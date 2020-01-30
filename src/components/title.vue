<template>
  <div class="title-view justified">
    <div
      class="title-text"
      style="display: flex; align-items: center;"
    >
      <span
        v-if="icon"
        style="display: flex; align-items: center; margin-right: 0.4rem; "
      >
        <folder-icon
          v-if="icon === 'files'"
          size="1x"
        />
        <star-icon
          v-else-if="icon === 'starred'"
          size="1x"
        />
        <share-2-icon
          v-else-if="icon === 'shared'"
          size="1x"
        />
        <trash-2-icon
          v-else-if="icon === 'trash'"
          size="1x"
        />
        <lock-icon
          v-else-if="icon === 'locker'"
          size="1x"
        />
        <layers-icon
          v-else-if="icon === 'library'"
          size="1x"
        />
        <terminal-icon
          v-else-if="icon === 'console'"
          size="1x"
        />
      </span>
      <span>
        <span v-if="links.length">
          <a
            href="#files"
            @click="loadFolder({path: 'FILES'})"
          > Files </a>
          <span
            v-for="(link, index) in links"
            :key="index"
          >
            > <a
              :href="'#' + link.href"
              @click="loadFolder(link)"
            > {{ link.name }}</a>
          </span>
        </span>
        <span v-else> {{ currentTitle }} </span>
      </span>
    </div>
    <slot name="extra" />
  </div>
</template>

<script>
import { FolderIcon, StarIcon, Share2Icon, Trash2Icon, LockIcon, LayersIcon, TerminalIcon } from "vue-feather-icons"

import { coreFolders } from "@constants"

import { openFolder } from "@lib/utils"
import { removeBaseFileName } from "@lib/helpers"

export default {
  components: {
    FolderIcon,
    StarIcon,
    Share2Icon,
    Trash2Icon,
    LockIcon,
    LayersIcon,
    TerminalIcon
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    currentTitle: "",
    links: []
  }),
  watch: {
    title (newVal, oldVal) {
      this.currentTitle = this.title
      this.setLinks()
    }
  },
  mounted () {
    this.currentTitle = this.title
    this.setLinks()
  },
  methods: {
    setLinks () {
      let currentTitle = this.currentTitle
      var index = currentTitle.indexOf(" > ")
      var parts = [currentTitle.slice(0, index), currentTitle.slice(index + 3)]

      let baseTitle = parts[0].toUpperCase()
      let linkable = baseTitle === coreFolders.files

      let path = parts[1]

      if (linkable && path) {
        let subfolders = path.split("/")

        this.links = subfolders.map((sf, ind) => {
          let p = (coreFolders.files + "/" + subfolders.slice(0, ind).join("/") + "/" + sf).replace(/\/\//g, "/")
          return {
            name: sf,
            path: p,
            href: removeBaseFileName(p)
          }
        })
      } else {
        this.links = []
      }
    },
    async loadFolder (meta) {
      await openFolder(meta)

      // update current title
      let currentTitle = meta.href ? "Files > " + meta.href : "Files"
      this.currentTitle = currentTitle
      this.setLinks()
    }
  }
}
</script>

<style scoped>
.title-view {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #fafafa;
}
.title-text {
  font-size: 120%;
  font-weight: 700;
}
</style>
