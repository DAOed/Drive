import { getUserBasic, saveFile } from "@lib/blockstack"

import ZeitUI from "@zeit-ui/vue"

export default {
  async userData ({ commit }, payload) {
    let newData = await getUserBasic(payload.username)
    commit("userData", { ...payload, ...newData })
  },
  folderMeta ({ commit }, payload) {
    commit("folderMeta", payload)
  },
  async theme ({ commit, state }, payload = {}) {
    const { mode, auto } = payload
    if (auto) {
      if (mode === "dark") {
        ZeitUI.theme.enableDark()
      } else {
        ZeitUI.theme.enableLight()
      }
      commit("theme", mode)
    } else {
      let theme
      if (state.theme === "light") {
        ZeitUI.theme.enableDark()
        theme = "dark"
      } else {
        ZeitUI.theme.enableLight()
        theme = "light"
      }
      commit("theme", theme)

      if (state.settings.saveTheme) {
        await saveFile("settings", { ...state.settings, theme })
      }
    }
  },
  settings ({ commit, state }, payload) {
    let auto = payload.auto
    delete payload.auto

    if (!auto) saveFile("settings", { ...state.settings, ...payload })
    commit("settings", payload)
  },
  coreFolderStats ({ commit }, payload) {
    commit("coreFolderStats", payload)
  },
  updateFolderStats ({ commit, state }, payload) {
    /*
    let coreFolderStats = state.coreFolderStats

    switch (payload.action) {
    case "new_file":
      if (payload.parent) coreFolderStats.files.files = coreFolderStats.files.files++
      break
    case "new_folder":
      if (payload.parent) coreFolderStats.files.folders = coreFolderStats.files.folders++
      break
    case "star_file":
      coreFolderStats.starred.files = coreFolderStats.starred.files++
      break
    case "star_folder":
      coreFolderStats.starred.folders = coreFolderStats.starred.folders++
      if (payload.parent) coreFolderStats.files.featuredFolders.push(payload.data)
      break
    case "un_star_file":
      coreFolderStats.starred.files = coreFolderStats.starred.files--
      break
    case "un_star_folder":
      coreFolderStats.starred.folders = coreFolderStats.starred.folders--
      if (payload.parent) {
        coreFolderStats.files.featuredFolders =
        coreFolderStats.files.featuredFolders.filter((f) => f.path !== payload.data.path)
      }
      break
    case "trash_file":
      coreFolderStats.trash.files = coreFolderStats.trash.files++
      if (payload.parent) coreFolderStats.files.files = coreFolderStats.files.files--
      break
    case "trash_folder":
      coreFolderStats.trash.folders = coreFolderStats.trash.folders++
      if (payload.parent) coreFolderStats.files.folders = coreFolderStats.files.folders--
      break
    case "un_trash_file":
      coreFolderStats.trash.files = coreFolderStats.trash.files--
      if (payload.parent) coreFolderStats.files.files = coreFolderStats.files.files++
      break
    case "un_trash_folder":
      coreFolderStats.trash.folders = coreFolderStats.trash.folders--
      if (payload.parent) coreFolderStats.files.folders = coreFolderStats.files.folders++
      break
    default:
      return false
    }

    commit("coreFolderStats", coreFolderStats)
    */
  }
}
