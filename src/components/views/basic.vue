
<template>
  <div>
    <div class="content">
      <div class="content-inside">
        <div class="dual-grid">
          <div class="dual-grid-one">
            <page-aside />
          </div>
          <div class="dual-grid-two">
            <div>
              <div>
                <search-input @search="search" />
              </div>

              <div class="mg-t-1">
                <page-title
                  :title="viewTitle"
                  :icon="icon"
                >
                  <template v-slot:extra>
                    <div style="display: flex;">
                      <span>
                        <zi-popover
                          :hoverable="true"
                          @command="toggleItemsMode"
                        >
                          <zi-button
                            size="small"
                            auto
                            title="Toggle file/folder view"
                            class="action-button"
                          >
                            <file-icon
                              v-if="folderMode"
                              size="1.5x"
                            />
                            <folder-icon
                              v-else
                              size="1.5x"
                            />
                          </zi-button>
                          <template v-slot:dropdown>
                            <zi-popover-item title> Showing {{ folderMode ? "folders" : "files" }} </zi-popover-item>
                            <zi-popover-item
                              v-if="folderMode"
                              command="file"
                            > Show files </zi-popover-item>
                            <zi-popover-item
                              v-else
                              command="folder"
                            > Show folders </zi-popover-item>
                          </template>
                        </zi-popover>
                      </span>

                      <zi-button
                        size="small"
                        auto
                        title="Multi select"
                        class="action-button"
                      >
                        <shopping-bag-icon
                          size="1.5x"
                        />
                      </zi-button>
                      <zi-button
                        size="small"
                        auto
                        :title="latest ? 'Oldest' : 'Recent'"
                        class="action-button"
                        :disabled="latestButtonDisabled"
                        @click="toggleLatest"
                      >
                        <arrow-down-icon
                          v-if="latest"
                          size="1.5x"
                        />
                        <arrow-up-icon
                          v-else
                          size="1.5x"
                        />
                      </zi-button>
                    </div>
                  </template>
                </page-title>
              </div>

              <app-loader v-if="appLoading" />

              <div
                v-else
                class="mg-t-1"
              >
                <div
                  v-for="(item, index) in items"
                  :key="index"
                  class="mg-d-1"
                >
                  <zi-card hoverable>
                    <div style="display: flex;">
                      <div>
                        <folder-icon
                          v-if="folderMode"
                          size="1.5x"
                        />
                        <file-icon
                          v-else
                          size="1.5x"
                        />
                      </div>
                      <div style="width: 100%; margin-left: 0.8rem">
                        <div class="justified">
                          <div>
                            <span title="Folder"> {{ item.name }} </span>
                            <span :title="item.private ? 'Private' : 'Public'">
                              <eye-off-icon
                                v-if="item.private"
                                size="0.7x"
                              />
                              <eye-icon
                                v-else
                                size="0.7x"
                              />
                            </span>
                          </div>

                          <div>
                            <zi-button
                              v-if="activeButtonPath === item.path"
                              size="mini"
                              auto
                              :loading="true"
                            >
                              Actions
                            </zi-button>
                            <zi-popover
                              v-else
                              :hoverable="true"
                              @command="commandHandler"
                            >
                              <zi-button
                                size="mini"
                                auto
                                :loading="activeButtonPath === item.path"
                              >
                                Actions
                              </zi-button>
                              <template v-slot:dropdown>
                                <zi-popover-item
                                  v-if="!folderMode"
                                  :command="'download-' + index"
                                >
                                  Download file
                                </zi-popover-item>
                                <zi-popover-item
                                  v-if="icon === 'starred'"
                                  :command="'remove_star-' + index"
                                >
                                  Remove star
                                </zi-popover-item>
                                <zi-popover-item
                                  v-if="item.type === 'folder'"
                                  :command="'open_folder-' + index"
                                >
                                  Open folder
                                </zi-popover-item>
                                <zi-popover-item
                                  v-if="icon === 'trash'"
                                  :command="'remove_trash-' + index"
                                >
                                  Restore to files
                                </zi-popover-item>
                                <zi-popover-item
                                  v-if="icon === 'trash' && item.type === 'file'"
                                  line
                                />
                                <zi-popover-item
                                  v-if="icon === 'trash' && item.type === 'file'"
                                  :command="'delete-' + index"
                                >
                                  Permanently delete
                                </zi-popover-item>
                              </template>
                            </zi-popover>
                          </div>
                        </div>
                        <span
                          class="s-60"
                          title="File path"
                        >
                          <timeago
                            :datetime="item.modified"
                            :auto-update="60"
                          />,
                          {{ getBytes(item.size) }}</span>
                      </div>
                    </div>
                  </zi-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <progress-bar :progress="progress" />
    <a
      id="download"
      ref="download"
      style="display: none"
    />
  </div>
</template>

<script>

import { loadFolderMeta, formatBytes, loadFileContent, resetStar, undoTrash, deleteFileFromTrash } from "@lib/utils"
import { removeBaseFileName, sortModified } from "@lib/helpers"

import { ArrowUpIcon, ArrowDownIcon, FileIcon, FolderIcon, ShoppingBagIcon, EyeOffIcon, EyeIcon } from "vue-feather-icons"

import pageTitle from "@components/title"
import searchInput from "@components/search"
import pageAside from "@components/aside"
import ProgressBar from "@components/progress"

import appLoader from "@components/loader"

import { mapGetters } from "vuex"

export default {
  name: "Starred",
  components: {
    pageTitle,
    searchInput,
    pageAside,
    ProgressBar,
    appLoader,
    ArrowUpIcon,
    ArrowDownIcon,
    FileIcon,
    FolderIcon,
    ShoppingBagIcon,
    EyeOffIcon,
    EyeIcon
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    base: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    listView: true,
    content: [],
    removingName: "",
    progress: 0,
    appLoading: true,
    folderMode: true,
    latest: true,
    latestButtonDisabled: false,
    activeButtonPath: "",
    searchData: ""
  }),
  computed: {
    ...mapGetters([
      "folderMeta",
      "coreFolderStats"
    ]),
    viewTitle () {
      return this.folderMode ? `${this.title} folders` : `${this.title} files`
    },
    items () {
      const items = this.folderMeta[this.folderMode ? "subfolders" : "files"]
      return this.searchData ? items.filter((i) => i.name.includes(this.searchData)) : items
    }
  },
  async mounted () {
    if (this.$route.query.mode === "files") this.folderMode = false

    let folderMeta = await loadFolderMeta(this.base)

    this.$store.dispatch("folderMeta", folderMeta)
    this.appLoading = false

    if (this.folderMeta.sys) {
      let target = this.folderMeta.name.toLowerCase()

      let updatedCoreFolderStats = {
        ...this.coreFolderStats,
        [target]: {
          ...this.coreFolderStats[target],
          files: this.folderMeta.files.length,
          subfolders: this.folderMeta.subfolders.length
        }
      }
      this.$store.dispatch("coreFolderStats", updatedCoreFolderStats)
    }
  },
  methods: {
    search (data) {
      this.searchData = data
    },
    toggleItemsMode () {
      this.folderMode = !this.folderMode
    },
    toggleLatest () {
      this.latestButtonDisabled = true

      let files = [...this.folderMeta.files]
      files = sortModified(this.latest, files)

      let subfolders = [...this.folderMeta.subfolders]
      subfolders = sortModified(this.latest, subfolders)

      this.latest = !this.latest

      let newFolderMeta = {
        ...this.folderMeta,
        subfolders,
        files
      }
      this.$store.dispatch("folderMeta", newFolderMeta)

      this.latestButtonDisabled = false
    },
    commandHandler (command) {
      let parts = command.split("-")
      let cmd = parts[0]
      let index = parts[1]

      switch (cmd) {
      case "remove_star":
        this.removeStarFromItem(this.items[index])
        break
      case "remove_trash":
        this.removeItemFromTrash(this.items[index])
        break
      case "open_folder":
        this.openSelectedFolder(this.items[index])
        break
      case "delete":
        this.permanentlyDelete(this.items[index])
        break
      default:
        this.downloadItem(this.items[index])
      }
    },
    getBytes (bytes) {
      return formatBytes(bytes)
    },
    async removeStarFromItem (data) {
      this.activeButtonPath = data.path
      this.progress += 20

      await resetStar(data)
      this.progress = 0
      this.activeButtonPath = ""
    },
    async openSelectedFolder (data) {
      this.$router.push("/files#" + removeBaseFileName(data.path))
    },
    async removeItemFromTrash (data) {
      this.activeButtonPath = data.path
      this.progress += 20

      await undoTrash(data)
      this.progress = 0
      this.activeButtonPath = ""

      this.$Toast.show({
        type: "success",
        action: "View Files",
        text: data.name + " restored to Files",
        handler: () => this.$router.push("/files")
      })
    },
    async permanentlyDelete (data) {
      this.activeButtonPath = data.path
      this.progress += 20

      await deleteFileFromTrash(data)
      this.progress = 0
      this.activeButtonPath = ""
    },
    async downloadItem (data) {
      this.activeButtonPath = data.path
      this.progress += 5
      // download only works for files, not folders
      // zipping content of folder and downloading will com next

      const download = this.$refs.download
      download.download = data.name

      this.progress += 20

      let file = await loadFileContent(data.path)

      this.progress += 60
      download.href = file

      download.click()

      this.progress = 0
      this.$emit("closing")

      download.href = null
      this.activeButtonPath = ""
    }

  }
}
</script>

<style scoped>
.content {
  min-height: 60vh;
}
.content-inside {
  width: 100%;
}
</style>
