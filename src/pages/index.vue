<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-btn
      color="info"
      @click="signInWithTwitter"
      v-show="!$store.state.user.id"
    >ログイン
    </v-btn>

    <template v-if="logs">
      <LogCard
        v-for="log in logs"
        :log="log"
        :key="log.id"
      />
    </template>
    <v-progress-circular
      indeterminate
      color="info"
      v-else
    ></v-progress-circular>
  </v-layout>
</template>

<script>
import auth from '~/plugins/auth'
import firebase from '~/plugins/firebase'
import LogCard from '../components/LogCard'

const db = firebase.firestore()

export default {
  components: { LogCard },
  data() {
    return {
      logs: []
    }
  },
  mounted() {
    if (this.$route.query.e === 'logout') {
      this.signOut()
      location.replace('/')
    }
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
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.$store.commit('user/set', user.id)
        })
        .catch((error) => {
          this.$store.commit('alert/activate', error)
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
