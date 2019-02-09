<template>
  <table>
    <thead>
    <tr>
      <th>日</th>
      <th>月</th>
      <th>火</th>
      <th>水</th>
      <th>木</th>
      <th>金</th>
      <th>土</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="weekAgo in weekRange">
      <td
        v-for="day in weekUntil(weekAgo)"
        :style="`background-color: ${rgb(day)}`"
      >
        {{ day.format('DD') }}
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment'
import utils from '../plugins/utils'

export default {
  props: {
    input: Array
  },
  data() {
    return {
      weekRange: utils.range(10)
    }
  },
  methods: {
    weekUntil(n) {
      return utils.range(7).map(i => {
        return moment().add(n * -7, 'days').add(i * -1, 'days')
      })
    },
    _createDataFromInput() {
      const r = {}
      this.input.forEach(data => {
        const dateString = moment(data.date).format('YYYY-MM-DD')
        r[dateString] = data.count
      })
      return r
    },
    rgb(date) {
      const dataInput = this._createDataFromInput()
      const maxCountInput = utils.max(Object.values(dataInput))
      const dateString = date.format('YYYY-MM-DD')
      if (dateString in dataInput) {
        const currentData = dataInput[dateString]
        const color = Math.ceil(255 * currentData / maxCountInput)

        return `rgb(255, ${(255 - color).toString()}, 255)`
      }
      return 'rgb(255, 255, 255)'
    }
  }
}
</script>
