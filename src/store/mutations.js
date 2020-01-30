
export default {
  userData (state, payload) {
    state.userData = payload
  },
  folderMeta (state, payload) {
    state.folderMeta = payload
  },

  theme (state, payload) {
    state.theme = payload
  },
  settings (state, payload) {
    state.settings = payload
  },
  coreFolderStats (state, payload) {
    state.coreFolderStats = payload
  }
}
