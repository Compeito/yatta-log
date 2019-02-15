<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card class="log-card">
      <v-card-title>
        <h1 v-if="isNew">ログの新規作成</h1>
        <h1 v-else-if="!log">読み込み中…</h1>
        <h1 v-else>{{ log.data().title }}の編集</h1>
      </v-card-title>
      <BaseForm ref="form" :fields="fields">
        <v-swatches colors="material-dark" v-model="color"/>
        <v-btn color="info" @click="submit" style="margin-top: 20px">
          <div v-if="!isSubmitting">送信</div>
          <div v-else>
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular>
          </div>
        </v-btn>
        <v-dialog
          v-model="deleteDialogIsOpen"
          width="500"
          v-if="log"
        >
          <v-btn
            color="error"
            slot="activator"
            @click="deleteDialogIsOpen = true"
            style="margin-top: 20px"
            class="right"
          >
            削除
          </v-btn>
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              {{ log.data().title }}の削除
            </v-card-title>

            <v-card-text>
              この操作は取り消せません。削除しますか？
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                flat
                @click="deleteLog"
              >
                削除する
              </v-btn>
              <v-btn
                color="primary"
                flat
                @click="deleteDialogIsOpen = false"
              >
                キャンセル
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </BaseForm>
    </v-card>
  </v-layout>
</template>

<script>
import { VTextField, VSelect } from 'vuetify/lib'
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.min.css'

import firebase from '~/plugins/firebase'
import BaseForm from '~/components/BaseForm'

const db = firebase.firestore()
const storage = firebase.storage()

export default {
  components: { BaseForm, VSwatches },
  data() {
    return {
      log: null,
      color: '#1FBC9C',
      isNew: true,
      isSubmitting: false,
      deleteDialogIsOpen: false
    }
  },
  computed: {
    fields() {
      return [
        {
          component: VTextField,
          label: 'ログの名前',
          key: 'title',
          model: this.log ? this.log.data().title : '',
          counter: 10,
          rules: [
            v => v.length <= 10 || '10文字までです',
            v => v !== '' || '入力して下さい'
          ],
          isRequired: true
        },
        {
          component: VTextField,
          label: 'ログの単位',
          key: 'unit',
          model: this.log ? this.log.data().unit : '回',
          rules: [
            v => v.length <= 10 || '10文字までです'
          ],
          isRequired: true
        },
        /*{
          component: VSelect,
          label: '書き込み権限設定',
          key: 'permission',
          model: 0,
          items: [
            {
              text: '自分だけがログを書ける',
              value: 0
            },
            {
              text: '自分以外もログを書ける',
              value: 1
            }
          ],
          isRequired: true
        },*/
        {
          component: VTextField,
          label: 'コミットカラー',
          key: 'color',
          model: this.color,
          isRequired: true,
          rules: [
            v => new RegExp(/^#([\da-fA-F]{6}|[\da-fA-F]{3})$/).test(v) || '不正なカラーコードです'
          ],
          readonly: true
        },
      ]
    }
  },
  mounted() {
    const logID = this.$route.query.l
    if (logID) {
      db.collection('logs').doc(logID).get()
        .then(doc => {
          if (!doc.exists || doc.data().user_id !== this.$store.state.user.id) {
            this.$router.push('/edit')
          } else {
            this.isNew = false
            this.log = doc
            this.color = this.log.data().color
          }
        })
    }
  },
  methods: {
    submit() {
      if (!this.$store.state.user.id) {
        this.$store.commit('alert/activate', 'ログインが必要です')
        return
      }
      const form = this.$refs.form
      if (form.validate() && !this.isSubmitting) {
        this.isSubmitting = true
        const formData = form.getFieldsAsObject()

        if (this.isNew) {
          db.collection('logs').add(formData)
            .then((log) => {
              this.$store.commit('alert/activate', '送信完了！')
              this.$router.push(`/view?l=${log.id}`)
            })
            .catch(error => {
              this.$store.commit('alert/activate', error)
            })
        } else {
          db.collection('logs').doc(this.log.id).update(formData)
            .then((log) => {
              this.$store.commit('alert/activate', '送信完了！')
              this.$router.push(`/view?l=${log.id}`)
            })
            .catch(error => {
              this.$store.commit('alert/activate', error)
            })
        }
      }
    },
    deleteLog() {
      db.collection('logs').doc(this.log.id).get()
        .then(doc => {
          const currentOGPImagePath = doc.data().filepath
          // OGPがあれば削除
          if (currentOGPImagePath) {
            storage.ref().child(currentOGPImagePath).delete()
              .finally(() => {this._deleteWithAlert(doc)})
          } else {
            this._deleteWithAlert(doc)
          }
        })
        .finally(() => {this.deleteDialogIsOpen = false})
    },
    _deleteWithAlert(doc) {
      doc.ref.delete()
        .then(() => {
          this.$store.commit('alert/activate', '削除しました')
          this.$router.push('/')
        })
        .catch(error => {
          this.$store.commit('alert/activate', '削除出来ませんでした')
          console.error(error)
        })
    },
  },
}
</script>
