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
      <!-- Form Input -->
      <b-row>
        <!-- form Block -->
        <b-col xl="8" lg="8" md="7">
          <b-row>
            <!-- business type -->
            <b-col xl="12" lg="12">
              <b-form-group
                :invalid-feedback="veeErrors.first('business_type')"
                :state="!veeErrors.has('business_type')"
                :label="$t('business_type')"
                label-for="business_type"
                label-class="control-label"
                class="required"
              >
                <b-form-select
                  v-model="form.business_type_id"
                  v-validate="'required'"
                  :state="veeErrors.has('business_type') ? false : null"
                  data-vv-name="business_type"
                  :data-vv-as="$t('business_type')"
                  type="text"
                  :placeholder="$t('business_type')"
                >
                  <template slot="first">
                    <b-form-select-option :value="null" disabled
                    >{{ $t('please_select') }}
                    </b-form-select-option>
                  </template>
                  <b-form-select-option :value="enums.business_type.CHARITY_ORGANIZATION">
                    {{ $t('charity_donor') }}
                  </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </b-col>
  
            <!-- name -->
            <b-col xl="12" lg="12">
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
                  <b-form-select-option :value="enums.business_category_status.ENABLE"
                  >{{ $t('enable') }}
                  </b-form-select-option>
                  <b-form-select-option :value="enums.business_category_status.DISABLE"
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
          business_type_id: 10,
          order: 0,
          status: 1,
          image: null,
          old_image: null
        },
        defaultForm: {
          id: null,
          name: null,
          business_type_id: null,
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
            this.imagePath = this.apiUrl + 'images/charity/category/'
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
          ? `${this.$t('add')} ${this.$t('charity_category')}`
          : `${this.$t('update')} ${this.$t('charity_category')}`
      },
      modalOk() {
        return this.modalType == 1 ? this.$t('save') : this.$t('update')
      },
    },
    methods: {
      setData(){
        this.form = Object.assign({}, this.formData)
        this.form.old_image = this.form.image
  
        if(this.formData.status == "true"){
          this.form.status = this.enums.business_category_status.ENABLE;
        }else {
          this.form.status = this.enums.business_category_status.DISABLE;
        }
      },
     save(evt) {
        // prevent close popup
        evt.preventDefault()
        // check validation
        let vm = this
        vm.$validator.validateAll().then((result) => {
          if (result) {
            let url = 'charity_category/store'
            if (this.modalType == 2) {
              url = 'charity_category/update'
            }
            let input = vm.form
  
            vm.$axios.$post(url, input).then(({data}) => {
              vm.listItems = data
              vm.clearForm()
              vm.$notify('success', vm.$t('charity_category'), vm.$t('done'))
            })
          } else {
            vm.$notify(
              'warning',
              vm.$t('charity_category'),
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
        vm.$axios.$post('charity_category/get_auto_order', {loading: true}).then(({data}) => {
          vm.form.order = data
        })
      }
    },
  }
  </script>
  