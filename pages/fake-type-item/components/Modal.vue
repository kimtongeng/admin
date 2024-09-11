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
                v-model="form.numberOrder"
                type="number"
                min="0"
                :placeholder="$t('order_number')"
                @keydown.enter="save"
              />
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
        numberOrder: 0,
        image: null,
      },
      defaultForm: {
        id: null,
        name: null,
        numberOrder: 0,
        image: null,
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
        } else if (val == 2) {
          this.imagePath = this.apiUrl + 'images/delivery/item_type/'
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
        ? `${this.$t('add')} ${this.$t('item_type')}`
        : `${this.$t('update')} ${this.$t('item_type')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  methods: {
    setData() {
      this.form = Object.assign({}, this.formData)
      this.form.old_image = this.form.image
      
    },
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'typeItemFake'
          if (this.modalType == 2) {
            url = 'typeItemFake/update'
          }
          let input = vm.form
          vm.$axios.$post(url, input).then(({ data }) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('item_type'), vm.$t('done'))
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('item_type'),
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
        .$post('item_type/get_auto_order', { loading: true })
        .then(({ data }) => {
          vm.form.order = data
        })
    },
  },
}
</script>
