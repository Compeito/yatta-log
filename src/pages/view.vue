<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <template v-if="log">
      <LogCard :id="`log-${log.id}`" ref="logCard" :log="log"/>
      <v-card class="log-card">
        <v-btn small color="info" class="right" @click="tweet">
          <v-icon small>fab fa-twitter</v-icon>
          ツイート
        </v-btn>
      </v-card>
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
                <h4 class="headline mb-0">まとめて入力</h4>
                <p>数字を入力してください</p>
              </div>
            </v-card-title>
            <v-layout row style="padding: 20px;">
              <BaseForm ref="form" :fields="fields"/>
              <v-btn style="margin: auto" @click="doneCommit(fields[0].model)">送信</v-btn>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-btn flat small :to="`/edit?l=${log.id}`" class="right">
          <v-icon small>edit</v-icon>
          編集
        </v-btn>
      </v-card>
      <v-card class="log-card">
        <CommitList
          style="margin-top: 20px;"
          :commits="commits"
          :log="log"
          :update="updateTable"
        />
      </v-card>
    </template>
    <v-progress-circular
      indeterminate
      color="info"
      v-else
    ></v-progress-circular>
    <v-dialog v-model="isUploading" width="500">
      <v-card style="width: 100%;">
        <v-progress-circular
          indeterminate
          color="info"
        ></v-progress-circular>
      </v-card>
    </v-dialog>
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
import html2canvas from 'html2canvas'

const db = firebase.firestore()
const storage = firebase.storage()

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
      dialogIsActive: false,
      isUploading: false
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
          // LogCardは初期状態しか持たないので更新と同時に流し込む
          this.$refs.logCard.update(querySnapshot.docs)
        })
    },
    _uploadCanvas(canvas, filepath) {
      canvas.toBlob(blob => {
        const fileRef = storage.ref().child(filepath)
        fileRef.put(blob)
      })
      db.collection('logs').doc(this.log.id).update({ filepath: filepath })
    },
    _updateOGPImage(canvas) {
      const filepath = `ogp/${this.log.id}/${moment().format('YYYYMMDDHHmmss')}.jpg`
      db.collection('logs').doc(this.log.id).get()
        .then((doc) => {
          const oldFilepath = doc.data().filepath
          if (oldFilepath) {
            storage.ref().child(oldFilepath).delete()
              .then(() => {
                this._uploadCanvas(canvas, filepath)
              })
          } else {
            this._uploadCanvas(canvas, filepath)
          }
        })
    },
    _createTweetIntentURL() {
      return encodeURI(
        'https://twitter.com/intent/tweet'
        + `?text=${this.log.data().title}`
        + `&hashtags=${'やったログ'}`
        + `&url=${location.origin}/share/${this.log.id}`
      )
    },
    tweet() {
      this.isUploading = true
      html2canvas(document.querySelector(`#log-${this.log.id}`))
        .then(canvas => {
          this._updateOGPImage(canvas)
        })
        .catch(error => {
          this.$store.commit('alert/activate', error)
        })
        .finally(() => {
          this.isUploading = false
          open(this._createTweetIntentURL(), '_blank')
        })
    }
  }
}
</script>
