<template>
  <div>
    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2 mb-2">
        <b-col cols="12" xl="6">
          <div class="page-title">
            <div>
              <i class="simple-icon-key"></i>
              {{ $t('api_version') }}
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
            v-if="checkModuleAuthorize('api_version', 'update')"
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
        <!--API Version-->
        <b-col cols="6" xl="6">
          <b-form-group
            :label="$t('version')"
            label-class="control-label"
            label-for="tag"
          >
            <b-input-group>
              <b-form-input
                v-model="form.version"
                :disabled="!checkModuleAuthorize('api_version','change_api_version')"
                :placeholder="$t('version')"
                type="text"
                @keydown.enter="update"
              />
            </b-input-group>
          </b-form-group>
        </b-col>

        <!--API Version-->
        <b-col cols="6" xl="6">
          <b-form-group
            :label="$t('min_version')"
            label-class="control-label"
            label-for="tag"
          >
            <b-input-group>
              <b-form-input
                v-model="form.min_version"
                :disabled="!checkModuleAuthorize('api_version','change_api_version')"
                :placeholder="$t('min_version')"
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
  moduleKey: 'api_version',
  head() {
    return {
      title: this.$t('api_version'),
    }
  },
  data() {
    return {
      form: {
        version: null,
        min_version: null,
      },
      defaultForm: {
        version: null,
        min_version: null,
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

      vm.$axios.$post('api_version/get', {loading: loading}).then(({data}) => {
        //set Security Code
        vm.setAPIVersion(data)
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
          let input = vm.form
          input.value = JSON.stringify({
            version: this.form.version,
            min_version: this.form.min_version
          })

          vm.$axios
            .$post('api_version/update', input)
            .then((response) => {
              vm.$notify(
                'success',
                vm.$t('api_version'),
                vm.$t('done')
              )
              vm.get(false)
            })
            .catch((error) => {
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('api_version'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    setAPIVersion(data) {
      if (this.$helpers.nullToVoid(data) != '') {
          this.form.version = data.version
          this.form.min_version = data.min_version
      }
    }
  }
}
</script>
