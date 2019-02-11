<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <template v-if="log">
      <v-card class="log-card">
        <HeatTable
          class="log-card-table"
          :input="commits"
          :unit="log.data().unit"
        />
        <v-card-title primary-title>
          <h3 class="headline mb-0">{{ log.data().title }}</h3>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="primary" @click="doneCommit">
            <v-icon>add_circle</v-icon>やった(+1)
          </v-btn>
          <v-btn flat color="info">
            <v-icon>share</v-icon>共有
          </v-btn>
        </v-card-actions>
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
      this.updateTable()
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

<style scoped>
.log-card {
  padding: 10px;
  width: 100%;
  max-width: 600px;
}

.log-card-table {
  margin-bottom: 20px;
}
</style>
