<template>
  <div class="small-container">
    <div class="faqs">
      <title-view
        title="Frequently Asked Questions"
        style="border-bottom: 0px"
      />

      <zi-collapse
        v-model="value"
        accordion
      >
        <zi-collapse-item
          v-for="(issue, index) in issues"
          :key="index"
          :title="issue.title"
        >
          <!-- eslint-disable vue/no-v-html -->
          <p v-html="issue.description" />
        </zi-collapse-item>
      </zi-collapse>
    </div>
  </div>
</template>

<script>
import TitleView from "@components/title"

export default {
  components: {
    TitleView
  },
  data: () => ({
    value: "",
    issues: [
      {
        title: "What is the decentralized Internet?",
        description: `
          The terms <b>Decentralized Internet</b> is used to describe the concept of an Internet where users are custodians of their data and activities.
          <br/>
          <b>Daoed</b> is built on <a href="https://blockstacks.org" target="_blank">Block Stack</a>, a Decentralized Internet platform.
        `
      },
      {
        title: "What can I do with DAOed Drive?",
        description: `
          You can upload files locally, and also from external sources such as URLs as well as downloads. All files are securely encrypted before storage to your accounts Gaia hub.
          We support folder, bookmarks, trash, as well as permanently deleting files.
        `
      },
      {
        title: "Are there any limitations",
        description: `
          Currently, we only support file uploads of files less than 4BM. This restriction is to better user experience, as well as a limitation based on the Gaia hub we are using. In the future however when we have our own Gaia hub, this limitation will be remove. We are sorry for any inconvenience caused.
          Also, kindly note that this app is still in development and may be not fully stable. We do not recommend you use this app as the only back of your files.
        `
      }
    ]
  }),

  watch: {
    value () {
    }
  }
}
</script>

<style>
.faqs {
  width: 100%;
  height: 100%;
}
</style>
