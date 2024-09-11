<template>
  <div>
    <!-- Start Modal Components -->
    <div v-if="modalShow">
      <modal
      :form-data="formData"
      :modal-type="modalType"
      @closeModal="closeModal"
      />
    </div>
    <!-- End Modal Components -->
    <i-form
    ref="table_default"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
     module-key="position_group"
      :title="$t('position_group')"
      :table-header="header"
      :table-data="items"
      :button-add="true"
      @addClick="add"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      :enable-table-action="true"
      :pagination="pagination"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
    >
    <!-- Filter Area -->
    <template #filter>
      <!-- business type -->
          <b-col xl="6" lg="6" cols="12">
            <b-form-group
              :label="$t('business_type')"
              label-for="business_type"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.business_type_id"
                type="text"
                :placeholder="$t('business_type')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('please_select') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.business_type.NEWS"
                >{{ $t('society_security') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col
            cols="12" lg="6" xl="6"
          >
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
                <b-form-select-option :value="enums.business_category_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_category_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
    </template>
    <!-- End Filter Area -->

    <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="position_group"
          @deleteClick="deleteItem(row.item)"
          @editClick="editItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>
    <!-- End Action -->

    <!-- Table Action Area -->
    <template #cell(business_type_id)="row">
        {{ getBusinessTypeName(row.item.business_type_id) }}
      </template>

      <!-- updated change status -->
      <template #cell(status)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('position_group', 'change_status')"
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(created_at)="row"
      >{{ row.item.created_at | dateTimeFormat }}
      </template>
      <!-- End Custom Field -->
    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'position_group',
  head() {
    return {
      title: this.$t('position_group')
    }
  },
  components: {
    Modal: () => import('./components/Modal'),
  },
  data() {
    return {
      header: [
        {
          key: 'name',
          label: this.$t('name'),
          sortable: true,
        },
        {
          key: 'business_type_id',
          label: this.$t('business_type'),
          sortable: false,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('show'),
          sortable: true,
        },
      ],
      apiUrl: process.env.API_URL,
      modalType: 0,
      modalShow: false,
      items: [],
      formData: {},
      filter: {
        search: null,
        date_time_picker: null,
        business_type_id: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        business_type_id: null,
        status: null,
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      sortBy: 'created_at',
      sortType: 'desc',
      datePickerProps: {
        editable: false,
        type: 'datetime',
        range: true,
        date_time_value: [],
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
    getBusinessTypeName(businessType){
      let text = ''

      let data  = this.enums.business_type_list.find(obj => obj.id == businessType)
      if(this.$helpers.nullToVoid(data) != ''){
        text = this.$t(this.$helpers.lowercase(data.name))
      }

      return text;
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('position_group/get', input).then(({data}) => {
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
            vm.$axios.$post('position_group/delete', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('position_group'), vm.$t('done'))
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
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.$refs.table_default.$refs.date_picker.dateTime = null;

      this.filter = Object.assign({}, this.defaultFilter)
    },
    // refresh
    refresh(){
      this.resetSort()
      this.resetFilterData()
      this.get()
    },
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    /**
     * Change status
     */
    statusShowSwitch(id, status, index) {
      let vm = this
      let switchToStatus = vm.enums.business_category_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.business_category_status.DISABLE
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
            .$post('position_group/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('position_group'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
      })
    },
  },
}
</script>
