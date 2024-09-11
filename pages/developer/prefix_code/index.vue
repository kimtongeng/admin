<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :form-filter="formFilter"
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
      module-key="prefix_code"
      :title="$t('prefix_code')"
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
          module-key="prefix_code"
          :enable-delete-action="false"
          @editClick="editItem(row.item)"
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
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'prefix_code',
  head() {
    return {
      title: this.$t('prefix_code'),
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
          key: 'type',
          label: this.$t('type'),
          sortable: true,
        },
        {
          key: 'prefix',
          label: this.$t('prefix'),
          sortable: true,
        },
        {
          key: 'code_length',
          label: this.$t('length'),
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
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        date_time_picker: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null
      },
      apiUrl: process.env.API_URL,
      formFilter: {},
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
  created() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading
      this.$axios.$post('prefix_code/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    add() {
      this.modalShow = true
      this.formFilter = this.getInput()
      this.modalType = 1
    },
    /**
     * open modal for editing unit_type
     */
    editItem(item) {
      this.modalShow = true
      this.rowItem = Object.assign({}, item)
      this.formFilter = this.getInput()
      this.modalType = 2 // set modal type 2 = update
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
