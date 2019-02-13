<template>
  <v-toolbar
    fixed
    app
  >
    <v-toolbar-side-icon @click="$store.commit('navbar/set', true)"/>
    <v-toolbar-title v-text="title"/>
  </v-toolbar>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$route.path === '/' ? '' : 'YattaLog'
    }
  }
}
</script>
