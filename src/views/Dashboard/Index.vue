<template>
  <div class="container">
    <div class="dashboard">
      <div class="dashboard-inside">
        <div class="dual-grid">
          <div class="dual-grid-one">
            <page-aside />
          </div>
          <div class="dual-grid-two">
            <page-content />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageAside from "@components/aside"

import pageContent from "./Content"

export default {
  name: "Dashboard",
  components: {
    pageAside,
    pageContent
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 60vh;
}
.dashboard-inside {
  width: 100%;
}
.mesh-icon {
  width: 30rem;
  height: 30rem;
}
</style>
