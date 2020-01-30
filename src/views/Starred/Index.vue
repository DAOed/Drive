
<template>
  <div class="container">
    <basic-view
      title="Starred"
      :base="coreFolders.starred"
      icon="starred"
    />
  </div>
</template>

<script>
import { coreFolders } from "@constants"

import BasicView from "@components/views/basic"

export default {
  name: "Starred",
  components: {
    BasicView
  },
  data: () => ({
    coreFolders
  })
}
</script>

<style scoped>
</style>
