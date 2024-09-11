<template>
  <div>
     <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :form-data="formData"
        :modal-type="modalType"
        :attributeGroupList="attributeGroupList"
        @closeModal="closeModal"
      />
    </div>
    <!-- End modal Component -->

    <i-form
      ref="table_default"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
      module-key="attribute"
      :title="$t('attribute')"
      :table-header="header"
      :table-data="items"
      :pagination="pagination"
      :button-add="true"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      @addClick="add"
      @searchInput="get(false)"
      :enable-table-action="true"
      @refreshClick="refresh()"
      @paginationClick="get()"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
    >
    <!-- Filter Area -->
    <template #filter>
      <!-- status -->
        <b-col
          cols="12" lg="12" xl="12"
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
              <b-form-select-option :value="enums.attribute_status.ENABLE"
              >{{ $t('enable') }}
              </b-form-select-option>
              <b-form-select-option :value="enums.attribute_status.DISABLE"
              >{{ $t('disable') }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
    </template>
    <!-- End Area Filter -->
    <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="attribute"
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
          path="accommodation/attribute_image"
        ></i-table-image-viewer>
      </template>

      <template #cell(attribute_group_id)="row">
        {{ getAttributeGroupNameByID(row.item.attribute_group_id) }}
      </template>

      <!-- updated change status -->
      <template #cell(status)="row">
        <b-form-checkbox
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>
    <!-- End Custom Area -->
    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import iForm from '~/components/IDGForm/iForm.vue'
import iTableActionDropdown from '~/components/IDGForm/iTableActionDropdown'
import iTableImageViewer from '~/components/IDGForm/iTableImageViewer'
export default {
  layout: 'app',
  moduleKey: 'attribute',
  middleware: 'acl',
  head() {
    return {
      title: this.$t('attribute')
    }
  },
  components: {
    Modal: () => import('./components/modal'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer,
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
          key: 'attribute_group_id',
          label: this.$t('attribute_group'),
          sortable: false,
          thClass: 'NameThWidth',
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: true,
          thClass: 'NameThWidth',
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: true,
        },
      ],
      apiUrl: process.env.API_URL,
      modalType: 0,
      modalShow: false,
      items: [],
      filter: {
        search: null,
        date_time_picker: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        status: null,
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
      attributeGroupList: [],
    }
  },
  watch: {
    attributeGroupList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.getNameByLang(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
  },
  created() {
    this.get()
    this.getSelectData()
  },
  methods: {
    getSelectData() {
      let vm = this

      vm.$axios.$post('attribute/get_select_data', {loading: false}).then(({data}) => {
        vm.attributeGroupList = data.attribute_group
      })
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('attribute/get', input).then(({data}) => {
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
     * delete attribute
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
            vm.$axios.$post('attribute/delete', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('attribute'), vm.$t('done'))
              vm.get()
            })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
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
      this.get()
    },
    getAttributeGroupNameByID(id) {
      let result = ''
      let data = this.attributeGroupList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
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
    /**
     * Change status
     */
    statusShowSwitch(id, status, index) {
      let vm = this
      let switchToStatus = vm.enums.attribute_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.attribute_status.DISABLE
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
            .$post('attribute/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('attribute'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
      })
    },
  }
}
</script>
