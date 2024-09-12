<template>
  <div>
    <i-form
      ref="table_default"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"

      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      
      module-key="user_role"
      :title="$t('user_role')"
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
          module-key="user_role"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
        </i-table-action-dropdown>
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
  moduleKey: 'user_role',
  head() {
    return {
      title: this.$t('user_role'),
    }
  },
  components: {
    authLinkButton: () => import('~/components/AuthLinkButton'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer
  },
  data() {
    return {
      header: [
        {
          key: 'role_name',
          label: this.$t('role'),
          sortable: true,
        },
        {
          key: 'type',
          label: this.$t('user_type'),
          sortable: true,
        },
        {
          key: 'role_desc',
          label: this.$t('description'),
          sortable: false,
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
      modal: false,
      modalType: 1,
      inProgress: false,
      filter: {
        search: null,
        date_time_picker: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null
      },
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
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('role')}`
        : `${this.$t('update')} ${this.$t('role')}`
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

      this.$axios
        .$post('role/get', input)
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
      this.$router.push({path: this.makeLink('/setting/user/role/action?type=add')})
    },
    editItem(item) {
      this.$router.push({path: this.makeLink('/setting/user/role/action?type=edit&id=' + item.id)})
    },
    /**
     * delete selected role
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
            let input = {
              data: {
                role_id: item.id,
              },
            }
            vm.inProgress = true
            vm.$axios
              .$post('role/delete', input)
              .then(function (response) {
                vm.inProgress = false

                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('user_role'),
                  vm.$t('done')
                )
                vm.get()
              })
              .catch(function (error) {
                vm.inProgress = false
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    /** Row selected */
    rowSelected(items) {
      if (items.length > 0) {
        this.selectedItem = items[0]
      } else {
        this.selectedItem = {}
      }
    },
    closeModal(value) {
      if (value) {
        this.get()
      }
      this.modalType = 0
      this.rowItem = {}
    },

    /** select date*/
    refresh() {
      this.$refs.table_default.$refs.date_picker.dateTime = null;
      this.filter = Object.assign({}, this.defaultFilter)
      this.get()
    },
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    }
  },
}
</script>
<style>
.custom-control-label {
  padding-top: 3px;
}

.child_menu {
  padding-left: 25px;
}
</style>
