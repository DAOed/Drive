
<template>
  <div class="container">
    <basic-view
      title="Trash"
      :base="coreFolders.trash"
      icon="trash"
    />
  </div>
</template>

<script>
import { coreFolders } from "@constants"

import BasicView from "@components/views/basic"

export default {
  name: "Trash",
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
