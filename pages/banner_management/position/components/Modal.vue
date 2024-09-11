<template>
  <b-modal
    id="modal"
    v-model="modal"
    scrollable
    centered
    size="xxl"
    no-close-on-backdrop
    no-close-on-esc
    :title="$t('banner_list')"
  >
    <!-- Banner Form-->
    <div v-if="modalBannerShow">
      <modal-banner
        :modalType="modalBannerType"
        :platformType="platformType"
        :imageType="imageType"
        :attraction-list="attractionList"
        :property-list="propertyList"
        :property-type-list="propertyTypeList"
        :province-list="provinceList"
        :shop-list="shopList"
        :category-in-shop-all="categoryInShopAllList"
        @closeModal="closeBannerModal"
      ></modal-banner>
    </div>

    <template #modal-header="{ close }">
      <h5 style="margin-top: 3px">
        <span>{{ $t('banner_list') }}</span>
        <i
          v-if="checkModuleAuthorize('banner', 'create')"
          class="iconsminds-folder-add-- text-primary"
          style="cursor: pointer; font-size: 20px"
          @click="openBannerModal"
        ></i>
      </h5>
      <div class="search-sm">
        <b-input
          v-model="filter.txt_src"
          :placeholder="$t('search')"
          @input="getBannerList(false)"
        />
      </div>
    </template>

    <b-row v-if="bannerList.length > 0">
      <b-col cols="12">
        <div
          v-for="(banner, index) in bannerList"
          :key="index"
          class="bannerListItem"
        >
          <img
            :src="apiUrl + 'images/banner/' + banner.image"
            width="345"
            border="0"
            class="img-rounded mr-3 mb-4"
            :class="banner.selected == true ? 'selected-item' : ''"
            @click="selectItem(index)"
          />
        </div>
      </b-col>
    </b-row>
    <b-row class="text-center" v-else>
      <b-col cols="12">
        <span class="text-muted">{{ $t('no_data') }}</span>
      </b-col>
    </b-row>

    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="clearForm"
        >{{ $t('cancel') }}
      </b-button>
      <b-button size="xs" variant="primary" @click="saveSelect"
        >{{ $t('select') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import swal from 'sweetalert2'

export default {
  props: {
    bannerSelected: {
      type: Array,
      default: () => {
        return []
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
    platformType: {
      type: Number,
      default: 0,
    },
    imageType: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ModalBanner: () => import('../../banner/components/Modal'),
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      listItemSelected: [],
      bannerList: [],
      filter: {
        image_type: null,
        text_src: null,
      },
      modalBannerShow: false,
      modalBannerType: 0,
      propertyList: [],
      propertyTypeList: [],
      attractionList: [],
      provinceList: [],
      shopList: [],
      categoryInShopAllList: []
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if (val) {
          this.modal = true
        }
      },
      immediate: true,
    },
    propertyTypeList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.getNameByLang(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
    provinceList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.getNameByLang(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
  },
  created() {
    this.filter.platform_type = this.platformType
    this.filter.image_type = this.imageType
    this.getBannerList()
  },
  methods: {
    getBannerList(loading = true) {
      let vm = this
      let input = {
        filter: this.filter,
        loading: loading,
      }

      vm.bannerList = []
      vm.$axios
        .$post('position_banner/get_banner_list', input)
        .then(({ data }) => {
          //Form Add
          vm.bannerList = data
          vm.bannerList.map((obj) => {
            obj.banner_position_id = null
            obj.position_id = null
            obj.selected = JSON.parse(obj.selected) //Convert string to boolean
            return obj
          })

          //Set Auto select when Form Update
          if (vm.modalType == 2) {
            vm.setData()
          }
        })
    },
    saveSelect(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this

      // Set Selected Banner
      vm.listItemSelected = vm.bannerList.filter((obj) => obj.selected == true)

      //Check if selected list is empty
      if (vm.listItemSelected.length < 1) {
        let message = ''
        if (vm.$i18n.locale == 'en') {
          message = 'Please select at least one banner.'
        } else if (vm.$i18n.locale == 'kh') {
          message = 'សូមជ្រើសរើសប៉ាណូយ៉ាងហោចណាស់មួយ។'
        }
        vm.$notify('warning', vm.$t('banner_list'), message, {
          duration: 4500,
        })
        return
      } else {
        vm.clearForm()
      }
    },
    clearForm() {
      this.modal = false
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
      this.$emit('closeModal', this.listItemSelected)
      this.listItemSelected = []
    },
    setData() {
      this.bannerList.map((obj) => {
        this.bannerSelected.map((item) => {
          if (obj.id == item.id) {
            obj.banner_position_id = item.banner_position_id
            obj.position_id = item.position_id
            obj.selected = JSON.parse(item.selected) //Convert string to boolean
            return obj
          }
        })
      })
    },
    selectItem(index) {
      this.bannerList[index].selected = !this.bannerList[index].selected
    },
    async openBannerModal() {
      this.modalBannerType = 3
      this.modalBannerShow = true
      await this.getSelectDataForBannerModal()
    },
    closeBannerModal(data) {
      this.modalBannerType = 0
      this.modalBannerShow = false

      if (!this.$helpers.isEmpty(data)) {
        this.getBannerList(false)
      }
    },
    async getSelectDataForBannerModal() {
      let vm = this

      await vm.$axios
        .$post('banner/get_select_data', {loading: true})
        .then(({data}) => {
          vm.propertyList = data.property
          vm.propertyTypeList = data.property_type
          vm.attractionList = data.attraction
          vm.provinceList = data.province
          vm.shopList = data.shop
          vm.categoryInShopAllList = data.category_in_shop_all
        })
    },
  },
}
</script>
<style scoped>
.bannerListItem {
  display: inline-flex;
}

.bannerListItem img {
  cursor: pointer;
}

.selected-item {
  border: 2px solid #2fc0f3;
  opacity: 0.6;
}
</style>
