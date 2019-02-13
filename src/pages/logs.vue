<template>
  <v-layout
    column
    justify-center
    align-center
  >
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
import LogCard from '~/components/LogCard'
import firebase from '~/plugins/firebase'
import moment from 'moment'

const db = firebase.firestore()

export default {
  components: { LogCard },
  data() {
    return {
      logs: [],
      isLoaded: false
    }
  },
  created() {
    db.collection('logs').where('user_id', '==', this.$store.state.user.id).get()
      .then(querySnapshot => {
        this.logs = this.sortByCreatedAt(querySnapshot.docs)
        this.isLoaded = true
      })
  },
  methods: {
    sortByCreatedAt(logs) {
      return logs.sort((a, b) => {
        const aDate = a.data().createdAt
        const bDate = b.data().createdAt
        if (moment(aDate).isAfter(bDate)) {
          return -1
        } else if (moment(aDate).isBefore(bDate)) {
          return 1
        } else {
          return 0
        }
      })
    },
  }
}
</script>
