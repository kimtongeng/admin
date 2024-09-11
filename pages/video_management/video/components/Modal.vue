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
      <!-- name -->
      <b-col
        cols="12"
      >
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
            autofocus
            v-model="form.name"
            v-validate="'required|max:255'"
            :state="veeErrors.has('name') ? false : null"
            data-vv-name="name"
            :data-vv-as="$t('name')"
            type="text"
            required
            :placeholder="$t('name')"
            @keydown.enter="save"
          />
        </b-form-group>
      </b-col>

      <!-- youtube_link -->
      <b-col cols="12">
        <b-form-group
          :invalid-feedback="veeErrors.first('youtube_link')"
          :state="!veeErrors.has('youtube_link')"
        >
          <label class="control-label" for="youtube_link">
            <span>{{ $t('youtube_link') }}</span>
            <span style="color: red"> *</span>
            <span class="text-muted"
            >https://www.youtube.com/.....</span
            >
          </label>

          <b-form-input
            autocomplete="off"
            v-model="form.url"
            v-validate="'required|url_youtube'"
            :state="veeErrors.has('youtube_link') ? false : null"
            data-vv-name="youtube_link"
            :data-vv-as="$t('youtube_link')"
            type="text"
            :placeholder="$t('youtube_link')"
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
              <b-form-select-option
                :value="null"
                disabled
              >{{
                  $t('status')
                }}
              </b-form-select-option
              >
            </template>
            <b-form-select-option
              :value="enums.video_status.ENABLE"
            >{{ $t('enable') }}
            </b-form-select-option
            >
            <b-form-select-option
              :value="enums.video_status.DISABLE"
            >{{ $t('disable') }}
            </b-form-select-option
            >
          </b-form-select>
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
    }
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        url: null,
        order: 0,
        status: 1
      },
      defaultForm: {
        id: null,
        name: null,
        url: null,
        order: 0,
        status: 1
      },
      modal: false,
      apiUrl: process.env.API_URL,
      listItems: {},
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('video')}`
        : `${this.$t('update')} ${this.$t('video')}`
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
          this.getAutoOrder()
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
          let url = 'video/store'
          if (this.modalType == 2) {
            url = 'video/update'
          }
          let input = JSON.parse(JSON.stringify(vm.form))
          input.page = vm.formFilter.page
          input.table_size = vm.formFilter.table_size
          input.filter = vm.formFilter.filter

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data

            vm.clearForm()

            vm.$notify('success', vm.$t('video'), vm.$t('done'))
          })
        } else {
          this.$notify(
            'warning',
            this.$t('video'),
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
      this.form = Object.assign({}, this.formItem)
      if(this.formItem.status == "true"){
        this.form.status = this.enums.video_status.ENABLE;
      }else {
        this.form.status = this.enums.video_status.DISABLE;
      }
    },
    getAutoOrder() {
      let vm = this
      vm.$axios
        .$post('video/get_auto_order', { loading: true })
        .then(({ data }) => {
          vm.form.order = data
        })
    },
  },
}
</script>
<style scoped>
:deep(.ql-editor) {
  min-height: 250px !important;
}
</style>
