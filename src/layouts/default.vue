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
    <alert-snackbar></alert-snackbar>
  </v-app>
</template>

<script>
import VNavbar from './VNavbar'
import AlertSnackbar from '~/components/AlertSnackbar'

export default {
  components: {AlertSnackbar, VNavbar},
}
</script>
