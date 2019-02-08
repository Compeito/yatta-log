export const state = () => ({
  isActive: false
})

export const mutations = {
  set(state, value) {
    state.isActive = value
  }
}
