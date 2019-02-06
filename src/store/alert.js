export const state = () => ({
  isActive: false,
  text: 'test'
})

export const mutations = {
  activate(state, value) {
    state.isActive = true
    state.text = value
  },
  deactivate(state) {
    state.isActive = false
  }
}
