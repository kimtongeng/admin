<template>
  <div>
    <!-- Start modal-cropper-image Component -->
    <div v-if="modalShowCropperImage">
      <modal-cropper-image
        :modal-show="modalShowCropperImage"
        :target-file="targetFile"
        :aspect-ratio="aspectRatio"
        :preview-width="cropWidth"
        :preview-height="cropHeight"
        :cropBoxResizable="false"
        @closeModal="closeModalCropperImage"
        @save="saveModalCropperImage"
      />
    </div>
    <!-- End modal-cropper-image Component -->

    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2">
        <b-col cols="6" xl="6">
          <div class="page-title">
            <nuxt-link :to="makeLink('/notifications/broadcast')">{{
                $t('broadcast')
              }}
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
            v-if="checkModuleAuthorize('broadcast', 'create') && paramAction == formAction.ADD"
          >
            <b-button
              size="xs"
              variant="primary"
              @click="save($event, formAction.ADD)"
            >
              <i class="simple-icon-plus"></i>
              {{ $t('save') }}
            </b-button>

            <b-button
              v-if="checkModuleAuthorize('broadcast', 'send')"
              size="xs"
              variant="primary"
              @click="save($event, formAction.ADD_SEND)"
            >
              <i class="simple-icon-plus"></i>
              {{ $t('save_and_send') }}
            </b-button>
          </template>

          <template
            v-else-if="checkModuleAuthorize('broadcast', 'update') && paramAction == formAction.UPDATE"
          >
            <b-button
              size="xs"
              variant="primary"
              @click="save($event, formAction.UPDATE_ADD)"
            >
              <i class="simple-icon-pencil mr"></i>
              {{ $t('updateAndAdd') }}
            </b-button
            >

            <b-button
              v-if="checkModuleAuthorize('broadcast', 'send')"
              size="xs"
              variant="primary"
              @click="save($event, formAction.UPDATE_SEND)"
            >
              <i class="simple-icon-pencil mr"></i>
              {{ $t('update_and_send') }}
            </b-button>

            <b-button
              size="xs"
              variant="primary"
              @click="save($event, formAction.UPDATE)"
            >
              <i class="simple-icon-pencil mr"></i>
              {{ $t('update') }}
            </b-button>
          </template>
        </b-col>
      </b-row>
      <div class="separator mb-4"></div>
    </div>

    <b-card class="shadow">
      <!-- Image Block -->
      <b-row>
        <b-col cols="12" class="text-center">
          <div
            v-if="$helpers.nullToVoid(form.image) == ''"
            class="text-center"
          >
            <i
              id="image"
              class="simple-icon-picture"
              style="font-size: 80px; color: rgba(0, 0, 0, 0.54)"
            ></i>
          </div>
          <div v-else class="text-center" style="margin-bottom: 20px">
            <b-img
              :src="imagePath + form.image"
              alt="image"
              width="155"
              height="155"
              style="margin-top: 20px"
            />
          </div>

          <div class="text-center">
            <div class="mb-2">
              <b>{{ $t('image_size') }}: </b>
              <span>1200px&nbsp; X &nbsp;700px</span>
              <div>{{ $t('less_than') }} 300KB</div>
            </div>
            <b-button
              variant="outline-primary"
              @click="chooseImage"
              class="ml-2"
            >{{ $t('choose_image') }}
            </b-button
            >
            <input
              ref="fileInput"
              style="display: none"
              type="file"
              accept=".jpeg, .jpg, .png, .gif"
              :multiple="false"
              @change="onFileChange"
            />
          </div>
        </b-col>
      </b-row>

      <!-- Form Block -->
      <b-row>
        <!-- title -->
        <b-col cols="12">
          <b-form-group
            :invalid-feedback="veeErrors.first('title')"
            :state="!veeErrors.has('title')"
            :label="$t('title')"
            label-for="title"
            class="required"
            label-class="control-label"
          >
            <b-form-input
              autocomplete="off"
              v-model="form.title"
              v-validate="'required'"
              :state="veeErrors.has('title') ? false : null"
              data-vv-name="title"
              :data-vv-as="$t('title')"
              type="text"
              :placeholder="$t('title')"
              @keydown.enter="send"
            />
          </b-form-group>
        </b-col>

        <!-- type -->
        <b-col cols="12">
          <b-form-group
            :invalid-feedback="veeErrors.first('type')"
            :state="!veeErrors.has('type')"
            :label="$t('type')"
            label-for="type"
            label-class="control-label"
            class="required"
          >
            <b-form-select
              v-model="form.contact_noti_type"
              v-validate="'required'"
              :state="veeErrors.has('type') ? false : null"
              data-vv-name="type"
              :data-vv-as="$t('type')"
              :placeholder="$t('type')"
              @change="onChangeType"
            >
              <template slot="first">
                <b-form-select-option :value="null">{{
                    $t('please_select')
                  }}
                </b-form-select-option>
              </template>
              <b-form-select-option
                v-for="(obj, index) in enums.contact_noti_type_list"
                :key="index"
                :value="obj.id"
              >
                {{ $t(obj.name) }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>

        <!-- link -->
        <b-col
          cols="12"
          v-if="notiType == enums.contact_noti_type.LINK"
        >
          <b-form-group
            :invalid-feedback="veeErrors.first('link')"
            :state="!veeErrors.has('link')"
          >
            <label class="control-label" for="link">
              <span>{{ $t('link') }}</span>
              <span style="color: red"> *</span>
              <span class="text-muted"
              >http://www.example.com</span
              >
            </label>

            <b-form-input
              autofocus
              autocomplete="off"
              v-model="form.description"
              v-validate="'required|url_http_or_https'"
              :state="veeErrors.has('link') ? false : null"
              data-vv-name="link"
              :data-vv-as="$t('link')"
              type="text"
              :placeholder="$t('link')"
              @keydown.enter="send"
            />
          </b-form-group>
        </b-col>

        <!-- property_detail -->
        <b-col
          cols="12"
          v-if="notiType == enums.contact_noti_type.PROPERTY_DETAIL"
        >
          <b-form-group
            :invalid-feedback="veeErrors.first('property_detail')"
            :state="!veeErrors.has('property_detail')"
            :label="$t('property_detail')"
            label-for="property_detail"
            label-class="control-label"
            class="required"
          >
            <b-multi-select
              v-model="form.reference_id"
              v-validate="'required'"
              data-vv-name="property_detail"
              :data-vv-as="$t('property_detail')"
              :multiple="false"
              label="name"
              track-by="name"
              :options="propertyList"
              :placeholder="$t('property_detail')"
              @reset="resetPropertyDetailSelect"
            ></b-multi-select>
          </b-form-group>
        </b-col>

        <!-- property_type -->
        <b-col
          cols="12"
          v-if="notiType == enums.contact_noti_type.PROPERTY_TYPE"
        >
          <b-form-group
            :invalid-feedback="veeErrors.first('property_type')"
            :state="!veeErrors.has('property_type')"
            :label="$t('property_type')"
            label-for="property_type"
            label-class="control-label"
            class="required"
          >
            <b-multi-select
              v-model="form.reference_id"
              v-validate="'required'"
              data-vv-name="property_type"
              :data-vv-as="$t('property_type')"
              :multiple="false"
              label="name"
              track-by="name"
              :options="propertyTypeList"
              :placeholder="$t('property_type')"
              @reset="resetPropertyTypeSelect"
            ></b-multi-select>
          </b-form-group>
        </b-col>

        <!-- description -->
        <b-col
          cols="12"
          v-if="notiType != enums.contact_noti_type.LINK"
        >
          <b-form-group
            :invalid-feedback="veeErrors.first('description')"
            :state="!veeErrors.has('description')"
            :label="$t('description')"
            label-for="description"
            class="required"
            label-class="control-label"
          >
            <b-form-textarea
              autocomplete="off"
              v-model="form.description"
              v-validate="notiType == enums.contact_noti_type.DETAIL ||
              notiType == enums.contact_noti_type.PROPERTY ||
              notiType == enums.contact_noti_type.PROPERTY_DETAIL ||
              notiType == enums.contact_noti_type.PROPERTY_TYPE
              ? 'required' : ''"
              :state="veeErrors.has('description') ? false : null"
              data-vv-name="description"
              :data-vv-as="$t('description')"
              :placeholder="$t('description')"
              rows="5"
              style="height: 185px"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import swal from 'sweetalert2'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'broadcast',
  head() {
    return {
      title: this.$t('broadcast'),
    }
  },
  components: {
    ModalCropperImage: () => import('~/components/ModalCropperImage'),
  },
  data() {
    return {
      form: {
        id: null,
        title: null,
        description: null,
        contact_noti_type: null,
        contact_id: null,
        reference_id: null,
        image: null,
      },
      defaultForm: {
        id: null,
        title: null,
        description: null,
        contact_noti_type: null,
        contact_id: null,
        reference_id: null,
        image: null,
      },
      paramAction: null,
      formAction: {
        ADD: 'add',
        UPDATE: 'update',
        ADD_SEND: 'add_send',
        UPDATE_SEND: 'update_send',
      },
      apiUrl: process.env.API_URL,
      imagePath: null,
      targetFile: null,
      aspectRatio: null,
      cropWidth: null,
      cropHeight: null,
      modalShowCropperImage: false,
      modalTypeCropperImage: 0,
      notiType: 0,
      modalType: 0,
      isSend: false,
      propertyList: [],
      propertyTypeList: [],
    }
  },
  computed: {
    headTitleForm() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('broadcast')}`
        : `${this.$t('update')} ${this.$t('broadcast')}`
    },
  },
  watch: {
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
    //Set Image Path
    this.imagePath = this.apiUrl + 'images/notification/'

    this.paramAction = this.$route.query.type
    let permission = true

    //Get Select Data On Form
    await this.getSelectData(false)

    if (this.paramAction == this.formAction.ADD) {
      if (this.checkModuleAuthorize('broadcast', 'create')) {
        this.modalType = 1
        this.form.contact_noti_type = this.enums.contact_noti_type.DETAIL
        this.onChangeType()
      } else {
        permission = false
      }
    } else if (this.paramAction == this.formAction.UPDATE) {
      if (this.checkModuleAuthorize('broadcast', 'update')) {
        this.modalType = 2

        //get edit data form update
        await this.getEditData(true)
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
        .$post('broadcast/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.propertyList = data.property
          vm.propertyTypeList = data.property_type
        })
    },
    async getEditData(loading = true) {
      let vm = this

      let input = {
        id: vm.$route.query.id,
        loading: loading,
      }

      await vm.$axios.$post('broadcast/edit', input).then(({data}) => {
        let formItem = data

        vm.form = Object.assign({}, formItem)
        vm.form.old_image = vm.form.image

        if (vm.form.contact_noti_type == vm.enums.contact_noti_type.PROPERTY_DETAIL) {
          //Set Property Detail
          if (vm.$helpers.nullToVoid(formItem.reference_id) != '') {
            let property = vm.propertyList.find((obj) => obj.id == formItem.reference_id)
            if (vm.$helpers.nullToVoid(property) != '') {
              vm.form.reference_id = property
            }
          }
        } else if (vm.form.contact_noti_type == vm.enums.contact_noti_type.PROPERTY_TYPE) {
          //Set Property Type
          if (vm.$helpers.nullToVoid(formItem.reference_id) != '') {
            let propertyType = vm.propertyTypeList.find((obj) => obj.id == formItem.reference_id)
            if (vm.$helpers.nullToVoid(propertyType) != '') {
              vm.form.reference_id = propertyType
            }
          }
        }

        vm.notiType = vm.form.contact_noti_type
      })
    },
    save(evt, saveType = this.formAction.ADD) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'broadcast/store_or_update'

          //Is Send Broadcast Or Not
          if (
            saveType == vm.formAction.ADD_SEND ||
            saveType == vm.formAction.UPDATE_SEND
          ) {
            vm.form.is_send = true
          } else {
            vm.form.is_send = false
          }

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
                swal.close()
                vm.apiSave(saveType, url)
              })
            },
            allowOutsideClick: () => !swal.isLoading(),
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('broadcast'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    apiSave(saveType, url) {
      this.$axios.$post(url, this.setDataToApiSave()).then(({data}) => {
        this.responseFromApiSave(saveType, data)
      })
    },
    setDataToApiSave() {
      let input = Object.assign({}, this.form)

      input.notification_id = this.form.id
      input.action = this.paramAction

      if (this.form.contact_noti_type == this.enums.contact_noti_type.PROPERTY_DETAIL ||
        this.form.contact_noti_type == this.enums.contact_noti_type.PROPERTY_TYPE
      ) {
        input.reference_id = this.form.reference_id.id
      } else {
        input.reference_id = null
      }
      return input
    },
    responseFromApiSave(saveType, response) {
      this.$notify('success', this.$t('broadcast'), this.$t('done'))

      if (saveType == this.formAction.ADD) {
        this.clearForm()
      } else if (
        saveType == this.formAction.ADD_SEND ||
        saveType == this.formAction.UPDATE_SEND
      ) {
        this.clearForm()

        // redirect to post page
        this.$router.push({
          path: this.makeLink('/notifications/broadcast'),
        })
      } else if (saveType == this.formAction.UPDATE) {
        this.clearForm()
        this.getEditData(false)
      } else if (saveType == this.formAction.UPDATE_ADD) {
        this.clearForm()
        this.$router.push({
          path: this.makeLink(
            '/notifications/broadcast/action?type=add'
          ),
        })
      }
    },
    cancelNotDoAction() {
      let vm = this

      swal.fire({
        title: vm.$t('are_you_sure'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('yes'),
        cancelButtonText: vm.$t('close'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            vm.clearForm()
            vm.$router.push({
              path: vm.makeLink('/notifications/broadcast'),
            })
            swal.close()
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    clearForm() {
      this.form = Object.assign({}, this.defaultForm)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
      //Set Image Path
      this.imagePath = this.apiUrl + 'images/notification/'
    },
    onChangeType() {
      this.form.reference_id = null
      this.notiType = this.form.contact_noti_type

      //Want to see empty textbox when equal link
      if (this.notiType == this.enums.contact_noti_type.LINK) {
        this.form.description = null
      }

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
    resetPropertyDetailSelect() {
      this.form.reference_id = null
    },
    resetPropertyTypeSelect() {
      this.form.reference_id = null
    },

    //Image
    chooseImage() {
      this.$refs.fileInput.click()
    },
    onFileChange($event) {
      let vm = this
      const files = $event.target.files || $event.dataTransfer.files

      if (files[0].size > 300000) {
        vm.$refs.fileInput.value = ''
        vm.$notify(
          'warning',
          vm.$t('image'),
          vm.$i18n.locale == 'en'
            ? 'Image file must be less than 300 KB.'
            : vm.$i18n.locale == 'kh'
              ? 'ទំហំរូបភាពត្រូវតែតិចជាង ៣០០ គីឡូ'
              : ''
        )
        return
      } else {
        vm.aspectRatio = 1.71 / 1
        vm.cropWidth = 1200
        vm.cropHeight = 700

        vm.targetFile = $event
        vm.openModalCropperImage()
      }
    },
    //Cropper
    openModalCropperImage() {
      this.modalShowCropperImage = true
    },
    closeModalCropperImage() {
      this.modalShowCropperImage = false
      this.$refs.fileInput.value = ''
      this.targetFile = null
      this.aspectRatio = null
      this.cropWidth = null
      this.cropHeight = null
    },
    saveModalCropperImage(base64) {
      this.imagePath = ''
      this.form.image = base64
      this.closeModalCropperImage()
    },
  },
}
</script>
