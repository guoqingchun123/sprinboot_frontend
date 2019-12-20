<template>
  <div v-html="helpContent" />
</template>

<script>
import axios from 'axios'

export default {
  name: 'Help',
  props: {
    type: {
      type: String,
      default: 'route'
    },
    path: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      helpContent: null
    }
  },
  created() {
    this.initHelpContent()
    if (this.type === 'route') {
      this.$watch('$route', () => {
        this.initHelpContent()
      })
    }
  },
  methods: {
    initHelpContent() {
      if (this.type === 'route') {
        if (this.$route.meta && this.$route.meta.help) {
          axios.get(require('@/assets/help/' + this.$route.meta.help)).then(res => {
            this.helpContent = res.data
          })
        }
      } else if (this.path) {
        axios.get(require('@/assets/help/' + this.path)).then(res => {
          this.helpContent = res.data
        })
      }
    }
  }
}
</script>

