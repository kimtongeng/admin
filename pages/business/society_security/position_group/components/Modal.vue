<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    size="md"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    :title="modalHeader"
  >
  <!-- Form Input -->
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
          <b-form-select-option :value="enums.business_type.NEWS"
          >{{ $t('society_security') }}
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

          <!-- order
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
          </b-col> -->

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
  <!-- Custom Footer Button -->
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
        business_type_id: null,
        // order: 1,
        status: 1,
      },
      defaultForm: {
        id: null,
        name: null,
        business_type_id: null,
        // order: 1,
        status: 1,
      },
      modal: false,
      apiUrl: process.env.API_URL,
      listItems: {}
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if(val == 1) {
          this.modal = true
          // this.getAutoOrder()
        }else if(val == 2) {
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
        ? `${this.$t('add')} ${this.$t('position_group')}`
        : `${this.$t('update')} ${this.$t('position_group')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  methods: {
    setData(){
      this.form = Object.assign({}, this.formData)

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
          let url = 'position_group/store'
          if (this.modalType == 2) {
            url = 'position_group/update'
          }
          let input = vm.form

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('position_group'), vm.$t('done'))
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('position_group'),
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
  }
}
</script>
