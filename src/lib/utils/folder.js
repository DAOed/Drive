import { metaIndexName } from "@constants"
import { saveFile, getFile } from "@lib/blockstack"

import { makePath, erasePath } from "@lib/utils"
import { uuid } from "@lib/helpers"

import store from "@store"

export const loadFolderMeta = async (path) => {
  let file = await getFile(`${path}/${metaIndexName}`)
  return file ? JSON.parse(file) : null
}

export const deleteFolderMeta = (path) => erasePath(`${path}/${metaIndexName}`)

export const newFolderMeta = (meta) => {
  if (!meta.name || !meta.path || isNaN(meta.level)) throw new Error("Invalid folder meta")

  return {
    name: meta.name,
    tag: meta.tag,
    modified: new Date(),
    private: meta.private || true,
    size: 1,
    files: [],
    subfolders: [],
    path: meta.path,
    level: meta.level,
    id: meta.id || uuid(),
    sys: meta.sys || false,
    starred: false
  }
}

export const updateFolderMeta = (meta) => saveFile(`${meta.path}/${metaIndexName}`, meta)

export const createFolderMeta = async ({ name, path, level }, meta) => {
  if ((!name && !path) && !meta) throw new Error("Invalid params")

  meta = newFolderMeta(meta || { name, path, level })
  await updateFolderMeta(meta)
}

export const createFolderMetas = async ({ names, paths, levels }, metas) => {
  if ((!names && !paths) && !metas) throw new Error("Invalid params")

  for (let i = 0; i < (names || metas).length; i++) {
    let meta = newFolderMeta(metas ? metas[i] : { name: names[i], path: paths[i], level: levels[i] })
    await updateFolderMeta(meta)
  }
}

export const loadFolderMetas = async (folderPaths) => {
  let metas = []

  for (let i = 0; i < folderPaths.length; i++) {
    let meta = await loadFolderMeta(folderPaths[i])
    metas.push(meta)
  }

  return metas
}

export const newFolder = async (folder) => {
  const parentFolderMeta = store.getters.folderMeta

  folder.path = makePath(parentFolderMeta.path, folder.name)
  folder.level = parentFolderMeta.level ? parentFolderMeta.level++ : 1
  if (!folder.path) throw new Error("Invalid folder name")

  // update parent meta
  const updatedParentFolderMeta = {
    ...parentFolderMeta,
    modified: new Date(),
    subfolders: [
      {
        ...folder,
        modified: new Date()
      },
      ...parentFolderMeta.subfolders
    ]
  }
  await updateFolderMeta(updatedParentFolderMeta)

  // update global stats ? skip for folder and do only for files

  // create folder with base content
  let newMeta = newFolderMeta(folder)
  await saveFile(`${folder.path}/${metaIndexName}`, newMeta)

  store.dispatch("folderMeta", updatedParentFolderMeta)
}

export const openFolder = async (folder) => {
  const folderMeta = await loadFolderMeta(folder.path)
  store.dispatch("folderMeta", folderMeta)
}

export const eraseFolder = async (folder) => {
  const parentFolderMeta = store.getters.folderMeta

  // load folder's meta
  const folderMeta = await loadFolderMeta(folder.path)

  // check if folder contains subfolders, if so reject folder delete request
  if (folderMeta.subfolder.length) throw new Error("Folder contains sub folders")

  if (!folder.name || !folder.path) throw new Error("Invalid folder")

  // remove folder from subfolders of parent
  const newSubFolders = parentFolderMeta.subfolders.filter((fd) => fd.path !== folder.path)

  // update global stats ? skip for folder and do only for files

  // delete all files in folder
  for (let i = 0; i < folderMeta.files.length; i++) {
    await erasePath(folderMeta.files[i].path)
  }

  // delete folder's meta file
  await deleteFolderMeta(folder.path)

  // update parent meta
  const updatedParentFolderMeta = {
    ...parentFolderMeta,
    modified: new Date(),
    subfolders: newSubFolders
  }
  await updateFolderMeta(updatedParentFolderMeta)

  store.dispatch("folderMeta", updatedParentFolderMeta)
}
