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
      :button-add="true"
      @addClick="openModalAdd"
      :enable-sort="true"
      :enable-table-action="true"
      :filter="filter"
      :pagination="pagination"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      :table-data="items"
      :table-header="header"
      :title="$t('module')"
      module-key="module"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      @sortChange="get()"
    >
      <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="module"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>

      <!-- Table Custom Field Area -->
      <template #cell(featured)="row">
        <div v-if="row.item.featured == 1">Main Menu</div>
        <div v-else>Sub Menu</div>
      </template>

      <template #cell(permission)="row">
        <span
          v-for="(item, index) in row.item.permission"
          :key="index"
        >
            {{
            item.permission_name
          }}{{
            row.item.permission.length === index + 1
              ? ''
              : ' |'
          }}
        </span>
      </template>

    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'module',
  head() {
    return {
      title: this.$t('module'),
    }
  },
  components: {
    iForm,
    iTableActionDropdown,
    modal: () => import('./components/Modal')
  },
  data() {
    return {
      header: [
        {
          key: 'module_name',
          label:
            this.$store.state.lang.locale == 'en'
              ? 'Module Name'
              : 'ឈ្មោះ មូ៉ឌុល',
          sortable: true,
        },
        {
          key: 'module_key',
          label: this.$t('module_key'),
          sortable: false,
        },
        {
          key: 'menu_title',
          label: this.$t('menu_title'),
          sortable: false,
        },
        {
          key: 'featured',
          label: this.$t('feature'),
          sortable: true,
        },
        {
          key: 'sequence',
          label: this.$t('sequence'),
          sortable: true,
        },
        {
          key: 'permission',
          label: this.$t('permission'),
          sortable: false,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
        // {
        //   key: 'updated_at',
        //   label: this.$t('updated_at'),
        //   sortable: true,
        // },
      ],
      apiUrl: process.env.API_URL,
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
      sortBy: 'sequence',
      sortType: 'asc',
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
  created() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading
      this.$axios.$post('module/get', input).then((response) => {
        vm.setInput(response)
      })
    },
    /** get input */
    getInput() {
      return {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
        sort_by: this.sortBy,
        sort_type: this.sortType
      }
    },
    /** Set input */
    setInput(response) {
      this.items = response.data
      this.pagination.total = response.pagination.total
      this.pagination.from = response.pagination.from
      this.pagination.to = response.pagination.to
    },
    openModalAdd() {
      this.modalType = 1
      this.modalShow = true
    },
    /**
     * Edit Item
     */
    editItem(item) {
      this.rowItem = Object.assign({}, item)
      this.modalType = 2 // set modal type 2 = update
      this.modalShow = true
    },
    /**
     * Close Modal
     */
    closeModal(value) {
      if (!this.$helpers.isEmpty(value)) {
        this.get()
      }

      this.modalType = 0
      this.modalShow = false

      this.rowItem = {}
    },
    /**
     * delete selected contact
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
              id: item.id,
            }
            vm.$axios
              .$post('module/delete', input)
              .then(function (response) {
                vm.$notify(
                  'success',
                  vm.$t('module'),
                  vm.$t('done')
                )
                swal.close()
                vm.get()
              })
              .catch(function (error) {
                console.log(error)
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
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
<style scoped>
.separator-custom {
  border-bottom: 1px solid #f1ebeb;
}
</style>
