<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <p>{{ user.providerData ? user.providerData[0].displayName : '未ログイン'}}</p>
    <p v-for="log in logs">
      <a :href="`/view?l=${log.id}`">{{ log.data().title }}</a>
    </p>
    <v-btn color="info" @click="signInWithTwitter">ログイン</v-btn>
    <v-btn color="warning" @click="signOut">ログアウト</v-btn>
    <v-btn @click="$store.commit('alert/activate', 'test')">アラート</v-btn>
  </v-layout>
</template>

<script>
import auth from '~/plugins/auth'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export default {
  data() {
    return {
      user: {},
      logs: []
    }
  },
  mounted() {
    auth().then((user) => {
      this.user = user
    })
    db.collection('logs').get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          this.logs.push(doc)
        })
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
    },
    signOut() {
      firebase.auth().signOut()
        .then(() => {
          this.$store.commit('alert/activate', 'ログアウトしました')
          this.$store.commit('user/set', '')
        })
    }
  }
}
</script>
