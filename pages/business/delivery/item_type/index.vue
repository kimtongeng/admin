<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :form-data="formData"
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
      module-key="item_type"
      :title="$t('item_type')"
      :table-header="header"
      :table-data="items"
      :button-add="true"
      @addClick="add"
      :enable-table-action="true"
      :pagination="pagination"
      :enable-filter="false"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
    >
      <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="item_type"
          @deleteClick="deleteItem(row.item)"
          @editClick="editItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>
    <!-- End Action -->

      <!-- Table Custom Field Area -->
      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="delivery/item_type/"
        ></i-table-image-viewer>
      </template>

      <template #cell(created_at)="row"
      >{{ row.item.created_at | dateTimeFormat }}
      </template>
      <!-- End Custom Field Area -->
    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'item_type',
  head() {
    return {
      title: this.$t('item_type')
    }
  },
  components: {
    Modal: () => import('./components/Modal'),
  },
  data() {
    return {
      header: [
        {
          key: 'image',
          label: this.$t('image'),
          sortable: false,
          thClass: 'imageThWidth',
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: true,
        },
        {
          key: 'order',
          label: this.$t('order_number'),
          sortable: true,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
      ],
      apiUrl: process.env.API_URL,
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        date_time_picker: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
      },
      sortBy: 'created_at',
      sortType: 'desc',
      formData: {},
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      items: [],
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
  created() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('item_type/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /** get input */
    getInput() {
      return {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
        sort_by: this.sortBy,
        sort_type: this.sortType,
      }
    },
    /** Set input */
    setInput(data) {
      this.items = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
    add() {
      this.modalShow = true
      this.formData = this.getInput()
      this.modalType = 1
    },
    editItem(item){
      this.formData = item
      this.modalType = 2
      this.modalShow = true
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
            vm.$axios.$post('item_type/delete', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('item_type'), vm.$t('done'))
              vm.get()
            })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    /**
     *
     */
    closeModal(data) {
      this.modalType = 0
      if (!this.$helpers.isEmpty(data)) {
        this.get(false)
      }
      this.modalShow = false
    },
    // select date
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    resetFilterData() {
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    // refresh
    refresh(){
      this.resetFilterData()
      this.get()
    },
  }
}
</script>
