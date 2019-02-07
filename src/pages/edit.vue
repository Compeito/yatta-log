<template>
  <v-card>
    <BaseForm ref="form" :fields="fields">
      <v-btn @click="submit">test</v-btn>
    </BaseForm>
  </v-card>
</template>

<script>
import { VTextField, VSelect } from 'vuetify/lib'

import firebase from '~/plugins/firebase'
import BaseForm from '~/components/BaseForm'

export default {
  components: { BaseForm },
  data() {
    return {
      fields: [
        {
          component: VTextField,
          label: 'ログの名前',
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
          model: '回',
          rules: [
            v => v.length <= 10 || '10文字までです'
          ],
        },
        {
          component: VSelect,
          label: '書き込み権限設定',
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
      if (form.isValid) {

      }
    }
  }
}
</script>
