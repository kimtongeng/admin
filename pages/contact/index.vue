<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalDetailShow">
      <modal-detail :form-item="rowItem" @closeModal="closeModalDetail"/>
    </div>

    <div v-if="modalViewDeviceShow">
      <modal-view-device :form-item="rowItem" @closeModal="closeModalViewDevice"/>
    </div>
    <!-- End modal Component -->

    <i-form
      ref="table_default"
      :enable-date-picker="true"
      :date-picker-props="datePickerProps"
      @datePickerSelected="datePickerSelected"
      :button-add="false"
      :enable-sort="true"
      :enable-table-action="true"
      :filter="filter"
      :pagination="pagination"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      :table-data="items" 
      :table-header="header"
      :title="$t('contact')"
      module-key="contact"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
      @sortChange="get()"
      :enable-filter="true"
      @filterClick="get()"
      @resetFilterClick="resetFilterData(); get()"
    >

      <!-- filter block -->
      <template #filter>
        <!-- Role -->
        <b-col cols="12" lg="6" xl="6">
            <b-form-group
              :label="$t('role')"
              label-for="role"
              label-class="control-label"
            >
              <b-form-select
                v-model="typeSelectData"
                type="text"
                :placeholder="$t('role')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('role') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="property_owner"
                >{{ $t('property_owner') }}
                </b-form-select-option>
                <b-form-select-option :value="agency"
                >{{ $t('agency') }}
                </b-form-select-option>
                <b-form-select-option :value="sale_assistance"
                >{{ $t('sale_assistance') }}
                </b-form-select-option>
                <b-form-select-option :value="seller"
                >{{ $t('seller') }}
                </b-form-select-option>
                <b-form-select-option :value="hotel_owner"
                >{{ $t('hotel_owner') }}
                </b-form-select-option>
                <b-form-select-option :value="attraction_owner"
                >{{ $t('attraction_owner') }}
                </b-form-select-option>
                <b-form-select-option :value="massage_owner"
                >{{ $t('massage_owner') }}
                </b-form-select-option>
                <b-form-select-option :value="massager"
                >{{ $t('massage_therapist') }}
                </b-form-select-option>
                <b-form-select-option :value="news"
                >{{ $t('recipient') }}
                </b-form-select-option>
                <b-form-select-option :value="ktv_owner"
                >{{ $t('ktv_owner') }}
                </b-form-select-option>
                <b-form-select-option :value="ktv_girl"
                >{{ $t('ktv_girl') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        <!-- status -->
          <b-col cols="12" lg="6" xl="6">
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
                <b-form-select-option :value="enums.contact_status.ACTIVATED"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.contact_status.NOT_ACTIVATE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
      </template>

      <!-- Filter Area-->
      <template #cell(action)="row">
        <i-table-action-dropdown
          :enable-edit-action="false"
          module-key="contact"
          @deleteClick="deleteItem(row.item)"
        >
          <b-dropdown-item
            v-if="isSuper()"
            @click="viewDevice(row.item)"
          >
            <i class="simple-icon-screen-smartphone"></i>
            <span class="ml-3 mb-2">{{ $t('device') }}</span>
          </b-dropdown-item>

          <b-dropdown-item
            v-if="checkModuleAuthorize('contact', 'detail')"
            @click="viewDetail(row.item)"
          >
            <i class="simple-icon-eye"></i>
            <span class="ml-3 mb-2">{{ $t('view') }}</span>
          </b-dropdown-item>
        </i-table-action-dropdown>
      </template>

      <!-- Table Custom Field Area -->
      <template #cell(profile_image)="row">
        <i-table-image-viewer
          :image="row.item.profile_image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="contact"
        ></i-table-image-viewer>
      </template>

      <template #cell(cover_image)="row">
        <i-table-image-viewer
          :image="row.item.cover_image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="contact"
        ></i-table-image-viewer>
      </template>

      <template #cell(type)="row">
        <b-badge variant="primary"><span>{{ $t('customer') }}</span></b-badge>
        <b-badge variant="warning">
          <span
            v-if="row.item.is_property_owner == enums.is_true.YES || row.item.is_property_owner == enums.is_true.SUSPEND">
              {{ $t('property_owner') }}
            <template v-if="row.item.is_property_owner == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)</template>
          </span>
        </b-badge>
        <b-badge variant="danger">
          <span v-if="row.item.is_agency == enums.is_true.YES">
            {{ $t('agency') }}
          </span>
        </b-badge>
        <b-badge variant="success">
          <span v-if="row.item.is_sale_assistance == enums.is_true.YES">
            {{ $t('sale_assistance') }}
          </span>
        </b-badge>
        <b-badge variant="secondary">
          <span
            v-if="row.item.is_seller == enums.is_true.YES || row.item.is_seller == enums.is_true.SUSPEND">
              {{ $t('seller') }}
            <template v-if="row.item.is_seller == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)</template>
          </span>
        </b-badge>
        <b-badge variant="info">
          <span
            v-if="row.item.is_hotel_owner == enums.is_true.YES || row.item.is_hotel_owner == enums.is_true.SUSPEND">
              {{ $t('hotel_owner') }}
            <template v-if="row.item.is_hotel_owner == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)</template>
          </span>
        </b-badge>
        <b-badge variant="light">
          <span v-if="row.item.is_massager == enums.is_true.YES">
            {{ $t('massage_therapist') }}
          </span>
        </b-badge>
        <b-badge variant="dark">
          <span v-if="row.item.is_massage_owner == enums.is_true.YES || row.item.is_massage_owner == enums.is_true.SUSPEND">
            {{ $t('massage_owner') }}
            <template v-if="row.item.is_massage_owner == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)</template>
          </span>
        </b-badge>
        <b-badge variant="info">
          <span v-if="row.item.is_attraction_owner == enums.is_true.YES || row.item.is_attraction_owner == enums.is_true.SUSPEND">
            {{ $t('attraction_owner') }}
            <template v-if="row.item.is_attraction_owner == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)
            </template>
          </span>
        </b-badge>
        <b-badge variant="success">
          <span v-if="row.item.is_news == enums.is_true.YES">
            {{ $t('recipient') }}
          </span>
        </b-badge>
        <b-badge variant="info">
          <span v-if="row.item.is_ktv_owner == enums.is_true.YES || row.item.is_ktv_owner == enums.is_true.SUSPEND">
            {{ $t('ktv_owner') }}
            <template v-if="row.item.is_ktv_owner == enums.is_true.SUSPEND">
              (<span class="text-danger">{{ $t('suspend') }}</span>)
            </template>
          </span>
        </b-badge>
        <b-badge variant="light">
          <span v-if="row.item.is_ktv_girl == enums.is_true.YES">
            {{ $t('ktv_girl') }}
          </span>
        </b-badge>
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('contact', 'change_status')"
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(business_type)="row">
        <b-button
          style="font-size: 20px;"
          variant='link'
          @click='row.toggleDetails'
        >
          <i
            v-show='!row.detailsShowing'
            class='iconsminds-arrow-next'
          ></i>
          <i
            v-show='row.detailsShowing'
            class='iconsminds-arrow-down-3'
          ></i>
        </b-button>
      </template>

      <template #row-details='row'>
        <b-card>
          <template v-if="row.item.is_property_owner != enums.is_true.NO
            || row.item.is_hotel_hotel_owner != enums.is_true.NO
            || row.item.is_attraction_owner != enums.is_true.NO
            || row.item.is_seller != enums.is_true.NO
            || row.item.is_massage_owner != enums.is_true.NO
            || row.item.is_ktv_owner != enums.is_true.NO">
            <b-row class='font-weight-bold mb-2'>
              <b-col>{{ $t('business') }}</b-col>
              <b-col>{{ $t('active') }}</b-col>
            </b-row>
            <div class="separator-custom mb-2"></div>
            <div class="ml-3">
              <b-row v-if="row.item.is_property_owner != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('property') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_property_owner_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.PROPERTY, row.item.is_property_owner_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="row.item.is_attraction_owner != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('attraction') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_attraction_owner_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.ATTRACTION, row.item.is_attraction_owner_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="row.item.is_hotel_owner != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('hotel') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_hotel_owner_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.ACCOMMODATION, row.item.is_hotel_owner_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="row.item.is_massage_owner != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('massage') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_massage_owner_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.MASSAGE, row.item.is_massage_owner_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="row.item.is_seller != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('shop') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_seller_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.SHOP_RETAIL ||
                      enums.business_type.SHOP_WHOLESALE ||
                      enums.business_type.SHOP_LOCAL_PRODUCT ||
                      enums.business_type.RESTAURANT ||
                      enums.business_type.SERVICE, row.item.is_seller_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
              <b-row v-if="row.item.is_ktv_owner != enums.is_true.NO" class="mb-2">
                <b-col>{{ $t('ktv_place') }}</b-col>
                <b-col>
                  <b-form-checkbox
                    v-model="row.item.is_ktv_owner_active" switch
                    @change="blockBusinessByType(row.item.id, enums.business_type.KTV, row.item.is_ktv_owner_active, row.index)"
                  >
                  </b-form-checkbox>
                </b-col>
              </b-row>
            </div>
          </template>

          <template v-else>
            <center><span class="text-muted">{{ $t('no_data') }}</span></center>
          </template>
        </b-card>
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
  moduleKey: 'contact',
  head() {
    return {
      title: this.$t('contact'),
    }
  },
  components: {
    ModalDetail: () => import('./components/ModalDetail'),
    ModalViewDevice: () => import('./components/ModalViewDevice'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer
  },
  data() {
    return {
      header: [
        {
          key: 'profile_image',
          label: this.$t('profile_image'),
          sortable: false,
          tdClass: 'imageTdWidth',
        },
        {
          key: 'cover_image',
          label: this.$t('cover_image'),
          sortable: false,
          tdClass: 'imageTdWidth',
        },
        {
          key: 'fullname',
          label: this.$t('fullname'),
          sortable: true,
        },
        {
          key: 'type',
          label: this.$t('role'),
          sortable: false,
          tdClass: 'nameTdWidth',
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
        },
        {
          key: 'show',
          label: this.$t('show'),
          sortable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
        },
        {
          key: 'business_type',
          label: this.$t('block_business'),
          thClass: 'text-center',
          tdClass: 'text-center',
        },
      ],
      apiUrl: process.env.API_URL,
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
      modalDetailShow: false,
      modalViewDeviceShow: false,
      filter: {
        search: null,
        type: null,
        status: null,
        date_time_picker: null,
      },
      defaultFilter: {
        search: null,
        type: null,
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
      typeSelectData: null,
      property_owner: 1,
      agency: 2,
      sale_assistance: 3,
      seller: 4,
      hotel_owner: 5,
      attraction_owner: 6,
      massage_owner: 7,
      massager: 8,
      news: 9,
      ktv_owner: 10,
      ktv_girl: 11,
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
      this.$axios.$post('contact/get', input).then(({data}) => {
        vm.setInput(data)
        console.log(data.type);
      })
    },
    /**
     * open modal for view account
     */
    viewDetail(item) {
      this.modalDetailShow = true

      this.rowItem = Object.assign({}, item)
    },
    viewDevice(item) {
      this.modalViewDeviceShow = true

      this.selectedItem = item

      this.rowItem = Object.assign({}, this.selectedItem)
    },
    /**
     * delete selected contact
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
            let input = {
              id: item.id,
              loading: false,
            }
            input.filter = this.getInput()
            vm.$axios
              .$post('contact/delete', input)
              .then((data) => {
                this.get()
                vm.$notify(
                  'success',
                  vm.$t('model'),
                  vm.$t('done')
                )
                swal.close()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    setFilter() {
      this.filter.type = null
      if(this.$helpers.nullToVoid(this.typeSelectData) != ''){
        if(this.typeSelectData == this.property_owner) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.agency) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.sale_assistance) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.seller) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.hotel_owner) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.attraction_owner) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.massage_owner) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.massager) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.news) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.ktv_owner) {
          this.filter.type = this.typeSelectData
        } else if (this.typeSelectData == this.ktv_girl) {
          this.filter.type = this.typeSelectData
        }
      }
    },
    /** get input */
    getInput() {
      this.setFilter()
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
    closeModalDetail(modal) {
      this.modalDetailShow = modal
    },
    /**
     * Change status
     */
    statusShowSwitch(id, status, index) {
      let vm = this
      let switchToStatus = vm.enums.contact_status.ACTIVATED

      if (status == false) {
        switchToStatus = vm.enums.contact_status.NOT_ACTIVATE
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
            .$post('contact/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('contact'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
      })
    },
    closeModalViewDevice(modal) {
      this.modalViewDeviceShow = modal
    },
    blockBusinessByType(id, businessType, active, index) {
      let vm = this

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
            business_type: businessType,
            active: active,
            loading: true,
          }
          vm.$axios
            .$post('contact/block_business', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('contact'),
                vm.$t('done')
              )
              vm.get(false)
            }).catch(error => {
            vm.setOldActiveBusiness(businessType, active, index)
          })
        } else if (result.isDismissed) {
          vm.setOldActiveBusiness(businessType, active, index)
        }
      })
    },
    setOldActiveBusiness(businessType, active, index) {
      if (businessType == this.enums.business_type.PROPERTY) {
        this.items[index].is_property_owner_active = !active
      } else if (businessType == this.enums.business_type.ACCOMMODATION) {
        this.items[index].is_hotel_owner_active = !active
      } else if (businessType == this.enums.business_type.ATTRACTION) {
        this.items[index].is_attraction_owner_active = !active
      } else if (businessType == this.enums.business_type.SHOP_RETAIL ||
        businessType == this.enums.business_type.SHOP_WHOLESALE ||
        businessType == this.enums.business_type.SHOP_LOCAL_PRODUCT ||
        businessType == this.enums.business_type.RESTAURANT ||
        businessType == this.enums.business_type.SERVICE
        ) {
          this.items[index].is_seller_active = !active
      } else if (businessType == this.enums.business_type.MASSAGE) {
        this.items[index].is_massager_owner_active = !active
      } else if (businessType == ThumbListItem.enums.business_type.KTV) {
        this.item[index].is_ktv_owner_active = !active
      }
    },
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    resetFilterData() {
      this.filter = this.defaultFilter
      this.typeSelectData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    refresh(){
      this.resetFilterData()
      this.get()
    },
  },
}
</script>
<style scoped>
.separator-custom {
  border-bottom: 1px solid #f1ebeb;
}
</style>
