<template>
  <v-list>
    <v-subheader>履歴</v-subheader>
    <template v-for="commit in sortedCommits">
      <v-divider/>

      <v-list-tile @click="">

        <v-list-tile-content>
          <v-list-tile-title>
            <span>
              {{ commit.data().count }}{{ unit }} - {{ commit.data().date }}
            </span>
          </v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action>
          <v-btn icon ripple>
            <v-icon flat color="red lighten-1">fas fa-times</v-icon>
          </v-btn>
        </v-list-tile-action>

      </v-list-tile>

    </template>
  </v-list>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    commits: Array,
    unit: String
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
    }
  }
}
</script>
