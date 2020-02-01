import { maxRawFiles, maxFilesPerFolder } from "@constants"
import { saveFile, getFile, deleteFile } from "@lib/blockstack"
import { listFiles, getFileUrl } from "blockstack"

import { makePath, updateFolderMeta, uniquifyNewFileNames } from "@lib/utils"

import store from "@store"

export const listRawFiles = async () => {
  const files = []
  await listFiles(name => {
    files.push(name)
    return !(files.length >= maxRawFiles)
  })
  return files
}

export const listRawFilesUrl = async () => {
  const files = {}
  await listFiles(async (name) => {
    let fileUrl = await getFileUrl(name)
    files[name] = fileUrl

    return !(files.length > maxRawFiles)
  })

  return files
}

export const newFiles = async (files) => {
  const parentFolderMeta = store.getters.folderMeta

  let canAddItems = parentFolderMeta.files.length + files.length <= maxFilesPerFolder
  if (!canAddItems) throw new Error("Maximum number of item in a folder should not be more than 100.")

  files = uniquifyNewFileNames(parentFolderMeta.files, files)

  // save files
  for (let i = 0; i < files.length; i++) {
    files[i].path = makePath(parentFolderMeta.path, files[i].name)
  }

  // generate metas
  let fileMetas = []
  let filesSize = 0
  for (let i = 0; i < files.length; i++) {
    let meta = {
      ...files[i],
      modified: new Date()
    }
    // extremely important - else will put file content too among meta,
    // increasing size of meta, duplicating file content and slowing entire system down
    delete meta.content
    // delete it in the new `meta` object and not actual `files` content as we will use `files[i].content` this later
    fileMetas.push(meta)

    filesSize += files[i].size
  }

  // update parent meta
  const updatedParentFolderMeta = {
    ...parentFolderMeta,
    modified: new Date(),
    size: parentFolderMeta.size + filesSize,
    files: [
      ...fileMetas,
      ...parentFolderMeta.files
    ]
  }
  await updateFolderMeta(updatedParentFolderMeta)

  // update global stats ? skip for folder and do only for files

  // save files
  for (let i = 0; i < files.length; i++) {
    await saveFile(files[i].path, files[i].content, { encrypt: files[i].private })
  }

  store.dispatch("folderMeta", updatedParentFolderMeta)
}

// this will be called only for files in trash folder, and they have TRASH folder as their ONLY PARENT
export const deleteFileFromTrash = async (file) => {
  const trashFolderMeta = store.getters.folderMeta

  // update trash folder meta, remove file from its list
  const updatedTrashFolderMeta = {
    ...trashFolderMeta,
    modified: new Date(),
    size: trashFolderMeta.size - file.size,
    files: trashFolderMeta.files.filter((f) => f.path !== file.path)
  }
  await updateFolderMeta(updatedTrashFolderMeta)

  // update global stats ? skip for folder and do only for files

  // erase file
  await erasePath(file.path)

  store.dispatch("folderMeta", updatedTrashFolderMeta)
}

export const erasePath = async (path) => {
  // override with dummy content
  await saveFile(path, "{}", { encrypt: false, noPrefix: true })

  // delist / delete
  await deleteFile(path, { noPrefix: true })
}

export const loadFileContent = (path, params) => getFile(path, params)
