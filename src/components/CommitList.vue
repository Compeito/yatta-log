<template>
  <v-list>
    <template v-for="commit in sortedCommits">
      <p class="text-xs-right">{{ commit.data().count }}{{ unit }} - {{ commit.data().date }}</p>
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
