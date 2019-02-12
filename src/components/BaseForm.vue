<template>
  <v-form ref="innerForm" v-model="isValid">
    <v-container>
      <v-layout column>
        <component
          v-for="field in fields"
          v-model="field.model"
          item-text="text"
          item-value="value"
          :items="field.items"
          :key="field.key"
          :is="field.component"
          :rules="field.rules"
          :label="field.label"
          :suffix="field.suffix"
          :type="field.type"
          :counter="field.counter"
          :required="field.isRequired"
        ></component>
        <slot></slot>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import auth from '~/plugins/auth'

export default {
  props: {
    'fields': Array
  },
  data() {
    return {
      isValid: false,
    }
  },
  mounted() {
    auth().then((user) => {
      this.user = user
    })
  },
  methods: {
    validate() {
      return this.$refs.innerForm.validate()
    },
    getFieldsAsObject() {
      const obj = {}
      this.fields.forEach(field => {
        obj[field.key] = field.model
      })
      obj.user_id = this.user.uid
      return obj
    }
  }
}
</script>
