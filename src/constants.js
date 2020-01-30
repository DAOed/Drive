import { AppConfig } from "blockstack"

export const appConfig = new AppConfig(["store_write", "publish_data"])
export const baseBlockstackApi = "https://core.blockstack.org/v1/"

export const placeholderImg = "./img/placeholder.png"

export const maxFileSize = 1048576

export const DApps =
 [
   {

     url: "/",
     name: "Search",
     description: "Decentralized search",
     icon: "./img/daoed-search.png"
   }
 ]

export const defaultSettings = {
  theme: "light",
  saveSearch: false,
  saveTheme: false
}

export const appPrefixer = "drive/"
export const metaIndexName = "__daoed__meta__data__SYS"

export const coreFolders = {
  files: "FILES",
  starred: "STARRED", // nothing needed here, since its an index file of files not a folder of files
  trash: "TRASH"
  /*
  shared: "SHARED",
  locker: "LOCKER", // files that are encrypted with a secret set by user, so they need the pin to unlock even for the login user
  library: "LIBRARY", // this is for files put in *library.daoed.com*
  */
}

export const maxRawFiles = 100
export const maxFolderLevels = 5
export const maxFilesPerFolder = 100
export const maxLogs = 20
export const maxStars = 100

export const loggableFileActivity = ["new_file", "trash_file", "restore_file", "erase_file", "share_file"]
export const loggableFolderActivity = ["new_folder", "trash_folder", "restore_folder", "erase_folder", "share_folder"]
export const loggableActivities = [...loggableFileActivity, ...loggableFolderActivity]
