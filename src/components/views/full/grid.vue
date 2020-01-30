<template>
  <div>
    <div
      v-if="folders.length"
      class="grid-type-container"
    >
      <div class="three-grid-container">
        <zi-card
          v-for="(item, index) in folders"
          :key="index"
          hoverable
        >
          <div>
            <div class="justified">
              <span />
              <span>
                <span
                  v-if="item.starred"
                  title="Starred"
                  style="margin-right: 0.2rem"
                >
                  <star-icon
                    size="0.8x"
                  />
                </span>

                <a
                  :href="'#' + item.path"
                  style="color: inherit;"
                  @click="view(item)"
                >
                  <chevron-down-icon
                    size="1x"
                  /> </a>
              </span>
            </div>

            <p
              style="display: flex; align-items: center;"
              title="Folder"
            >
              <folder-icon
                size="1x"
              />
              <a
                :href="'#' + removeBaseFileName(item.path)"
                style="color: inherit; marginLeft: 0.2rem; fontWeight: bolder"
                @click="openFolder(item)"
              >{{ item.name }} </a>
            </p>
            <span
              class="s-60 tc-gray"
              :title="new Date(item.modified).toUTCString()"
            >
              <timeago
                :datetime="item.modified"
                :auto-update="60"
              />,
              {{ getBytes(item.size) }}
            </span>
          </div>
        </zi-card>
      </div>
    </div>

    <div class="">
      <div class="three-grid-container">
        <zi-card
          v-for="(item, index) in files"
          :key="index"
          hoverable
        >
          <div class="justified">
            <div />
            <div>
              <span
                v-if="item.starred"
                title="Starred"
                style="margin-right: 0.4rem"
              >
                <star-icon
                  size="0.8x"
                  fill="#666"
                />
              </span>

              <zi-tag>{{ ext(item.name) || '?' }}</zi-tag>
            </div>
          </div>
          <div>
            <p title="File">
              <a
                :href="'#' + removeBaseFileName(item.path)"
                style="color:inherit;"
                @click="view(item)"
              >{{ name(item.name) }} </a>
            </p>
            <span
              class="s-60 tc-gray"
              :title="new Date(item.modified).toUTCString()"
            >
              <timeago
                :datetime="item.modified"
                :auto-update="60"
              />,
              {{ getBytes(item.size) }}
            </span>
          </div>
        </zi-card>
      </div>
    </div>
  </div>
</template>

<script>
import { FolderIcon, ChevronDownIcon, StarIcon } from "vue-feather-icons"
import { fileName, fileExt, formatBytes } from "@lib/utils"

import { removeBaseFileName } from "@lib/helpers"

export default {
  components: {
    FolderIcon,
    ChevronDownIcon,
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
    files () {
      return this.content.files || []
    },
    folders () {
      return this.content.folders || []
    }
  },
  watch: {
    /*
    files (newVal, oldVal) {
      this.$nextTick(() => {
        let newEl = this.getNewItem(newVal, oldVal)

        if (newEl) {
          const mouseoverEvent = new Event("mouseover")
          this.$refs[newEl.path].$el.dispatchEvent(mouseoverEvent)
        }
      })
    },
    folders (newVal, oldVal) {
      this.$nextTick(() => {
        let newEl = this.getNewItem(newVal, oldVal)

        if (newEl) {
          // const mouseoverEvent = new Event("mouseover")
          // console.log(this.$refs[newEl.path])
          // this.$refs[newEl.path][0].$el.dispatchEvent(mouseoverEvent)

          const el = document.getElementById(newEl.path)

          el.dispatchEvent(
            new MouseEvent("mouseover", { "view": window, "bubbles": true, "cancelable": true })
          )
        }
      })
    }
    */
  },
  methods: {
    getNewItem (newArr, oldArr) {
      for (var i = 0; i < newArr.length; i++) {
        let exists = oldArr.find((item) => item === newArr[i])
        if (!exists) return newArr[i]
      }
    },
    name (name) {
      return fileName(name)
    },
    ext (name) {
      return fileExt(name)
    },
    view (data) {
      this.$emit("view", data)
    },
    openFolder (data) {
      this.$emit("openFolder", data)
    },
    getBytes (bytes) {
      return formatBytes(bytes)
    },
    removeBaseFileName (path) {
      return removeBaseFileName(path)
    }
  }
}
</script>

<style scoped>
.grid-type-container {
  margin-bottom: 5rem;
}
</style>
