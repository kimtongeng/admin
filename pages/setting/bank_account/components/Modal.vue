<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    size="lg"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    :title="modalHeader"
  >

    <!-- Start modal-cropper-image Component -->
    <div v-if="modalShowCropperImage">
      <modal-cropper-image
        :modal-show="modalShowCropperImage"
        :target-file="targetFile"
        :aspect-ratio="1/1"
        :preview-width="350"
        :preview-height="350"
        :cropBoxResizable="false"
        @closeModal="closeModalCropperImage"
        @save="saveModalCropperImage"
      />
    </div>
    <!-- End modal-cropper-image Component -->

    <b-row>
      <!-- Form Block -->
      <b-col cols="12" sm="12" md="7" xl="8">
        <b-row>
          <!-- bank_id -->
          <b-col
            cols="12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('bank')"
              :state="!veeErrors.has('bank')"
              :label="$t('bank')"
              label-for="property_detail"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="bank_data"
                v-validate="'required'"
                data-vv-name="bank"
                :data-vv-as="$t('bank')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="bankList"
                :placeholder="$t('bank')"
                @reset="resetBankListSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- account_name -->
          <b-col
            cols="12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('account_name')"
              :state="!veeErrors.has('account_name')"
              :label="$t('account_name')"
              label-for="account_name"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.account_name"
                v-validate="'required'"
                :state="veeErrors.has('account_name') ? false : null"
                data-vv-name="account_name"
                :data-vv-as="$t('account_name')"
                type="text"
                required
                :placeholder="$t('account_name')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- account_number -->
          <b-col
            cols="12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('account_number')"
              :state="!veeErrors.has('account_number')"
              :label="$t('account_number')"
              label-for="account_number"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.account_number"
                v-validate="'required|numeric'"
                :state="veeErrors.has('account_number') ? false : null"
                data-vv-name="account_number"
                :data-vv-as="$t('account_number')"
                type="number"
                min="0"
                required
                :placeholder="$t('account_number')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col
            cols="12"
          >
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
                @keydown.enter="save"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('status') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.bank_account_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.bank_account_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <!-- Image Block -->
      <b-col cols="12" sm="12" md="5" xl="4" class="text-center">
        <div v-if="$helpers.nullToVoid(form.account_qr_code) == ''" class="text-center">
          <i
            id="image"
            class="simple-icon-picture"
            style="font-size: 80px; color: rgba(0, 0, 0, 0.54)"
          ></i>
        </div>
        <div v-else class="text-center" style="margin-bottom: 20px">
          <b-img
            :src="imagePath + form.account_qr_code"
            alt="image"
            width="155"
            height="155"
            style="margin-top: 20px"
          />
        </div>

        <div class="text-center">
          <div class="mb-2">
            <b>{{ $t('image_size') }}: </b>
            <template>
              <span>350px&nbsp; X &nbsp;350px</span>
              <div class="mt-1">{{ $t('less_than') }} 15MB</div>
            </template>
          </div>

          <b-button variant="outline-primary" @click="chooseImage" class="ml-2"
          >{{ $t('choose_image_qr_code') }}
          </b-button>
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

    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="clearForm"
      >{{ $t('cancel') }}
      </b-button>
      <b-button size="xs" variant="primary" @click="save"
      >{{ modalOk }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import swal from "sweetalert2";

export default {
  components: {
    ModalCropperImage: () => import('~/components/ModalCropperImage'),
  },
  props: {
    formFilter: {
      type: Object,
      default:
        () => {
          return {}
        },
    },
    formItem: {
      type: Object,
      default:
        () => {
          return {}
        },
    },
    modalType: {
      type: Number,
      default:
        0,
    },
    bankList: {
      type: Array,
      default:
        () => {
          return []
        },
    },
  },
  data() {
    return {
      form: {
        id: null,
        contact_id: null,
        contact_type: null,
        bank_id: null,
        account_name: null,
        account_number: null,
        account_qr_code: null,
        old_account_qr_code: null,
        status: 1,
      },
      defaultForm: {
        id: null,
        contact_id: null,
        contact_type: null,
        bank_id: null,
        account_name: null,
        account_number: null,
        account_qr_code: null,
        old_account_qr_code: null,
        status: 1,
      },
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      listItems: {},
      bank_data: null,
      targetFile: null,
      modalShowCropperImage: false,
      modalTypeCropperImage: 0,
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('bank_account')}`
        : `${this.$t('update')} ${this.$t('bank_account')}`
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
        } else if (val == 2) {
          this.imagePath = this.apiUrl + 'images/bank_qr_code/'

          this.setData()
          this.modal = true
        }
      },
      immediate: true,
    },
  },
  methods: {
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'bank_account/store'
          if (this.modalType == 2) {
            url = 'bank_account/update'
          }
          let input = JSON.parse(JSON.stringify(vm.form))

          if (vm.$helpers.nullToVoid(input.account_qr_code) == '') {
            swal.fire({
              icon: 'warning',
              title: vm.$t('bank_account'),
              text:
                vm.$i18n.locale == 'en'
                  ? 'Please Upload QR Code.'
                  : vm.$i18n.locale == 'kh'
                    ? 'សូមបង្ហោះរូបភាព QR Code'
                    : '',
            })
            return
          }

          input.page = vm.formFilter.page
          input.table_size = vm.formFilter.table_size
          input.filter = vm.formFilter.filter


          if (vm.$helpers.nullToVoid(vm.bank_data) != '') {
            input.bank_id = vm.bank_data.id
          }

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data

            vm.clearForm()

            vm.$notify('success', vm.$t('bank_account'), vm.$t('done'))
          })
        } else {
          this.$notify(
            'warning',
            this.$t('bank_account'),
            this.$t('validation_failed')
          )
        }
      })
    },
    setData() {
      this.form = Object.assign({}, this.formItem)
      this.form.old_account_qr_code = this.formItem.account_qr_code

      if(this.formItem.status == "true"){
        this.form.status = this.enums.bank_account_status.ENABLE;
      }else {
        this.form.status = this.enums.bank_account_status.DISABLE;
      }

      let bankItem = this.bankList.find(
        (obj) => obj.id == this.formItem.bank_id
      )
      if (this.$helpers.nullToVoid(bankItem) != '') {
        this.bank_data = bankItem
      } else {
        this.bank_data = null
      }
    },
    clearForm() {
      this.modal = false
      this.form = Object.assign({}, this.defaultForm)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.$emit('closeModal', this.listItems)

      this.listItems = {}
      this.bank_data = null
    },
    resetBankListSelect() {
      this.bank_data = null
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
        vm.openModalCropperImage()
      }
    },
    //Cropper
    openModalCropperImage() {
      this.modalShowCropperImage = true
    },
    saveModalCropperImage(base64) {
      this.imagePath = ''
      this.form.account_qr_code = base64
      this.closeModalCropperImage()
    },
    closeModalCropperImage(data) {
      this.modalShowCropperImage = false
      this.$refs.fileInput.value = ''
      this.targetFile = null
    },
  },
}
</script>
