<template>
  <div style="overflow: hidden">
    <!-- Position Form-->
    <div v-if="modalBannerListShow">
      <modal-banner-list
        :bannerSelected="bannerList"
        :imageType="imageType"
        :modalType="modalBannerListType"
        :platformType="form.platform_type"
        @closeModal="closeBannerListModal"
      ></modal-banner-list>
    </div>
    <div>
      <!-- Heading -->
      <div class="page-header-nav">
        <b-row class="mt-2">
          <b-col cols="6" xl="6">
            <div class="page-title">
              <nuxt-link to="/banner_management/position"
              >{{ $t('position_banner') }}
              </nuxt-link>
              <span> / </span>
              <span v-if="modalType == 1" class="page-title-sub">{{
                  $t('add')
                }}</span>
              <span v-if="modalType == 2" class="page-title-sub">{{
                  $t('update')
                }}</span>
            </div>
          </b-col>

          <b-col class="text-right mb-3" cols="12" xl="6">
            <b-button
              size="xs"
              variant="outline-danger"
              @click="cancelNotDoAction"
            >
              {{ $t('close') }}
            </b-button>
            <template
              v-if="
                checkModuleAuthorize('position_banner', 'create') &&
                paramAction == formAction.ADD
              "
            >
              <b-button
                size="xs"
                variant="primary"
                @click="save($event, formAction.ADD)"
              >
                <i class="iconsminds-add"></i>
                {{ $t('save') }}
              </b-button>

              <b-button
                size="xs"
                variant="primary"
                @click="save($event, formAction.ADD_CLOSE)"
              >
                <i class="iconsminds-add"></i>
                {{ $t('save_and_close') }}
              </b-button>
            </template>

            <template
              v-else-if="
                checkModuleAuthorize('position_banner', 'update') &&
                paramAction == formAction.UPDATE
              "
            >
              <b-button
                v-if="checkModuleAuthorize('position_banner', 'create')"
                size="xs"
                variant="primary"
                @click="save($event, formAction.UPDATE_ADD)"
              >
                <i class="simple-icon-pencil"></i>
                {{ $t('updateAndAdd') }}
              </b-button>

              <b-button
                size="xs"
                variant="primary"
                @click="save($event, formAction.UPDATE_CLOSE)"
              >
                <i class="simple-icon-pencil"></i>
                {{ $t('update_and_close') }}
              </b-button>

              <b-button
                size="xs"
                variant="primary"
                @click="save($event, formAction.UPDATE)"
              >
                <i class="simple-icon-pencil"></i>
                {{ $t('update') }}
              </b-button>
            </template>
          </b-col>
        </b-row>
        <div class="separator mb-4"></div>
      </div>

      <b-collapse v-model="isShowPositionForm">
        <b-card class="shadow mb-5">
          <b-row>
            <!-- Form Block -->
            <!-- platform_type -->
            <!--            <b-col cols="12" md="6" lg="3" xl="3">-->
            <!--              <b-form-group-->
            <!--                :invalid-feedback="veeErrors.first('platform_type')"-->
            <!--                :state="!veeErrors.has('platform_type')"-->
            <!--                :label="$t('platform_type')"-->
            <!--                label-for="platform_type"-->
            <!--                label-class="control-label"-->
            <!--                class="required"-->
            <!--              >-->
            <!--                <b-form-select-->
            <!--                  v-model="form.platform_type"-->
            <!--                  v-validate="'required'"-->
            <!--                  :state="veeErrors.has('platform_type') ? false : null"-->
            <!--                  data-vv-name="platform_type"-->
            <!--                  :data-vv-as="$t('platform_type')"-->
            <!--                  type="text"-->
            <!--                  :placeholder="$t('platform_type')"-->
            <!--                  @change="onChangeOptionPlatformType"-->
            <!--                >-->
            <!--                  <template slot="first">-->
            <!--                    <b-form-select-option :value="null"-->
            <!--                    >{{ $t('please_select') }}-->
            <!--                    </b-form-select-option>-->
            <!--                  </template>-->

            <!--                  <b-form-select-option-->
            <!--                    :value="enums.position_platform_type.WEB"-->
            <!--                  >{{ $t('web') }}-->
            <!--                  </b-form-select-option>-->
            <!--                  <b-form-select-option-->
            <!--                    :value="enums.position_platform_type.MOBILE"-->
            <!--                  >{{ $t('mobile') }}-->
            <!--                  </b-form-select-option>-->
            <!--                </b-form-select>-->
            <!--              </b-form-group>-->
            <!--            </b-col>-->

            <!-- page -->
            <b-col :lg="isRealEstateByPropertyType ? 3 : 4" :md="isRealEstateByPropertyType ? 3 : 4"
                   :xl="isRealEstateByPropertyType ? 3 : 4"
                   cols="12">
              <b-form-group
                :invalid-feedback="veeErrors.first('page')"
                :label="$t('page')"
                :label-for="$t('page')"
                :state="!veeErrors.has('page')"
                class="required"
                label-class="control-label"
              >
                <b-multi-select
                  v-model="page_data"
                  v-validate="'required'"
                  :data-vv-as="$t('page')"
                  :disabled="disabledOptionPage"
                  :multiple="false"
                  :options="pageList"
                  :placeholder="$t('page')"
                  :state="veeErrors.has('page') ? false : null"
                  data-vv-name="page"
                  label="name"
                  track-by="name"
                  @input="onChangeOptionPage"
                  @reset="resetOptionPageData"
                ></b-multi-select>
              </b-form-group>
            </b-col>

            <!-- property_type -->
            <b-col
              v-if="isRealEstateByPropertyType" cols="12" lg="3" md="3"
              xl="3"
            >
              <b-form-group
                :invalid-feedback="veeErrors.first('property_type')"
                :label="$t('property_type')"
                :state="!veeErrors.has('property_type')"
                class="required"
                label-class="control-label"
                label-for="property_type"
              >
                <b-multi-select
                  v-model="property_type_data"
                  v-validate="'required'"
                  :data-vv-as="$t('property_type')"
                  :multiple="false"
                  :options="propertyTypeList"
                  :placeholder="$t('property_type')"
                  data-vv-name="property_type"
                  label="name"
                  track-by="name"
                  @reset="resetPropertyTypeSelect"
                ></b-multi-select>
              </b-form-group>
            </b-col>

            <!-- position -->
            <b-col :lg="isRealEstateByPropertyType ? 3 : 4" :md="isRealEstateByPropertyType ? 3 : 4"
                   :xl="isRealEstateByPropertyType ? 3 : 4"
                   cols="12">
              <b-form-group
                :invalid-feedback="veeErrors.first('position')"
                :label="$t('position')"
                :label-for="$t('position')"
                :state="!veeErrors.has('position')"
                class="required"
                label-class="control-label"
              >
                <b-multi-select
                  v-model="position_data"
                  v-validate="'required'"
                  :data-vv-as="$t('position')"
                  :disabled="disabledOptionPosition"
                  :multiple="false"
                  :options="positionList"
                  :placeholder="$t('position')"
                  :state="veeErrors.has('position') ? false : null"
                  data-vv-name="position"
                  label="text"
                  track-by="text"
                  @input="onChangeOptionPosition"
                  @reset="resetOptionPositionData"
                ></b-multi-select>
              </b-form-group>
            </b-col>

            <!-- status -->
            <b-col :lg="isRealEstateByPropertyType ? 3 : 4" :md="isRealEstateByPropertyType ? 3 : 4"
                   :xl="isRealEstateByPropertyType ? 3 : 4"
                   cols="12">
              <b-form-group
                :invalid-feedback="veeErrors.first('status')"
                :label="$t('status')"
                :state="!veeErrors.has('status')"
                class="required"
                label-class="control-label"
                label-for="status"
              >
                <b-form-select
                  v-model="form.status"
                  v-validate="'required'"
                  :data-vv-as="$t('status')"
                  :placeholder="$t('status')"
                  :state="veeErrors.has('status') ? false : null"
                  data-vv-name="status"
                  type="text"
                >
                  <template slot="first">
                    <b-form-select-option :value="null" disabled
                    >{{ $t('status') }}
                    </b-form-select-option>
                  </template>
                  <b-form-select-option :value="enums.position_status.ENABLE"
                  >{{ $t('enable') }}
                  </b-form-select-option>
                  <b-form-select-option :value="enums.position_status.DISABLE"
                  >{{ $t('disable') }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row class="mt-2">
            <b-col cols="12">
              <label
                :label-for="$t('banner')"
                class="required"
                label-class="control-label"
              >
                <span>{{ $t('banner') }}</span>
                <span class="text-danger"> *</span>
              </label>
              <b-button
                class="px-2"
                style="text-decoration: none"
                variant="link"
                @click="openBannerModal"
              >
                <i class="simple-icon-picture" style="font-size: 17px"></i>
              </b-button>

              <b-row class="box-add-banner" @click="openBannerModal">
                <b-col cols="12">
                  <div
                    v-if="$helpers.isEmpty(bannerList)"
                    class="d-flex flex-column align-items-center"
                  >
                    <label class="select-banner-text">{{
                        `${$t('select')} ${$t('banner')}`
                      }}</label>
                    <div class="box-icon-add-banner">
                      <i class="iconsminds-add"></i>
                    </div>
                  </div>
                  <div v-else>
                    <draggable :list="bannerList" class="row">
                      <div
                        v-for="(banner, index) in bannerList"
                        :key="index"
                        class="banner-selected-item"
                      >
                        <b-img
                          :src="apiUrl + 'images/banner/' + banner.image"
                          class="mb-4"
                          height="150"
                          style="margin-top: 20px"
                          width="150"
                        />
                        <div
                          class="minus-image"
                          @click="removeBannerItem($event, index)"
                        >
                          <i class="iconsminds-remove"></i>
                        </div>
                      </div>
                    </draggable>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import Draggable from 'vuedraggable'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'position_banner',
  head() {
    return {
      title: this.$t('position_banner'),
    }
  },
  components: {
    draggable: Draggable,
    ModalBannerList: () => import('../components/Modal'),
  },
  data() {
    return {
      form: {
        id: null,
        platform_type: 2, //Mobile
        page: null,
        name: null,
        reference_id: null,
        status: 1,
      },
      defaultForm: {
        id: null,
        platform_type: 2, //Mobile
        page: null,
        name: null,
        reference_id: null,
        status: 1,
      },
      paramAction: null,
      formAction: {
        ADD: 'add',
        UPDATE: 'update',
        ADD_CLOSE: 'add_close',
        UPDATE_CLOSE: 'update_close',
      },
      apiUrl: process.env.API_URL,
      modalType: 0,
      isShowPositionForm: true,
      page_data: null,
      old_page_data: null,
      pageList: [],
      position_data: null,
      old_position_data: null,
      positionList: [],
      bannerList: [],
      modalBannerListShow: false,
      modalBannerListType: 0,
      disabledOptionPage: true,
      disabledOptionPosition: true,
      imageType: null,
      deletedBannerList: [],
      old_platform_type: null,
      isClearBannerList: false,
      property_type_data: null,
      old_property_type_data: null,
      propertyTypeList: []
    }
  },
  computed: {
    headTitleForm() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('position')}`
        : `${this.$t('update')} ${this.$t('position')}`
    },
    isRealEstateByPropertyType() {
      return this.page_data && this.page_data.id == this.enums.banner_page.REAL_ESTATE_BY_PROPERTY_TYPE
    }
  },
  watch: {
    pageList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.$t(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
    positionList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.text = this.$t(obj.text)
            return obj
          })
        }
      },
      immediate: true,
    },
    imageType: {
      handler(newVal, oldVal) {
        this.oldImageType = oldVal
      },
    },
    'form.platform_type': {
      handler(newVal, oldVal) {
        this.old_platform_type = oldVal
      },
    },
    page_data: {
      handler(newVal, oldVal) {
        this.old_page_data = oldVal
      },
    },
    position_data: {
      handler(newVal, oldVal) {
        this.old_position_data = oldVal
      },
    },
    property_type_data: {
      handler(newVal, oldVal) {
        this.old_property_type_data = oldVal
      },
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
  },
  async created() {
    this.paramAction = this.$route.query.type
    let permission = true

    //Get Select Data On Form
    await this.getSelectData(false)

    this.onChangeOptionPlatformType()
    if (this.paramAction == this.formAction.ADD) {
      if (this.checkModuleAuthorize('position_banner', 'create')) {
        this.modalType = 1
      } else {
        permission = false
      }
    } else if (this.paramAction == this.formAction.UPDATE) {
      if (this.checkModuleAuthorize('position_banner', 'update')) {
        this.modalType = 2

        //get edit data form update
        this.getEditData(true)
      } else {
        permission = false
      }
    } else {
      this.$router.push({
        path: this.makeLink('/errors/404'),
      })
    }

    if (!permission) {
      this.$router.push({
        path: this.makeLink('/errors/403'),
      })
    }
  },
  methods: {
    async getSelectData(loading = true) {
      let vm = this

      await vm.$axios
        .$post('position_banner/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.propertyTypeList = data.property_type
        })
    },
    async getEditData(loading = true) {
      let vm = this

      let input = {
        id: vm.$route.query.id,
        loading: loading,
      }

      await this.$axios
        .$post('position_banner/edit', input)
        .then(({data}) => {
          let formItem = data

          vm.form = Object.assign({}, formItem)

          vm.onChangeOptionPlatformType()
          //Set Page
          let pageItem = vm.pageList.find((obj) => obj.id == formItem.page)
          if (vm.$helpers.nullToVoid(pageItem) != '') {
            vm.page_data = pageItem
          } else {
            vm.page_data = null
          }

          //Set Position
          vm.getPositionByPage()
          vm.disabledOptionPosition = false

          let positionItem = vm.positionList.find(
            (obj) => obj.value == formItem.name
          )
          if (vm.$helpers.nullToVoid(positionItem) != '') {
            vm.position_data = positionItem
          } else {
            vm.position_data = null
          }

          //Set Property Type
          if (vm.isRealEstateByPropertyType) {
            let propertyTypeItem = vm.propertyTypeList.find(
              (obj) => obj.id == formItem.reference_id
            )
            if (vm.$helpers.nullToVoid(propertyTypeItem) != '') {
              vm.property_type_data = propertyTypeItem
            } else {
              vm.property_type_data = null
            }
          }

          //Set Banner List
          vm.bannerList = data.banner_list
          vm.deletedBannerList = []
        })
    },
    save(evt, saveType = this.formAction.ADD) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'position_banner/store'
          if (vm.paramAction == vm.formAction.UPDATE) {
            url = 'position_banner/update'
          }
          if (vm.$helpers.isEmpty(vm.bannerList)) {
            swal.fire({
              icon: 'warning',
              title: vm.$t('banner'),
              text:
                vm.$i18n.locale == 'en'
                  ? 'Please select at least one banner.'
                  : vm.$i18n.locale == 'kh'
                    ? 'សូមជ្រើសរើសប៉ាណូយ៉ាងហោចណាស់មួយ។'
                    : '',
            })
            return
          }

          vm.$axios.$post(url, vm.setDataToApiSave()).then(({data}) => {
            vm.responseFromApiSave(saveType, data)
          })
        } else {
          vm.$notify('warning', vm.$t('position'), vm.$t('validation_failed'))
        }
      })
    },
    setDataToApiSave() {
      let input = Object.assign({}, this.form)

      input.name = this.position_data.value
      input.page = this.page_data.id
      input.reference_id = null
      if (this.isRealEstateByPropertyType) {
        input.reference_id = this.property_type_data.id
      }

      this.bannerList.map((obj, index) => {
        obj.order = index
        return obj
      })
      input.banner_list = this.bannerList
      input.deleted_banner_list = this.deletedBannerList

      return input
    },
    responseFromApiSave(saveType, response) {
      this.$notify('success', this.$t('position'), this.$t('done'))

      if (saveType == this.formAction.ADD) {
        this.clearForm()
      } else if (
        saveType == this.formAction.ADD_CLOSE ||
        saveType == this.formAction.UPDATE_CLOSE
      ) {
        this.clearForm()

        // redirect to banner position page
        this.$router.push({
          path: this.makeLink('/banner_management/position'),
        })
      } else if (saveType == this.formAction.UPDATE) {
        this.clearForm()
        this.getEditData(false)
      } else if (saveType == this.formAction.UPDATE_ADD) {
        this.clearForm()
        this.$router.push({
          path: this.makeLink('/banner_management/position/action?type=add'),
        })
      }
    },
    cancelNotDoAction() {
      let vm = this

      swal.fire({
        title: vm.$t('are_you_sure'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('ok'),
        cancelButtonText: vm.$t('close'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            vm.clearForm()
            vm.$router.push({
              path: vm.makeLink('/banner_management/position'),
            })
            swal.close()
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    clearForm() {
      this.form = Object.assign({}, this.defaultForm)

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.resetOptionPositionData()
      this.imageType = null
      this.positionList = []
      this.bannerList = []
      this.deletedBannerList = []
    },
    openBannerModal() {
      if (
        this.$helpers.nullToVoid(this.form.platform_type) == '' ||
        this.$helpers.nullToVoid(this.page_data) == '' ||
        this.$helpers.nullToVoid(this.position_data) == ''
      ) {
        swal.fire({
          icon: 'warning',
          title: this.$t('banner'),
          text:
            this.$i18n.locale == 'en'
              ? 'Please select all data first (Page, Position,.......)'
              : this.$i18n.locale == 'kh'
                ? 'សូមជ្រើសរើសទិន្នន័យទាំងអស់ជាមុនសិន (ទំព័រ, ទីតាំង,.......)'
                : '',
        })

      } else {
        this.getImageTypeByPosition()

        if (this.$helpers.isEmpty(this.bannerList)) {
          //From Add
          this.modalBannerListType = 1
          this.modalBannerListShow = true
        } else {
          //Form Update
          this.modalBannerListType = 2
          this.modalBannerListShow = true
        }
      }
    },
    closeBannerListModal(list) {
      if (!this.$helpers.isEmpty(list)) {
        this.bannerList = list
      }

      this.modalBannerListType = 0
      this.modalBannerListShow = false
    },
    removeBannerItem(evt, index) {
      evt.stopPropagation()

      if (
        this.$helpers.nullToVoid(this.bannerList[index].banner_position_id) !=
        ''
      ) {
        this.deletedBannerList.push(this.bannerList[index])
      }
      this.bannerList.splice(index, 1)
    },

    onChangeOptionPlatformType() {
      this.askWhenDeleteBannerNotEmpty('platform')

      if (this.isClearBannerList == false) {
        this.resetOptionPageData()
        this.disabledOptionPage = true

        if (this.$helpers.nullToVoid(this.form.platform_type) != '') {
          let platformTypeEnum = this.enums.position_platform_type
          let currentPlatformType = this.form.platform_type
          let list = JSON.parse(JSON.stringify(this.enums.banner_page_list))

          if (currentPlatformType == platformTypeEnum.MOBILE) {
            this.pageList = list.MOBILE
          } else if (currentPlatformType == platformTypeEnum.WEB) {
            this.pageList = list.WEB
          }

          if (this.pageList.length > 0) {
            this.disabledOptionPage = false
          }
        }
      }
    },
    onChangeOptionPage() {
      this.askWhenDeleteBannerNotEmpty('page')

      if (this.isClearBannerList == false) {
        if (this.$helpers.nullToVoid(this.page_data) == '') {
          this.resetOptionPageData()
        } else {
          this.getPositionByPage()
          this.disabledOptionPosition = false
        }
      }
    },
    clearBannerList() {
      //Push to deleted banner list
      this.bannerList.forEach((obj) => {
        if (this.$helpers.nullToVoid(obj.banner_position_id) != '') {
          this.deletedBannerList.push(obj)
        }
      })

      //Clear Banner List
      this.bannerList = []
    },
    resetOptionPageData() {
      this.form.page = null
      this.page_data = null
      this.positionList = []
      this.position_data = null
      this.disabledOptionPosition = true

      this.clearBannerList()

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    getPositionByPage() {
      let platformTypeEnum = this.enums.position_platform_type
      let pageEnum = this.enums.banner_page
      let list = JSON.parse(JSON.stringify(this.enums.position_banner_list))

      let currentPlatformType = this.form.platform_type
      let currentPageData = this.page_data ? this.page_data.id : null
      this.positionList = []
      this.position_data = null
      this.property_type_data = null
      let positionListByPage = []

      if (currentPlatformType == platformTypeEnum.MOBILE) {
        if (currentPageData == pageEnum.HOME) {
          positionListByPage = list.MOBILE.HOME
        } else if (currentPageData == pageEnum.REAL_ESTATE_HOME) {
          positionListByPage = list.MOBILE.REAL_ESTATE_HOME
        } else if (currentPageData == pageEnum.REAL_ESTATE_BY_PROPERTY_TYPE) {
          positionListByPage = list.MOBILE.REAL_ESTATE_BY_PROPERTY_TYPE
        } else if (currentPageData == pageEnum.ATTRACTION_HOME) {
          positionListByPage = list.MOBILE.ATTRACTION_HOME
        } else if (currentPageData == pageEnum.SHOP_RETAIL_HOME) {
          positionListByPage = list.MOBILE.SHOP_RETAIL_HOME
        } else if (currentPageData == pageEnum.SHOP_WHOLESALE_HOME) {
          positionListByPage = list.MOBILE.SHOP_WHOLESALE_HOME
        } else if (currentPageData == pageEnum.RESTAURANT_HOME) {
          positionListByPage = list.MOBILE.RESTAURANT_HOME
        } else if (currentPageData == pageEnum.SHOP_LOCAL_PRODUCT_HOME) {
          positionListByPage = list.MOBILE.SHOP_LOCAL_PRODUCT_HOME
        }else if (currentPageData == pageEnum.HOTEL_HOME) {
          positionListByPage = list.MOBILE.HOTEL_HOME
        }else if (currentPageData == pageEnum.MASSAGE_HOME) {
          positionListByPage = list.MOBILE.MASSAGE_HOME
        }else if (currentPageData == pageEnum.KTV_HOME) {
          positionListByPage = list.MOBILE.KTV_HOME
        }else if (currentPageData == pageEnum.SERVICE) {
          positionListByPage = list.MOBILE.SERVICE
        }else if (currentPageData == pageEnum.MODERN_COMMUNITY) {
          positionListByPage = list.MOBILE.MODERN_COMMUNITY
        }else if (currentPageData == pageEnum.CHARITY_HOME) {
          positionListByPage = list.MOBILE.CHARITY_HOME
        }
      }

      this.positionList = positionListByPage
      if (positionListByPage.length == 1) {
        this.position_data = positionListByPage[0]
      }


      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    getImageTypeByPosition() {
      let square = this.enums.banner_image_type.SQUARE
      let rectangle = this.enums.banner_image_type.RECTANGLE
      let platformTypeEnum = this.enums.position_platform_type
      let currentPlatformType = this.form.platform_type
      let currentPage = this.page_data.id
      let currentPosition = this.position_data.value

      if (currentPlatformType == platformTypeEnum.MOBILE) {
        if (currentPosition == 'slideshow') {
          this.imageType = rectangle
        } else {
          this.imageType = square
        }
      }
    },
    onChangeOptionPosition() {
      this.askWhenDeleteBannerNotEmpty('position')
    },
    askWhenDeleteBannerNotEmpty(onChangeType) {
      if (
        this.bannerList.length > 0 &&
        this.$helpers.nullToVoid(this.form.platform_type) != '' &&
        this.pageList.length > 0 &&
        this.positionList.length > 0
      ) {
        this.isClearBannerList = true
        swal
          .fire({
            title: this.$t('are_you_sure'),
            text:
              this.$i18n.locale == 'en'
                ? 'It will delete the banner below.'
                : this.$i18n.locale == 'kh'
                  ? 'វានឹងលុបបា៉ណូខាងក្រោមចោល។'
                  : '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('close'),
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !swal.isLoading(),
          })
          .then((result) => {
            if (result.isConfirmed) {
              //Clear Banner List
              this.clearBannerList()

              this.isClearBannerList = false

              if (onChangeType == 'platform') {
                this.onChangeOptionPlatformType()
              } else if (onChangeType == 'page') {
                this.onChangeOptionPage()
              }
            } else if (result.isDismissed) {
              if (onChangeType == 'platform') {
                this.form.platform_type = this.old_platform_type
              } else if (onChangeType == 'page') {
                this.page_data = this.old_page_data
              } else if (onChangeType == 'position') {
                this.position_data = this.old_position_data
              }
            }
            swal.close()
          })
      }
    },
    resetOptionPositionData() {
      this.form.name = null
      this.position_data = null

      this.clearBannerList()

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    resetPropertyTypeSelect() {
      this.property_type_data = null

      this.clearBannerList()

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
  },
}
</script>
