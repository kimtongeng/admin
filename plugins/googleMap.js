import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

const googleOptions = {
    load: {
        key: process.env.GOOGLE_MAP_KEY,
        libraries: 'places',
    },
}
Vue.use(VueGoogleMaps, googleOptions)
