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
    <b-row>
      <b-col xl="8" lg="8" md="5">
        <b-row>
          <!--  name -->
          <b-col xl="12" lg="12" cols="12">
            <b-form-group
              :invalid-feedback="veeErrors.first('name')"
              :state="!veeErrors.has('name')"
              :label="$t('name')"
              label-for="name"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.name"
                v-validate="'required'"
                :state="veeErrors.has('name') ? false : null"
                data-vv-name="name"
                :data-vv-as="$t('name')"
                type="text"
                :placeholder="$t('name')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- optional name -->
          <b-col xl="12" lg="12" cols="12">
            <b-form-group
              :invalid-feedback="veeErrors.first('optional_name')"
              :state="!veeErrors.has('optional_name')"
              :label="$t('optional_name')"
              label-for="optional_name"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.optional_name"
                v-validate="'required'"
                :state="veeErrors.has('optional_name') ? false : null"
                data-vv-name="optional_name"
                :data-vv-as="$t('optional_name')"
                type="text"
                :placeholder="$t('optional_name')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col
            cols="12" lg="12" xl="12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('has_transaction')"
              :state="!veeErrors.has('has_transaction')"
              :label="$t('has_transaction')"
              label-for="has_transaction"
              label-class="control-label"
              class="required"
            >
              <b-form-select
                v-model="form.has_transaction"
                v-validate="'required'"
                :state="veeErrors.has('has_transaction') ? false : null"
                data-vv-name="has_transaction"
                :data-vv-as="$t('has_transaction')"
                type="text"
                :placeholder="$t('has_transaction')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('has_transaction') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.business_type_has_transaction.YES"
                >{{ $t('charge') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type_has_transaction.NO"
                >{{ $t('free_charge') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- app_fee -->
          <b-col xl="12" lg="12">
            <b-form-group
              :label="$t('app_fee')"
              label-for="app_fee"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.app_fee"
                type="text"
                :placeholder="$t('app_fee')"
                :disabled="$helpers.nullToVoid(form.has_transaction) != enums.business_type_has_transaction.YES"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- order -->
          <b-col xl="12" lg="12">
            <b-form-group
              :label="$t('order_number')"
              label-for="order_number"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.order"
                type="number"
                min="0"
                :placeholder="$t('order_number')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col
            cols="12" lg="12" xl="12"
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
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('status') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.business_type_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

    <!-- Image Block -->
      <b-col xl="4" lg="4" md="5">
        <div v-if="$helpers.nullToVoid(form.image) == ''" class="text-center">
          <i
            id="image"
            class="simple-icon-picture"
            style="font-size: 130px; color: rgba(0, 0, 0, 0.54)"
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
          <b-button variant="outline-primary" @click="chooseImage" class="ml-2"
          >{{ $t('choose_image') }}
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
export default {
  props: {
    formData: {
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
  data() {
    return {
      form: {
        id: null,
        name: null,
        has_transaction: 1,
        app_fee: null,
        optional_name: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null
      },
      defaultForm: {
        id: null,
        name: null,
        has_transaction: null,
        app_fee: null,
        optional_name: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null
      },
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      listItems: {}
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if(val == 1) {
          this.imagePath = null
          this.modal = true
          this.getAutoOrder()
        }else if(val == 2) {
          this.imagePath = this.apiUrl + 'images/business_type/'
          this.modal = true
          this.setData()
        }
      },
      immediate: true,
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('business_type')}`
        : `${this.$t('update')} ${this.$t('business_type')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  methods: {
    setData(){
      console.log(this.formData);
      this.form = Object.assign({}, this.formData)
      this.form.old_image = this.form.image

      this.form.name = this.$helpers.getNameByLocal(
        this.formData.name,'local_name'
      )

      this.form.optional_name = this.$helpers.getNameByLocal(
        this.formData.name,'latin_name'
      )

      if(this.formData.has_transaction == this.enums.business_type_has_transaction.NO) {
        this.form.app_fee = null
      }

      if(this.formData.show == "true"){
        this.form.status = this.enums.business_type_status.ENABLE;
      }else {
        this.form.status = this.enums.business_type_status.DISABLE;
      }
    },
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'business_type/store'
          if (this.modalType == 2) {
            url = 'business_type/update'
          }

          if (vm.$helpers.nullToVoid(vm.form.app_fee) == '') {
            vm.form.app_fee = 0
          }

          let input = JSON.parse(JSON.stringify(vm.form))
          input.name = JSON.stringify({
            local_name: this.form.name,
            latin_name: this.form.optional_name
          })

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('business_type'), vm.$t('done'))
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('business_type'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    clearForm() {
      this.modal = false
      this.form = Object.assign({}, this.defaultForm)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.$emit('closeModal', this.listItems)
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
      }else {
        var reader = new FileReader()
        reader.onload = function (e) {
            vm.imagePath = ''
            vm.form.image = ''
            vm.form.image = e.target.result
            vm.$refs.fileInput.value = ''
        }
        reader.readAsDataURL(files[0])
      }
    },
    getAutoOrder(){
      let vm = this
      vm.$axios.$post('business_type/get_auto_order', {loading: true}).then(({data}) => {
        vm.form.order = data
      })
    }
  }
}
</script>
