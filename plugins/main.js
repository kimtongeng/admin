// https://github.com/nuxt/nuxt.js/issues/3221
import Vue from 'vue'
import CryptoJS from 'crypto-js'
import moment from 'moment'
import {mapGetters} from 'vuex'

Vue.mixin({
  computed: {
    ...mapGetters({
      enums: 'enums/getAllEnum',
    }),
  },
  methods: {
    changeLang(locale) {
      this.$i18n.setLocale(locale)
      this.$validator.localize(locale)
      this.$store.dispatch('lang/setLocale', {
        locale: locale,
      })
    },
    /**
     * make link
     * @param {*} route
     */
    makeLink(route) {
      const currentLange = this.$store.getters['lang/locale']
      if (currentLange != this.$i18n.defaultLocale) {
        return `/${currentLange}${route}`
      }
      return route
    },
    /**
     * check is superuser or not
     */
    isSuper() {
      if (this.$store.state.auth.user == '') {
        return
      }
      if (this.$store.state.auth != '') {
        if (
          this.$store.state.auth.user.user_type_id ==
          this.$store.state.permission.IDG ||
          this.$store.state.auth.user.user_type_id ==
          this.$store.state.permission.SUPER_ADMIN
        ) {
          return true
        }
      }
      return false
    },
    /**
     *  check authorize access
     * @param {} moduleId
     * @param {*} action
     */
    checkAuthorize(action) {
      if (this.$helpers.nullToVoid(this.$store.state.auth.user) == '') {
        return false
      }
      const moduleKey = this.$store.state.module.current_module
      if (this.isSuper()) {
        return true
      } else {
        const module = this.$store.state.auth.roleModules.find(
          (obj) => obj.module_key == moduleKey
        )

        if (!this.$helpers.isEmpty(module)) {
          const hasPermission = module.permissions.find(
            (ele) => ele.permission_name == action
          )
          if (!this.$helpers.isEmpty(hasPermission)) {
            return true
          }
        }
      }
      return false
    },
    checkModuleAuthorize(moduleKeyName, action) {
      if (this.$helpers.nullToVoid(this.$store.state.auth.user) == '') {
        return false
      }
      const moduleKey = moduleKeyName
      if (this.isSuper()) {
        return true
      } else {
        const module = this.$store.state.auth.roleModules.find(
          (obj) => obj.module_key == moduleKey
        )
        if (!this.$helpers.isEmpty(module)) {
          const hasPermission = module.permissions.find(
            (ele) => ele.permission_name == action
          )
          if (!this.$helpers.isEmpty(hasPermission)) {
            return true
          }
        }
      }
      return false
    },
    getFullLocalName(local, latin) {
      let name = {
        local_name: local,
        latin_name: latin,
      }
      return JSON.stringify(name)
    },
    getNameByLang(name) {
      if (name != '' && name != null) {
        try {
          name = JSON.parse(name)
          if (this.$store.state.lang.locale == 'kh') {
            return name.local_name
          } else {
            return name.latin_name
          }
        } catch (e) {
          return name
        }
      } else {
        return null
      }
    },
    encrypt(text) {
      const iv = 'G9cRYFH2gVJv8ono'
      const key = 'Xna4VoFQ7Ayk8szAJwc0qNmwFlw3gAJ='

      const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
      })

      return cipher.toString()
    },
    decrypt(text) {
      const iv = 'G9cRYFH2gVJv8ono'
      const key = 'Xna4VoFQ7Ayk8szAJwc0qNmwFlw3gAJ='

      const cipher = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
      })

      return CryptoJS.enc.Utf8.stringify(cipher).toString()
    },
    getRandomColor() {
      function c() {
        let hex = Math.floor(Math.random() * 256).toString(16)
        return ('0' + String(hex)).substr(-2) // pad with zero
      }

      return '#' + c() + c() + c()
    },
    getUserTypeByLevel() {
      let current_user_id = this.$store.state.auth.authLevel
      return this.userTypes.filter(function (item) {
        return item.level < current_user_id
      })
    },
    roundNumber(num) {
      if (this.$helpers.nullToVoid(num) != '') {
        return +(Math.round(num + 'e+3') + 'e-3')
      } else {
        return 0
      }
    },
    numberFormat(value) {
      return parseFloat(value)
        .toFixed(3)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    },
    generateUUID() {
      var d = new Date().getTime()
      var d2 = (performance && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = Math.random() * 16
          if (d > 0) {
            var r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
          } else {
            var r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
          }
          return (c == 'x' ? r : (r & 0x7) | 0x8).toString(16)
        }
      )
      return uuid
    },
    getCommissionProduct(totalPrice, commission, type) {
      const enums = this.$store.getters['enums/getAllEnum']
      let totalCommission = 0

      if (commission > 0) {
        if (type == enums.commission_type.PERCENTAGE) {
          totalCommission = (commission * totalPrice) / 100
        } else if (type == enums.commission_type.AMOUNT) {
          totalCommission = totalPrice - commission
        }
      }

      return totalCommission.toFixed(2)
    },
    getTimeAgoFromNow(time) {
      if (this.$i18n.locale == 'en') {
        return moment(time).locale('en').fromNow()
      } else if (this.$i18n.locale == 'kh') {
        return moment(time).locale('km').fromNow()
      }
    },
    setNotificationRead(id, notiList = []) {
      let input = {
        id: id,
        loading: false,
      }

      this.$axios
        .$post('notifications/set_readed', input)
        .then((res) => {
          this.updateNotificationRead(id, notiList)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    updateNotificationRead(notiID, notiList) {
      const notificationStatus =
        this.$store.getters['enums/getAllEnum'].notification_status
      let totalNotiNotRead =
        this.$store.getters['notification_badge/getTotalNotRead']

      //Update List At TopNav Bar
      let list = []
      let notiCustomList = JSON.parse(JSON.stringify(notiList)) //Prevent Bind

      if (!this.$helpers.isEmpty(notiCustomList)) {
        //Set Read
        notiCustomList.map((obj) => {
          if (obj.id == notiID) {
            obj.status = notificationStatus.READ
            return obj
          }
        })

        //Assign New List
        list = notiCustomList.splice(0, 5)
        this.$store.dispatch('notification_badge/updateList', list)
      }

      //Update Count At TopNav Bar
      if (totalNotiNotRead != 0) {
        let count = totalNotiNotRead - 1
        this.$store.dispatch('notification_badge/updateTotalCount', count)
      }
    },
    getNotificationBackgroundColor(status) {
      return status
        ? 'bg-white text-secondary'
        : 'unread-noti-background text-dark'
    },
    async viewDetailNotificationAdmin(item) {
      let adminNotiType = this.enums.admin_notification_type;

      //Go to detail by type
      if (item.admin_noti_type == adminNotiType.OWNER_PAY_TRANSACTION_FEE) {
        await this.$router.push({path: this.makeLink(`/transaction_fee/payment_history/view_detail?owner=${item.contact_id}&business_type=${item.business_type}`)})
      }

      //Close notification top nav bar
      document.body.click();
    },
    getNotificationImage(image) {
      if (this.$helpers.nullToVoid(image) != '') {
        return process.env.BASE_URL + 'images/' + image
      } else {
        return '/no-image.jpeg'
      }
    },
    getTimeChatFormat(date) {
      if (this.$helpers.nullToVoid(date) != '') {
        let locale = ''
        this.$i18n.locale == 'kh'
          ? (locale = 'km')
          : (locale = this.$i18n.locale)

        let defaultFormat = 'MMMM DD, YYYY [at] h:mm:ss A [UTC+7]'
        let format = 'hh:mm A'

        let today = moment().locale(locale).format('DD/MM/YYYY')
        let dateDefault = moment(date.toDate(), defaultFormat)
          .locale(locale)
          .format('DD/MM/YYYY')

        let timeFormat = moment(date.toDate(), defaultFormat)
          .locale(locale)
          .format(format)

        if (dateDefault == today) {
          return timeFormat
        }

        return dateDefault
      } else {
        return ''
      }
    },
    getContactNameOrPhone(account) {
      let name = account.fullname
      let phone = account.phone

      if (this.$helpers.nullToVoid(name) != '') {
        return name
      }

      if (this.$helpers.nullToVoid(phone) != '') {
        return phone
      }

      return '';
    },
    getBannerPositionPageName(platformType, page) {
      let text = ''

      let data = null
      if (platformType == this.enums.position_platform_type.MOBILE) {
        data = this.enums.banner_page_list.MOBILE.find((obj) => obj.id == page)
      }

      if (this.$helpers.nullToVoid(data) != '') {
        text = this.$t(data.name)
      }
      return text
    },
    getVideoPositionPageName(platformType, page) {
      let text = ''

      let data = null
      if (platformType == this.enums.position_platform_type.MOBILE) {
        data = this.enums.video_page_list.MOBILE.find((obj) => obj.id == page)
      }

      if (this.$helpers.nullToVoid(data) != '') {
        text = this.$t(data.name)
      }
      return text
    },
    getYouTubeVideoId(url) {
      let regex =
        /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm
      return regex.exec(url)[3]
    },
  },
})
