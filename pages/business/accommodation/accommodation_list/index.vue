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
     module-key="accommodation_list"
      :title="$t('accommodation_list')"
      :table-header="header"
      :table-data="items"
      :enable-table-action="true"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      :pagination="pagination"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
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

        <!-- hotel_type-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('hotel_type')"
            label-for="hotel_type"
            label-class="control-label"
          >
            <b-multi-select
              v-model="hotelTypeData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="hotelTypeList"
              :placeholder="$t('hotel_type')"
              @reset="resetHotelTypeList"
            >
            </b-multi-select>
          </b-form-group>
        </b-col>

        <!-- province_name-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('province_name')"
            label-for="province_name"
            label-class="control-label"
          >
            <b-multi-select
              v-model="provinceData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="provinceList"
              :placeholder="$t('province_name')"
              @reset="resetProvinceList"
              @input="getDistrictByProvince"
            >
            </b-multi-select>
          </b-form-group>
        </b-col>

        <!-- district_name-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('district_name')"
            label-for="district_name"
            label-class="control-label"
          >
            <b-multi-select
              v-model="districtData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="districtList"
              :placeholder="$t('district_name')"
              :disabled="$helpers.nullToVoid(provinceData) == ''"
              @reset="resetDistrictList"
            >
            </b-multi-select>
          </b-form-group>
        </b-col>

        <!-- price-->
        <b-col cols="12" lg="4" xl="4">
          <b-row>
            <b-col cols="6">
              <b-form-group
                :label="$t('price_min')"
                label-for="price_min"
                label-class="control-label"
              >
                <b-form-input
                  v-model="filter.price.min"
                  min="0"
                  type="number"
                  :placeholder="$t('price_min')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="6">
              <b-form-group
                :label="$t('price_max')"
                label-for="price_max"
                label-class="control-label"
              >
                <b-form-input
                  v-model="filter.price.max"
                  min="0"
                  type="number"
                  :placeholder="$t('price_max')"
                />
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
    <!-- End Filter Area -->

    <!-- Table Action Area -->
    <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="accommodation_list"
          @editClick="editItem(row.item)"
          :enable-delete-action="false"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('accommodation_list', 'detail')"
            @click="viewDetail(row.item)">
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
          path="accommodation/logo"
        ></i-table-image-viewer>
      </template>

      <template #cell(business_type_name)="row">
        {{ getBusinessTypeName(row.item.business_type_id) }}
      </template>

    <template #cell(province_name)="row">
        {{ getNameByLang(row.item.province_name) }}
      </template>

      <template #cell(district_name)="row">
        {{ getNameByLang(row.item.district_name) }}
      </template>

      <template #cell(price)="row">
        {{ row.item.price | currency('$', 2) }}
      </template>

      <template #cell(app_fee)="row">
        {{ row.item.app_fee }} %
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('accommodation_list', 'change_status')"
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
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'accommodation_lits',
  head() {
    return {
      title: this.$t('accommodation_list')
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
          tdClass: 'imageTdWidth'
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'contact_name',
          label: this.$t('owner'),
          sortable: false,
        },
        {
          key: 'business_type_name',
          label: this.$t('business_type'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'business_category_name',
          label: this.$t('hotel_type'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'province_name',
          label: this.$t('province_name'),
          sortable: false,
        },
        {
          key: 'district_name',
          label: this.$t('district_name'),
          sortable: false,
        },
        {
          key: 'contact_name',
          label: this.$t('owner_name'),
          sortable: false,
        },
        {
          key: 'price',
          label: this.$t('price'),
          sortable: true,
          tdClass: 'moneyTdWidth text-center'
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
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
          sortable: false,
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
      rowItem: {},
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        date_time_picker: null,
        business_category_id: null,
        business_owner_id: null,
        province_id: null,
        district_id: null,
        verify: null,
        status: null,
        price: {
          min: null,
          max: null,
        }
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        business_category_id: null,
        business_owner_id: null,
        province_id: null,
        district_id: null,
        verify: null,
        status: null,
        price: {
          min: null,
          max: null,
        }
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
      apiUrl: process.env.API_URL,
      businessOwnerList: [],
      businessOwnerData: null,
      hotelTypeList: [],
      hotelTypeData: null,
      provinceList: [],
      provinceData: null,
      districtList: [],
      districtData: null,
    }
  },
  watch: {
    provinceList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map(obj => {
            obj.name = this.getNameByLang(obj.name)
            return obj
          })
        }
      }
    },
    districtList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map(obj => {
            obj.name = this.getNameByLang(obj.name)
            return obj
          })
        }
      }
    },
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
    refresh() {
      this.resetSort()
      this.resetFilterData()
      this.get()
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('accommodation_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.businessOwnerData) != '') {
        this.filter.business_owner_id = this.businessOwnerData.id
      }

      if (this.$helpers.nullToVoid(this.hotelTypeData) != '') {
        this.filter.business_category_id = this.hotelTypeData.id
      }

      if (this.$helpers.nullToVoid(this.provinceData) != '') {
        this.filter.province_id = this.provinceData.id
      }

      if (this.$helpers.nullToVoid(this.districtData) != '') {
        this.filter.district_id = this.districtData.id
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
            .$post('accommodation_list/change_active', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('accommodation_list'),
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
    viewDetail(item) {
      this.$router.push('/business/accommodation/accommodation_list/view_detail?id=' + item.id);
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
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    getSelectData(loading = true) {
      let vm = this

      vm.$axios
        .$post('accommodation_list/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.businessOwnerList = data.business_owner
          vm.hotelTypeList = data.hotel_type
          vm.provinceList = data.province
        })
    },
    getDistrictByProvince() {
      let vm = this

      if (vm.$helpers.nullToVoid(this.provinceData) != '') {
        let input = {
          province_id: vm.provinceData.id,
          loading: false
        }
        vm.$axios
          .$post('dropdown/get_district_by_province', input)
          .then(({data}) => {
            vm.districtList = data
          })
      }
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.businessOwnerData = null
      this.hotelTypeData = null
      this.provinceData = null
      this.districtData = null
      this.filter.price.min = null
      this.filter.price.max = null
      this.$refs.table_default.$refs.date_picker.dateTime = null;

      this.filter = Object.assign({}, this.defaultFilter)
    },
    resetBusinessOwnerList() {
      this.businessOwnerData = null
      this.filter.business_owner_id = null
    },
    resetHotelTypeList() {
      this.hotelTypeData = null
      this.filter.business_category_id = null
    },
    resetProvinceList() {
      this.provinceData = null
      this.filter.province_id = null
    },
    resetDistrictList() {
      this.districtData = null
      this.filter.district_id = null
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
            .$post('accommodation_list/update_verify', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('accommodation_list'),
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
