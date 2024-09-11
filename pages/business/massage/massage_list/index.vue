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
      module-key="massage_list"
      :title="$t('massage_list')"
      :table-header="header"
      :table-data="items"
      :enable-table-action="true"
      :pagination="pagination"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      :filter="filter"
      :enable-filter="true"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
    >
    <!-- Filter Area -->
    <template #filter>
      <!-- business_owner_name-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('business_owner_name')"
            label-for="business_owner_name"
            label-class="control-label"
          >
            <b-multi-select
              v-model="businessOwnerData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="businessOwnerList"
              :placeholder="$t('business_owner_name')"
              @reset="resetBusinessOwnerList"
            >
            </b-multi-select>
          </b-form-group>
        </b-col>

        <b-col cols="12" lg="4" xl="4">
          <b-row>
            <!-- Open Time & Close Time -->
        <b-col cols="12" lg="6" xl="6">
          <b-form-group
            :label="$t('open_time')"
            label-for="open_time"
            label-class="control-label"
          >
            <b-form-timepicker
              v-model="filter.open_time"
              :hour12="false"
              show-seconds
              :placeholder="$t('open_time')"
              close-button-variant="outline-danger"
              :label-close-button="$t('close')"
            ></b-form-timepicker>
          </b-form-group>
        </b-col>
        <b-col cols="12" lg="6" xl="6">
          <b-form-group
            :label="$t('close_time')"
            label-for="close_time"
            label-class="control-label"
          >
            <b-form-timepicker
              v-model="filter.close_time"
              :hour12="false"
              show-seconds
              :placeholder="$t('close_time')"
              close-button-variant="outline-danger"
              :label-close-button="$t('close')"
            ></b-form-timepicker>
          </b-form-group>
        </b-col>
          </b-row>
        </b-col>



        <!-- Verify -->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
              :label="$t('verify')"
              label-for="verify"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.verify"
                type="text"
                :placeholder="$t('verify')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('verify') }}
                  </b-form-select-option>
                </template>
                 <b-form-select-option :value="enums.business_active.TRUE"
                >{{ $t('verify') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_active.FALSE"
                >{{ $t('un_verify') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
        </b-col>

        <!-- Status -->
        <b-col cols="12" lg="4" xl="4">
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
               <b-form-select-option :value="enums.business_active.TRUE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_active.FALSE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
        </b-col>
    </template>

    <!-- Table Action Area -->
    <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="massage_list"
          @editClick="editItem(row.item)"
          :enable-delete-action="false"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('massage_list', 'detail')"
            @click="viewDetail(row.item)"
          >
            <i class="simple-icon-eye"></i>
            <span class="ml-3">
              {{ $t('view') }}
            </span>
          </b-dropdown-item>
        </i-table-action-dropdown>
      </template>
    <!-- Table Custom Field Area -->
      <template #cell(image)="row">
        <i-table-image-viewer
            :image="row.item.image"
            :popover-image-width="500"
            :popover-image-height="200"
            path="massage/logo"
          ></i-table-image-viewer>
      </template>

      <template #cell(business_type_name)="row">
        {{ getBusinessTypeName(row.item.business_type_id) }}
      </template>

      <template #cell(open_time)="row">
        {{ row.item.open_time }}
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <template #cell(app_fee)="row">
        {{ row.item.app_fee }} %
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('massage_list', 'change_status')"
          v-model="row.item.active" switch
          @change="activeShowSwitch(row.item.id, row.item.active, row.index)"
        >
        </b-form-checkbox>
      </template>

      <!-- updated change status -->
      <template #cell(is_verify)="row">
        <b-form-checkbox
          v-model="row.item.is_verify" switch
          @change="updateVerifyBusiness(row.item.id, row.item.is_verify, row.index)"
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
  moduleKey: 'massage_list',
  head() {
    return {
      title: this.$t('massage_list'),
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
          key: 'image',
          label: this.$t('image'),
          sortable: false,
          thClass: 'imageThWidth',
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: true,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'contact_name',
          label: this.$t('owner'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'business_type_name',
          label: this.$t('business_type'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'address',
          label: this.$t('address'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'open_time',
          label: this.$t('open_time'),
          sortable: false,
        },
        {
          key: 'close_time',
          label: this.$t('close_time'),
          sortable: false,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'app_fee',
          label: this.$t('app_fee'),
          sortable: true,
          tdClass: 'moneyTdWidth'
        },
        {
          key: 'is_verify',
          label: this.$t('verify'),
          sortable: false,
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'show',
          label: this.$t('show'),
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
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
      apiUrl: process.env.API_URL,
      rowItem: {},
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        business_owner_id: null,
        open_time: null,
        close_time: null,
        verify: null,
        status: null,
        date_time_picker: null,
      },
      defaultFilter: {
        search: null,
        business_owner_id: null,
        verify: null,
        status: null,
        date_time_picker: null,
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
      businessOwnerList: [],
      businessOwnerData: null,
    }
  },
  created() {
    this.get(false)
    this.getSelectData()
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
    refresh() {
      this.get()
      this.resetFilterData()
      this.resetSort()
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('massage_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    // get Input Filter
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.businessOwnerData) != '') {
        this.filter.business_owner_id = this.businessOwnerData.id
      }
    },
    /** get input */
    getInput() {
      this.getInputFilter()
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
    viewDetail(item) {
      this.$router.push('/business/massage/massage_list/view_detail?id=' + item.id);
    },
    editItem(item){
      this.formData = item
      this.modalType = 2
      this.modalShow = true
    },
    /**
     * close Modal
     */
    closeModal(data) {
      this.modalType = 0
      if (!this.$helpers.isEmpty(data)) {
        this.get(false)
      }
      this.modalShow = false
    },
    getSelectData(loading = true) {
      let vm = this

      vm.$axios.$post('massage_list/get_select_data', {loading: loading})
      .then(({data}) => {
          vm.businessOwnerList = data.business_owner
        })
    },
    // select date
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    resetFilterData() {
      this.businessOwnerData = null
      this.filter.open_time
      this.filter.close_time

      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetBusinessOwnerList() {
      this.businessOwnerData = null
      this.filter.business_owner_id = null
    },
    /**
     * Active Shop
     */
    activeShowSwitch(id, active, index) {
      let vm = this
      let switchTo = vm.enums.business_active.TRUE

      if (active == false) {
        switchTo = vm.enums.business_active.FALSE
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
            active: switchTo,
            loading: true,
          }
          vm.$axios
            .$post('massage_list/change_active', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('massage_list'),
                vm.$t('done')
              )
              vm.get(false)
            }).catch(error => {
              this.items[index].active = !active
          })
        } else if (result.isDismissed) {
          this.items[index].active = !active
        }
      })
    },
    /**
     * Update Verify
     */
    updateVerifyBusiness(id, is_verify, index) {
      let vm = this
      let switchTo = vm.enums.business_active.TRUE

      if (is_verify == false) {
        switchTo = vm.enums.business_active.FALSE
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
            verify: switchTo,
            loading: true,
          }
          vm.$axios
            .$post('massage_list/update_verify', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('massage_list'),
                vm.$t('done')
              )
              vm.get(false)
            }).catch(error => {
              this.items[index].is_verify = !is_verify
          })
        } else if (result.isDismissed) {
          this.items[index].is_verify = !is_verify
        }
      })
    },
  }
}
</script>
