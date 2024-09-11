<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :form-item="rowItem"
        :modal-type="modalType"
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
      module-key="user_list"
      :title="$t('user_list')"
      :button-add="true"
      @addClick="add"
      :table-header="header"
      :table-data="items"
      :pagination="pagination"
      :filter="filter"
      :enable-table-action="true"
      @refreshClick="refresh()"
      @paginationClick="get()"
      @searchInput="get(false)"
    >
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="user_list"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>

      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-width="500"
          :popover-image-height="200"
          path="users"
        ></i-table-image-viewer>
      </template>

      <template #cell(created_at)="row"
      >{{ row.item.created_at | dateTimeFormat }}
      </template>

    </i-form>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import swal from 'sweetalert2'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'user_list',
  head() {
    return {
      title: this.$t('user_list'),
    }
  },
  components: {
    modal: () => import('./components/Modal'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer
  },
  data() {
    return {
      header: [
        {
          key: 'image',
          label: this.$t('image'),
          sortable: false,
        },
        {
          key: 'username',
          label: this.$t('username'),
          sortable: true,
        },
        {
          key: 'email',
          label: this.$t('email'),
          sortable: true,
        },
        {
          key: 'user_type',
          label: this.$t('user_type'),
          sortable: true,
        },
        {
          key: 'role_name',
          label: this.$t('role'),
          sortable: true,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
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
      modalShow: false,
      modalType: 0,
      filter: {
        search: null,
        date_time_picker: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null
      },
      inProgress: false,
      apiUrl: process.env.API_URL,
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
      }
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? this.$t('add_user')
        : this.$t('update_user')
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
    ...mapGetters({
      user: 'auth/user',
    }),
  },
  created() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
        loading: loading,
        sort_by: this.sortBy,
        sort_type: this.sortType
      }
      vm.inProgress = true
      this.$axios
        .$post('user/get', input)
        .then((response) => {
          vm.inProgress = false
          if (response.data) {
            vm.items = response.data
            vm.pagination.total = response.pagination.total
            vm.pagination.from = response.pagination.from
            vm.pagination.to = response.pagination.to
          }
        })
        .catch((error) => {
          vm.inProgress = false
        })
    },
    add() {
      this.modalShow = true
      this.modalType = 1
    },
    /**
     * open modal for edting user
     */
    editItem(item) {
      this.modalShow = true
      this.selectedItem = item
      this.rowItem = Object.assign({}, this.selectedItem)
      this.modalType = 2 // set modal type 2 = update
    },
    /**
     * delete selected user
     */
    deleteItem(item, index) {
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
            vm.inProgress = false

            vm.selectedItem = item
            let input = {
              id: vm.selectedItem.id,
              loading: vm.inProgress,
            }

            vm.$axios
              .$post('user/delete', input)
              .then(function (response) {
                vm.inProgress = false
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('user'),
                  vm.$t('done')
                )
                vm.get()
              })
              .catch(function (error) {
                vm.inProgress = false
                vm.$notify(
                  'error',
                  vm.$t('user'),
                  error.response.data.message
                )
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    /**
     * Update user flag
     */
    updateStatus(item, status) {
      let vm = this
      let input = {
        id: item.id,
        status: status,
      }
      vm.inProgress = true
      vm.$axios
        .$post('user/update_status', input)
        .then(function (response) {
          vm.inProgress = false
          vm.get()
        })
        .catch((error) => {
          vm.inProgress = false
        })
    },
    /**
     * Clear form and validation before modal display
     */
    closeModal(value) {
      if (value) {
        this.get()
      }
      this.modalType = 0
      this.rowItem = {}
    },
    /** select date*/
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    refresh(){
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
      this.get()
    }
  },
}
</script>
