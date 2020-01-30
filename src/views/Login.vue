<template>
  <div class="small-container">
    <div class="login-page">
      <div>
        <h3>Secure login</h3>

        <div class="login-about">
          Login to interact with your BlockStack data via Daoed.
        </div>

        <div class="login-meta">
          Login is securely managed by BlockStack, we neither require or access any of your keys.
        </div>

        <div class="justified">
          <div />
          <div class="login-button">
            <zi-button
              auto
              :loading="loading ? true : false"
              @click="signIn"
            >
              Log in
            </zi-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { userSession } from "@lib/blockstack"

export default {
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters([
      "userData"
    ])
  },
  watch: {
    userData (val) {
      if (val.username) this.$router.push("/")
    }
  },
  mounted () {
    if (this.userData.username) this.$router.push("/")
  },
  methods: {
    signIn () {
      this.loading = true
      userSession.redirectToSignIn()
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.login-about {

}
.login-meta {
  font-size: 60%;
  color: #888;
}
.login-button {
  margin: 1rem 0rem;
}
</style>
