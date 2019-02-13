<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <h1>やったログ</h1>
    <p>やった履歴を色で残そう</p>
    <p>
      <v-btn
        color="info"
        @click="signInWithTwitter"
        v-if="needSignIn"
      >
        <v-icon>fab fa-twitter</v-icon>ログイン
      </v-btn>
      <v-btn
        color="secondary"
        to="/edit"
        v-else
      >
        <v-icon>edit</v-icon>ログを作る
      </v-btn>
    </p>

    <h2>みんなのログ</h2>
    <template v-if="isLoaded">
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
      logs: [],
      isLoaded: false
    }
  },
  created() {
    if (this.$route.query.e === 'logout') {
      this.signOut()
      this.$router.push('/')
    }
    db.collection('logs').orderBy('createdAt').limit(5).get()
      .then(querySnapshot => {
        this.logs = querySnapshot.docs
        this.isLoaded = true
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
