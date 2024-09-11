const pkg = require('./package')
require('dotenv').config()
export default {
  ssr: false,
  target: 'static',
  server: {
    port: 7575, // default: 3000
    host: '127.0.0.1', // default: localhost
  },
  env: {
    API_URL: process.env.BASE_URL,
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
    ADMIN_URL: process.env.ADMIN_URL,
  },
  head: {
    title: 'SuperApp - Admin',
    meta: [
      {charset: 'utf-8'},
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {hid: 'description', name: 'description', content: ''},
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,700|Kantumruy'
      }
    ],

  },
  manifest: {
    name: 'SuperApp',
    lang: 'kh',
    short_name: 'SuperApp',
    display: 'standalone',
  },
  css: [
    '~/assets/fonts/simple-line-icons/css/simple-line-icons.css',
    '~/assets/fonts/iconsmind/style.css',
    '~/assets/fonts/iconsmind-s/css/iconsminds.css',
    '~/assets/piaf/themes/piaf.light.blueolympic.scss'
  ],
  plugins: [
    '~/plugins/main.js',
    '~/plugins/utils/index.js',
    '~/plugins/axios.js',
    '~/plugins/i18n.js',
    '~/plugins/vee-validation.js',
    '~/plugins/components.js',
    '~/plugins/googleMap.js',
  ],
  loading: {color: '#08A1E7'},
  loadingIndicator: {
    name: 'folding-cube',
    color: '#08A1E7',
    background: 'white',
  },
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    [
      '@nuxtjs/i18n',
      {
        locales: [
          {
            code: 'en',
            name: 'English',
            file: 'en.js',
            iso: 'en-US',
          },
          {
            code: 'kh',
            name: 'ខ្មែរ',
            file: 'kh.js',
            iso: 'kh',
          },
        ],
        lazy: true,
        defaultLocale: 'kh',
        langDir: 'lang/',
        vueI18nLoader: true,
      },
    ],
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID,
        },
        services: {
          messaging: {
            createServiceWorker: true,
            actions: [
              {
                action:
                  process.env.ADMIN_URL +
                  'notifications/list',
              },
            ],
            fcmPublicVapidKey: process.env.FCM_PUBLIC_VAPID_KEY, // OPTIONAL : Sets vapid key for FCM after initialization
          },
          auth: {},
          firestore: {}
        },
      },
    ],
  ],
  /**
   *
   */
  router: {
    middleware: ['auth', 'init-store'],
    linkActiveClass: 'active',
    // extendRoutes(routes, resolve) {
    //   let listRoutes = [
    //     {
    //       name: 'custom',
    //       path: '*',
    //       component: resolve(__dirname, 'pages/errors/404.vue'),
    //     },
    //   ]
    //   listRoutes.map((item) => {
    //     routes.push(item)
    //   })
    // },
  },

  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false, // Or `bvCSS: false`
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.API_URL,
  },

  // Content module configuration (https://go.nuxtjs.dev/content-config)
  content: {},
  generate: {
    routes: ['/product_management/product/add'],
    cache: {
      ignore: ['renovate.json'], // ignore changes applied on this file
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    babel: {compact: true},
  },
}
