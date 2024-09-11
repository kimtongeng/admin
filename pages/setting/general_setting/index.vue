<template>
  <div>
    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2 mb-2">
        <b-col cols="12" xl="6">
          <div class="page-title">
            <div>
              <i class="simple-icon-support"></i>
              {{ $t('general_setting') }}
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
            v-if="checkModuleAuthorize('general_setting', 'update')"
            @click="update"
          >
            <i class="simple-icon-pencil"></i>
            {{ $t('update') }}
          </b-button
          >
        </b-col>
      </b-row>
      <div class="separator mb-4"></div>
    </div>

    <b-card class="shadow mb-4">
      <b-row>
        <!--property_transaction_fee-->
        <!--
        <b-col cols="6" xl="6">
          <b-form-group
            :label="$t('property_transaction_fee')"
            label-class="control-label"
            label-for="tag"
          >
            <b-input-group>
              <b-form-input
                v-model="form.property_transaction_fee"
                :disabled="!checkModuleAuthorize('general_setting','change_property_transaction_fee')"
                :placeholder="$t('property_transaction_fee')"
                min="0"
                type="number"
                @keydown.enter="update"
              />
              <b-input-group-append>
                <b-button variant="primary">%</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        -->
        <!-- transaction_payment_deadline-->
        <b-col cols="12" xl="12">
          <b-form-group
            :label="$t('transaction_payment_deadline')"
            label-class="control-label"
            label-for="transaction_payment_deadline"
          >
            <b-input-group class="input-group-multiselect">
              <b-input-group-prepend>
                <b-button variant="primary">
                  <template v-if="$i18n.locale == 'en'">From the 1st to</template>
                  <template v-if="$i18n.locale == 'kh'">ពីថ្ងៃទី ០១ ដល់</template>
                </b-button>
              </b-input-group-prepend>
              <b-multi-select
                v-model="form.transaction_payment_deadline"
                :disabled="!checkModuleAuthorize('general_setting','change_transaction_payment_deadline')"
                :multiple="false"
                :options="transactionPaymentDeadlineList"
                :placeholder="$t('transaction_payment_deadline')"
                label="value"
                track-by="value"
                @reset="form.transaction_payment_deadline = null"
              >
              </b-multi-select>
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
  moduleKey: 'general_setting',
  head() {
    return {
      title: this.$t('general_setting'),
    }
  },
  data() {
    return {
      form: {
        property_transaction_fee: null,
        transaction_payment_deadline: null,
      },
      defaultForm: {
        property_transaction_fee: null,
        transaction_payment_deadline: null,
      },
      apiUrl: process.env.API_URL,
      transactionPaymentDeadlineList: []
    }
  },
  mounted() {
    this.initTransactionPaymentDeadline()
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this

      vm.$axios.$post('general_setting/get', {loading: loading}).then(({data}) => {
        //set property transaction fee
        vm.setPropertyTransactionFee(data)

        //set transaction payment deadline
        vm.setTransactionPaymentDeadline(data)
      })
    },
    update(evt) {
      let vm = this
      // prevent close popup
      evt.preventDefault()

      // check validation
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let input = this.form

          if (this.$helpers.nullToVoid(input.transaction_payment_deadline) != '') {
            input.transaction_payment_deadline = input.transaction_payment_deadline.value
          }
          vm.$axios
            .$post('general_setting/update', input)
            .then((response) => {
              vm.$notify(
                'success',
                vm.$t('general_setting'),
                vm.$t('done')
              )
              vm.get(false)
            })
            .catch((error) => {
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('general_setting'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    clearForm() {
      this.form = Object.assign({}, this.defaultForm)
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
      this.get()
    },
    setPropertyTransactionFee(data) {
      let propertyTransactionFee = data.find((item) => item.key == this.enums.general_setting_key.PROPERTY_TRANSACTION_FEE)
      this.form.property_transaction_fee = propertyTransactionFee.value
    },
    initTransactionPaymentDeadline() {
      let day = 0;

      this.transactionPaymentDeadlineList = []
      for (let i = 1; i <= 31; i++) {
        this.transactionPaymentDeadlineList.push({
          value: day += 1
        })
      }
    },
    setTransactionPaymentDeadline(data) {
      let dataFromDb = data.find((item) => item.key == this.enums.general_setting_key.TRANSACTION_PAYMENT_DEADLINE)
      let dataFromList = this.transactionPaymentDeadlineList.find(obj => obj.value == dataFromDb.value)

      if (this.$helpers.nullToVoid(dataFromList) != '') {
        this.form.transaction_payment_deadline = dataFromList
      }
    },
  },
}
</script>
