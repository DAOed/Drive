<template>
  <div>
    <zi-files
      :files="files"
      :default-expand="defaultExpand"
      @file-click="clickHandler"
    />
    <div class="aside-meta s-70 tc-gray">
      <span style="border-top: 2px #fafafa solid; padding-top: 0.5rem;">
        {{ `${meta.subfolders} main folders` }}
      </span>
    </div>
  </div>
</template>

<script>
import { maxRawFiles } from "@constants"
import { removeBaseFileName } from "@lib/helpers"
import { mapGetters } from "vuex"

export default {
  name: "Aside",
  data: () => ({
    defaultExpand: false
  }),
  computed: {
    ...mapGetters([
      "folderMeta",
      "coreFolderStats"
    ]),
    folderStats () {
      return this.coreFolderStats
    },
    details () {
      let folderStats = this.folderStats || {}
      return {
        files: folderStats.files,
        starred: folderStats.starred,
        trash: folderStats.trash,
        console: folderStats.console
        /*
        starred: folderStats.starred,
        locker: folderStats.locker,
        library: folderStats.library,
        */
      }
    },
    featuredFolders () {
      return this.details && this.details.files ? this.details.files.featuredFolders : []
    },
    defaultFiles () {
      if ((this.coreFolders && !this.coreFolders.files) || !this.featuredFolders.length) {
        return [
          {
            type: "directory",
            name: "Files",
            files: [
              {
                type: "file",
                name: "All uploads"
              }]
          },
          {
            type: "directory",
            name: "Starred",
            files: [{
              type: "file",
              name: "(0) files"
            },
            {
              type: "file",
              name: "(0) folders"
            }]
          },
          {
            type: "directory",
            name: "Trash",
            files: [{
              type: "file",
              name: "(0) files"
            },
            {
              type: "file",
              name: "(0) folders"
            }]
          },
          {
            type: "directory",
            name: "Console",
            files: [{
              type: "file",
              name: "Last ~" + maxRawFiles + " files"
            }]
          }
        ]
      } else {
        return [
          {
            type: "directory",
            name: "Files",
            files: [
              ...this.featuredFolders.map((ff) => ({
                type: "file",
                name: ff.name,
                path: ff.path
              })),
              {
                type: "file",
                name: "All uploads"
              }]
          },
          {
            type: "directory",
            name: "Starred",
            files: [{
              type: "file",
              name: `(${this.details.starred.files}) files`
            },
            {
              type: "file",
              name: `(${this.details.starred.subfolders}) folders`
            }]
          },
          /*
        {
          type: "directory",
          name: "Shared",
            files: [{
              type: "file",
              name: `(${this.details.shared.files}) files`
            },
            {
              type: "file",
              name: `(${this.details.shared.subfolders}) folders`
            }]
        },
        {
          type: "directory",
          name: "Locker",
            files: [{
              type: "file",
              name: `(${this.details.locker.files}) files`
            },
            {
              type: "file",
              name: `(${this.details.locker.subfolders}) folders`
            }]
        },
        {
          type: "directory",
          name: "Library",
            files: [{
              type: "file",
              name: `(${this.details.library.files}) files`
            },
            {
              type: "file",
              name: `(${this.details.library.subfolders}) folders`
            }]
        },
        */
          {
            type: "directory",
            name: "Trash",
            files: [{
              type: "file",
              name: `(${this.details.trash.files}) files`
            },
            {
              type: "file",
              name: `(${this.details.trash.subfolders}) folders`
            }]
          },
          {
            type: "directory",
            name: "Console",
            files: [{
              type: "file",
              name: "Last ~" + maxRawFiles + " files"
            }]
          }
        ]
      }
    },
    meta () {
      return {
        subfolders: this.folderStats.files.subfolders
      }
    },
    files () {
      return this.defaultFiles
      /*
      let keys = Object.keys(coreFolders)
      let defaultRoute = this.$route.hash ? false : keys.indexOf(this.$route.name.toLowerCase() !== -1)

      if (defaultRoute) {
        return this.defaultFiles
      } else {
        return [
          {
            type: "directory",
            name: this.$route.name,
            files: [
              {
                type: "file",
                name: "All files"
              },
              {
                type: "directory",
                name: this.folderMeta.name,
                files: this.folderMeta.files.map((f) => {
                  return {
                    type: "file",
                    name: f.name
                  }
                })
              }
            ]
          }
        ]
      }
    */
    }
  },
  methods: {
    clickHandler (e) {
      let parts = e.name.split("/")
      let path = parts[0].toLowerCase()
      let mode = (parts[1].split(" ")[1] || "").toLowerCase()
      let isStarredSubfolder = !!e.trigger.path

      if (isStarredSubfolder) {
        path = "/files#" + removeBaseFileName(e.trigger.path)
      } else if (parts.length === 2) {
        let isMode = ["files", "folders"].indexOf(mode) !== -1
        path = isMode ? path + "?mode=" + mode : path
      }

      if (this.$route.path !== path) this.$router.push(path)
    }
  }
}
</script>
