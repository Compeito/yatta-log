<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card v-if="log">
      <v-card-title>{{ log.title }}</v-card-title>
    </v-card>
    <v-progress-circular
      indeterminate
      color="info"
      v-else
    ></v-progress-circular>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase'

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
          this.log = documentSnapshot.data()
          if (!this.log) {
            location.replace('/')
          }
        })
    } else {
      location.replace('/')
    }
  }
}
</script>
