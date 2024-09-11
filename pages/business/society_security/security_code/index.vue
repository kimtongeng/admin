<template>
  <div>
    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2 mb-2">
        <b-col cols="12" xl="6">
          <div class="page-title">
            <div>
              <i class="simple-icon-key"></i>
              {{ $t('security_code') }}
            </div>
          </div>
        </b-col>
        <b-col class="text-right m-0" cols="12" xl="6">
          <b-button size="xs" variant="primary" @click="clearForm">
            <i class="iconsminds-repeat-2"></i>
            {{ $t('refresh') }}
          </b-button
          >
          <b-button
            size="xs"
            variant="primary"
            v-if="checkModuleAuthorize('security_code', 'update')"
            @click="update"
          >
            <i class="simple-icon-pencil"></i>
            {{ $t('update') }}
          </b-button>
        </b-col>
      </b-row>
      <div class="separator mb-4"></div>
    </div>

    <b-card class="shadow mb-4">
      <b-row>
        <!--property_transaction_fee-->
        <b-col cols="12" xl="12">
          <b-form-group
            :label="$t('code')"
            label-class="control-label"
            label-for="tag"
          >
            <b-input-group>
              <b-form-input
                v-model="form.code"
                :disabled="!checkModuleAuthorize('security_code','change_code')"
                :placeholder="$t('code')"
                type="text"
                @keydown.enter="update"
              />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'security_code',
  head() {
    return {
      title: this.$t('security_code'),
    }
  },
  data() {
    return {
      form: {
        code: null,
      },
      defaultForm: {
        code: null,
      },
      apiUrl: process.env.API_URL,
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this

      vm.$axios.$post('security_code/get', {loading: loading}).then(({data}) => {
        //set Security Code
        vm.setSecurityCode(data)
      })
    },
    clearForm() {
      this.form = Object.assign({}, this.defaultForm)
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
      this.get()
    },
    update(evt) {
      let vm = this
      // prevent close popup
      evt.preventDefault()

      // check validation
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let input = this.form

          vm.$axios
            .$post('security_code/update', input)
            .then((response) => {
              vm.$notify(
                'success',
                vm.$t('security_code'),
                vm.$t('done')
              )
              vm.get(false)
            })
            .catch((error) => {
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('security_code'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    setSecurityCode(data) {
      if (this.$helpers.nullToVoid(data) != '') {
          this.form.code = data.value;
      }
    }
  }
}
</script>
