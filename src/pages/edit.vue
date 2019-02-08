<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card>
      <BaseForm ref="form" :fields="fields">
        <v-btn color="info" @click="submit">
          <div v-if="!isSubmitting">送信</div>
          <div v-else>
            <v-progress-circular
              indeterminate
              color="white"
            ></v-progress-circular>
          </div>
        </v-btn>
      </BaseForm>
    </v-card>
  </v-layout>
</template>

<script>
import { VTextField, VSelect } from 'vuetify/lib'

import firebase from '~/plugins/firebase'
import BaseForm from '~/components/BaseForm'

const db = firebase.firestore()

export default {
  components: { BaseForm },
  data() {
    return {
      isSubmitting: false,
      fields: [
        {
          component: VTextField,
          label: 'ログの名前',
          key: 'title',
          model: '',
          counter: 10,
          rules: [
            v => v.length <= 10 || '10文字までです'
          ],
          isRequired: true
        },
        {
          component: VTextField,
          label: 'ログの単位',
          key: 'unit',
          model: '回',
          rules: [
            v => v.length <= 10 || '10文字までです'
          ],
        },
        {
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
        },
      ]
    }
  },
  methods: {
    submit() {
      const form = this.$refs.form
      if (form.isValid && !this.isSubmitting) {
        this.isSubmitting = true
        const formData = form.getFieldsAsObject()

        db.collection('logs').add(formData)
          .then(() => {
            this.$store.commit('alert/activate', '送信完了！')
            this.isSubmitting = false
          })
          .catch(error => {
            this.$store.commit('alert/activate', error)
          })
      }
    }
  }
}
</script>
