<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalDetailShow">
      <modal-detail :form-item="rowItem" @closeModal="closeModalDetail"/>
    </div>
    <!-- End modal Component -->

    <!-- Example -->
    <div class="page-title" style="cursor: pointer">
      <span @click="showExampleCollapse = !showExampleCollapse">Example</span>
      <i
        :class="showExampleCollapse ? 'simple-icon-arrow-down' : 'simple-icon-arrow-right'"
        style="font-size: 15px;"
        @click="showExampleCollapse = !showExampleCollapse"></i>
      <div class="separator mb-2"></div>
    </div>

    <b-collapse class="mt-2 mb-3" v-model="showExampleCollapse">

      <div>
        <b-form-group>
          <b-form-radio v-model="isTabContent" :value="false">Normal Table</b-form-radio>
          <b-form-radio v-model="isTabContent" :value="true">Tab Content Table</b-form-radio>
        </b-form-group>
      </div>

      <!-- Being Use-->
      <i-form
        ref="table_default"
        module-key="default_form"
        :title="$t('default_form')"
        :table-header="header"
        :table-data="items"
        :table-tab-content="isTabContent"
        :table-tab-content-header="tabContentHeader"
        @tabChange="tabChange"
        :enable-table-action="true"
        :button-refresh="true"
        @refreshClick="refresh()"
        :button-add="true"
        @addClick="addItem"
        :enable-action-dropdown="true"
        :enable-sort="true"
        :sort-by.sync="sortBy"
        :sort-type.sync="sortType"
        @sortChange="get()"
        :enable-date-picker="true"
        :date-picker-props="datePickerProps"
        @datePickerSelected="datePickerSelected"
        :button-excel="true"
        @excelClick="excelClick"
        :button-print="true"
        @printClick="printClick"
        :enable-filter="true"
        :filter="filter"
        @filterClick="filterClick"
        @resetFilterClick="resetFilterClick"
        :pagination="pagination"
        @paginationClick="get()"
        @searchInput="get(false)"
      >
        <!-- Header Action Dropdown Area -->
        <template #action-dropdown>
          <b-dropdown-item
            @click="comingSoon()"
          >
            <i class="iconsminds-magnifi-glass"></i>
            <span class="ml-3">Coming Soon</span>
          </b-dropdown-item>
        </template>

        <!-- Filter Area (Dynamic Html)-->
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

        <!-- Table Action Area -->
        <template #cell(action)="row">
          <i-table-action-dropdown
            module-key="default_form"
            :enable-edit-action="true"
            @editClick="editItem(row.item)"
            :enable-delete-action="true"
            @deleteClick="deleteItem(row.item)"
          >
            <b-dropdown-item
              v-if="checkModuleAuthorize('default_form', 'detail')"
              @click="view(row.item)"
            >
              <i class="simple-icon-eye"></i>
              <span class="ml-3 mb-2">{{ $t('view') }}</span>
            </b-dropdown-item>
          </i-table-action-dropdown>
        </template>

        <!-- updated Verify
    <template #cell(verify)="row">
      <i-table-action-verify
        :id="row.item.id"
        :verify="row.item.verify"
        :index="row.index"
        @updateVerify="updateVerifyBusiness(row.item.id, row.item.verify, row.index, $event)"
      ></i-table-action-verify>
    </template> -->

        <!-- Table Custom Field Area -->
        <template #cell(profile_image)="row">
          <i-table-image-viewer
            :image="row.item.profile_image"
            :popover-image-width="500"
            :popover-image-height="200"
            path="contact"
          ></i-table-image-viewer>
        </template>

        <template #cell(cover_image)="row">
          <i-table-image-viewer
            :image="row.item.cover_image"
            :popover-image-width="500"
            :popover-image-height="200"
            path="contact"
          ></i-table-image-viewer>
        </template>

        <template #cell(status)="row">
          <b-button
            size="xs"
            variant="outline-success"
            v-if="row.item.status == enums.contact_status.ACTIVATED"
            @click="changeStatus(row.item.id,enums.contact_status.NOT_ACTIVATE)"
          >{{ $t('activated') }}
          </b-button>
          <b-button
            size="xs"
            variant="outline-danger"
            v-if="row.item.status == enums.contact_status.NOT_ACTIVATE"
            @click="changeStatus(row.item.id,enums.contact_status.ACTIVATED)"
          >{{ $t('not_activate') }}
          </b-button>
        </template>

        <template #cell(created_at)="row">
          {{ row.item.created_at | dateFormat }}
        </template>
        <!-- End Table Custom Field Area -->

        <!-- Table Footer Total Area -->
        <template #footer-total-amount v-if="isTabContent">
         <b-card-title class='float-right'>
            <h4>
              {{ $t('total') }}:
              <span class='text-danger'>
                {{ $helpers.currency(grandTotal, '$', 2) }}
              </span>
            </h4>
        </b-card-title>
        </template>

      </i-form>

    </b-collapse>

    <!-- Document -->
    <i-form-document></i-form-document>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'
import iForm from '~/components/IDGForm/iForm.vue'
import iTableActionDropdown from '~/components/IDGForm/iTableActionDropdown'
import iTableImageViewer from '~/components/IDGForm/iTableImageViewer'
import iFormDocument from "~/components/IDGForm/iFormDocument";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'default_form',
  head() {
    return {
      title: this.$t('default_form'),
    }
  },
  components: {
    ModalDetail: () => import('../../pages/contact/components/ModalDetail'),
    iForm,
    iTableActionDropdown,
    iTableImageViewer,
    iFormDocument
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
      tabContentHeader: [
        {
          key: 'all',
          label: this.$t('all'),
          icon: 'simple-icon-layers'
        },
        {
          key: 'outstanding',
          label: this.$t('outstanding'),
          icon: 'simple-icon-speedometer'
        },
        {
          key: 'paid',
          label: this.$t('paid'),
          icon: 'simple-icon-book-open'
        }
      ],
      isTabContent: false,
      apiUrl: process.env.API_URL,
      items: [],
      rowItem: {},
      modalDetailShow: false,
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      filter: {
        search: null,
        created_at: {
          startDate: null,
          endDate: null,
        },
        status: null
      },
      sortBy: 'created_at',
      sortType: 'desc',
      datePickerProps: {
        editable: false,
        type: 'date',
        range: true,
        date_time_value: [],
        show_select_time_btn: false,
        show_confirm_btn: false,
        format: 'DD/MM/YYYY',
        value_type: 'YYYY-MM-DD',
      },
      showExampleCollapse: true,
    }
  },
  created() {
    this.get(true)
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
      this.$axios.$post('contact/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    view(item) {
      this.modalDetailShow = true

      this.rowItem = Object.assign({}, item)
    },
    addItem() {
      alert('Add Click')
    },
    editItem(item) {
      alert('Edit Click')
    },
    deleteItem(item) {
      alert('Delete Click')
    },
    changeStatus(id, status) {
      alert('Change Status Click')
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
    closeModalDetail(modal) {
      this.modalDetailShow = modal
    },
    filterClick() {
      alert('Filter Click')
    },
    resetFilterClick() {
      alert('Reset Filter Click')
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      //Reset Value on date time picker component
      this.$refs.table_default.$refs.date_picker.setDateTimeValue([null, null])

      //Reset Filter Data
      this.filter = {
        search: null,
        created_at: {
          startDate: null,
          endDate: null,
        },
        status: null
      }
    },
    datePickerSelected(date) {
      this.filter.created_at = date
    },
    comingSoon() {
      alert('Coming Soon Click')
    },
    excelClick() {
      alert('Excel Click')
    },
    printClick() {
      alert('Print Click')
    },
    tabChange(tab){
      if(tab == 'what'){
        //do something
      }
      this.get()
    }
  },
}
</script>
