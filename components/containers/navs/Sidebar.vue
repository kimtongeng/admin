<template>
  <div class="sidebar" @click.stop="() => {}">
    <div class="main-menu">
      <vue-perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <ul class="list-unstyled">
          <li
            v-for="(item, index) in menuItems"
            :class="{
              active:
                (selectedParentMenu === item.key && viewingParentMenu === '') ||
                viewingParentMenu === item.key,
            }"
            :key="`parent_${index}`"
            :data-flag="item.key"
          >
            <a
              v-if="item.newWindow"
              :href="makeLink(item.to)"
              rel="noopener noreferrer"
              target="_blank"
            >
              <p class="h4 mb-1">
                <i :class="item.icon"></i>
              </p>
              {{ $t(item.label) }}dd
            </a>
            <a
              v-else-if="item.subs && item.subs.length > 0"
              @click.prevent="openSubMenu($event, item)"
              :href="`#${item.to}`"
            >
              <p class="h4 mb-1">
                <i :class="item.icon"></i>
              </p>
              {{ $t(item.label) }}
            </a>
            <router-link
              v-else
              @click.native="changeSelectedParentHasNoSubmenu(item.key)"
              :to="makeLink(item.to)"
            >
              <p class="h4 mb-1">
                <i :class="item.icon"></i>
              </p>
              {{ $t(item.label) }}
            </router-link>
          </li>
        </ul>
      </vue-perfect-scrollbar>
    </div>

    <div class="sub-menu">
      <vue-perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <!--first level menu-->
        <ul
          v-for="(item, itemIndex) in menuItems"
          :class="{
            'list-unstyled': true,
            'd-block':
              (selectedParentMenu === item.key && viewingParentMenu === '') ||
              viewingParentMenu === item.key,
          }"
          :data-parent="item.key"
          :key="`sub_${item.key}`"
        >
          <!--second level menu-->
          <li
            v-for="(sub, subIndex) in item.subs"
            :key="`sub_${subIndex}`"
            :class="{
              'has-sub-item': sub.subs && sub.subs.length > 0,
              active:
                $route.path.indexOf(trimParamFromURL(makeLink(sub.to))) > -1,
            }"
          >
            <a
              v-if="sub.newWindow"
              :href="makeLink(sub.to)"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i :class="sub.icon"></i>
              <span>{{ $t(sub.label) }}</span>
            </a>
            <!--third level menu-->
            <template v-else-if="sub.subs && sub.subs.length > 0">
              <b-link
                v-b-toggle="`menu_${itemIndex}_${subIndex}`"
                variant="link"
                class="rotate-arrow-icon"
                @click="is_toggle = !is_toggle"
              >
                <i
                  v-if="is_toggle === false"
                  class="iconsminds-arrow-down-2"
                ></i>
                <i
                  v-if="is_toggle === true"
                  class="iconsminds-arrow-down-2"
                ></i>
                <span class="d-inline-block">{{ $t(sub.label) }}</span>
              </b-link>
              <!-- Have visible  -->
              <b-collapse :id="`menu_${itemIndex}_${subIndex}`">
                <ul class="list-unstyled third-level-menu">
                  <li
                    v-for="(thirdLevelSub, thirdIndex) in sub.subs"
                    :key="`third_${itemIndex}_${subIndex}_${thirdIndex}`"
                    :class="{
                      'third-level-menu': true,
                      active:
                        $route.path.indexOf(trimParamFromURL(makeLink(thirdLevelSub.to))) > -1,
                    }"
                  >
                    <a
                      v-if="thirdLevelSub.newWindow"
                      :href="makeLink(thirdLevelSub.to)"
                      rel="noopener noreferrer"
                      target="_blank"
                    ></a>
                    <router-link v-else :to="makeLink(thirdLevelSub.to)">
                      <i
                        :class="thirdLevelSub.icon"
                        class="mr-2"
                        style="vertical-align: middle"
                      ></i>
                      <span>{{ $t(thirdLevelSub.label) }}</span>
                    </router-link>
                  </li>
                </ul>
              </b-collapse>
            </template>

            <router-link v-else :to="makeLink(sub.to)">
              <i
                :class="sub.icon"
                class="mr-2"
                style="vertical-align: middle"
              ></i>
              <span>{{ $t(sub.label) }}</span>
            </router-link>
          </li>
        </ul>
      </vue-perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {menuHiddenBreakpoint, subHiddenBreakpoint} from '../constants/config'
import {sidebar} from '~/data/sidebar.js'
export default {
  data() {
    return {
      selectedParentMenu: '',
      viewingParentMenu: '',
      is_toggle: false,
      menuItems: [],
      items: sidebar
    }
  },
  computed: {
    ...mapGetters({
      roleModules: 'auth/roleModules',
      user: 'auth/user',
      view: 'permission/getViewPermission',
      IDG: 'permission/IDG',
      SUPER_ADMIN: 'permission/SUPER_ADMIN',
      menuType: 'menuType/getMenuType',
      menuClickCount: 'menuType/getMenuClickCount',
      selectedMenuHasSubItems: 'menuType/getSelectedMenuHasSubItems',
    }),
  },
  watch: {
    $route(to, from) {
      if (to.path !== from.path) {
        const toParentUrl = to.path.split('/').filter((x) => x !== '')[0]
        if (toParentUrl !== undefined || toParentUrl !== null) {
          this.selectedParentMenu = toParentUrl
        } else {
          this.selectedParentMenu = 'dashboards'
        }
        this.selectMenu()
        this.toggle()
        this.changeSideMenuStatus({
          step: 0,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems,
        })

        window.scrollTo(0, top)
      }
    },
  },
  created() {
    this.menuItems = this.getMenuItems()
  },
  mounted() {
    this.selectMenu()
    window.addEventListener('resize', this.handleWindowResize)
    document.addEventListener('click', this.handleDocumentClick)
    this.handleWindowResize()
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleDocumentClick)
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    ...mapMutations({
      changeSideMenuStatus: 'menuType/changeSideMenuStatus',
      addMenuClassname: 'menuType/addMenuClassname',
      changeSelectedMenuHasSubItems: 'menuType/changeSelectedMenuHasSubItems',
    }),
    getMenuItems() {
      let vm = this
      const dashboardItem = {
        label: 'dashboard',
        icon: 'simple-icon-layers',
        key: 'dashboard',
        to: '/dashboard',
      }

      if (this.$helpers.nullToVoid(this.user) == '') {
        return []
      }
      if (this.$helpers.isEmpty(this.user)) return
      if (this.user.user_type_id == this.IDG) {
        //this.items.unshift(dashboardItem)
        return this.items
      } else if (this.user.user_type_id == this.SUPER_ADMIN) {
       // this.items.unshift(dashboardItem)
        return this.items.filter((item) => item.key != 'developer')
      }

      // filter module only menu
      let moduleMenu = this.roleModules
      let menu = []

      this.items.forEach((obj) => {
        // if menu no subs
        if (vm.$helpers.nullToVoid(obj.subs) == '') {
          moduleMenu.forEach((b) => {
            if (obj.key == b.module_key) {
              let view =
                this.$helpers.nullToVoid(obj.view_key) == ''
                  ? 'view'
                  : obj.view_key
              let viewPermission = b.permissions.find(
                (ele) => ele.permission_name == view
              )

              if (!this.$helpers.isEmpty(viewPermission)) {
                menu.push(obj)
              }
            }
          })
        } else {
          // if menu has subs (sub level 1)
          let subs = []
          let lastSubs = []
          obj.subs.forEach((subsObj) => {
            if (vm.$helpers.nullToVoid(subsObj.subs) == '') {
              moduleMenu.forEach((b) => {
                if (subsObj.key == b.module_key) {
                  let view =
                    this.$helpers.nullToVoid(subsObj.view_key) == ''
                      ? 'view'
                      : subsObj.view_key
                  let viewPermission = b.permissions.find(
                    (obj) => obj.permission_name == view
                  )
                  // if (this.$helpers.isEmpty(viewPermission)) {
                  //     subs.push(subsObj)
                  // }
                  if (!this.$helpers.isEmpty(viewPermission)) {
                    subs.push(subsObj)
                  }
                }
              })
            } else {
              subsObj.subs.forEach((lastSubsObj) => {
                moduleMenu.forEach((b) => {
                  if (lastSubsObj.key == b.module_key) {
                    let view =
                      this.$helpers.nullToVoid(lastSubsObj.view_key) == ''
                        ? 'view'
                        : lastSubsObj.view_key
                    let viewPermission = b.permissions.find(
                      (obj) => obj.permission_name == view
                    )
                    if (!this.$helpers.isEmpty(viewPermission)) {
                      lastSubs.push(lastSubsObj)
                    }
                  }
                })
              })
            }
            if (lastSubs.length > 0) {
              subs.push({
                label: subsObj.label,
                icon: subsObj.icon,
                subs: lastSubs,
              })
            }
            lastSubs = []
          })
          if (subs.length > 0) {
            menu.push({
              label: obj.label,
              to: obj.to,
              icon: obj.icon,
              key: obj.key,
              subs: subs,
            })
          }
        }
      })
     // menu.unshift(dashboardItem)
      return menu
    },
    selectMenu() {
      if (this.$i18n.locale == 'kh') {
        var currentParentUrl = this.$route.path
          .split('/')
          .filter((x) => x !== '')[0]

        this.$validator.localize('kh')
      } else if (this.$i18n.locale == 'en') {
        var currentParentUrl = this.$route.path
          .split('/')
          .filter((x) => x !== '')[1]

        this.$validator.localize('en')
      }
      //
      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl
      } else {
        this.selectedParentMenu = 'dashboards'
      }
      this.isCurrentMenuHasSubItem()
    },
    isCurrentMenuHasSubItem() {
      const menuItem = this.menuItems.find(
        (x) => x.key === this.selectedParentMenu
      )
      const isCurrentMenuHasSubItem =
        menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false
      if (isCurrentMenuHasSubItem != this.selectedMenuHasSubItems) {
        if (!isCurrentMenuHasSubItem) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: false,
          })
        } else {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: true,
          })
        }
      }

      return isCurrentMenuHasSubItem
    },

    changeSelectedParentHasNoSubmenu(parentMenu) {
      this.selectedParentMenu = parentMenu
      this.viewingParentMenu = parentMenu
      this.changeSelectedMenuHasSubItems(false)
      this.changeSideMenuStatus({
        step: 0,
        classNames: this.menuType,
        selectedMenuHasSubItems: false,
      })
    },

    openSubMenu(e, menuItem) {
      const selectedParent = menuItem.key
      const hasSubMenu = menuItem.subs && menuItem.subs.length > 0
      this.changeSelectedMenuHasSubItems(hasSubMenu)
      if (!hasSubMenu) {
        this.viewingParentMenu = selectedParent
        this.selectedParentMenu = selectedParent
        this.toggle()
      } else {
        const currentClasses = this.menuType
          ? this.menuType.split(' ').filter((x) => x !== '')
          : ''

        if (!currentClasses.includes('menu-mobile')) {
          if (
            currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 2 || this.menuClickCount === 0)
          ) {
            this.changeSideMenuStatus({
              step: 3,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu,
            })
          } else if (
            currentClasses.includes('menu-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 2,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu,
            })
          } else if (
            currentClasses.includes('menu-default') &&
            !currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 0,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu,
            })
          }
        } else {
          this.addMenuClassname({
            classname: 'sub-show-temporary',
            currentClasses: this.menuType,
          })
        }
        this.viewingParentMenu = selectedParent
      }
    },
    handleDocumentClick(e) {
      this.viewingParentMenu = ''
      this.selectMenu()
      this.toggle()
    },
    toggle() {
      const currentClasses = this.menuType.split(' ').filter((x) => x !== '')
      if (
        currentClasses.includes('menu-sub-hidden') &&
        this.menuClickCount === 3
      ) {
        this.changeSideMenuStatus({
          step: 2,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems,
        })
      } else if (
        currentClasses.includes('menu-hidden') ||
        currentClasses.includes('menu-mobile')
      ) {
        if (!(this.menuClickCount === 1 && !this.selectedMenuHasSubItems)) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: this.selectedMenuHasSubItems,
          })
        }
      }
    },
    // Resize
    handleWindowResize(event) {
      if (event && !event.isTrusted) {
        return
      }
      let nextClasses = this.getMenuClassesForResize(this.menuType)
      this.changeSideMenuStatus({
        step: 0,
        classNames: nextClasses.join(' '),
        selectedMenuHasSubItems: this.selectedMenuHasSubItems,
      })
    },
    getMenuClassesForResize(classes) {
      let nextClasses = classes.split(' ').filter((x) => x !== '')
      const windowWidth = window.innerWidth

      if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push('menu-mobile')
      } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter((x) => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          !nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses.push('menu-sub-hidden')
        }
      } else {
        nextClasses = nextClasses.filter((x) => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses = nextClasses.filter((x) => x !== 'menu-sub-hidden')
        }
      }
      return nextClasses
    },
    trimParamFromURL(url) {
      if (url !== undefined) {
        let arr = url.split('?')
        return arr[0]
      }
    },
  },
}
</script>
