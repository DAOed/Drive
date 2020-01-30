<template>
  <div class="modal">
    <zi-dialog
      v-model="visible"
      done="ok!"
      :before-done="closing"
    >
      <div class="modal-content">
        <div>
          <div class="dual-grid">
            <div class="dual-grid-one">
              <div class="file-icon-div">
                <folder-icon
                  v-if="modalData.type === 'folder'"
                  size="8x"
                />
                <file-icon
                  v-else
                  size="8x"
                />
              </div>
            </div>
            <div class="dual-grid-two">
              <div
                class="file-desc"
                title="File name"
              >
                <circle-icon size="1x" />
                <span class="file-desc-value">{{ modalData.name }}</span>
              </div>
              <div
                class="file-desc"
                title="Modified"
              >
                <clock-icon size="1x" />
                <span class="file-desc-value">
                  <timeago
                    :datetime="modalData.modified"
                    :auto-update="60"
                  />
                </span>
              </div>
              <div
                v-if="modalData.type === 'file'"
                class="file-desc"
                title="Size"
              >
                <octagon-icon size="1x" />
                <span class="file-desc-value">{{ getBytes(modalData.size) }}</span>
              </div>
              <div
                class="file-desc"
                title="Private"
              >
                <eye-off-icon
                  v-if="modalData.private"
                  size="1x"
                />
                <eye-icon
                  v-else
                  size="1x"
                />
                <span class="file-desc-value">{{ !!modalData.private }}</span>
              </div>
              <div
                class="file-desc"
                title="Starred"
              >
                <star-icon size="1x" />
                <span class="file-desc-value">{{ !!modalData.starred }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="divider" />

        <div class="contents">
          <div class="actions">
            <zi-button
              v-if="modalData.type === 'file'"
              size="small"
              class="action-button"
              type="abort"
              title="Download"
              auto
              @click="downloadItem()"
            >
              <download-icon size="1.5x" />
              <span class="action-text desktop">Download</span>
            </zi-button>
            <zi-button
              size="small"
              class="action-button"
              type="abort"
              title="Share"
              auto
              disabled
              @click="shareItem()"
            >
              <share-2-icon size="1.5x" />
              <span class="action-text desktop">Share</span>
            </zi-button>
            <zi-button
              size="small"
              class="action-button"
              type="abort"
              :title="modalData.starred ? 'Remove star' : 'Star'"
              :disabled="loadingStar"
              auto
              @click="starItem(modalData.starred)"
            >
              <star-icon
                size="1.5x"
                :fill="modalData.starred ? '#666' : 'none'"
              />
              <span class="action-text desktop">{{ modalData.starred ? 'Remove star' : 'Star' }}</span>
            </zi-button>
            <zi-button
              size="small"
              class="action-button"
              type="abort"
              title="Trash"
              auto
              @click="trashActiveItem()"
            >
              <trash-icon size="1.5x" />
              <span class="action-text desktop">Trash</span>
            </zi-button>
          </div>
        </div>
      </div>
    </zi-dialog>
    <progress-bar :progress="progress" />
    <v-styler>{{ updateClass }}</v-styler>
    <a
      id="download"
      ref="download"
      style="display: none"
    />
  </div>
</template>

<script>

import { OctagonIcon, ClockIcon, CircleIcon, FileIcon, FolderIcon,
  DownloadIcon, StarIcon, Share2Icon, TrashIcon, EyeIcon, EyeOffIcon } from "vue-feather-icons"

import ProgressBar from "@components/progress"

import { formatBytes, loadFileContent, newStar, removeStar, trashItem } from "@lib/utils"

export default {
  components: {
    OctagonIcon,
    ClockIcon,
    CircleIcon,
    FileIcon,
    FolderIcon,
    DownloadIcon,
    StarIcon,
    Share2Icon,
    TrashIcon,
    EyeIcon,
    EyeOffIcon,
    ProgressBar
  },
  props: {
    modalData: {
      type: Object,
      default: () => {
        return { }
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    visible: false,
    progress: 0,
    updateClass: `
      .zi-dialog-footer {
        display: none !important;
      }
      .zi-dialog-wrapper {
        transform: translateY(0px) !important;
      }
    `,
    placeholder: "img/placeholder.png",
    loadingStar: false
  }),
  mounted () {
    this.visible = this.show
  },
  methods: {
    closing () {
      this.$emit("closing")
    },
    imgUrlAlt (event) {
      event.target.src = this.placeholder
    },
    getBytes (bytes) {
      return formatBytes(bytes)
    },
    async downloadItem () {
      this.progress += 5
      this.visible = false
      // download only works for files, not folders
      // zipping content of folder and downloading will com next

      const data = this.modalData

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
    shareItem () {
    },
    async starItem (alreadyStarred) {
      // state will NOT update in modal, so just close it  - fix later
      this.visible = false
      this.$emit("closing")
      // this.loadingStar = true

      if (alreadyStarred) {
        await removeStar(this.modalData)
      } else {
        await newStar(this.modalData)
      }

      // this.loadingStar = false
    },
    async trashActiveItem () {
      // state will NOT update in modal, so just close it  - fix later
      this.visible = false
      this.$emit("closing")

      await trashItem(this.modalData)

      this.$Toast.show({
        type: "warning",
        action: "View Trash",
        text: this.modalData.name + " moved to Trash",
        handler: () => this.$router.push("/trash?mode=" + this.modalData.type + "s")
      })
    },
    closeModal () {
    }
  }
}
</script>

<style scoped>
.modal {
  width: 500px;
}
.modal-content {
}
.divider {
  margin: 1rem 0rem;
  border: 1px solid black;
}
.contents {
  margin: 0rem 1rem;
}
.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}
.action-button {
  margin-bottom: 1rem;
}
.action-text {
  margin-left: 0.3rem;
}
.file-desc {
  display: flex;
  align-items: center;
}
.file-desc-value {
  margin-left: 0.3rem;
}
.file-icon-div {
  display: flex;
  justify-content: center;
}
</style>
