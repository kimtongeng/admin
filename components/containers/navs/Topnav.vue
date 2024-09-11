<template>
  <nav class="navbar fixed-top">
    <!-- user modal -->
    <div v-if="modalUserShow">
      <modal-user
        :form-item="userItem"
        :modal-type="modalUserType"
        @closeModal="closeModalUser"
      />
    </div>
    <!-- user modal -->

    <div class="d-flex align-items-center navbar-left">
      <a
        class="menu-button d-none d-md-block"
        href="#"
        @click.prevent.stop="changeSideMenuStatus({step: menuClickCount + 1, classNames: menuType, selectedMenuHasSubItems,})"
      >
        <i
          class="iconsminds-decrase-inedit"
          style="font-size: 25px;"
        ></i>
      </a>
      <a
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        href="#"
        @click.prevent.stop="changeSideMenuForMobile(menuType)"
      >
        <i
          class="iconsminds-decrase-inedit"
          style="font-size: 25px;"
        ></i>
      </a>
      <div class="d-inline-block">
        <b-dropdown class="ml-2" size="sm" variant="outline-primary">
          <template slot="button-content">
                        <span class="name">{{
                            $i18n.locale.toUpperCase()
                          }}</span>
          </template>
          <b-dropdown-item
            v-for="locale in $i18n.locales"
            :key="locale.code"
            @click="changeLang(locale.code)"
          >{{ locale.name }}
          </b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>
    <div class="navbar-logo">
      <span class="logo d-none d-xs-block"></span>
      <span
        class="logo-mobile d-lg-block d-md-block d-sm-none d-xs-none"
      ></span>
    </div>
    <div class="navbar-right">
      <div class="header-icons d-inline-block align-middle">
        <!-- Chat -->
        <div
          v-if="checkModuleAuthorize('chat', 'view')"
          class="position-relative d-inline-block"
        >
          <div class="btn-group">
            <nuxt-link
              :to="makeLink('/chat')"
              class="header-icon btn chatButton"
              no-prefetch
              style="margin-right: -12px"
              variant="empty"
            >
              <!-- iconsminds-mail-send-->
              <i class="simple-icon-speech" style="font-size: 20px;"></i>
              <span class="count">{{ unSeenChat }}</span>
            </nuxt-link>
          </div>
        </div>

        <!-- Notification -->
        <div
          v-if="checkModuleAuthorize('admin_notification_list', 'view')"
          class="position-relative d-inline-block"
        >
          <b-dropdown
            menu-class="position-absolute mt-3 notificationDropdown"
            no-caret
            right
            size="sm"
            toggle-class="header-icon notificationButton"
            variant="empty"
          >
            <template v-slot:button-content>
              <i class="simple-icon-bell" style="font-size: 20px;"></i>
              <span class="count">{{ totalNotiNotRead }}</span>
            </template>

            <b-dropdown-item-button
            >{{ $t('notification') }}
              <span v-if="totalNotiNotRead != 0"
              >({{ totalNotiNotRead }})</span
              ></b-dropdown-item-button
            >
            <b-dropdown-divider
              style="margin-bottom: -8px"
            ></b-dropdown-divider>

            <b-dropdown-item
              v-if="notificationList.length == 0"
              class="text-center"
              disabled
              style="margin-top: 127px; margin-bottom: 133px"
            >{{ $t('no_notification') }}
            </b-dropdown-item
            >

            <vue-perfect-scrollbar
              v-else
              :settings="{suppressScrollX: true,wheelPropagation: false,}"
            >
              <div
                v-for="(noti, index) in notificationList"
                :key="index"
                :class="getNotificationBackgroundColor(noti.status)"
                class="d-flex flex-row border-bottom notificationItem"
                @click="viewNotificationDetail(noti)"
              >
                <div>
                  <b-img
                    class="image-notify-top-bar"
                    :src="getNotificationImage(noti.image)"
                    alt="thumbnail"
                    :style="$helpers.nullToVoid(noti.image) == '' ? 'opacity: 0.3' : ''"
                  />
                </div>

                <div class="pl-3 pr-2">
                  <p class="font-weight-medium mb-1">
                    {{ noti.title | truncate(40) }}
                  </p>
                  <p class="text-muted mb-2 text-small">
                    {{ noti.description | truncate(40) }}
                  </p>
                  <p class="text-muted mb-0 text-small">
                    {{ getTimeAgoFromNow(noti.created_at) }}
                  </p>
                </div>
              </div>
            </vue-perfect-scrollbar>

            <b-dropdown-divider
              style="margin-top: -8px"
            ></b-dropdown-divider>

            <b-dropdown-item-button
              :disabled="notificationList.length > 0 ? false : true"
              class="text-center"
              variant="link"
              @click="seeAll"
            >
                <span class="see-all-text">{{
                    $t('see_more')
                  }}</span>
            </b-dropdown-item-button>
          </b-dropdown>
        </div>

        <div class="position-relative d-none d-sm-inline-block ml-2">
          <div class="btn-group">
            <b-button
              class="header-icon btn-sm"
              variant="empty"
              @click="toggleFullScreen"
            >
              <i
                :class="
                                    !fullScreen
                                        ? 'simple-icon-size-fullscreen'
                                        : 'simple-icon-size-actual'
                                "
                class="d-inline-block"
              ></i>
            </b-button>
          </div>
        </div>
      </div>

      <div class="user d-inline-block ml-2">
        <b-dropdown
          class="dropdown-menu-right"
          menu-class="mt-3"
          no-caret
          right
          toggle-class="p-0"
          variant="empty"
        >
          <template slot="button-content">
            <span class="name mr-1">{{ auth.full_name }}</span>
            <span>
                            <b-img
                              :src="getImage(auth.image)"
                              alt="Circle image"
                              rounded="circle"
                            ></b-img>
                        </span>
          </template>
          <b-dropdown-item @click="openModalUser(auth)">
            {{ $t('profile') }}
          </b-dropdown-item>

          <b-dropdown-item v-if="isSuper()" @click="serverLog">
            Server Log
          </b-dropdown-item>

          <b-dropdown-item @click="logout">
            {{ $t('logout') }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import Cookies from 'js-cookie'

export default {
  components: {
    modalUser: () =>
      import('~/pages/setting/user/list/components/QuickUpdateModal'),
  },
  data() {
    return {
      notifications: [],
      mainProps: {
        blank: true,
        blankColor: '#777',
        width: 75,
        height: 40,
        class: 'm1',
      },
      branch: {},
      fullScreen: false,
      apiUrl: process.env.API_URL,
      modalUserShow: false,
      modalUserType: 0,
      userItem: {},
      device_id: null,
      modalDetailShow: false,
      detailItem: {},
    }
  },
  computed: {
    ...mapGetters({
      auth: 'auth/user',
      menuType: 'menuType/getMenuType',
      menuClickCount: 'menuType/getMenuClickCount',
      selectedMenuHasSubItems: 'menuType/getSelectedMenuHasSubItems',
      notificationList: 'notification_badge/getList',
      totalNotiNotRead: 'notification_badge/getTotalNotRead',
      unSeenChat: 'chat_badge/getUnSeenChat',
    }),
  },
  mounted() {
    this.startOnMessageListener()
    this.onTokenRefresh()
    this.getChatNotReadCount()
    this.$store.dispatch('notification_badge/fetchData')
  },
  methods: {
    ...mapMutations({
      changeSideMenuStatus: 'menuType/changeSideMenuStatus',
      changeSideMenuForMobile: 'menuType/changeSideMenuForMobile',
    }),
    ...mapActions(['setLang', 'signOut']),
    searchClick() {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true
        } else {
          this.search()
          this.isMobileSearch = false
        }
      } else {
        this.search()
      }
    },
    handleDocumentForMobileSearch() {
      if (!this.isSearchOver) {
        this.isMobileSearch = false
        this.searchKeyword = ''
      }
    },
    async logout() {
      // Log out the user.
      this.device_id = Cookies.get('super-app-admin-browser-id')

      await this.$store.dispatch('auth/logout', this.device_id)

      // Redirect to login
      this.$router.push({path: this.localePath('login')})
    },
    toggleFullScreen() {
      const isInFullScreen = this.isInFullScreen()

      var docElm = document.documentElement
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      }
      this.fullScreen = !isInFullScreen
    },
    isInFullScreen() {
      return (
        (document.fullscreenElement &&
          document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement &&
          document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement &&
          document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement &&
          document.msFullscreenElement !== null)
      )
    },
    getImage(image) {
      if (this.$helpers.nullToVoid(image) != '') {
        return this.apiUrl + 'images/users/' + image
      } else {
        return '/no-profile.png'
      }
    },
    openModalUser(item) {
      this.modalUserShow = true
      this.userItem = Object.assign({}, item)
      this.modalUserType = 2 // set modal type 2 = update
    },
    closeModalUser(value) {
      this.modalUserType = 0
      this.userItem = {}
    },
    startOnMessageListener() {
      this.$fire.messaging.onMessage((payload) => {
        this.$notify(
          'info',
          payload.notification.title,
          payload.notification.body,
          {
            duration: 4000,
          },
          payload.notification.click_action
        )
        if (payload.data.type != this.enums.notification_send_type.CHAT) {
          this.$store.dispatch('notification_badge/fetchData')
        }
      })
    },
    onTokenRefresh() {
      this.$fire.messaging.onTokenRefresh(async () => {
        try {
          const refreshedToken = await this.$fire.messaging.getToken()
          this.setUpdateToken(refreshedToken)
          this.$store.dispatch(
            'auth/setUserAuthToken',
            refreshedToken
          )
        } catch (e) {
          this.$notify(
            'warning',
            this.$t('Notification'),
            'Unable to retrieve refreshed token'
          )
        }
      })
    },
    async setUpdateToken(token) {
      this.device_id = Cookies.get('super-app-admin-browser-id')

      const input = {
        token: token,
        device_id: this.device_id,
        loading: false,
      }
      await this.$axios.$post('user/update_fcm_token', input)
    },
    serverLog() {
      window.open(`${this.apiUrl}logs`, '_blank')
    },

    // Notification Badge Block
    seeAll() {
      this.$router.push({
        path: this.makeLink('/notifications/list'),
      })
    },
    viewNotificationDetail(noti) {
      let vm = this

      //Link to detail by type
      this.viewDetailNotificationAdmin(noti);

      //Set Notification Read Or Not
      if (noti.status == this.enums.notification_status.NOT_READ) {
        vm.setNotificationRead(noti.id, vm.notificationList)
      }
    },
    closeViewNotificationDetail(type) {
      this.modalDetailShow = false
      this.detailItem = {}
    },
    getChatNotReadCount() {
      this.$fire.firestore
        .collection('customers')
        .where('is_read', '==', false)
        .where('last_message_type', '==', this.enums.chat_type.CUSTOMER)
        .onSnapshot((snapshot) => {
          this.$store.dispatch(
            'chat_badge/setUnSeenChat',
            snapshot.size
          )
        })
    },
  },
}
</script>
<style scoped>
.ps-container {
  margin-right: 0 !important;
  padding-right: 0 !important;
}

.notificationItem {
  padding: 10px 10px 22px 10px !important;
}

.notificationItem:hover {
  cursor: pointer;
  background-color: #f9fbfd !important;
}

.swal2-icon svg {
  margin-bottom: 8px;
  margin-left: 14px;
}

.swal2-info,
.swal2-success,
.swal2-warning,
.swal2-error {
  height: 40px;
  width: 40px;
  margin: 0 !important;
  top: 10px;
  left: 5px;
}

.swal2-icon::before {
  height: unset;
  font-size: 2em;
}

.noti-text {
  font-size: 12px;
}


.image-notify-top-bar {
  width: 75px;
  height: 75px;
  margin-top: 2px;
  border-radius: 10px;
}
</style>
