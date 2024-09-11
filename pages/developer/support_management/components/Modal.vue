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
    <b-row>
      <b-col cols="12">
        <b-form-group
          :invalid-feedback="veeErrors.first('support_type')"
          :state="!veeErrors.has('support_type')"
          :label="$t('support_type')"
          label-for="support_type"
          class="required"
          label-class="control-label"
        >
          <b-form-input
            autofocus
            autocomplete="off"
            v-model="form.support_type"
            v-validate="'required|max:255'"
            :state="veeErrors.has('support_type') ? false : null"
            data-vv-name="support_type"
            :data-vv-as="$t('support_type')"
            type="text"
            required
            :placeholder="$t('support_type')"
            @keydown.enter="save"
          />
        </b-form-group>
      </b-col>
      <b-col cols="12">
        <b-form-group
          :invalid-feedback="veeErrors.first('support_value')"
          :state="!veeErrors.has('support_value')"
          :label="$t('data')"
          label-for="data"
          class="required"
          label-class="control-label"
        >
          <b-form-input
            autocomplete="off"
            v-model="form.support_value"
            v-validate="'required|max:255'"
            :state="veeErrors.has('support_value') ? false : null"
            data-vv-name="support_value"
            :data-vv-as="$t('data')"
            type="text"
            required
            :placeholder="$t('data')"
            @keydown.enter="save"
          />
        </b-form-group>
      </b-col>
    </b-row>

    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="clearForm"
      >{{ $t('cancel') }}
      </b-button>
      <b-button size="xs" variant="primary" @click="save">{{
          modalOk
        }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'

export default {
  props: {
    formFilter: {
      type: Object,
      default: () => {
        return {}
      },
    },
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
  data() {
    return {
      form: {
        id: '',
        support_type: '',
        support_value: '',
      },
      defaultForm: {
        id: '',
        support_type: '',
        support_value: '',
      },
      modal: false,
      apiUrl: process.env.API_URL,
      listItems: {},
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 2
        ? `${this.$t('update')} ${this.formItem.support_type}`
        : `${this.$t('add')}`
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
          let url = 'support_management/store'

          if (this.modalType == 2) {
            url = 'support_management/update'
          }

          let input = this.form

          input.page = this.formFilter.page
          input.table_size = this.formFilter.table_size
          input.filter = this.formFilter.filter

          this.$axios.$post(url, input).then(({data}) => {
            this.listItems = data
            this.clearForm()

            this.$notify(
              'success',
              this.$t('support_management'),
              this.$t('done')
            )
          })
        } else {
          this.$notify(
            'warning',
            this.$t('support_management'),
            this.$t('validation_failed')
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

      this.listItems = {}
    },
    setData() {
      this.form = Object.assign({}, JSON.parse(JSON.stringify(this.formItem)))
    },
  },
}
</script>
