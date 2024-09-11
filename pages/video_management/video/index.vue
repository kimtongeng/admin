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
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      module-key="video"
      :title="$t('video')"
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
        <!-- status -->
          <b-col cols="12" lg="12" xl="12">
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
                <b-form-select-option :value="enums.video_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.video_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
      </template>

      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="video"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>
      <template #cell(url)="row">
        <a :href="row.item.url" target="_blank">{{ row.item.url }}</a>
      </template>

      <template #cell(created_at)="row">{{
          row.item.created_at | dateTimeFormat
        }}
      </template>

      <!-- updated change status from button to switch -->
      <template #cell(status)="row">
        <b-form-checkbox
          v-model="row.item.status" switch
          v-if="checkModuleAuthorize('video', 'change_status')"
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
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
  moduleKey: 'video',
  head() {
    return {
      title: this.$t('video'),
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
          key: 'name',
          label: this.$t('name'),
          sortable: true,
        },
        {
          key: 'url',
          label: this.$t('youtube_link'),
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
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        status: null,
      },
      apiUrl: process.env.API_URL,
      selectedItem: {},
      formFilter: {},
      sortBy:'created_at',
      sortType:'desc',
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
    ...mapGetters({
      pageOptions: 'pagination/getPageOptions',
    }),
  },
  created() {
    this.get(true)
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('video/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /**
     * open modal for editing video
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
     * delete selected video
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
            vm.$axios
              .$post('video/delete', input)
              .then(({data}) => {
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('video'),
                  vm.$t('done')
                )
                vm.get()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
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
      if (status == vm.enums.video_status.DISABLE) {
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
            vm.$axios
              .$post('video/change_status', input)
              .then(({data}) => {
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('video'),
                  vm.$t('done')
                )
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
      let switchToStatus = vm.enums.video_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.video_status.DISABLE
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
            .$post('video/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('video'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
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
    refresh(){
      this.resetFilterData()
      this.get()
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
