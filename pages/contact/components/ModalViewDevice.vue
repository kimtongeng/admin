<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    scrollable
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    size="lg"
    :title="$t('contact_device')"
  >
    <b-row>
      <b-col cols="12">
        <b-card v-for="(obj, index) in contactDeviceList" :key="index" class="mb-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <b>{{ $t('device') }}: </b>
              <span>{{ obj.device_id }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <b>{{ $t('is_login') }}:</b>
              </div>
              <div>
                <i
                  :class="obj.is_login == 1 ? 'simple-icon-check text-success' : 'simple-icon-close text-danger'"
                  class="ml-2"
                  style="font-size: 18px"
                ></i>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2"
               v-if="$helpers.nullToVoid(obj.created_at) != '' || $helpers.nullToVoid(obj.updated_at) != ''">
            <div>
              <b>{{ $t('created_at') }}: </b>
              <span>{{ obj.created_at }}</span>
            </div>

            <div v-if="$helpers.nullToVoid(obj.updated_at) != ''">
              <b>{{ $t('updated_at') }}: </b>
              <span>{{ obj.updated_at }}</span>
            </div>
          </div>
          <div class="mt-2">
            <b>FCM Token: </b>
            <div>{{ obj.fcm_token }}</div>
          </div>
        </b-card>
        <div v-if="contactDeviceList.length == 0" class="text-muted text-center">{{ $t('no_data') }}</div>
      </b-col>
    </b-row>
    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="closeForm">
        {{ $t('close') }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      contactDeviceList: []
    }
  },
  created() {
    this.modal = true
    this.getContactDevice()
  },
  methods: {
    getContactDevice(loading = true) {
      let input = {
        contact_id: this.formItem.id,
        loading: loading
      }

      this.$axios.$post('contact/get_device', input).then(({data}) => {
        this.contactDeviceList = data
      })
    },
    closeForm() {
      let vm = this

      vm.modal = false

      vm.$nextTick().then(() => {
        vm.veeErrors.clear()
      })

      vm.$emit('closeModal', vm.modal)
    },
  },
}
</script>
