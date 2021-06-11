import {getters} from '../plugins/common/base'

const state = () => ({
  all: []
});

export default {
  state,
  mutations: {
    SET_GARAGES(state, garages) {
      state.all = garages
    }
  },
  actions: {
    async ENSURE({commit}) {
      const {data} = await this.$axios.$get(`${process.env.API_URL}/garages`)
      commit('SET_GARAGES', data)
    }
  },
  getters: {
    ...getters
  }
}
