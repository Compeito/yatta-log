<template>
  <v-snackbar
    v-model="isActive"
    bottom right
    multi-line
    :timeout="2000"
  >
    {{ text }}
    <v-btn
      color="pink"
      flat
      @click="deactivate"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    isActive: {
      get() {
        return this.$store.state.alert.isActive
      },
      set(v) {
        this.deactivate()
      }
    },
    text() {
      return this.$store.state.alert.text
    }
  },
  methods: {
    deactivate() {
      this.$store.commit('alert/deactivate')
    }
  }
}
</script>
