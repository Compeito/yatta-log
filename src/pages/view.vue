<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <template v-if="log">
      <LogCard :log="log"/>
      <v-card class="log-card" v-show="log.data().user_id === $store.state.user.id">
        <v-btn @click="doneCommit(1)">
          <v-icon>add_circle</v-icon>
          1{{ log.data().unit }}
        </v-btn>
        <v-dialog
          v-model="dialogIsActive"
          width="500"
        >
          <v-btn small slot="activator">
            <v-icon>add</v-icon>
            まとめて
          </v-btn>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h4 class="headline mb-0">コミット数を選択</h4>
                <p>数字を入力してください</p>
              </div>
            </v-card-title>
            <v-layout row style="padding: 20px;">
              <BaseForm ref="form" :fields="fields"/>
              <v-btn style="margin: auto" @click="doneCommit(fields[0].model)">コミット</v-btn>
            </v-layout>
          </v-card>
        </v-dialog>
      </v-card>
      <v-card class="log-card">
        <CommitList
          style="margin-top: 20px;"
          :commits="commits"
          :unit="log.data().unit"
          :update="updateTable"
        />
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
import BaseForm from '~/components/BaseForm'
import CommitList from '~/components/CommitList'
import LogCard from '~/components/LogCard'
import firebase from '~/plugins/firebase'
import { VTextField } from 'vuetify/lib'
import moment from 'moment'

const db = firebase.firestore()

export default {
  components: { LogCard, CommitList, BaseForm, HeatTable },
  computed: {
    fields() {
      return [
        {
          component: VTextField,
          key: 'count',
          model: 1,
          suffix: this.log ? this.log.data().unit : '',
          type: 'number',
          isRequired: true
        }
      ]
    }
  },
  data() {
    return {
      log: null,
      commits: [],
      dialogIsActive: false
    }
  },
  mounted() {
    const logID = this.$route.query.l
    if (logID) {
      db.collection('logs').doc(logID).get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
            this.$router.push('/')
          } else {
            this.log = documentSnapshot
            this.updateTable()
          }
        })
    } else {
      this.$router.push('/')
    }
  },
  methods: {
    doneCommit(count) {
      const doneData = {
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        count: parseInt(count),
        log_id: this.log.id
      }
      db.collection('doneCommits').add(doneData)
        .then(() => {
          this.$store.commit('alert/activate', '送信完了！')
        })
        .catch(error => {
          this.$store.commit('alert/activate', error)
        })
      this.dialogIsActive = false
      this.updateTable()
    },
    updateTable() {
      db.collection('doneCommits').where('log_id', '==', this.log.id).get()
        .then(querySnapshot => {
          this.commits = querySnapshot.docs
        })
    }
  }
}
</script>

