<template>
  <div style="overflow: hidden">
    <!-- Position Form-->
    <div v-if="modalVideoListShow">
      <modal-video-list
        :videoSelected="videoList"
        :modalType="modalVideoListType"
        @closeModal="closeVideoListModal"
      ></modal-video-list>
    </div>
    <div>
      <!-- Heading -->
      <div class="page-header-nav">
        <b-row class="mt-2">
          <b-col cols="6" xl="6">
            <div class="page-title">
              <nuxt-link to="/banner_management/position"
              >{{ $t('position_video') }}
              </nuxt-link>
              <span> / </span>
              <span class="page-title-sub" v-if="modalType == 1">{{
                  $t('add')
                }}</span>
              <span class="page-title-sub" v-if="modalType == 2">{{
                  $t('update')
                }}</span>
            </div>
          </b-col>

          <b-col cols="12" xl="6" class="text-right mb-3">
            <b-button
              size="xs"
              variant="outline-danger"
              @click="cancelNotDoAction"
            >
              {{ $t('close') }}
            </b-button>
            <template
              v-if="
                checkModuleAuthorize('position_video', 'create') &&
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
                checkModuleAuthorize('position_video', 'update') &&
                paramAction == formAction.UPDATE
              "
            >
              <b-button
                v-if="checkModuleAuthorize('position_video', 'create')"
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

      <b-card class="shadow mb-5">
        <b-row>
          <!-- Form Block -->
          <!-- platform_type -->
          <!--          <b-col cols="12" md="6" lg="3" xl="3">-->
          <!--            <b-form-group-->
          <!--              :invalid-feedback="veeErrors.first('platform_type')"-->
          <!--              :state="!veeErrors.has('platform_type')"-->
          <!--              :label="$t('platform_type')"-->
          <!--              label-for="platform_type"-->
          <!--              label-class="control-label"-->
          <!--              class="required"-->
          <!--            >-->
          <!--              <b-form-select-->
          <!--                v-model="form.platform_type"-->
          <!--                v-validate="'required'"-->
          <!--                :state="veeErrors.has('platform_type') ? false : null"-->
          <!--                data-vv-name="platform_type"-->
          <!--                :data-vv-as="$t('platform_type')"-->
          <!--                type="text"-->
          <!--                :placeholder="$t('platform_type')"-->
          <!--                @change="onChangeOptionPlatformType"-->
          <!--              >-->
          <!--                <template slot="first">-->
          <!--                  <b-form-select-option :value="null" disabled-->
          <!--                  >{{ $t('please_select') }}-->
          <!--                  </b-form-select-option>-->
          <!--                </template>-->

          <!--                <b-form-select-option-->
          <!--                  :value="enums.position_platform_type.WEB"-->
          <!--                >{{ $t('web') }}-->
          <!--                </b-form-select-option>-->
          <!--                <b-form-select-option-->
          <!--                  :value="enums.position_platform_type.MOBILE"-->
          <!--                >{{ $t('mobile') }}-->
          <!--                </b-form-select-option>-->
          <!--              </b-form-select>-->
          <!--            </b-form-group>-->
          <!--          </b-col>-->

          <!-- page -->
          <b-col cols="12" md="4" lg="4" xl="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('page')"
              :state="!veeErrors.has('page')"
              :label="$t('page')"
              :label-for="$t('page')"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="page_data"
                v-validate="'required'"
                :state="veeErrors.has('page') ? false : null"
                data-vv-name="page"
                :data-vv-as="$t('page')"
                label="name"
                track-by="name"
                :options="pageList"
                :multiple="false"
                :placeholder="$t('page')"
                @input="onChangeOptionPage"
                @reset="resetOptionPageData"
                :disabled="disabledOptionPage"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- position -->
          <b-col cols="12" md="4" lg="4" xl="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('position')"
              :state="!veeErrors.has('position')"
              :label="$t('position')"
              :label-for="$t('position')"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="position_data"
                v-validate="'required'"
                :state="veeErrors.has('position') ? false : null"
                data-vv-name="position"
                :data-vv-as="$t('position')"
                label="text"
                track-by="text"
                :options="positionList"
                :multiple="false"
                :placeholder="$t('position')"
                @input="onChangeOptionPosition"
                @reset="resetOptionPositionData"
                :disabled="disabledOptionPosition"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col cols="12" md="4" lg="4" xl="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('status')"
              :state="!veeErrors.has('status')"
              :label="$t('status')"
              label-for="status"
              label-class="control-label"
              class="required"
            >
              <b-form-select
                v-model="form.status"
                v-validate="'required'"
                :state="veeErrors.has('status') ? false : null"
                data-vv-name="status"
                :data-vv-as="$t('status')"
                type="text"
                :placeholder="$t('status')"
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
              :label-for="$t('youtube_link')"
              class="required"
              label-class="control-label"
            >
              <span>{{ $t('youtube_link') }}</span>
              <span class="text-danger"> *</span>
            </label>
            <b-button
              variant="link"
              class="px-2 mt-1"
              @click="openVideoListModal"
              style="text-decoration: none"
            >
              <i class="simple-icon-social-youtube" style="font-size: 17px; color: red"></i>
            </b-button>

            <b-row
              @click="openVideoListModal"
              class="box-add-banner"
            >
              <b-col cols="12">
                <div
                  v-if="$helpers.isEmpty(videoList)"
                  class="d-flex flex-column align-items-center"
                >
                  <label
                    class="select-banner-text">{{ `${$t('select')} ${$t('youtube_link')}` }}</label>
                  <div class="box-icon-add-banner">
                    <i class="iconsminds-add"></i>
                  </div>
                </div>
                <div v-else>
                  <draggable :list="videoList" class="row">
                    <div v-for="(video, index) in videoList" :key="index"
                         class="video-list-selected-item mt-3 mb-3 mr-4" @click="preventClickEvent">
                      <b-card class="shadow">
                        <b-card-title>{{ video.name }}</b-card-title>
                        <iframe :src="`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}`"
                                title="YouTube video player" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>

                        <div
                          class="minus-video"
                          @click="removeVideoItem($event, index)"
                        >
                          <i class="iconsminds-remove"></i>
                        </div>
                      </b-card>
                    </div>
                  </draggable>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import Draggable from 'vuedraggable'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'position_video',
  head() {
    return {
      title: this.$t('position_video'),
    }
  },
  components: {
    draggable: Draggable,
    ModalVideoList: () => import('../components/Modal'),
  },
  data() {
    return {
      form: {
        id: null,
        platform_type: 2, //Mobile
        page: null,
        name: null,
        status: 1,
      },
      defaultForm: {
        id: null,
        platform_type: 2, //Mobile
        page: null,
        name: null,
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
      videoList: [],
      modalVideoListShow: false,
      modalVideoListType: 0,
      disabledOptionPage: true,
      disabledOptionPosition: true,
      imageType: null,
      deletedVideoList: [],
      old_platform_type: null,
      isClearVideoList: false,
    }
  },
  computed: {
    headTitleForm() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('position')}`
        : `${this.$t('update')} ${this.$t('position')}`
    },
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
  },
  async created() {
    this.paramAction = this.$route.query.type
    let permission = true

    this.onChangeOptionPlatformType()
    this.getPositionByPage()
    this.disabledOptionPosition = false
    if (this.paramAction == this.formAction.ADD) {
      if (this.checkModuleAuthorize('position_video', 'create')) {
        this.modalType = 1
      } else {
        permission = false
      }
    } else if (this.paramAction == this.formAction.UPDATE) {
      if (this.checkModuleAuthorize('position_video', 'update')) {
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
        .$post('position_video/get_select_data', {loading: loading})
        .then(({data}) => {
        })
    },
    async getEditData(loading = true) {
      let vm = this

      let input = {
        id: vm.$route.query.id,
        loading: loading,
      }

      await this.$axios
        .$post('position_video/edit', input)
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

          //Set Video List
          vm.videoList = data.video_list
          vm.deletedVideoList = []
        })
    },
    save(evt, saveType = this.formAction.ADD) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'position_video/store'
          if (vm.paramAction == vm.formAction.UPDATE) {
            url = 'position_video/update'
          }
          if (vm.$helpers.isEmpty(vm.videoList)) {
            swal.fire({
              icon: 'warning',
              title: vm.$t('youtube_link'),
              text:
                vm.$i18n.locale == 'en'
                  ? 'Please select at least one video.'
                  : vm.$i18n.locale == 'kh'
                    ? 'សូមជ្រើសរើសវីដេអូយ៉ាងហោចណាស់មួយ។'
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

      this.videoList.map((obj, index) => {
        obj.order = index
        return obj
      })
      input.video_list = this.videoList
      input.deleted_video_list = this.deletedVideoList

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
          path: this.makeLink('/video_management/position'),
        })
      } else if (saveType == this.formAction.UPDATE) {
        this.clearForm()
        this.getEditData(false)
      } else if (saveType == this.formAction.UPDATE_ADD) {
        this.clearForm()
        this.$router.push({
          path: this.makeLink('/video_management/position/action?type=add'),
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
              path: vm.makeLink('/video_management/position'),
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

      this.resetOptionPageData()
      this.resetOptionPositionData()
      this.positionList = []
      this.videoList = []
      this.deletedVideoList = []
    },
    openVideoListModal() {
      if (
        this.$helpers.nullToVoid(this.form.platform_type) == '' ||
        this.$helpers.nullToVoid(this.page_data) == '' ||
        this.$helpers.nullToVoid(this.position_data) == ''
      ) {
        swal.fire({
          icon: 'warning',
          title: this.$t('youtube_link'),
          text:
            this.$i18n.locale == 'en'
              ? 'Please select platform type, page and position first'
              : this.$i18n.locale == 'kh'
                ? 'សូមជ្រើសរើសប្រភេទ Platform, ទំព័រ និងទីតាំងជាមុនសិន'
                : '',
        })
        return
      } else {

        if (this.$helpers.isEmpty(this.videoList)) {
          //From Add
          this.modalVideoListType = 1
          this.modalVideoListShow = true
        } else {
          //Form Update
          this.modalVideoListType = 2
          this.modalVideoListShow = true
        }
      }
    },
    closeVideoListModal(list) {
      if (!this.$helpers.isEmpty(list)) {
        this.videoList = list
      }

      this.modalVideoListType = 0
      this.modalVideoListShow = false
    },
    removeVideoItem(evt, index) {
      evt.stopPropagation()

      if (
        this.$helpers.nullToVoid(this.videoList[index].video_position_id) !=
        ''
      ) {
        this.deletedVideoList.push(this.videoList[index])
      }
      this.videoList.splice(index, 1)
    },

    onChangeOptionPlatformType() {
      this.askWhenDeleteVideoNotEmpty('platform')

      if (this.isClearVideoList == false) {
        this.resetOptionPageData()
        this.disabledOptionPage = true

        if (this.$helpers.nullToVoid(this.form.platform_type) != '') {
          let platformTypeEnum = this.enums.position_platform_type
          let currentPlatformType = this.form.platform_type
          let list = JSON.parse(JSON.stringify(this.enums.video_page_list))

          if (currentPlatformType == platformTypeEnum.MOBILE) {
            this.pageList = list.MOBILE
            this.page_data = this.pageList[0]
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
      this.askWhenDeleteVideoNotEmpty('page')

      if (this.isClearVideoList == false) {
        if (this.$helpers.nullToVoid(this.page_data) == '') {
          this.resetOptionPageData()
        } else {
          this.getPositionByPage()
          this.disabledOptionPosition = false
        }
      }
    },
    clearVideoList() {
      //Push to deleted banner list
      this.videoList.forEach((obj) => {
        if (this.$helpers.nullToVoid(obj.banner_position_id) != '') {
          this.deletedVideoList.push(obj)
        }
      })

      //Clear Banner List
      this.videoList = []
    },
    resetOptionPageData() {
      this.form.page = null
      this.page_data = null
      this.positionList = []
      this.position_data = null
      this.disabledOptionPosition = true

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    getPositionByPage() {
      let platformTypeEnum = this.enums.position_platform_type
      let pageEnum = this.enums.video_page
      let list = JSON.parse(JSON.stringify(this.enums.position_video_list))

      let currentPlatformType = this.form.platform_type
      let currentPageData = this.page_data ? this.page_data.id : null
      this.positionList = []
      this.position_data = null
      let positionListByPage = []

      if (currentPlatformType == platformTypeEnum.MOBILE) {
        if (currentPageData == pageEnum.HOME) {
          positionListByPage = list.MOBILE.HOME
        }
      }

      this.positionList = positionListByPage
      if(positionListByPage.length == 1){
        this.position_data = positionListByPage[0]
      }

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    onChangeOptionPosition() {
      this.askWhenDeleteVideoNotEmpty('position')
    },
    askWhenDeleteVideoNotEmpty(onChangeType) {
      if (
        this.videoList.length > 0 &&
        this.$helpers.nullToVoid(this.form.platform_type) != '' &&
        this.pageList.length > 0 &&
        this.positionList.length > 0
      ) {
        this.isClearVideoList = true

        swal
          .fire({
            title: this.$t('are_you_sure'),
            text:
              this.$i18n.locale == 'en'
                ? 'It will delete the video below.'
                : this.$i18n.locale == 'kh'
                  ? 'វានឹងលុបវីដេអូខាងក្រោមចោល។'
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
              this.isClearVideoList = true
              //Clear Video List
              this.clearVideoList()
            } else if (result.isDismissed) {
              this.isClearVideoList = false
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

      //Clear Error Message On Input
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    preventClickEvent(evt) {
      evt.stopPropagation();
    }
  },
}
</script>
<style lang="scss" scoped>
.box-add-banner {
  height: 540px !important;
  max-height: 540px !important;

  .select-banner-text {
    margin-top: 200px !important;
  }

}
</style>
