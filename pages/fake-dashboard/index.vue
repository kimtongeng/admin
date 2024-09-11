<template>
  <div>

    <div v-if="modalDetailShow">
      <modal-detail :form-item="row" @closeModal="closeModalDetail"/>
    </div>

    <div v-if="modalViewDeviceShow">
      <modal-view-device :form-item="row" @closeModal="closeModalViewDevice"/>
    </div>
    <!-- End modal Component -->
    <b-collapse class="mt-2 mb-3" v-model="showExampleCollapse">
      <i-form
        :title="$t('dashboard')"
        :table-header="tableHeader"
        :table-data="tableData"
        
        :filter="filter"
        :enable-filter="true"
        :pagination="pagination"
        @paginationClick="get()"
        
        @searchInput="get(false)"

        :enable-sort="true"
        :sort-by.sync="sortBy"
        :sort-type.sync="sortType"
        @sortChange="get()"

        :enable-table-action="true"

        :button-refresh="true"
        @refreshClick="refresh()"

        :enable-date-picker="true"
        :date-picker-props="datePickerProps"
        @datePickerSelected="datePickerSelected"
      >
      <template #filter>
          <b-col cols="6">
            <b-form-group
              :label="$t('status')"
              label-for="status"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.status"
              >
                <template slot="first">
                  <b-form-select-option :value="null" :disabled="true">{{
                      $t('status')
                    }}
                  </b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="(obj, index) in enums.transaction_fee_status_list"
                  :key="index"
                  :value="obj.id"
                >
                  {{ $t(obj.name) }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col cols="6">
            <b-form-group
              :label="$t('status')"
              label-for="status"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.status"
              >
                <template slot="first">
                  <b-form-select-option :value="null" :disabled="true">{{
                      $t('status')
                    }}
                  </b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="(obj, index) in enums.transaction_fee_status_list"
                  :key="index"
                  :value="obj.id"
                >
                  {{ $t(obj.name) }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
        </template>

      <template #cell(cover_image)="row">
        <i-table-image-viewer
          :image="row.item.cover_image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="contact"
        ></i-table-image-viewer>
      </template>

      <template #cell(profile_image)="row">
        <i-table-image-viewer
          :image="row.item.profile_image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="contact"
        ></i-table-image-viewer>
      </template>

      <template #cell(show)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('contact', 'change_status')"
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>
      
      <template #cell(created_at)="row">
          {{ row.item.created_at | dateTimeFormat  }}
        </template>


      <template #cell(action)="row">
          <i-table-action-dropdown
            module-key="default_form"
            :enable-delete-action="true"
            @deleteClick="deleteItem(row.item)"
          >

          <b-dropdown-item
              v-if="checkModuleAuthorize('default_form', 'detail')"
              @click="viewDevice(row.item)"
            >
              <i class="simple-icon-eye"></i>
              <span class="ml-3 mb-2">{{ $t('device') }}</span>
            </b-dropdown-item>
            
          <b-dropdown-item
              v-if="checkModuleAuthorize('default_form', 'detail')"
              @click="viewDetail(row.item)"
            >
              <i class="simple-icon-eye"></i>
              <span class="ml-3 mb-2">{{ $t('detail') }}</span>
            </b-dropdown-item>

            
          </i-table-action-dropdown>
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

      </i-form>
    </b-collapse>
  </div>
</template>

<script>
import swal from 'sweetalert2'
import iForm from '~/components/IDGForm/iForm.vue'
import { dateTimeFormat } from '~/plugins/utils/string';
export default {
  components: { iForm },
  layout: 'app',

  data() {
    return {
      showExampleCollapse: true,
      apiUrl: process.env.apiUrl,
      
      tableHeader: [
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
      tableData: [],
      filter: {
        search: null,
        date_time_picker:null
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
        type: 'date',
        range: true,
        date_time_value: [],
        show_select_time_btn: true,
        show_confirm_btn: true,
        format: 'DD/MM/YYYY',
        value_type: 'YYYY-MM-DD',
      },
      row:{}
    }
  },
  // END DATA

  // START METHOD
  methods: {

    async get(loading = true) {
      const vm = this
      let fille = {
        filter: this.filter,
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        sort_by: this.sortBy,
        sort_type: this.sortType,
      }
      fille.loading = loading
      await this.$axios.$post('contact/get', fille).then(({ data }) => {
        this.setInput(data)
      })
    },

    setInput(data) {
      this.tableData = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },

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
    refresh(){
      this.get();
    },
  
    datePickerSelected(date){
      this.filter.date_time_picker = date;
      this.get(); 
    },
    viewDevice(item){
      this.row = item;
     

    },
    viewDetail(item){
      this.row = item;
      
    },
  },
  // END METHOD
  created() {
    this.get()
  },
}
</script>

<style lang="scss" scoped></style>
