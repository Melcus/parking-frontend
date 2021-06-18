export default {
  actions: {
    async LOGIN({commit}, payload) {
      await this.$auth.loginWith('auth_jwt', {
        data: {
          email: payload.email,
          password: payload.password
        }
      })
    },
    async REGISTER({commit}, payload) {
      await this.$axios.post(`${process.env.API_URL}/auth/register`, payload)
    }
  }
}
