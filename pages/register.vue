<template>
  <div class="min-h-screen bg-white flex">
    <div class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img class="h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow">
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>

        <div class="mt-8">
          <div class="mt-6">
            <form method="POST" class="space-y-6" @submit.prevent="buildPayload">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div class="mt-1">
                  <input v-model="name" id="name" name="name" type="text" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div class="mt-1">
                  <input v-model="email" id="email" name="email" type="email" autocomplete="email" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input v-model="password" id="password" name="password" type="password"
                         autocomplete="current-password" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="space-y-1">
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                  Password confirmation
                </label>
                <div class="mt-1">
                  <input v-model="password_confirmation" id="password_confirmation" name="password_confirmation" type="password"
                         autocomplete="current-password" required
                         class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm">
                  <nuxt-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                    Already have an account ?
                  </nuxt-link>
                </div>
              </div>

              <div>
                <button type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative w-0 flex-1">
      <img class="absolute inset-0 h-full w-full object-cover"
           src="/login_bg.jpg"
           alt="">
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
  middleware: 'guest',
  data() {
    return {
      'name': '',
      'email': '',
      'password': '',
      'password_confirmation': '',
    }
  },
  methods: {
    ...mapActions({
      'login': 'authentication/LOGIN',
      'register': 'authentication/REGISTER',
    }),

    async buildPayload() {

      await this.register({
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      })

      // todo : implement validation

      await this.login({
        'email': this.email,
        'password': this.password,
      })
    }
  }
}
</script>
