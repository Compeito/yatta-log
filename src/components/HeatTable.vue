<template>
  <table v-if="input">
    <thead>
    <tr>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
      <th>&nbsp;</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="weekAgo in weekRange">
      <td
        v-for="day in weekUntil(weekAgo)"
        :style="`background-color: ${rgb(day)}`"
      >
        <v-tooltip style="width: 100%" bottom>
          <div slot="activator">&nbsp;</div>
          <span>{{ tooltipText(day) }}</span>
        </v-tooltip>
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
    input: Array,
    unit: String
  },
  data() {
    return {
      weekRange: utils.range(10)
    }
  },
  methods: {
    /**
     * ポップアップ表示する文字列を返す
     * @param {moment.Moment} day
     * @returns {String}
     */
    tooltipText(day) {
      const dataInput = this._createDataFromInput()
      const dateString = day.format('YYYY-MM-DD')
      let count = 0
      if (dateString in dataInput) {
        count = dataInput[dateString]
      }
      return day.format('YYYY/MM/DD') + '...' + count.toString() + this.unit
    },
    /**
     * n週間前の7日間のmomentオブジェクトの配列を返す
     * @param n
     * @returns {moment.Moment[]}
     */
    weekUntil(n) {
      return utils.range(7).map(i => {
        return moment().add(n * -7, 'days').add(i * -1, 'days')
      })
    },
    /**
     * this.inputから{dateString: countの合計}のオブジェクトを返す
     * @private
     * @returns {Object}
     */
    _createDataFromInput() {
      const r = {}
      this.input.forEach(data => {
        const dateString = moment(data.date).format('YYYY-MM-DD')
        if (dateString in r) {
          r[dateString] += data.count
        } else {
          r[dateString] = data.count
        }
      })
      return r
    },
    /**
     * tdのループの中で得られるmomentオブジェクトと
     * this._createDataFromInput()の値をもとにrgbカラーを返す
     * @param date
     * @returns {string}
     */
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

<style scoped>
table {
  width: 100%;
  max-width: 600px;
  background-color: #bcbcbc;
}

th {
  background-color: #bcbcbc;
}

table td {
  border: solid 1px #eeeeee;
}
</style>
