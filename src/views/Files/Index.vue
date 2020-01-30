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
              <div class="mg-t-1">
                <items-view
                  :title="title"
                  icon="files"
                  :loaded="loaded"
                  :active-folder-meta="activeFolderMeta"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchInput from "@components/search"
import pageAside from "@components/aside"
import itemsView from "@components/views/full"

import { coreFolders } from "@constants"
import { loadFolderMeta, newFolderMeta, updateFolderMeta } from "@lib/utils"

import { getFile, putFile } from "blockstack"
import { mapGetters } from "vuex"

export default {
  name: "Files",
  components: {
    searchInput,
    pageAside,
    itemsView
  },
  data: () => ({
    listView: true,
    loaded: false,
    searchData: "",
    title: "Files"
  }),
  computed: {
    ...mapGetters([
      "folderMeta",
      "coreFolderStats"
    ]),
    activeFolderMeta () {
      if (!this.folderMeta) return {}

      let files = this.searchData
        ? this.folderMeta.files.filter((i) => i.name.includes(this.searchData)) : this.folderMeta.files

      let subfolders = this.searchData
        ? this.folderMeta.subfolders.filter((i) => i.name.includes(this.searchData)) : this.folderMeta.subfolders

      return {
        ...this.folderMeta,
        files,
        subfolders
      }
    }
  },
  async mounted () {
    let targetFolderPath = this.$route.hash ? this.$route.hash.replace("#", "") : null

    if (targetFolderPath && targetFolderPath !== "files") {
      this.title = "Files > " + targetFolderPath
      await this.loadMeta(null, "FILES/" + targetFolderPath)
    } else if (this.folderMeta.name === coreFolders.files) {
      this.loaded = true
    } else {
      await this.loadMeta(coreFolders.files, coreFolders.files)
    }

    if (this.folderMeta.sys) {
      let updatedCoreFolderStats = {
        ...this.coreFolderStats,
        files: {
          ...this.coreFolderStats.files,
          files: this.folderMeta.files.length,
          subfolders: this.folderMeta.subfolders.length,
          featuredFolders: this.folderMeta.subfolders.filter((f) => f.starred).slice(0, 5)
        }
      }
      this.$store.dispatch("coreFolderStats", updatedCoreFolderStats)
    }
  },
  methods: {
    search (data) {
      this.searchData = data
    },
    async loadMeta (name, path) {
    // load index file of 'FILES'
      let folderMeta = await loadFolderMeta(path)
      // console.log(folderMeta)

      // if new user, create base
      if (!folderMeta && name) {
        folderMeta = newFolderMeta({ name, path })
        await updateFolderMeta(folderMeta.path, folderMeta)
      }

      this.$store.dispatch("folderMeta", folderMeta)
      this.loaded = true
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
