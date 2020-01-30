
import store from "@store"

export default (to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && (store.state.userData.username || localStorage.getItem("blockstack-session").indexOf('{"version') !== 0 ||
              (window.__PRERENDER_INJECTED && window.__PRERENDER_INJECTED.PRERENDER))) next()
  else if (requiresAuth && !store.state.userData.username) next("/login")
  else next()
}
