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
      <b-col xl="6" lg="6" md="6">
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
                <b-form-select-option :value="enums.business_type.SHOP_RETAIL"
                  >{{ $t('shop_retail') }}
                </b-form-select-option>
                <b-form-select-option
                  :value="enums.business_type.SHOP_WHOLESALE"
                  >{{ $t('shop_wholesale') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.RESTAURANT"
                  >{{ $t('restaurant') }}
                </b-form-select-option>
                <b-form-select-option
                  :value="enums.business_type.SHOP_LOCAL_PRODUCT"
                  >{{ $t('shop_local_product') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.SERVICE"
                  >{{ $t('service') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.MODERN_COMMUNITY"
                >{{ $t('modern_community') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col
            xl="12"
            lg="12"
            v-for="app_country in appCountryList"
            :key="app_country.id"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first(app_country.key)"
              :state="!veeErrors.has(app_country.key)"
              :label="$t(app_country.key)"
              :label-for="app_country.key"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="app_country.value"
                v-validate="'required'"
                :state="veeErrors.has(app_country.key) ? false : null"
                :data-vv-name="app_country.key"
                :data-vv-as="$t(app_country.key)"
                type="text"
                :placeholder="$t(app_country.key)"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <b-col xl="6" lg="6" md="6">
        <b-row>
          <!-- Image Block -->
          <b-col xl="12" class="mb-5">
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
              <b-button
                variant="outline-primary"
                @click="chooseImage"
                class="ml-2"
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
          <b-col cols="12" lg="12" xl="12">
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
                <b-form-select-option
                  :value="enums.business_category_status.ENABLE"
                  >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option
                  :value="enums.business_category_status.DISABLE"
                  >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
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
    appCountryList: {
      type: Array,
      default: () => {
        return {}
      },
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        business_type_id: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null,
      },
      defaultForm: {
        id: null,
        name: null,
        business_type_id: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null,
      },
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      listItems: {},
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if (val == 1) {
          this.imagePath = null
          this.modal = true
          this.getAutoOrder()
        } else if (val == 2) {
          this.imagePath = this.apiUrl + 'images/shop/category/'
          this.modal = true
          this.setData()
        }
      },
      immediate: true,
    },
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('shop_category')}`
        : `${this.$t('update')} ${this.$t('shop_category')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  methods: {
    setData() {
      this.form = Object.assign({}, this.formData)
      this.form.old_image = this.form.image

      let translate = JSON.parse(this.formData.name)
      this.appCountryList = this.appCountryList.map((ele, index) => {
        return {
          key: ele.key,
          value: translate[ele.key] !== undefined ? translate[ele.key] : '',
          index: index
        };
      });

      if (this.formData.status == 'true') {
        this.form.status = this.enums.business_category_status.ENABLE
      } else {
        this.form.status = this.enums.business_category_status.DISABLE
      }
    },
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'shop_category/store'
          if (this.modalType == 2) {
            url = 'shop_category/update'
          }
          let input = vm.form
          let temp ={}
          this.appCountryList.map((el) => {
           temp = {...temp,
              [el.key]: el.value
            }
          })
          input.name = JSON.stringify(temp)

          vm.$axios.$post(url, input).then(({ data }) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('shop_category'), vm.$t('done'))
          })
          console.log(this.appCountryList);
        } else {
          vm.$notify(
            'warning',
            vm.$t('shop_category'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    clearForm() {
      this.modal = false
      this.form = Object.assign({}, this.defaultForm)

      if (Array.isArray(this.appCountryList)) {
        this.appCountryList.forEach(item => {
          if (item && typeof item === 'object' && 'value' in item) {
            item.value = null;
          }
        });
      }

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
      } else {
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
    getAutoOrder() {
      let vm = this
      vm.$axios
        .$post('shop_category/get_auto_order', { loading: true })
        .then(({ data }) => {
          vm.form.order = data
        })
    }
  },
}
</script>
