import { metaIndexName, defaultPrefix, maxRawFiles, coreFolders, maxFilesPerFolder, maxStars } from "@constants"
import { saveFile, getFile, deleteFile } from "@lib/blockstack"
import { listFiles, getFileUrl } from "blockstack"

import { makePath, updateFolderMeta, loadFolderMeta, uniquifyNewFileNames } from "@lib/utils"

import store from "@store"

export const newStar = async (item) => {
  const type = item.type
  const itemsKey = type === "file" ? "files" : "subfolders"

  let parentFolderMeta = store.getters.folderMeta

  // load starred folder's meta
  const starsFolderMeta = await loadFolderMeta(coreFolders.starred)

  if (starsFolderMeta[itemsKey].length >= maxStars) throw new Error("Maximum number of stars allowed reached.")

  /* 1) update the folderMeta of the present folder */

  // update parent folder
  const list = parentFolderMeta[itemsKey]

  // find target item, be it file or folder and update starred field
  const targetItemIndex = list.findIndex((i) => i.path === item.path)
  list[targetItemIndex].starred = true

  parentFolderMeta[itemsKey] = list

  // update records in gaia store
  await updateFolderMeta(parentFolderMeta)

  /* 2) record change in starred folder's meta, so we can fetch the starred in the /starred route */

  // update records
  const updatedStarsFolderMeta = {
    ...starsFolderMeta,
    size: starsFolderMeta.size + item.size,
    [itemsKey]: [
      ...starsFolderMeta[itemsKey],
      {
        ...item,
        parent: parentFolderMeta.path // IMPORTANT: USED TO DETERMINE WHERE TO UPDATE PARENT WHEN STAR IS REMOVED
      }
    ]
  }

  // save records to gaia
  await updateFolderMeta(updatedStarsFolderMeta)

  store.dispatch("folderMeta", parentFolderMeta)
}

export const removeStar = async (item) => {
  const type = item.type
  const itemsKey = type === "file" ? "files" : "subfolders"

  let parentFolderMeta = store.getters.folderMeta

  // load starred folder's meta
  const starsFolderMeta = await loadFolderMeta(coreFolders.starred)

  /* 1) update the folderMeta of the present folder */

  // update parent folder
  const list = parentFolderMeta[itemsKey]

  // find target item, be it file or folder and update starred field
  const targetItemIndex = list.findIndex((i) => i.path === item.path)
  list[targetItemIndex].starred = false

  parentFolderMeta[itemsKey] = list

  // update records in gaia store
  await updateFolderMeta(parentFolderMeta)

  /* 2) record change in starred folder's meta, so we can fetch the starred in the /starred route */

  // update records
  const updatedStarsFolderMeta = {
    ...starsFolderMeta,
    size: starsFolderMeta.size - item.size,
    [itemsKey]: starsFolderMeta[itemsKey].filter((i) => i.path !== item.path)
  }

  // save records to gaia
  await updateFolderMeta(updatedStarsFolderMeta)

  store.dispatch("folderMeta", parentFolderMeta)
}

// this is caled only from the 'STARRED' core folder
export const resetStar = async (item) => {
  const type = item.type
  const itemsKey = type === "file" ? "files" : "subfolders"

  let starsFolderMeta = store.getters.folderMeta

  // load original folder's meta
  let parentFolderMeta = item.parent ? await loadFolderMeta(item.parent) : {}

  /* 1) update the present folder */

  // update parent folder
  const list = parentFolderMeta[itemsKey] || []

  // find target item, be it file or folder and update starred field
  const targetItemIndex = list.findIndex((i) => i.path === item.path)
  if (list[targetItemIndex]) list[targetItemIndex].starred = false

  parentFolderMeta[itemsKey] = list

  // update records in gaia store
  if (parentFolderMeta.name) await updateFolderMeta(parentFolderMeta)

  /* 2) record change in starred folder's meta, so we can fetch the starred in the /starred route */

  // update records
  const updatedStarsFolderMeta = {
    ...starsFolderMeta,
    size: starsFolderMeta.size - item.size,
    [itemsKey]: starsFolderMeta[itemsKey].filter((i) => i.path !== item.path)
  }

  // save records to gaia
  await updateFolderMeta(updatedStarsFolderMeta)

  store.dispatch("folderMeta", updatedStarsFolderMeta)
}

// keep file/folder still in the same position and folder
// only delist it from the folder's index and list it in trash's folder's index
export const trashItem = async (item) => {
  const type = item.type
  const itemsKey = type === "file" ? "files" : "subfolders"

  const parentFolderMeta = store.getters.folderMeta

  if (!item.path) throw new Error("Invalid file/folder name")

  // update parent meta and delist item
  const updatedParentFolderMeta = {
    ...parentFolderMeta,
    modified: new Date(),
    size: parentFolderMeta.size - item.size,
    [itemsKey]: parentFolderMeta[itemsKey].filter((i) => i.path !== item.path)
  }
  // update store early so file disappears, else use might still click it
  store.dispatch("folderMeta", updatedParentFolderMeta)
  await updateFolderMeta(updatedParentFolderMeta)

  // update global stats ? skip for folder and do only for files

  if (item.starred) {
    const starsFolderMeta = await loadFolderMeta(coreFolders.starred)

    const updatedStarsFolderMeta = {
      ...starsFolderMeta,
      modified: new Date(),
      size: starsFolderMeta.size - item.size,
      [itemsKey]: starsFolderMeta[itemsKey].filter((i) => i.path !== item.path)
    }
    await updateFolderMeta(updatedStarsFolderMeta)
  }

  // load trash folder's meta
  const trashFolderMeta = await loadFolderMeta(coreFolders.trash)

  // update trash folder's meta
  const updatedTrashFolderMeta = {
    ...trashFolderMeta,
    modified: new Date(),
    size: trashFolderMeta.size + item.size,
    [itemsKey]: [
      ...trashFolderMeta[itemsKey],
      {
        ...item,
        starred: false,
        modified: new Date(),
        parent: parentFolderMeta.path // IMPORTANT: USED TO DETERMINE WHERE TO RETURN FILE TO WHEN RESTORED FROM TRASH
      }
    ]
  }
  await updateFolderMeta(updatedTrashFolderMeta)
}

// keep file/folder still in the same position and folder
// only delist it from the trash folder's index and re-list it in the originating folder's index
export const undoTrash = async (item) => {
  const type = item.type
  const itemsKey = type === "file" ? "files" : "subfolders"

  if (!item.path) throw new Error("Invalid file/folder name")

  // load trash folder's meta
  const trashFolderMeta = await loadFolderMeta(coreFolders.trash)

  const updatedTrashFolderMeta = {
    ...trashFolderMeta,
    modified: new Date(),
    size: trashFolderMeta.size - item.size,
    [itemsKey]: trashFolderMeta[itemsKey].filter((f) => f.path !== item.path)
  }
  await updateFolderMeta(updatedTrashFolderMeta)

  const parentFolderMeta = await loadFolderMeta(item.parent)

  // update parent folder's meta
  const updatedParentFolderMeta = {
    ...parentFolderMeta,
    modified: new Date(),
    size: parentFolderMeta.size + item.size,
    [itemsKey]: [
      ...parentFolderMeta[itemsKey],
      {
        ...item,
        modified: new Date()
      }
    ]
  }
  await updateFolderMeta(updatedParentFolderMeta)

  // update global stats ? skip for folder and do only for files

  store.dispatch("folderMeta", updatedTrashFolderMeta)
}
