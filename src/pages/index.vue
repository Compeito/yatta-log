<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <h1>やったログ</h1>
    <p>やったことの履歴を残すWebアプリ</p>
    <p>
      <v-btn
        color="info"
        @click="signInWithTwitter"
        v-show="needSignIn"
      >
        <v-icon>fab fa-twitter</v-icon>ログイン
      </v-btn>
    </p>

    <h2>みんなのログ</h2>
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
import firebase from '~/plugins/firebase'
import LogCard from '../components/LogCard'

const db = firebase.firestore()

export default {
  components: { LogCard },
  computed: {
    needSignIn() {
      return !this.$store.state.user.id
    }
  },
  data() {
    return {
      logs: []
    }
  },
  mounted() {
    if (this.$route.query.e === 'logout') {
      this.signOut()
      this.$router.push('/')
    }
    db.collection('logs').get()
      .then(querySnapshot => {
        this.logs = querySnapshot.docs
      })
  },
  methods: {
    signInWithTwitter() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.$store.commit('alert/activate', 'ログイン完了！')
          this.$store.commit('user/set', result.user.uid)
        })
        .catch((error) => {
          this.$store.commit('alert/activate', error)
        })
    }
  }
}
</script>
