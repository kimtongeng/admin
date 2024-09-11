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
      module-key="attraction"
      :title="$t('attraction')"
      :table-header="header"
      :table-data="items"
      :enable-table-action="true"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
      :enable-filter="true"
      :filter="filter"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
      :enable-sort="true"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      @sortChange="get()"
      :pagination="pagination"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
    >
      <!-- Filter Area-->
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

      <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="attraction"
          @editClick="editItem(row.item)"
          :enable-delete-action="false"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('attraction', 'detail')"
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
          path="attraction/thumbnail"
        ></i-table-image-viewer>
      </template>

      <template #cell(province_name)="row">
        {{ getNameByLang(row.item.province_name) }}
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('attraction', 'change_status')"
          v-model="row.item.active" switch
          @change="activeShowSwitch(row.item.id, row.item.active, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(app_fee)="row">
        {{ row.item.app_fee }} %
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
import moment from 'moment'
import {mapGetters} from 'vuex'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'attraction',
  head() {
    return {
      title: this.$t('attraction'),
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
          label: this.$t('title'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'province_name',
          label: this.$t('province_name'),
          sortable: true,
        },
        {
          key: 'contact_name',
          label: this.$t('owner_name'),
          sortable: false,
        },
        {
          key: 'address',
          label: this.$t('address'),
          sortable: false,
          tdClass: 'descriptionTdWidth'
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
        business_owner_id: null,
        province_id: null,
        verify: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        business_owner_id: null,
        province_id: null,
        verify: null,
        status: null,
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
        show_select_time_btn: true,
        show_confirm_btn: true,
        format: 'DD/MM/YYYY HH:mm:ss',
        value_type: 'YYYY-MM-DD HH:mm:ss',
      },
      businessOwnerList: [],
      businessOwnerData: null,
      provinceList: [],
      provinceData: null,
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
  },
  created() {
    this.get(false)
    this.getSelectData(true)
  },
  methods: {
    refresh() {
      this.resetSort()
      this.resetFilterData()
      this.get()
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('attraction_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.businessOwnerData) != '') {
        this.filter.business_owner_id = this.businessOwnerData.id
      }

      if (this.$helpers.nullToVoid(this.provinceData) != '') {
        this.filter.province_id = this.provinceData.id
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
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.businessOwnerData = null
      this.propertyTypeData = null
      this.provinceData = null
      this.districtData = null
      this.communeData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null;

      this.filter = Object.assign({}, this.defaultFilter)
    },
    viewDetail(item) {
      this.$router.push('/business/attraction/view_detail?id=' + item.id);
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
                      .$post('attraction_list/change_active', input)
                      .then(({data}) => {
                          swal.close()
                          vm.$notify(
                              'success',
                              vm.$t('attraction'),
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
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    getSelectData(loading = true) {
      let vm = this

      vm.$axios
        .$post('attraction_list/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.businessOwnerList = data.business_owner
          vm.provinceList = data.province
        })
    },
    resetBusinessOwnerList() {
      this.businessOwnerData = null
      this.filter.business_owner_id = null
    },
    resetProvinceList() {
      this.provinceData = null
      this.filter.province_id = null
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
            .$post('attraction_list/update_verify', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('attraction_list'),
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
