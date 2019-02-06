<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <p>{{ user.providerData ? user.providerData[0].displayName : '未ログイン'}}</p>
    <v-btn color="info" @click="signInWithTwitter">ログイン</v-btn>
  </v-layout>
</template>

<script>
import auth from '~/plugins/auth'
import firebase from '~/plugins/firebase'

export default {
  data() {
    return {
      user: {}
    }
  },
  mounted() {
    auth().then((user) => {
      this.user = user
    })
  },
  methods: {
    signInWithTwitter() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider).then(function(result) {
        /*const token = result.credential.accessToken
        const secret = result.credential.secret*/
        this.user = result.user
      }).catch(function(error) {
        /*var errorCode = error.code
        var errorMessage = error.message
        var email = error.email
        var credential = error.credential*/
      })
    }
  }
}
</script>
