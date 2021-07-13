require('dotenv').config()

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Parking system',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@assets/css/overrides.css',
    '@assets/css/components.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    ['nuxt-gmaps', {
      key: process.env.GOOGLE_MAPS_API_KEY
    }],
    '@nuxtjs/auth-next'
  ],

  auth: {
    strategies: {
      'auth_jwt': {
        provider: 'laravel/jwt',
        url: process.env.API_URL,
        endpoints: {
          login: {
            url: '/auth/token',
            method: 'POST'
          },
          user: {
            url: '/me',
            method: 'GET'
          }
        },
        token: {
          property: 'access_token'
        }
      },
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
}
