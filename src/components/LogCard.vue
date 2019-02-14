<template>
  <v-card class="log-card">
    <v-card-title primary-title>
      <h2>
        <nuxt-link :to="`/view?l=${log.id}`">
          {{ log.data().title }}
        </nuxt-link>
      </h2>
      <HeatTable
        :input="commits"
        :log="log"
      />
      <slot></slot>
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
  },
  methods: {
    update(commits) {
      this.commits = commits
    }
  }
}
</script>
