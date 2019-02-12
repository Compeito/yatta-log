<template>
  <v-card class="log-card">
    <HeatTable
      class="log-card-table"
      :input="commits"
      :log="log"
    />
    <v-card-title primary-title>
      <h3 class="headline mb-0">
        <nuxt-link :to="`/view?l=${log.id}`">
          {{ log.data().title }}
        </nuxt-link>
      </h3>
    </v-card-title>
  </v-card>
</template>

<script>
import HeatTable from './HeatTable'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export default {
  components: { HeatTable },
  props: {
    log: firebase.firestore.DocumentSnapshot
  },
  data() {
    return {
      commits: []
    }
  },
  mounted() {
    db.collection('doneCommits').where('log_id', '==', this.log.id).get()
      .then(querySnapshot => {
        this.commits = querySnapshot.docs
      })
  }
}
</script>
