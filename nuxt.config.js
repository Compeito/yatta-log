const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'spa',
  srcDir: 'src/',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.title,
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'og:title', property: 'og:title', content: pkg.title },
      { hid: 'og:image', property: 'og:image', content: 'https://yatta-log.firebaseapp.com/icon.png' },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:title', name: 'twitter:title', content: pkg.title },
      { hid: 'twitter:image', name: 'twitter:image', content: 'https://yatta-log.firebaseapp.com/icon.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '~/assets/style/style.styl',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/icon'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa'
  ],

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    vendor: [
      'vuex',
    ],

    /*
     ** PWA settings
     */
    // workbox: {
    //   dev: true
    // },
    manifest: {
      name: pkg.name,
      short_name: pkg.title,
      title: pkg.title,
      'og:title': pkg.title,
      description: pkg.description,
      'og:description': pkg.description,
      lang: 'ja',
      theme_color: '#eeeeee',
      background_color: '#eeeeee'
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  }
}
