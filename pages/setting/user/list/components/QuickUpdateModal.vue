<template>
  <b-modal
    id="modal"
    ref="userModal"
    v-model="modal"
    scrollable
    centered
    no-close-on-backdrop
    no-close-on-esc
    :title="modalHeader"
    :form-item="formItem"
    :modal-type="modalType"
    hide-header-close
    @hidden="clearForm"
    size="lg"
  >
    <!-- Start modal-cropper-image Component -->
    <div v-if="modalShowCropperImage">
      <modal-cropper-image
        :modal-show="modalShowCropperImage"
        :target-file="targetFile"
        :aspect-ratio="1.03 / 1"
        :preview-width="350"
        :preview-height="350"
        :buttonOptions="{
                    flipX: true,
                    flipY: true,
                    rotatePlus90: true,
                    rotateMinus90: true,
                }"
        @closeModal="closeModalCropperImage"
        @save="saveModalCropperImage"
      />
    </div>
    <!-- End modal-cropper-image Component -->

    <b-form>
      <b-row>
        <!--image-->
        <b-col lg="4" md="4" sm="12" class="text-center">
          <div v-if="$helpers.nullToVoid(form.image) == ''">
            <i
              id="image"
              class="simple-icon-picture"
              style="font-size: 80px; color: rgba(0, 0, 0, 0.54)"
            ></i>

            <b-tooltip target="image" :title="$t('image')"/>
          </div>
          <div v-else style="margin-bottom: 20px">
            <b-img
              :src="imagePath + form.image"
              width="155"
              height="155"
              rounded
              style="margin-top: 20px"
            />
          </div>
          <div class="mb-2">
            <b>{{ $t('image_size') }}: </b>
            <span>350px&nbsp; X &nbsp;350px</span>
            <div> {{ $t('less_than') }} 15MB</div>
          </div>
          <b-button variant="outline-primary" @click="chooseImage">
            {{ $t('choose_file') }}
          </b-button>
          <input
            ref="fileInput"
            style="display: none"
            type="file"
            accept=".png, .jpg"
            :multiple="false"
            @change="onFileChange"
          />
        </b-col>
        <b-col lg="8" md="8" sm="12">
          <!--full_name-->
          <b-form-group
            :invalid-feedback="veeErrors.first('full_name')"
            :state="!veeErrors.has('full_name')"
            :label="$t('full_name')"
            label-for="full_name"
            class="required"
            label-class="control-label"
          >
            <b-form-input
              autocomplete="off"
              id="full_name"
              v-model="form.full_name"
              v-validate="'required|max:50'"
              :state="veeErrors.has('full_name') ? false : null"
              data-vv-name="full_name"
              type="text"
              required
              :readonly="inProgress"
              :placeholder="$t('full_name')"
              @keydown.enter="save"
            />
          </b-form-group>
          <!--username-->
          <b-form-group
            :invalid-feedback="veeErrors.first('username')"
            :state="!veeErrors.has('username')"
            :label="$t('username')"
            label-for="username"
            class="required"
            label-class="control-label"
          >
            <b-form-input
              autocomplete="off"
              id="username"
              v-model="form.username"
              v-validate="'required|alpha_dash|max:50'"
              :state="veeErrors.has('username') ? false : null"
              data-vv-name="username"
              :data-vv-as="$t('username')"
              type="text"
              required
              :readonly="inProgress"
              :placeholder="$t('username')"
              @keydown.enter="save"
            />
          </b-form-group>
          <!--password-->
          <b-form-group
            :invalid-feedback="veeErrors.first('password')"
            :state="!veeErrors.has('password')"
            :label="$t('password')"
            label-for="password"
            description="​លេខសំងាត់នឹងមិនបានកែប្រែទេ ប្រសិនបើទុកវាទទេរ."
            :class="modalType == 1 ? 'required' : ''"
            label-class="control-label"
          >
            <b-form-input
              id="password"
              v-model="form.password"
              v-validate="'min:6|max:50'"
              type="password"
              autocomplete="off"
              :state="veeErrors.has('password') ? false : null"
              data-vv-name="password"
              :data-vv-as="$t('password')"
              :placeholder="$t('password')"
              :readonly="inProgress"
              @keydown.enter="save"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <template slot="modal-footer">
      <b-button
        size="xs"
        variant="outline-secondary"
        :disabled="inProgress"
        @click="modal = false"
      >{{ $t('cancel') }}
      </b-button
      >
      <b-button
        size="xs"
        variant="primary"
        :disabled="inProgress"
        @click="save"
      >{{ modalOk }}
      </b-button
      >
    </template>
  </b-modal>
</template>
<script>
import {mapGetters} from 'vuex'
import swal from 'sweetalert2'

export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ModalCropperImage: () => import('~/components/ModalCropperImage'),
  },
  data() {
    return {
      form: {
        id: null,
        username: null,
        full_name: null,
        image: null,
        old_image: null,
        password: null,
      },
      defaultForm: {
        id: null,
        username: null,
        full_name: null,
        image: null,
        old_image: null,
        password: null,
      },
      passwordValidate: 'required|min:6|max:50',
      modal: false,
      isRefresh: false,
      inProgress: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      modalShowCropperImage: false,
      targetFile: null,
      aspectRatio: null,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      companies: 'company/companies',
      warehouses: 'warehouse/getWarehouses',
      authLevel: 'auth/authLevel',
      userLevel: 'user_type/level',
      userTypes: 'user_type/getUserType',
      type_id: 'user_type/USER_TYPE_ID',
      sale_agent: 'sale_agent/getSaleAgent',
    }),
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('user')}`
        : `${this.$t('update')} ${this.$t('user')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  watch: {
    modalType: {
      handler(val) {
        if (val == 1) {
          this.modal = true
          this.imagePath = this.apiUrl + 'images/users/'
        } else if (val == 2) {
          this.setData()
          this.modal = true
          this.imagePath = this.apiUrl + 'images/users/'
        }
      },
      immediate: true,
    },
  },
  methods: {
    save(evt) {
      let vm = this
      evt.preventDefault()
      vm.$validator.validateAll().then((result) => {
        if (result) {
          vm.inProgress = true
          let input = this.form

          let url = 'user/store'
          if (vm.modalType == 2) {
            url = 'user/update'
          }
          vm.$axios
            .$post(url, input)
            .then((response) => {
              vm.isRefresh = true
              vm.modal = false
              vm.inProgress = false

              vm.$notify('success', vm.$t('user'), vm.$t('done'))
              vm.get()
            })
            .catch((error) => {
              vm.inProgress = false
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('user'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    setData() {
      this.form = Object.assign({}, this.formItem)
      this.form.old_image = this.form.image
    },
    clearForm() {
      let vm = this
      vm.form = Object.assign({}, vm.defaultForm)
      setTimeout(() => {
        vm.veeErrors.clear()
      }, 50)
      vm.$emit('closeModal', vm.isRefresh)
      vm.isRefresh = false
    },
    chooseImage() {
      this.$refs.fileInput.click()
    },
    onFileChange($event) {
      let vm = this

      const files = $event.target.files || $event.dataTransfer.files

      if (files[0].size > 15000000) {
        vm.$refs.fileInput.value = ''
        vm.$notify(
          'warning',
          vm.$t('image'),
          vm.$i18n.locale == 'en'
            ? 'Image file must be less than 15 MB.'
            : vm.$i18n.locale == 'kh'
              ? 'ទំហំរូបភាពត្រូវតែតិចជាង ១៥ មេកាបៃ'
              : ''
        )
        return
      } else {
        vm.targetFile = $event
        vm.aspectRatio = 1 / 1
        vm.openModalCropperImage()
      }
    },
    openModalCropperImage() {
      this.modalShowCropperImage = true
    },
    closeModalCropperImage(data) {
      this.modalShowCropperImage = false
      this.$refs.fileInput.value = ''
      this.targetFile = null
    },
    saveModalCropperImage(base64) {
      this.imagePath = ''
      this.form.image = base64
      this.closeModalCropperImage()
    },
  },
}
</script>
