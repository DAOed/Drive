<template>
  <div>
    <div class="input-area">
      <zi-input
        id="input"
        v-model="data"
        :placeholder="placeholder"
        class="search-input"
        clearable
        @submit="search"
      />
      <zi-button
        auto
        class="search-button"
        @click="search"
      >
        Search
      </zi-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data: () => {
    return {
      data: "",
      placeholder: "Search files" // "user, app, post, media, or document..."
    }
  },
  created () {
    this.data = this.query
  },
  mounted () {
    document.getElementById("input").addEventListener("keyup", (event) => {
      if (event.key === "Enter" || (event.keyCode === 13)) {
        this.search()
      }
    })
  },
  methods: {
    search () {
      this.$emit("search", this.data)
    }
  }
}
</script>

<style scoped>
.input-area {
  display: flex;
  align-items: center;
}
.search-input {
  width: 100%;
  display: flex;
  margin: 1rem 1rem 1rem 0rem;
}
.app-logo-div {
}
</style>
