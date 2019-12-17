<template>
  <div id="app">
    <router-view />
    <login-dialog />
  </div>
</template>

<script>
import LoginDialog from './components/login/login-dialog'

export default {
  name: 'App',
  components: {
    LoginDialog
  }
  /*mounted() {
    this.$store.dispatch('message/send', {
      type: 'visible',
      content: true
    })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState == 'hidden') {
        this.$store.dispatch('message/send', {
          type: 'visible',
          content: false
        })
      } else if (document.visibilityState == 'visible') {
        this.$store.dispatch('message/send', {
          type: 'visible',
          content: true
        })
      }
    })
  }*/
}
</script>

<style>
body {
  overflow: hidden;
}
</style>
