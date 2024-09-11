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
      module-key="shop_list"
      :title="$t('shop_list')"
      :table-header="header"
      :table-data="items"
      :enable-table-action="true"
      @paginationClick="get()"
      :pagination="pagination"
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

        <!-- business type -->
          <b-col xl="4" lg="4" cols="12">
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
                <b-form-select-option :value="enums.business_type.SHOP_RETAIL"
                >{{ $t('shop_retail') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.SHOP_WHOLESALE"
                >{{ $t('shop_wholesale') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.RESTAURANT"
                >{{ $t('restaurant') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.SHOP_LOCAL_PRODUCT"
                >{{ $t('shop_local_product') }}
                </b-form-select-option>
                 <b-form-select-option :value="enums.business_type.SERVICE"
                >{{ $t('service') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.business_type.MODERN_COMMUNITY"
                >{{ $t('modern_community') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- business_owner_name-->
          <b-col cols="12" lg="4" xl="4">
            <b-form-group
              :label="$t('shop_category')"
              label-for="shop_category"
              label-class="control-label"
            >
              <b-multi-select
                v-model="businessCategoryData"
                :multiple="false"
                label="category_name"
                track-by="category_name"
                :options="businessCategoryList"
                :placeholder="$t('shop_category')"
                @reset="resetBusinessCategoryList"
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
          module-key="shop_list"
          @editClick="editItem(row.item)"
          :enable-delete-action="false"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('shop_list', 'detail')"
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
          path="shop/logo"
        ></i-table-image-viewer>
      </template>

      <template #cell(business_type_name)="row">
        {{ getBusinessTypeName(row.item.business_type_id) }}
      </template>

      <template #cell(business_category)="row">
        <div v-if="$helpers.nullToVoid(row.item.business_category) != ''">
          <div
            v-for="business_category in row.item.business_category"
            :key="business_category.id"
          >
            {{ getNameList(business_category.business_category_name) }}
          </div>
        </div>
      </template>

      <template #cell(app_fee)="row">
        {{ row.item.app_fee }} %
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <!-- updated change status -->
      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('shop_list', 'change_status')"
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
    <!-- End Custom Field -->
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
  middleware: 'acl',
  moduleKey: 'shop_list',
  head() {
    return {
      title: this.$t('shop_list')
    }
  },
  components: {
    Modal: () => import('./components/Modal'),
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
          key: 'business_category',
          label: this.$t('shop_category'),
          sortable: true,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'address',
          label: this.$t('location'),
          sortable: true,
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
      apiUrl: process.env.API_URL,
      rowItem: {},
      modalType: 0,
      modalShow: false,
      filter: {
        search: null,
        business_owner_id: null,
        business_type_id: null,
        category_id: null,
        location: null,
        date_time_picker: null,
        verify: null,
        status: null,
      },
      defaultFilter: {
        search: null,
        business_owner_id: null,
        business_type_id: null,
        category_id: null,
        location: null,
        date_time_picker: null,
        verify: null,
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
        // single_date_time: '',
        show_select_time_btn: true,
        show_confirm_btn: true,
        format: 'DD/MM/YYYY HH:mm:ss',
        value_type: 'YYYY-MM-DD HH:mm:ss',
      },
      businessOwnerList: [],
      businessOwnerData: null,
      businessCategoryList: [],
      businessCategoryData: null,
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
    getNameList(name) {
      if (!name) return '';

      let parsedName = JSON.parse(name);
      let data;
      if (Array.isArray(parsedName)) {
        data = parsedName.map(item => item.en_US).join(', ');
      } else {
        data = parsedName.en_US || '';
      }
      return data;
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('shop_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    // get Input Filter
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.businessOwnerData) != '') {
        this.filter.business_owner_id = this.businessOwnerData.id
      }

      if (this.$helpers.nullToVoid(this.businessCategoryData) != '') {
        this.filter.category_id = this.businessCategoryData.id
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
    // select date
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    resetFilterData() {
      this.businessOwnerData = null
      this.filter.business_type_id = null
      this.businessCategoryData = null
      this.filter.location = null

      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    // refresh
    refresh(){
      this.get()
      this.resetFilterData()
      this.resetSort()
    },
    viewDetail(item) {
      this.$router.push('/business/shop/shop_list/view_detail?id=' + item.id);
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

      vm.$axios
        .$post('shop_list/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.businessOwnerList = data.business_owner,
          vm.businessCategoryList = data.business_category
        })
    },
    resetBusinessOwnerList() {
      this.businessOwnerData = null
      this.filter.business_owner_id = null
    },
    resetBusinessCategoryList() {
      this.businessCategoryData = null
      this.filter.category_id = null
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
            .$post('shop_list/change_active', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('shop_list'),
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
            .$post('shop_list/update_verify', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('shop_list'),
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
<style scoped>
.name-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.name-list-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.name-list-item strong {
  flex: 0 0 100px; /* Adjust the width as needed */
}

.name-value {
  flex: 1;
  padding-left: 7px;
}

.name-list-item strong::after {
  padding-left: 7px;
}
</style>
