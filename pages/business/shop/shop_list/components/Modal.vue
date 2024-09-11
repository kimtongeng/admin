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
        <!-- App Fee -->
        <b-col xl="12" lg="12">
          <b-form-group
            :label="$t('app_fee')"
            label-for="app_fee"
            label-class="control-label"
          >
          <b-input-group append="%" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input
              autocomplete="off"
              v-model="form.app_fee"
              type="number"
              min="0"
              :placeholder="$t('app_fee')"
              @keydown.enter="save"
            />
          </b-input-group>
          </b-form-group>
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
          id: 0,
          business_type_id: 0,
          app_fee: 0
        },
        defaultForm: {
          id: 0,
          business_type_id: 0,
          app_fee: 0
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
            this.modal = true
          } else if (val == 2) {
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
          ? `${this.$t('add')}`
          : `${this.$t('update')}`
      },
      modalOk() {
        return this.modalType == 1 ? this.$t('save') : this.$t('update')
      },
    },
    methods: {
      setData() {
        this.form.id =  this.formData.id
        this.form.business_type_id = this.formData.business_type_id
        this.form.app_fee = this.formData.app_fee
      },
      save(evt) {
        // prevent close popup
        evt.preventDefault()
        // check validation
        let vm = this
        vm.$validator.validateAll().then((result) => {
          if (result) {
            let url = 'app_fee/store'
            if (this.modalType == 2) {
              url = 'app_fee/update'
            }
            let input = vm.form
            vm.$axios.$post(url, input).then(({data}) => {
              vm.listItems = data
              vm.clearForm()
              vm.$notify('success', vm.$t('app_fee'), vm.$t('done'))
            })
          } else {
            vm.$notify(
              'warning',
              vm.$t('app_fee'),
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
    },
  }
  </script>
