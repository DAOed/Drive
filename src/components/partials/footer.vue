<template>
  <div class="footer">
    <div class="container">
      <div class="justified">
        <div>
          <span
            class="foot-item"
            style="margin-left: 0"
          > A <a href="https://about.daoed.com">Daoed</a> Company</span>
          <a
            href="https://about.daoed.com/#support"
            class="foot-item"
          >
            Support us!
          </a>
        </div>
        <div>
          <router-link
            to="/faqs"
            class="foot-item"
          >
            FAQs
          </router-link>
          <router-link
            to="about"
            class="foot-item"
          >
            About
          </router-link>
          <a
            target="_blank"
            href="https://github.com/DAOed/Drive/issues"
            class="foot-item"
          >
            Issues
          </a>
          <a
            href="https://about.daoed.com/contact"
            class="foot-item"
          >
            Contact
          </a>
          <a
            href="https://about.daoed.com/terms"
            class="foot-item"
          >
            Terms
          </a>
          <a
            href="https://about.daoed.com/privacy"
            class="foot-item"
          >
            Privacy
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.footer {
  margin: 4rem 0rem 1rem 0rem;
}
.footer * {
  color: #666 !important;
}
.foot-item {
  font-size: 70% !important;
  margin-left: 0.5rem;
}
</style>
