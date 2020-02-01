<template>
  <div id="app">
    <div>
      <app-header />
    </div>
    <div class="app-body">
      <div
        v-if="loading"
        class="app-loader"
      >
        <zi-spinner size="big" />
        <div class="mg-2 s-110 w-500">
          {{ statusMessage }}
        </div>
      </div>
      <router-view v-else />
    </div>
    <div>
      <app-footer />
    </div>
    <progress-bar :progress="progress" />
  </div>
</template>

<script>
import AppHeader from "@components/partials/header"
import AppFooter from "@components/partials/footer"
import ProgressBar from "@components/progress"

import { getFile, userSession } from "@lib/blockstack"
import { coreFolders } from "@constants"

import { readyCoreFolders } from "@lib/utils"

export default {
  components: {
    AppHeader,
    AppFooter,
    ProgressBar
  },
  data: () => ({
    loading: true,
    progress: 0,
    statusMessage: ""
  }),
  async mounted () {
    this.progress += 10
    this.statusMessage = "Checking auth ..."

    // check if user is logged in
    if (userSession.isUserSignedIn()) {
      let data = userSession.loadUserData()
      this.$store.dispatch("userData", data)

      this.progress += 30
      this.statusMessage = "Loading user data ..."

      await this.loadData()

      window.history.replaceState({}, document.title, window.location.pathname)

      this.progress += 50
      this.statusMessage = "Reading drive ..."

      //
      let routeName = this.$route.name ? this.$route.name.toLowerCase() : "files"
      // let isFolder = Object.keys(coreFolders).find((route) => route === routeName)

      let folderMeta = await readyCoreFolders(coreFolders[routeName])
      if (folderMeta) this.$store.dispatch("folderMeta", folderMeta)

      this.loading = false
      this.progress = 0
    } else if (userSession.isSignInPending()) {
      this.progress += 20
      this.statusMessage = "Handling auth ..."

      userSession.handlePendingSignIn()
        .then(async (userData) => {
          this.$store.dispatch("userData", userData)

          this.progress += 30
          this.statusMessage = "Loading user data ..."

          await this.loadData()

          this.progress = 0
          this.$router.push("/dashboard")
          this.loading = false
        })

      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      this.loading = false
      this.progress = 0
    }

    this.$router.beforeEach((to, from, next) => {
      // This goes through the matched routes from last to first, finding the closest route with a title.
      // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
      const nearestWithTitle = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.title)

      // Find the nearest route element with meta tags.
      const nearestWithMeta = to.matched
        .slice()
        .reverse()
        .find(r => r.meta && r.meta.metaTags)
      // const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

      // If a route with a title was found, set the document (page) title to that value.
      if (nearestWithTitle) document.title = nearestWithTitle.meta.title

      // Remove any stale meta tags from the document using the key attribute we set below.
      Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
        el => el.parentNode.removeChild(el)
      )

      // Skip rendering meta tags if there are none.
      if (!nearestWithMeta) return next()

      // Turn the meta tag definitions into actual elements in the head.
      nearestWithMeta.meta.metaTags
        .map(tagDef => {
          const tag = document.createElement("meta")

          Object.keys(tagDef).forEach(key => {
            tag.setAttribute(key, tagDef[key])
          })

          // We use this to track which meta tags we create, so we don't interfere with other ones.
          tag.setAttribute("data-vue-router-controlled", "")

          return tag
        })
        // Add the meta tags to the document head.
        .forEach(tag => document.head.appendChild(tag))

      next()
    })
  },
  methods: {
    async loadData () {
      let settings = await getFile("settings")
      settings = JSON.parse(settings || "{}")

      if (settings.theme) this.$store.dispatch("theme", { mode: settings.theme, auto: true })
      this.$store.dispatch("settings", { ...settings, auto: true })
    }
  }
}
</script>

<style lang="scss">
#app {
}
.app-body {
  min-height: 65vh;
  margin: 3rem 0rem 0rem 0rem;
  overflow: hidden;
}
.app-loader {
  display: flex;
  height: 50vh;
  justify-content: center;
  align-items: center;
}
</style>
