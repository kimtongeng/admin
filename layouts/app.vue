<template>
  <div id="app-container" :class="getMenuType">
    <topnav/>
    <sidebar/>
    <main>
      <div class="container-fluid">
        <Nuxt/>
      </div>
    </main>
    <b-overlay
      :show="inProgress"
      rounded="sm"
      variant="dark"
      z-index="50000"
      opacity="0.2"
      no-wrap
    >
      <template v-slot:overlay>
        <div class="text-center text-primary px-5" v-show="overlay">
          <div class="spin-icon">
            <i class="iconsminds-sand-watch-2" style="font-size: 35px"></i>
          </div>
          <div style="font-size: 16px" class="text-primary mt-2">
            <div v-if="$i18n.locale == 'en'">Please wait...</div>
            <div v-else>សូមរង់ចាំបន្តិច...</div>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>
<script>
import Topnav from '~/components/containers/navs/Topnav'
import Sidebar from '~/components/containers/navs/Sidebar'
import {mapGetters} from 'vuex'
import Cookies from 'js-cookie'

export default {
  middleware: 'notAuth',
  head() {
    return {}
  },
  components: {
    Topnav,
    Sidebar,
  },
  computed: {
    ...mapGetters({
      roleModules: 'auth/roleModules',
      user: 'auth/user',
      view: 'permission/getViewPermission',
      IDG: 'permission/IDG',
      SUPER_ADMIN: 'permission/SUPER_ADMIN',
      getMenuType: 'menuType/getMenuType',
      inProgress: 'loading/getInProgress',
      overlay: 'loading/getOverlay',
    }),
  },
  watch: {
    $route: {
        handler(val) {
            if (val.path != '/chat') {
                Cookies.remove('super-app-current-chat-contact')
            }
        },
    },
  },
  mounted() {
    document.body.classList.add('rounded')
    setTimeout(() => {
      document.body.classList.add('default-transition')
    }, 100)
  },
}
</script>
<style>
.bgColor {
  background-color: rgb(24, 79, 144, 0.8);
}

.b-overlay {
  inset: -145px 0px 0px 0px !important;
}

.position-absolute {
  position: fixed !important;
}

.popover {
  max-width: 100% !important;
  max-height: 100% !important;
}

.popover .rounded {
  border-radius: 0.75rem !important;
}
</style>
<style scoped>
.spin-icon {
  animation-name: spin;
  animation-duration: 2000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
