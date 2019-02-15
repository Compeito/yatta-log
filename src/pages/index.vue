<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <h1>やったログ</h1>
    <p>やった履歴を色で残そう</p>
    <p>
      <v-btn
        color="info"
        @click="signInWithTwitter"
        v-if="needSignIn"
      >
        <v-icon>fab fa-twitter</v-icon>
        ログイン
      </v-btn>
      <v-btn
        color="secondary"
        to="/edit"
        v-else
      >
        <v-icon>edit</v-icon>
        ログを作る
      </v-btn>
    </p>

    <h2 style="margin-top: 20px">こんな感じのが作れます</h2>
    <v-card class="log-card">
      <v-card-title primary-title>
        <h2>{{ log.title }}</h2>
        <HeatTableTest
          :input="commits"
          :log="log"
        />
        <slot></slot>
      </v-card-title>
    </v-card>
  </v-layout>
</template>

<script>
import firebase from '~/plugins/firebase'
import HeatTableTest from '~/components/HeatTableTest'
import utils from '~/plugins/utils'
import moment from 'moment'

export default {
  components: { HeatTableTest },
  computed: {
    needSignIn() {
      return !this.$store.state.user.id
    }
  },
  data() {
    const logSampleData = this.logSample()
    return {
      log: logSampleData,
      commits: this.commitsSample(logSampleData)
    }
  },
  created() {
    if (this.$route.query.e === 'logout') {
      this.signOut()
      this.$router.push('/')
    }
  },
  methods: {
    signInWithTwitter() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithPopup(provider)
        .then((result) => {
          this.$store.commit('alert/activate', 'ログイン完了！')
          this.$store.commit('user/set', result.user.uid)
        })
        .catch((error) => {
          this.$store.commit('alert/activate', error)
        })
    },
    commitsSample(log) {
      return utils.range(49).map(i => {
        let rnd = utils.randint(0, log.b)
        if (rnd < log.a) {
          return {}
        }
        return {
          date: moment().add(-i, 'days').format('YYYY-MM-DD HH:mm:ss'),
          count: rnd
        }
      })
    },
    logSample() {
      return utils.choice([
        {
          title: 'やったログ',
          color: '#689F38',
          unit: 'コミット',
          a: 2,
          b: 5,
        },
        {
          title: '読書履歴',
          color: '#9f2a1f',
          unit: 'コミット',
          a: 20,
          b: 50,
        },
        {
          title: 'ゲーム時間',
          color: '#3c5a9f',
          unit: '時間',
          a: 3,
          b: 12,
        },
      ])
    },
  }
}
</script>
