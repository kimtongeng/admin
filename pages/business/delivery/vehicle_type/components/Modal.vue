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

      <b-col xl="6" lg="6" md="6">
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
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <!-- Vehicle Distance Price -->
      <b-col cols='12'>
        <b-button class='mb-3' variant='outline-primary' size='sm' @click='addValues'>
          <i class="simple-icon-plus"></i>
          <span v-if="$store.state.lang.locale == 'en'"> Add Vehicle Distance Price </span>
          <span v-if="$store.state.lang.locale == 'kh'"> បង្កើតតម្លៃ ចម្ងាយយានយន្ត </span>
        </b-button>
        <b-row v-for='(option, index) in form.vehicle_price' :key='index' class='border-bottom mb-3'>
          <!--action-->
          <b-col cols='2' class='pl-0 d-flex align-items-right'>
            <b-button variant='link' @click='removeValue(option,index)' style="font-size: 22px; text-decoration: none; color: red;">
              <i class="simple-icon-trash"></i>
            </b-button>
          </b-col>
          <!--name-->
          <b-col>
            <!--min_distance-->
            <b-form-group
              :label="index == 0 ? $t('min_distance') : ''"
            >
              <b-form-input
                v-model='option.min_distance'
                v-validate="'required|max:100'"
                type='number'
                required
                @keydown.enter='addValues'
              />
            </b-form-group>
          </b-col>

          <b-col>
            <!--max_distance-->
            <b-form-group
              :label="index == 0 ? $t('max_distance') : ''"
            >
              <b-form-input
                v-model='option.max_distance'
                v-validate="'required|max:100'"
                type='number'
                required
                @keydown.enter='addValues'
              />
            </b-form-group>
          </b-col>

          <!--price-->
          <b-col>
            <b-form-group
              :label="index == 0 ? $t('distance_price') : ''"
            >
              <b-form-input
                v-model='option.price'
                v-validate="'required|max:100'"
                type='number'
                required
                @keydown.enter='addValues'
              />
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
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null,
        vehicle_price: [],
      },
      defaultForm: {
        id: null,
        name: null,
        order: 0,
        status: 1,
        image: null,
        old_image: null,
        vehicle_price: [],
      },
      deleted_vehicle_price: [],
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
          this.imagePath = this.apiUrl + 'images/delivery/vehicle/'
          this.modal = true
          this.setData()
        }
        //
        if (this.form.vehicle_price.length == 0) {
          this.addValues()
        }
      },
      immediate: true,
    },
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('vehicle_type')}`
        : `${this.$t('update')} ${this.$t('vehicle_type')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  methods: {
    setData() {
      this.form = Object.assign({}, this.formData)
      this.form.old_image = this.form.image
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
          let url = 'vehicle_type/store'
          if (this.modalType == 2) {
            url = 'vehicle_type/update'
          }
          let input = vm.form
          if (vm.$helpers.nullToVoid(vm.deleted_vehicle_price) != '') {
            input.deleted_vehicle_price = vm.deleted_vehicle_price
          }

          //check duplicated min_distance & max_distance
          const checkDuplicate =  input.vehicle_price.some((item, index) => {
            return input.vehicle_price.find((otherItem, otherIndex) => {
              return otherIndex !== index && item['min_distance'] === otherItem['min_distance'] && item['max_distance'] === otherItem['max_distance'];
            });
          });

          if (checkDuplicate) {
            this.$notify(
              'warning',
              this.$t('vehicle_price'),
              this.$t('validation_failed')
            )
            return
          }

          vm.$axios.$post(url, input).then(({ data }) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('vehicle_type'), vm.$t('done'))
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('vehicle_type'),
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
        .$post('vehicle_type/get_auto_order', { loading: true })
        .then(({ data }) => {
          vm.form.order = data
        })
    },
    addValues() {
      this.form.vehicle_price.push(
        {min_distance: null, max_distance: null,  price: 0}
      )
    },
    removeValue(item,index) {
      if (item.id != null) {
        this.deleted_vehicle_price.push({id: item.id})
      }
      this.$delete(this.form.vehicle_price, index)
    }
  },
}
</script>
