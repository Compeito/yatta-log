<template>
  <v-app>
    <v-navbar/>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import VNavbar from './VNavbar'

export default {
  components: {VNavbar},
}
</script>
