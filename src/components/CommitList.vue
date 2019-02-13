<template>
  <v-list>
    <v-subheader>履歴</v-subheader>
    <template v-for="commit in sortedCommits">
      <v-divider/>

      <v-list-tile @click="">

        <v-list-tile-content>
          <v-list-tile-title>
            <span>
              {{ commit.data().count }}{{ log.data().unit }} - {{ commit.data().date }}
            </span>
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action v-show="isUsersLog">
          <v-btn icon ripple @click="deleteCommit(commit)">
            <v-icon flat color="red lighten-1">fas fa-times</v-icon>
          </v-btn>
        </v-list-tile-action>

      </v-list-tile>

    </template>
  </v-list>
</template>

<script>
import moment from 'moment'
import firebase from '~/plugins/firebase'

const db = firebase.firestore()

export default {
  props: {
    commits: Array,
    log: firebase.firestore.DocumentSnapshot,
    update: Function
  },
  computed: {
    sortedCommits() {
      return this.commits.sort((a, b) => {
        const aDate = a.data().date
        const bDate = b.data().date
        if (moment(aDate).isAfter(bDate)) {
          return -1
        } else if (moment(aDate).isBefore(bDate)) {
          return 1
        } else {
          return 0
        }
      })
    },
    isUsersLog() {
      return this.$store.state.user.id === this.log.data().user_id
    }
  },
  methods: {
    deleteCommit(commit) {
      db.collection('doneCommits').doc(commit.id)
        .delete()
        .then(this.update)
    }
  }
}
</script>
