<template>
  <div>
    <zi-progress
      v-if="progress > 0 && progress < 100"
      :color="progressColor"
      :percentage="progress"
      fix="top"
    />
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 10
    }
  },
  data: () => ({
    progressColor: [
      {
        num: 5,
        color: "#000000"
      },
      {
        num: 25,
        color: "#5C5C5C"
      },
      {
        num: 50,
        color: "#969CA7"
      },
      {
        num: 75,
        color: "#94B9F1"
      },
      {
        num: 100,
        color: "#6d9fec"
      }
    ]
  })
}
</script>
