<template>
  <div>
    <div>
      <page-title
        :title="folderTitle"
        :icon="icon"
      >
        <template v-slot:extra>
          <div style="display: flex;">
            <span>
              <zi-popover
                :hoverable="true"
                @command="newFile"
              >
                <zi-button
                  size="small"
                  auto
                  title="New file"
                  class="action-button"
                >
                  <plus-icon
                    size="1.5x"
                  />
                </zi-button>
                <template v-slot:dropdown>
                  <zi-popover-item command="import"> Import from URL </zi-popover-item>
                  <zi-popover-item command="upload"> Upload from computer </zi-popover-item>
                  <zi-popover-item disabled> Request by form </zi-popover-item>
                  <zi-popover-item line />
                  <zi-popover-item
                    command="folder"
                    :disabled="activeFolderMeta.level === maxFolderLevels"
                  > New folder </zi-popover-item>
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
              :title="listView ? 'Grid view' : 'List view'"
              class="action-button"
              @click="toggleView"
            >
              <grid-icon
                v-if="listView"
                size="1.5x"
              />
              <list-icon
                v-else
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
    <div>
      <app-loader v-if="!loaded" />
      <div v-else>
        <list-view
          v-if="listView"
          :content="readyContent"
          @view="view"
          @openFolder="openFolder"
        />
        <grid-view
          v-else
          :content="readyContent"
          @view="view"
          @openFolder="openFolder"
        />
      </div>
    </div>

    <div v-if="modal">
      <Modal
        :key="modalKey()"
        :show="modal"
        :modal-data="modalData"
        @closing="closeModal"
      />
    </div>
    <div>
      <input
        ref="file"
        type="file"
        style="display:none"
        multiple
        @change="handleFileUpload()"
      >
      <zi-dialog
        v-model="importModalVisible"
        done="Upload"
        :before-done="handleFileImport"
      >
        <p> Input file details </p>
        <zi-input
          v-model="fileImportNAME"
          prefix-label="Filename"
          style="width: 100%; margin-bottom: 1rem"
          placeholder="Optional"
        />
        <zi-input
          v-model="fileImportURL"
          prefix-label="https://"
          style="width: 100%"
          placeholder="External URL"
        />
      </zi-dialog>
      <zi-dialog
        v-model="folderModalVisible"
        done="Create"
        :before-done="makeNewFolder"
      >
        <p> Enter name of new folder </p>
        <zi-input
          v-model="newFolderName"
          style="width: 100%"
          placeholder="Folder name"
        />
        <zi-checkbox
          v-model="newFolderPrivate"
          style="margin-top: 1rem;"
        >
          Make folder private
        </zi-checkbox>
      </zi-dialog>
      <zi-dialog
        v-model="localUploadVisible"
        done="Upload"
        :before-done="localUpload"
      >
        <p> Files to upload </p>
        <div>
          <ul>
            <li
              v-for="(file, index) in files"
              :key="index"
            >
              {{ file.name }} - {{ getBytes(file.size) }}
            </li>
          </ul>
        </div>
      </zi-dialog>
      <progress-bar :progress="progress" />
    </div>
  </div>
</template>

<script>
import pageTitle from "@components/title"

import listView from "@components/views/full/table"
import gridView from "@components/views/full/grid"

import Modal from "@components/views/full/modal"
import ProgressBar from "@components/progress"
import appLoader from "@components/loader"

import { ListIcon, GridIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon, ShoppingBagIcon } from "vue-feather-icons"

import { newFiles, newFolder, openFolder, formatBytes, readLocalFiles, readExternalFile } from "@lib/utils"
import { sortModified, removeBaseFileName, validUploadSize } from "@lib/helpers"

import { maxFolderLevels, maxFileSize } from "@constants"

export default {
  components: {
    ProgressBar,
    ListIcon,
    GridIcon,
    pageTitle,
    listView,
    gridView,
    ArrowDownIcon,
    ArrowUpIcon,
    PlusIcon,
    ShoppingBagIcon,
    Modal,
    appLoader
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    },
    loaded: {
      type: Boolean,
      default: false
    },
    activeFolderMeta: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => ({
    listView: false,
    latest: true,
    modal: false,
    modalData: {},
    files: null,
    fileImportNAME: "",
    fileImportURL: "",
    importModalVisible: false,
    newFolderName: "",
    folderModalVisible: false,
    progress: 0,
    newFolderPrivate: true,
    latestButtonDisabled: false,
    maxFolderLevels,
    currentFolderName: "",
    localUploadVisible: false
  }),
  computed: {
    folderTitle () {
      return this.title + (this.currentFolderName ? " > " + this.currentFolderName : "")
    },
    readyContent () {
      let folders = this.activeFolderMeta.subfolders.map((fd) => { return { ...fd, type: "folder" } })
      let files = this.activeFolderMeta.files.map((fl) => { return { ...fl, type: "file" } })

      return { folders: folders, files: files }
    }
  },
  methods: {
    modalKey () {
      return new Date().getTime()
    },
    getBytes (bytes) {
      return formatBytes(bytes)
    },
    toggleView () {
      this.modal = false
      this.listView = !this.listView
    },
    view (data) {
      this.modalData = data
      this.showModal()
    },
    showModal () {
      this.modal = false
      this.$nextTick(() => { this.modal = true })
    },
    closeModal () {
      this.modal = false
    },
    newFile (method) {
      switch (method) {
      case "upload":
        this.$refs.file.click()
        break
      case "import":
        this.showUploadModal()
        break
      case "folder":
        this.showFolderModal()
        break
      default:
      }
    },
    handleFileUpload () {
      this.files = this.$refs.file.files

      // if file size is greater than max allowed, reject

      // show modal
      this.localUploadVisible = true

      this.progress += 20
    },
    async handleFileImport () {
      let name = this.fileImportNAME
      let url = this.fileImportURL

      this.importModalVisible = false

      if (!url) return false

      this.progress += 30
      let file = await readExternalFile({ name, url })

      let validSize = validUploadSize([file])

      if (!validSize) {
        this.$Toast.warning(`Sorry, files > ${formatBytes(maxFileSize)} not yet supported`)
        this.progress = 0
      } else {
        this.progress += 50
        await newFiles([file])

        this.$Toast.success("File successfully uploaded")

        this.fileImportNAME = ""
        this.fileImportURL = ""
        this.progress = 0
      }
    },
    async localUpload () {
      this.localUploadVisible = false

      this.progress += 20
      let filesData = await readLocalFiles(this.files)

      let validSize = validUploadSize(filesData)

      if (!validSize) {
        this.$Toast.warning(`Sorry, files > ${formatBytes(maxFileSize)} not yet supported`)
        this.progress = 0
      } else {
        this.progress += 40
        // uploadFiles
        await newFiles(filesData)

        this.progress += 20
        this.$Toast.success("File successfully uploaded")

        this.progress = 0
      }
    },
    showUploadModal () {
      this.modal = false
      this.$nextTick(() => { this.importModalVisible = true })
    },
    showFolderModal () {
      this.modal = false
      this.$nextTick(() => { this.folderModalVisible = true })
    },
    async makeNewFolder () {
      if (!this.newFolderName) {
        this.$Toast.warning("Sorry, kindly enter name of folder")
      } else {
        this.progress += 20
        this.folderModalVisible = false

        // check if name does not already exist, if so warn and rename and append (2) to name

        let meta = { name: this.newFolderName, private: this.newFolderPrivate, level: this.activeFolderMeta.level }
        await newFolder(meta)
        this.progress += 60

        this.newFolderName = ""
        this.newFolderPrivate = true

        this.progress += 20

        // reset so can be used again
        this.progress = 0
      }
    },
    toggleLatest () {
      this.latestButtonDisabled = true

      let files = [...this.activeFolderMeta.files]
      files = sortModified(this.latest, files)

      let subfolders = [...this.activeFolderMeta.subfolders]
      subfolders = sortModified(this.latest, subfolders)

      this.latest = !this.latest

      let newactiveFolderMeta = {
        ...this.activeFolderMeta,
        subfolders,
        files
      }
      this.$store.dispatch("folderMeta", newactiveFolderMeta)

      this.latestButtonDisabled = false
    },
    async openFolder (data) {
      await openFolder(data)
      this.currentFolderName = removeBaseFileName(data.path)
    }
  }
}
</script>

<style scoped>
</style>
