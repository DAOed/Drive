
<template>
  <div class="container">
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

              <page-title
                :title="title"
                icon="console"
                class="mg-t-1"
              />

              <app-loader v-if="appLoading" />

              <div v-else>
                <div
                  v-for="(path, index) in itemList"
                  :key="index"
                  class="mg-d-1"
                >
                  <zi-card hoverable>
                    <div class="justified">
                      <span title="Folder"> {{ getFolderName(path) }} </span>

                      <div style="display: flex; align-items: center;">
                        <zi-button
                          size="mini"
                          auto
                          class="action-button"
                          title="Download file"
                          style="margin-right: 0.5rem"
                          :loading="deletingName === path"
                          @click="downloadItem(path)"
                        >
                          <download-icon size="1x" />
                        </zi-button>

                        <zi-tooltip
                          v-if="deletingName !== path"
                        >
                          <zi-button
                            size="mini"
                            auto
                          >
                            Erase
                          </zi-button>

                          <template v-slot:content>
                            <div>
                              <div class="mg-d-1">
                                Cannot be UNDONE!
                              </div>
                              <zi-button
                                size="mini"
                                disabled
                                @click="removePath(path)"
                              >
                                Delete
                              </zi-button>
                            </div>
                          </template>
                        </zi-tooltip>
                      </div>
                    </div>
                    <span
                      class="s-60"
                      title="File path"
                    >{{ path }}</span>
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

import { listFiles } from "blockstack"
import { erasePath, loadFileContent } from "@lib/utils"

import { DownloadIcon } from "vue-feather-icons"

import pageTitle from "@components/title"
import searchInput from "@components/search"
import pageAside from "@components/aside"
import ProgressBar from "@components/progress"

import appLoader from "@components/loader"

export default {
  name: "Console",
  components: {
    pageTitle,
    searchInput,
    pageAside,
    ProgressBar,
    appLoader,
    DownloadIcon
  },
  data: () => ({
    listView: true,
    paths: [],
    title: "Console",
    content: [],
    deletingName: "",
    progress: 0,
    appLoading: true,
    searchData: ""
  }),
  computed: {
    itemList () {
      return this.searchData ? this.paths.filter((path) => path.includes(this.searchData)) : this.paths
    }
  },
  async mounted () {
    await this.getFilesList()

    // let file = await getFile("drive/FILES/__daoed__meta__data__")
    // console.log(file)
  },
  methods: {
    search (data) {
      this.searchData = data
    },
    async getFilesList () {
      const paths = []
      await listFiles(path => {
        paths.push(path)
        return true
      })

      this.paths = paths
      this.appLoading = false
    },
    getFolderName (name) {
      let parts = name.split("/")
      parts.pop()
      return parts.join("/") + "/"
    },
    async removePath (path) {
      this.progress += 5

      this.deletingName = path

      this.progress += 5
      await erasePath(path)

      this.progress += 80
      const paths = [...this.paths]
      this.paths = paths.filter((p) => p !== path)

      this.$Toast.warning("Item permanently removed")

      this.deletingName = null
      this.progress += 20
    },
    async downloadItem (path) {
      this.progress += 5
      // download only works for files, not folders
      // zipping content of folder and downloading will com next

      const download = this.$refs.download
      download.download = path.split("/").pop()

      this.progress += 20

      let file = await loadFileContent(path, { noPrefix: true, decrypt: true })
      // console.log(file)

      const isDownloadable = file.substring(0, 5) === "data:"

      if (!isDownloadable) {
        file = "data:application/octet-stream," + encodeURIComponent(file)
        /*
        // this is for ideal cases since 1) we store as json and 2) it saves as json
        // yet not recommended as user might also upload a file with no extension or type
        // well, this is the console isn't it? things are raw here

        file = "data:text/json;charset=utf-8," + encodeURIComponent(file)
        download.download = path.split("/").pop() + ".json"
        */
      }

      this.progress += 60
      download.href = file

      download.click()

      this.progress = 0
      this.$emit("closing")

      download.href = null
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

