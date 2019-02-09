<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <template v-if="log">
      <v-card>
        <v-card-title>{{ log.data().title }}</v-card-title>
        <v-btn @click="doneCommit">やった</v-btn>
      </v-card>
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
import moment from 'moment'

const db = firebase.firestore()

export default {
  data() {
    return {
      log: null
    }
  },
  mounted() {
    const logID = this.$route.query.l
    if (logID) {
      db.collection('logs').doc(logID).get()
        .then(documentSnapshot => {
          this.log = documentSnapshot
          if (!this.log) {
            location.replace('/')
          }
        })
    } else {
      location.replace('/')
    }
  },
  methods: {
    doneCommit() {
      const doneData = {
        date: moment().format('YYYY-MM-DD_HH-mm-ss'),
        count: 1,
        log_id: this.log.id
      }
      db.collection('doneCommits').add(doneData)
        .then(() => {
          this.$store.commit('alert/activate', '送信完了！')
        })
        .catch(error => {
          this.$store.commit('alert/activate', error)
        })
    }
  }
}
</script>
