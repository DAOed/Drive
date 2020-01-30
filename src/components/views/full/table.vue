<template>
  <div>
    <zi-table
      :data="allContent"
      empty-text="Nothing to display"
    >
      <zi-table-column
        label="Type"
        width="10"
      >
        <template slot-scope="scope">
          <span
            class="item-type-icon"
            :title="scope.row.type === 'folder' ? 'Folder' : 'File'"
          >
            <folder-icon
              v-if="scope.row.type === 'folder'"
              size="1.2x"
            />
            <file-icon
              v-else
              size="1.2x"
            />
          </span>
        </template>
      </zi-table-column>

      <zi-table-column
        label="Name"
        min-width="200"
      >
        <template slot-scope="scope">
          <span
            style="display: flex; align-items: center;"
            title="Starred"
          >
            <span style="margin-right: 0.2rem">

              <star-icon
                v-if="scope.row.starred"
                fill="inherit"
                size="1x"
              />
            </span>
            <a
              :href="'#' + removeBaseFileName(scope.row.path)"
              :style="{ color: 'inherit', fontWeight: scope.row.type === 'folder' ? 'bolder' : 'normal' }"
              @click="scope.row.type === 'file' ? view(scope.row) : openFolder(scope.row)"
            >{{ scope.row.name }} </a>
          </span>
        </template>
      </zi-table-column>

      <zi-table-column label="Modified">
        <template slot-scope="scope">
          <timeago
            :datetime="scope.row.modified"
            :auto-update="60"
            :title="new Date(scope.row.modified).toUTCString()"
          />
        </template>
      </zi-table-column>

      <zi-table-column
        label="Size"
      >
        <template slot-scope="scope">
          {{ getBytes(scope.row.size) }}
        </template>
      </zi-table-column>

      <zi-table-column label="Actions">
        <template slot-scope="scope">
          <zi-button
            size="small"
            auto
            title="View"
            class="action-button"
            @click="scope.row.type === 'file' ? view(scope.row) : openFolder(scope.row)"
          >
            <eye-icon size="1.5x" />
          </zi-button>
          <zi-button
            v-if="scope.row.type === 'file'"
            size="small"
            auto
            class="action-button"
            title="Download"
            @click="downloadItem(scope.row)"
          >
            <download-icon size="1.5x" />
          </zi-button>
        </template>
      </zi-table-column>
    </zi-table>
    <a
      id="download"
      ref="download"
      style="display: none"
    />
  </div>
</template>

<script>
import { DownloadIcon, EyeIcon, FolderIcon, FileIcon, StarIcon } from "vue-feather-icons"

import { removeBaseFileName } from "@lib/helpers"
import { formatBytes, loadFileContent } from "@lib/utils"

export default {
  components: {
    DownloadIcon,
    EyeIcon,
    FolderIcon,
    FileIcon,
    StarIcon
  },
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    allContent () {
      return [...this.content.folders, ...this.content.files]
    }
  },
  methods: {
    viewItem (row, index) {
      // this.tableData.splice(index, 1)
    },
    async downloadItem (data) {
      this.progress += 5
      this.visible = false
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
    },
    view (data) {
      this.$emit("view", data)
    },
    openFolder (data) {
      this.$emit("openFolder", data)
    },
    removeBaseFileName (path) {
      return removeBaseFileName(path)
    },
    getBytes (bytes) {
      return formatBytes(bytes)
    }
  }
}
</script>

<style scopes>
.item-type-icon {
  display: flex;
  justify-content: center;
}
</style>
