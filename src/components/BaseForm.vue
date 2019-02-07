<template>
  <v-form v-model="isValid">
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
          :counter="field.counter"
          :required="field.isRequired"
        ></component>
        <slot></slot>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    'fields': Array
  },
  data() {
    return {
      isValid: false,
    }
  },
  methods: {
    getFieldsAsObject() {
      const obj = {}
      this.fields.forEach(field => {
        obj[field.key] = field.model
      })
      return obj
    }
  }
}
</script>
