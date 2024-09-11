<template>
  <div>
    <i-form
      ref="table_default"
      :button-add="true"
      :date-picker-props="datePickerProps"
      :enable-date-picker="true"
      :enable-filter="true"
      :enable-sort="true"
      :enable-table-action="true"
      :filter="filter"
      :pagination="pagination"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      :table-data="items"
      :table-header="header"
      :title="$t('position_banner')"
      module-key="position_banner"
      @addClick="add"
      @datePickerSelected="datePickerSelected"
      @filterClick="get()"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @resetFilterClick="resetFilterData(); get()"
      @searchInput="get(false)"
      @sortChange="get()"
    >
      <!-- filter block -->
      <template #filter>
        <!-- page -->
        <b-col :lg="isRealEstateByPropertyType ? 3 : 4"
               :xl="isRealEstateByPropertyType ? 3 : 4"
               cols="12">
          <b-form-group
            :label="$t('page')"
            :label-for="$t('page')"
            label-class="control-label"
          >
            <b-multi-select
              v-model="pageSelectData"
              :data-vv-as="$t('page')"
              :multiple="false"
              :options="pageList"
              :placeholder="$t('page')"
              label="name"
              track-by="name"
              @input="onChangePage"
              @reset="resetPage()"
            ></b-multi-select>
          </b-form-group>
        </b-col>

        <!-- property_type -->
        <b-col
          v-if="isRealEstateByPropertyType" cols="12" lg="3"
          xl="3"
        >
          <b-form-group
            :label="$t('property_type')"
            label-class="control-label"
            label-for="property_type"
          >
            <b-multi-select
              v-model="propertyTypeSelectData"
              :multiple="false"
              :options="propertyTypeList"
              :placeholder="$t('property_type')"
              label="name"
              track-by="name"
              @reset="resetPropertyType()"
            ></b-multi-select>
          </b-form-group>
        </b-col>

        <!-- position -->
        <b-col :lg="isRealEstateByPropertyType ? 3 : 4"
               :xl="isRealEstateByPropertyType ? 3 : 4"
               cols="12">
          <b-form-group
            :label="$t('position')"
            :label-for="$t('position')"
            label-class="control-label"
          >
            <b-multi-select
              v-model="positionSelectData"
              :data-vv-as="$t('position')"
              :disabled="$helpers.nullToVoid(pageSelectData) == ''"
              :multiple="false"
              :options="positionList"
              :placeholder="$t('position')"
              label="text"
              track-by="text"
              @reset="resetPosition()"
            ></b-multi-select>
          </b-form-group>
        </b-col>

        <!-- status -->
        <b-col
          :lg="isRealEstateByPropertyType ? 3 : 4"
          :xl="isRealEstateByPropertyType ? 3 : 4"
          cols="12"
        >
          <b-form-group
            :label="$t('status')"
            label-class="control-label"
            label-for="status"
          >
            <b-form-select
              v-model="filter.status"
              :placeholder="$t('status')"
              type="text"
            >
              <template slot="first">
                <b-form-select-option :value="null" disabled
                >{{ $t('status') }}
                </b-form-select-option>
              </template>
              <b-form-select-option :value="enums.banner_status.ENABLE"
              >{{ $t('enable') }}
              </b-form-select-option>
              <b-form-select-option :value="enums.banner_status.DISABLE"
              >{{ $t('disable') }}
              </b-form-select-option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </template>

      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="position_banner"
          @deleteClick="deleteItem(row.item)"
          @editClick="editItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>
      <template #cell(platform_type)="row">
        <div
          v-if="row.item.platform_type == enums.position_platform_type.MOBILE"
        >
          {{ $t('mobile') }}
        </div>

        <div
          v-if="row.item.platform_type == enums.position_platform_type.WEB"
        >
          {{ $t('web') }}
        </div>
      </template>

      <template #cell(page)="row">
        {{ getBannerPositionPageName(row.item.platform_type, row.item.page) }}
      </template>

      <template #cell(position)="row">
        <div>
          {{ $t(row.item.name) }}
        </div>

        <div v-if="row.item.page == enums.banner_page.REAL_ESTATE_BY_PROPERTY_TYPE">
          <b>{{ $t('type') }}: </b>
          <span>{{ getPropertyTypeTexById(row.item.reference_id) }}</span>
        </div>
      </template>

      <!-- updated change status -->
      <template #cell(status)="row">
        <b-form-checkbox
          v-if="checkModuleAuthorize('position_banner', 'change_status')"
          v-model="row.item.status" switch
          @change="statusShowSwitch(row.item.id, row.item.status, row.index)"
        >
        </b-form-checkbox>
      </template>

      <template #cell(created_at)="row"
      >{{ row.item.created_at | dateTimeFormat }}
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
  moduleKey: 'position_banner',
  head() {
    return {
      title: this.$t('position_banner'),
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
        // {
        //   key: 'platform_type',
        //   label: this.$t('platform_type'),
        //   sortable: true,
        // },
        {
          key: 'page',
          label: this.$t('page'),
          sortable: true,
        },
        {
          key: 'position',
          label: this.$t('position'),
          sortable: false,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: true,
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
        page: null,
        position: null,
        reference_id: null,
        status: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        page: null,
        position: null,
        reference_id: null,
        status: null
      },
      apiUrl: process.env.API_URL,
      propertyTypeList: [],
      pageList: [],
      positionList: [],
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
      propertyTypeSelectData: null,
      pageSelectData: null,
      positionSelectData: null,
    }
  },
  computed: {
    isRealEstateByPropertyType() {
      return this.pageSelectData && this.pageSelectData.id == this.enums.banner_page.REAL_ESTATE_BY_PROPERTY_TYPE
    }
  },
  watch: {
    pageList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.$t(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
    positionList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.text = this.$t(obj.text)
            return obj
          })
        }
      },
      immediate: true,
    },
    propertyTypeList: {
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
    this.getPageList()
    this.getSelectData(false)
    this.get(true)
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('position_banner/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    add() {
      this.$router.push({path: this.makeLink('/banner_management/position/action?type=add')})
    },
    editItem(item) {
      this.$router.push({path: this.makeLink('/banner_management/position/action?type=update&id=' + item.id)})
    },

    /**
     * delete selected position
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
              .$post('position_banner/delete', input)
              .then(({data}) => {
                swal.close()
                vm.$notify('success', vm.$t('position_banner'), vm.$t('done'))
                vm.get()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
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
     * Change status
     */
    changeStatus(id, status) {
      let vm = this

      let title = ''
      if (status == vm.enums.position_status.DISABLE) {
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
              .$post('position_banner/change_status', input)
              .then(({data}) => {
                swal.close()
                vm.$notify('success', vm.$t('position_banner'), vm.$t('done'))
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
      let switchToStatus = vm.enums.position_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.position_status.DISABLE
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
            .$post('position_banner/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('position_banner'),
                vm.$t('done')
              )
              vm.get(false)
            })
        } else if (result.isDismissed) {
          this.items[index].status = !status
        }
      })
    },
    getSelectData(loading = true) {
      let vm = this

      vm.$axios
        .$post('position_banner/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.propertyTypeList = data.property_type
        })
    },
    getPropertyTypeTexById(id) {
      let text = ''
      let propertyTypeItem = this.propertyTypeList.find(
        (obj) => obj.id == id
      )
      if (this.$helpers.nullToVoid(propertyTypeItem) != '') {
        text = propertyTypeItem.name
      }

      return text
    },

    // select date
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    },
    // refresh
    resetFilterData() {
      this.propertyTypeSelectData = null
      this.pageSelectData = null
      this.positionSelectData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    refresh() {
      this.resetFilterData();
      this.get()
    },
    getPageList() {
      let list = JSON.parse(JSON.stringify(this.enums.banner_page_list))
      this.pageList = list.MOBILE
    },
    onChangePage() {
      let currentPageData = this.pageSelectData ? this.pageSelectData.id : null
      let pageEnum = this.enums.banner_page
      let list = JSON.parse(JSON.stringify(this.enums.position_banner_list))
      let positionListByPage = []

      if (currentPageData == pageEnum.HOME) {
        positionListByPage = list.MOBILE.HOME
      } else if (currentPageData == pageEnum.REAL_ESTATE_HOME) {
        positionListByPage = list.MOBILE.REAL_ESTATE_HOME
      } else if (currentPageData == pageEnum.REAL_ESTATE_BY_PROPERTY_TYPE) {
        positionListByPage = list.MOBILE.REAL_ESTATE_BY_PROPERTY_TYPE
      } else if (currentPageData == pageEnum.ATTRACTION_HOME) {
        positionListByPage = list.MOBILE.ATTRACTION_HOME
      }else if (currentPageData == pageEnum.SHOP_RETAIL_HOME) {
        positionListByPage = list.MOBILE.SHOP_RETAIL_HOME
      }else if (currentPageData == pageEnum.SHOP_WHOLESALE_HOME) {
        positionListByPage = list.MOBILE.SHOP_WHOLESALE_HOME
      }else if (currentPageData == pageEnum.RESTAURANT_HOME) {
        positionListByPage = list.MOBILE.RESTAURANT_HOME
      }else if (currentPageData == pageEnum.SHOP_LOCAL_PRODUCT_HOME) {
        positionListByPage = list.MOBILE.SHOP_LOCAL_PRODUCT_HOME
      }else if (currentPageData == pageEnum.HOTEL_HOME) {
        positionListByPage = list.MOBILE.HOTEL_HOME
      }else if (currentPageData == pageEnum.MASSAGE_HOME) {
        positionListByPage = list.MOBILE.MASSAGE_HOME
      }

      this.positionList = positionListByPage
      this.propertyTypeSelectData = null
      this.positionSelectData = null
      if (positionListByPage.length == 1) {
        this.positionSelectData = positionListByPage[0]
      }
    },
    setFilter() {
      if (this.$helpers.nullToVoid(this.pageSelectData) != '') {
        this.filter.page = this.pageSelectData.id
      }

      if (this.$helpers.nullToVoid(this.positionSelectData) != '') {
        this.filter.position = this.positionSelectData.id
      }

      this.filter.reference_id = null

      if (this.filter.page == this.enums.banner_page.REAL_ESTATE_BY_PROPERTY_TYPE) {
        if (this.$helpers.nullToVoid(this.propertyTypeSelectData) != '') {
          this.filter.reference_id = this.propertyTypeSelectData.id
        }
      }
    },
    resetPage() {
      this.pageSelectData = null
    },
    resetPropertyType() {
      this.propertyTypeSelectData = null
    },
    resetPosition() {
      this.positionSelectData = null
    },
  },
}
</script>
