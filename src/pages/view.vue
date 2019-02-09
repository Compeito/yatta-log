<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <template v-if="log">
      <v-card>
        <v-card-title>{{ log.data().title }}</v-card-title>
        <HeatTable :input="commits"/>
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
import HeatTable from '~/components/HeatTable'
import firebase from '~/plugins/firebase'
import moment from 'moment'

const db = firebase.firestore()

export default {
  components: { HeatTable },
  data() {
    return {
      log: null,
      commits: []
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
          this.updateTable()
        })
    } else {
      location.replace('/')
    }
  },
  methods: {
    doneCommit() {
      const doneData = {
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
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
    },
    updateTable() {
      const commits = []
      db.collection('doneCommits').where('log_id', '==', this.log.id).get()
        .then(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            commits.push(doc.data())
          })
        })
      this.commits = commits
    }
  }
}
</script>
