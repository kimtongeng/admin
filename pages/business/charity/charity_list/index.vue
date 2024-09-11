<template>
  <div>
    <i-form
      ref="table_default"
      module-key="charity_list"
      :title="$t('charity_list')"
      :table-header="header"
      :table-data="items"
      :enable-table-action="true"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      :pagination="pagination"
      @paginationClick="get()"
    >

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

        <!-- charity_category-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('charity_category')"
            label-for="charity_category"
            label-class="control-label"
          >
            <b-multi-select
              v-model="charityTypeData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="charityTypeList"
              :placeholder="$t('charity_category')"
              @reset="resetCharityTypeList"
            >
            </b-multi-select>
          </b-form-group>
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
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_active.FALSE"
                >{{ $t('disable') }}
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
                >{{ $t('verify') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_active.FALSE"
                >{{ $t('un_verify') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
        </b-col>
    </template>

    <!-- updated Verify -->
    <!-- <template #cell(verify)="row">
      <i-table-action-verify
        :id="row.item.id"
        :verify="row.item.verify"
        :index="row.index"
        @updateVerify="updateVerifyBusiness(row.item.id, row.item.verify, row.index, $event)"
      ></i-table-action-verify>
    </template> -->

      <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="charity_list"
          :enable-edit-action="false"
          :enable-delete-action="false"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('charity_list', 'detail')"
            @click="viewDetail(row.item)"
          >
            <i class="simple-icon-eye"></i>
            <span class="ml-3">
              {{ $t('view') }}
            </span>
          </b-dropdown-item>
        </i-table-action-dropdown>
      </template>
    <!-- End Action -->
      <!-- Table Custom Field Area -->
      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-width="500"
          :popover-image-height="200"
          path="charity/organization_logo"
        ></i-table-image-viewer>
      </template>

      <template #cell(business_type_id)="row">
        {{ getBusinessTypeName(row.item.business_type_id) }}
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <template #cell(status)="row">
        <b-badge v-if="row.item.status == enums.business_status.APPROVED" variant="success" pill>
          {{ $t('is_approve') }}
        </b-badge>
        <b-badge v-if="row.item.status == enums.business_status.PENDING" variant="warning" pill>
          {{ $t('not_yet_approve') }}
        </b-badge>
        <b-badge v-if="row.item.status == enums.business_status.DISABLE" variant="danger" pill>
          {{ $t('disable') }}
        </b-badge>
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('charity_list', 'change_status')"
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
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'charity_list',
  head() {
    return {
      title: this.$t('charity_list'),
    }
  },
  components: {
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
          tdClass: 'imageTdWidth'
        },
        {
          key: 'business_type_id',
          label: this.$t('business_type'),
          sortable: false,
        },
        {
          key: 'business_category_name',
          label: this.$t('charity_category'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'name',
          label: this.$t('business_name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'contact_name',
          label: this.$t('owner_name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'phone',
          label: this.$t('phone'),
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
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
        {
          key: 'is_verify',
          label: this.$t('verify'),
          sortable: false,
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: false,
        },
        {
          key: 'show',
          label: this.$t('show'),
          sortable: false,
          thClass: 'text-center',
          tdClass: 'text-center',
        },
      ],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      items: [],
      apiUrl: process.env.API_URL,
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
      filter: {
        search: null,
        date_time_picker: null,
        business_owner_id: null,
        business_category_id: null,
        verify: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        business_owner_id: null,
        business_category_id: null,
        verify: null,
        status: null,
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
      businessOwnerList: [],
      businessOwnerData: null,
      charityTypeList: [],
      charityTypeData: null,
    }
  },
  created() {
    this.get()
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
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('charity_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.businessOwnerData) != '') {
        this.filter.business_owner_id = this.businessOwnerData.id
      }

      if (this.$helpers.nullToVoid(this.charityTypeData) != '') {
        this.filter.business_category_id = this.charityTypeData.id
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
    viewDetail(item) {
      this.$router.push('/business/charity/charity_list/view_detail?id=' + item.id);
    },
    /** Set input */
    setInput(data) {
      this.items = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
    getSelectData(loading = true) {
      let vm = this

      vm.$axios
        .$post('charity_list/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.businessOwnerList = data.business_owner
          vm.charityTypeList = data.charity_type
        })
    },
    refresh() {
      this.get()
      this.resetSort()
      this.resetFilterData()
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.businessOwnerData = null
      this.charityTypeData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null;

      this.filter = Object.assign({}, this.defaultFilter)
    },
    resetBusinessOwnerList() {
      this.businessOwnerData = null
      this.filter.business_owner_id = null
    },
    resetCharityTypeList() {
      this.charityTypeData = null
      this.filter.business_category_id = null
    },
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    activeShowSwitch(id, active, index) {
      let vm = this
      let switchTo = vm.enums.business_status.APPROVED

      if (active == false) {
        switchTo = vm.enums.business_status.PENDING
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
            .$post('charity_list/change_active', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('charity_list'),
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
            .$post('charity_list/update_verify', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('charity_list'),
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
  },
}
</script>
