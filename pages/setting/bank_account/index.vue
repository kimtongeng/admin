<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :form-filter="formFilter"
        :form-item="rowItem"
        :modal-type="modalType"
        :bank-list="bankList"
        @closeModal="closeModal"
      />
    </div>
    <!-- End modal Component -->

    <i-form
      ref="table_default"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      module-key="bank_account"
      :title="$t('bank_account')"
      :button-add="true"
      @addClick="add"
      :table-header="header"
      :table-data="items"
      :pagination="pagination"
      :enable-table-action="true"
      @refreshClick="refresh()"
      @paginationClick="get()"
      @searchInput="get(false)"
    >
      <!-- filter block -->
      <template #filter>
        <!-- bank_id -->
          <b-col
            cols="12" lg="6" xl="6"
          >
            <b-form-group
              :label="$t('bank')"
              :label-for="$t('bank')"
              label-class="control-label"
            >
              <b-multi-select
                v-model="bankSelectData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="bankList"
                :placeholder="$t('bank')"
                @reset="resetBank"
              ></b-multi-select>
            </b-form-group>
          </b-col>
          <!-- status -->
          <b-col cols="12" lg="6" xl="6">
            <b-form-group
              :label="$t('status')"
              label-for="status"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.status"
                type="text"
                :placeholder="$t('status')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('status') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.position_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.position_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
      </template>

      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="bank_account"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>

      <template #cell(bank_image)="row">
        <i-table-image-viewer
          :image="row.item.bank_image"
          :is-popover="false"
          path="bank"
        ></i-table-image-viewer>
      </template>

      <template #cell(account_qr_code)="row">
        <i-table-image-viewer
          :image="row.item.account_qr_code"
          :is-popover="true"
          path="bank_qr_code"
        ></i-table-image-viewer>
      </template>

      <!-- updated change status from button to switch -->
      <template #cell(status)="row">
        <b-form-checkbox
        v-if="checkModuleAuthorize('bank_account', 'change_status')"
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(created_at)="row"
      >{{ row.item.created_at | dateTimeFormat }}
      </template>

    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'bank_account',
  head() {
    return {
      title: this.$t('bank_account'),
    }
  },
  components: {
    Modal: () => import('./components/Modal'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer
  },
  data() {
    return {
      header: [
        {
          key: 'bank_image',
          label: this.$t('bank'),
          sortable: false,
          thClass: 'imageThWidth',
        },
        {
          key: 'account_qr_code',
          label: this.$t('qr_code'),
          sortable: false,
          thClass: 'imageThWidth',
        },
        {
          key: 'account_name',
          label: this.$t('account_name'),
          sortable: true,
        },
        {
          key: 'account_number',
          label: this.$t('account_number'),
          sortable: true,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
          thClass: 'createdAtThWidth',
        },
        {
          key: 'status',
          label: this.$t('show'),
          sortable: true,
        },
      ],
      items: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      rowItem: {},
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        date_time_picker: null,
        bank_id: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        bank_id: null,
        status: null,
      },
      apiUrl: process.env.API_URL,
      formFilter: {},
      bankList: [],
      sortBy: 'created_at',
      sortType: 'desc',
      datePickerProps: {
        editable: false,
        type: 'datetime',
        range: true,
        date_time_value: [],
        // single_date_time: '',
        show_select_time_btn: true,
        show_confirm_btn: true,
        format: 'DD/MM/YYYY HH:mm:ss',
        value_type: 'YYYY-MM-DD HH:mm:ss',
      },
      bankSelectData: null,
    }
  },
  watch: {
  },
  created() {
    this.getBankList()
    this.get(true)
  },
  methods: {
    getBankList() {
      let vm = this

      vm.$axios
        .$post('bank_account/get_bank_list', {loading: false})
        .then(({data}) => {
          vm.bankList = data
        })
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('bank_account/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /**
     * open modal for editing banner
     */
    editItem(item) {
      this.modalShow = true
      this.rowItem = Object.assign({}, item)
      this.formFilter = this.getInput()
      this.modalType = 2 // set modal type 2 = update
    },
    add() {
      this.modalShow = true
      this.formFilter = this.getInput()
      this.modalType = 1
    },
    /**
     * delete selected banner
     */
    deleteItem(item) {
      let vm = this
      swal.fire({
        title: vm.$t('are_you_sure'),
        text: vm.$t('cannot_revert_this'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('ok'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {

            let input = vm.getInput()
            input.id = item.id
            input.loading = false
            vm.$axios.$post('bank_account/delete', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('banner'), vm.$t('done'))
              vm.get()
            })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    /** get input */
    getInput() {
      this.setFilter()
      return {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
        sort_by: this.sortBy,
        sort_type: this.sortType
      }
    },
    /** Set input */
    setInput(data) {
      this.items = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
    /**
     *
     */
    closeModal(data) {
      this.modalType = 0
      if (!this.$helpers.isEmpty(data)) {
        this.setInput(data)
      }
      this.rowItem = {}
    },
    /**
     * Change status
     */
    changeStatus(id, status) {
      let vm = this

      let title = ''
      if (status == vm.enums.bank_account_status.DISABLE) {
        title = vm.$t('do_you_want_to_disable')
      } else {
        title = vm.$t('do_you_want_to_enable')
      }

      swal.fire({
        title: title,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('yes'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            let input = {
              id: id,
              status: status,
              loading: false,
            }
            vm.$axios.$post('bank_account/change_status', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('bank_account'), vm.$t('done'))
              vm.get()
            })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    /**
     * Change status
     */
    statusShowSwitch(id, status, index) {
      let vm = this
      let switchToStatus = vm.enums.bank_account_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.bank_account_status.DISABLE
      }

      swal.fire({
        title: vm.$t('are_you_sure'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('yes'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          let input = {
            id: id,
            status: switchToStatus,
            loading: true,
          }
          vm.$axios
            .$post('bank_account/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('bank_account'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
      })
    },
    setFilter() {
      if(this.$helpers.nullToVoid(this.bankSelectData) != ''){
        this.filter.bank_id = this.bankSelectData.id
      }
    },

    /** select date*/
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    resetFilterData() {
      this.bankSelectData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    // refresh
    refresh(){
      this.resetFilterData()
      this.get()
    },
    resetBank() {
      this.bankSelectData = null
    }
  },
}
</script>
<style scoped>
:deep(.imageThWidth) {
  width: 130px;
}

:deep(.createdAtThWidth) {
  width: 200px;
}
</style>
