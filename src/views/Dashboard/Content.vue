<template>
  <div>
    <div>
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <folder-icon size="1.5x" />
          <p class="meta-title">
            Files
          </p>
        </div>

        <div class="s-80">
          {{ `${details.files.files} files, ${details.files.subfolders} folders` }}
        </div>

        <div>
          <zi-button
            v-if="!featuredFolders.length"
            size="small"
            auto
            @click="commandHandler('files')"
          >
            View
          </zi-button>

          <zi-popover
            v-else
            align="right"
            :hoverable="true"
            @command="commandHandler"
          >
            <zi-button
              size="small"
              auto
            >
              Open
            </zi-button>
            <template v-slot:dropdown>
              <zi-popover-item
                v-for="(featured, index) in featuredFolders"
                :key="index"
                :command="removeBaseFileName(featured.path)"
              >
                {{ featured.name }}
              </zi-popover-item>
              <zi-popover-item command="files">
                All files
              </zi-popover-item>
            </template>
          </zi-popover>
        </div>
      </zi-card>
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <star-icon size="1.5x" />
          <p class="meta-title">
            Starred
          </p>
        </div>

        <div class="s-80">
          {{ `${details.starred.files} files, ${details.starred.subfolders} folders` }}
        </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/starred')"
        >
          View
        </zi-button>
      </zi-card>
      <!--
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <share-2-icon size="1.5x" />
          <p class="meta-title">
            Shared
          </p>
        </div>

          <div            class="s-80"          >
            {{ `${details.shared.files} files, ${details.shared.subfolders} folders` }}
          </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/shared')"
        >
          View
        </zi-button>
      </zi-card>
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <lock-icon size="1.5x" />
          <p class="meta-title">
            Locker
          </p>
        </div>

          <div            class="s-80"          >
           {{ `${details.locker.files} files, ${details.locker.subfolders} folders` }}
          </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/locker')"
        >
          View
        </zi-button>
      </zi-card>
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <layers-icon size="1.5x" />
          <p class="meta-title">
            Library
          </p>
        </div>

          <div            class="s-80"          >
            {{ `${details.library.files} files, ${details.library.subfolders} folders` }}
          </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/library')"
        >
          View
        </zi-button>
      </zi-card>
      -->
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <trash-2-icon size="1.5x" />
          <p class="meta-title">
            Trash
          </p>
        </div>

        <div class="s-80">
          {{ `${details.trash.files} files, ${details.trash.subfolders} folders` }}
        </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/trash')"
        >
          View
        </zi-button>
      </zi-card>
      <zi-card
        class="card-class justified"
        hoverable
      >
        <div class="card-meta">
          <terminal-icon size="1.5x" />
          <p class="meta-title">
            Console
          </p>
        </div>

        <div class="s-80">
          Manage all files
        </div>

        <zi-button
          size="small"
          auto
          @click="$router.push('/console')"
        >
          View
        </zi-button>
      </zi-card>
    </div>
  </div>
</template>

<script>
import { FolderIcon, StarIcon, Trash2Icon, TerminalIcon } from "vue-feather-icons" /*, Share2Icon, LockIcon, LayersIcon, */

import { removeBaseFileName } from "@lib/helpers"

import { mapGetters } from "vuex"

export default {
  components: {
    FolderIcon,
    StarIcon,
    Trash2Icon,
    TerminalIcon
    /*
    LockIcon,
    LayersIcon,
    Share2Icon,
    */
  },
  data: () => ({
    loading: true
  }),
  computed: {
    ...mapGetters([
      "coreFolderStats"
    ]),
    details () {
      return {
        files: this.coreFolderStats.files,
        starred: this.coreFolderStats.starred,
        trash: this.coreFolderStats.trash,
        console: this.coreFolderStats.console
        /*
        starred: this.coreFolderStats.starred,
        locker: this.coreFolderStats.locker,
        library: this.coreFolderStats.library,
        */
      }
    },
    featuredFolders () {
      return this.details.files.featuredFolders
    }
  },
  methods: {
    commandHandler (command) {
      this.$router.push("/files#" + command)
    },
    removeBaseFileName (path) {
      return removeBaseFileName(path)
    }
  }
}
</script>

<style scoped>
.card-class {
  display: inline-flex;
  margin: 1rem 0rem;
}
.card-meta {
  display: inline-flex;
  align-items: center;
}
.meta-title {
  margin-left: 0.5rem;
}
</style>
