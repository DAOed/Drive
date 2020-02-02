<template>
  <div class="container">
    <div class="landing">
      <div class="landing-inside">
        <h1>DAOed Drive</h1>
        <div class="w-700 s-150">
          Decentralized storage you <i>own</i> and <i>control</i>
        </div>
        <div class="features-div">
          <span class="feature-item">
            <check-circle-icon
              size="1.5x"
            />
            <span class="feature-item-message">
              Encrypted, secure and free
            </span>
          </span>
          <span class="feature-item">
            <check-circle-icon
              size="1.5x"
            />
            <span class="feature-item-message">
              Upload, download, manage and
              <zi-tooltip
                content="Coming soon!"
                placement="top"
                style="display: inline"
              >
                <s>share</s> files.
              </zi-tooltip>
            </span>
          </span>
        </div>
      </div>
      <div>
        <img
          class="mesh-icon"
          :src="'./img/mesh.svg'"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { CheckCircleIcon } from "vue-feather-icons"

import { mapGetters } from "vuex"

export default {
  name: "Landing",
  components: {
    CheckCircleIcon
  },
  computed: {
    ...mapGetters([
      "userData"
    ])
  },
  created () {
    if (this.userData.username) this.$router.push("/dashboard")
  }
}
</script>

<style scoped>
.landing {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
}
.landing-inside {
  width: 100%;
}
.features-div {
  margin: 1rem 0rem;
}
.feature-item {
  display: inline-flex;
  align-items: center;
  margin-right: 0.5rem;
}
.feature-item-message {
  margin: 0rem 0.3rem;
}
.mesh-icon {
  width: 30rem;
  height: 30rem;
}
@media only screen and (max-width: 800px) {
  .landing {
    flex-wrap: wrap;
  }
}
</style>
