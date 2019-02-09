<template>
  <v-app>
    <navbar/>
    <toolbar/>
    <v-content>
      <v-container>
        <nuxt/>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
    <alert-snackbar/>
  </v-app>
</template>

<script>
import Navbar from '~/components/Navbar'
import Toolbar from '~/components/Toolbar'
import AlertSnackbar from '~/components/AlertSnackbar'
import auth from '~/plugins/auth'

export default {
  components: { Navbar, Toolbar, AlertSnackbar },
  mounted() {
    auth().then(user => {
      this.$store.commit('user/set', user.uid)
    })
  }
}
</script>
