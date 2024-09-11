<template>
  <div>
    <!-- Start modal Component -->
    <div v-if="modalShow">
      <modal
        :attraction-list="attractionList"
        :form-filter="formFilter"
        :form-item="rowItem"
        :modal-type="modalType"
        :property-list="propertyList"
        :property-type-list="propertyTypeList"
        :province-list="provinceList"
        :shop-list="shopList"
        :category-in-shop-all="categoryInShopAllList"
        @closeModal="closeModal"
      />
    </div>
    <!-- End modal Component -->

    <i-form
      ref="table_default"
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
      :button-add="true"
      :enable-table-action="true"
      :pagination="pagination"
      :table-data="items"
      :table-header="header"
      :title="$t('banner')"
      module-key="banner"
      @addClick="add"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @searchInput="get(false)"
    >

      <!-- Filter Area-->
      <template #filter>
        <!-- banner_type-->
        <b-col
          cols="12"
          :lg="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
          :xl="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
        >
          <b-form-group
              :label="$t('banner_type')"
              label-for="banner_type"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.banner_type"
                type="text"
                :placeholder="$t('banner_type')"
                @input="onChangeBannerType"
              >
                <template slot="first">
                  <b-form-select-option :value="null"
                  >{{ $t('please_select') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option
                  v-for="(obj, index) in enums.banner_type_list"
                  :key="index"
                  :value="obj.id"
                >{{ $t(obj.name) }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
        </b-col>

        <!-- property_detail -->
          <b-col
            cols="12" lg="3" xl="3"
            v-if="filter.banner_type == enums.banner_type.PROPERTY_DETAIL"
          >
            <b-form-group
              :label="$t('property_detail')"
              label-for="property_detail"
              label-class="control-label"
            >
              <b-multi-select
                v-model="propertySelectData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="propertyList"
                :placeholder="$t('property_detail')"
                @reset="resetPropertyDetail"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- property_type -->
          <b-col
            cols="12" lg="3" xl="3"
            v-if="filter.banner_type == enums.banner_type.PROPERTY_TYPE"
          >
            <b-form-group
              :label="$t('property_type')"
              label-for="property_type"
              label-class="control-label"
            >
              <b-multi-select
                v-model="propertyTypeSelectData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="propertyTypeList"
                :placeholder="$t('property_type')"
                @reset="resetPropertyType"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- attraction_detail -->
          <b-col
            cols="12" lg="3" xl="3"
            v-if="filter.banner_type == enums.banner_type.ATTRACTION_DETAIL"
          >
            <b-form-group
              :label="$t('attraction_detail')"
              label-for="attraction_detail"
              label-class="control-label"
            >
              <b-multi-select
                v-model="attractionDetailData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="attractionList"
                :placeholder="$t('attraction_detail')"
                @reset="resetAttractionDetail"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- attraction_destination -->
          <b-col
            cols="12" lg="3" xl="3"
            v-if="filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION"
          >
            <b-form-group
              :label="$t('attraction_destination')"
              label-for="attraction_destination"
              label-class="control-label"
            >
              <b-multi-select
                v-model="attractionDestinationData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="provinceList"
                :placeholder="$t('attraction_destination')"
                @reset="resetAttractionDestination"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- shop -->
          <b-col
            cols="12" lg="3" xl="3"
            v-if="filter.banner_type == enums.banner_type.SHOP"
          >
            <b-form-group
              :label="$t('shop')"
              label-for="shop"
              label-class="control-label"
            >
              <b-multi-select
                v-model="shopSelectData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="shopList"
                :placeholder="$t('shop')"
                @reset="resetShopSelectData"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- shop select by enums Category in Shop-->
          <b-col
            cols="12" xl="3" lg="3"
            v-if="filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP"
          >
            <b-form-group
              :label="$t('shop')"
              label-for="shop"
              label-class="control-label"
            >
              <b-multi-select
                v-model="categoryShopSelectData"
                :multiple="false"
                label="name"
                track-by="name"
                :options="shopList"
                :placeholder="$t('shop')"
                @input="onChangeShopData"
                @reset="resetCategoryShopSelectData"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- Category In Shop -->
          <b-col
            cols="12" xl="3" lg="4"
            v-if="has_category_in_shop"
          >
            <b-form-group
                :label="$t('category')"
                label-for="category"
                label-class="control-label"
              >
                <b-multi-select
                  v-model="categoryInShopSelectData"
                  :multiple="false"
                  label="name"
                  track-by="name"
                  :options="categoryInShopList"
                  :placeholder="$t('category')"
                  @input="onChangeCategoryInShopData"
                  @reset="resetSelectCategoryData"
                ></b-multi-select>
              </b-form-group>
          </b-col>

          <!-- Sub Category -->
          <b-col
            cols="12" xl="3" lg="3"
            v-if="has_sub_category"
          >
            <b-form-group
                :label="$t('sub_category')"
                label-for="sub_category"
                label-class="control-label"
              >
                <b-multi-select
                  v-model="subCategorySelectData"
                  :multiple="false"
                  label="name"
                  track-by="name"
                  :options="subCategoryList"
                  :placeholder="$t('sub_category')"
                  @reset="resetSubCategorySelectData"
                ></b-multi-select>
              </b-form-group>
          </b-col>

          <!-- image_type -->
          <b-col
            cols="12"
            :lg="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
          :xl="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
          >
            <b-form-group
              :label="$t('image_type')"
              label-for="image_type"
              label-class="control-label"
            >
              <b-form-select
                v-model="filter.image_type"
                type="text"
                :placeholder="$t('image_type')"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('please_select') }}
                  </b-form-select-option>
                </template>

                <b-form-select-option :value="enums.banner_image_type.SQUARE"
                >{{ $t('square') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.banner_image_type.RECTANGLE"
                >{{ $t('rectangle') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- status -->
          <b-col
            cols="12"
            :lg="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
            :xl="filter.banner_type == enums.banner_type.PROPERTY_DETAIL ||
              filter.banner_type == enums.banner_type.PROPERTY_TYPE ||
              filter.banner_type == enums.banner_type.ATTRACTION_DETAIL ||
              filter.banner_type == enums.banner_type.ATTRACTION_DESTINATION ||
              filter.banner_type == enums.banner_type.SHOP ||
              filter.banner_type == enums.banner_type.CATEGORY_IN_SHOP
              ? 3 : 4"
          >
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
      <!-- End Filter Area -->

      <!-- Table Action Area -->
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="banner"
          @deleteClick="deleteItem(row.item)"
          @editClick="editItem(row.item)"
        >
        </i-table-action-dropdown>
      </template>
      <!-- End Table Action Area -->

      <!-- Table Custom Field Area -->
      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-height="200"
          :popover-image-width="500"
          path="banner"
        ></i-table-image-viewer>
      </template>

      <template #cell(banner_type)="row">
        <div>{{ $t(getBannerTypeText(row.item.type)) }}</div>

        <!-- Property Detail -->
        <div
          v-if="row.item.type == enums.banner_type.PROPERTY_DETAIL"
          class="mt-2"
        >
          <b>{{ $t('property') }}: </b>
          <span>{{ getPropertyNameByID(row.item.description) | truncate(30) }}</span>
        </div>
        <!-- Property Type -->
        <div
          v-else-if="row.item.type == enums.banner_type.PROPERTY_TYPE"
          class="mt-2"
        >
          <b>{{ $t('type') }}: </b>
          <span>{{ getPropertyTypeNameByID(row.item.description) | truncate(30) }}</span>
        </div>
        <!-- Attraction Detail -->
        <div
          v-else-if="row.item.type == enums.banner_type.ATTRACTION_DETAIL"
          class="mt-2"
        >
          <b>{{ $t('type') }}: </b>
          <span>{{ getAttractionNameByID(row.item.description) | truncate(30) }}</span>
        </div>
        <!-- Attraction Destination -->
        <div
          v-else-if="row.item.type == enums.banner_type.ATTRACTION_DESTINATION"
          class="mt-2"
        >
          <b>{{ $t('type') }}: </b>
          <span>{{ getProvinceNameByID(row.item.description) }}</span>
        </div>

        <!-- Category In Shop -->
        <div
          v-else-if="row.item.type == enums.banner_type.CATEGORY_IN_SHOP"
          class="mt-2"
        >
          <b>{{ $t('category') }}: </b>
          <span>{{ getCategoryNameByID(row.item.description) }}</span>
        </div>
      </template>

      <template #cell(image_type)="row">
        <div v-if="row.item.image_type == enums.banner_image_type.SQUARE">
          {{ $t('square') }}
        </div>
        <div v-if="row.item.image_type == enums.banner_image_type.RECTANGLE">
          {{ $t('rectangle') }}
        </div>
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

      <!-- updated change status -->
      <template #cell(status)="row">
        <b-form-checkbox
        v-if="checkModuleAuthorize('banner', 'change_status')"
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
  moduleKey: 'banner',
  head() {
    return {
      title: this.$t('banner'),
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
        },
        {
          key: 'banner_type',
          label: this.$t('banner_type'),
          sortable: false,
        },
        {
          key: 'image_type',
          label: this.$t('image_type'),
          sortable: true,
        },
        // {
        //   key: 'platform_type',
        //   label: this.$t('platform_type'),
        //   sortable: true,
        // },
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
        banner_type: null,
        image_type: null,
        status: null,
        description: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        banner_type: null,
        image_type: null,
        status: null,
        description: null
      },
      apiUrl: process.env.API_URL,
      formFilter: {},
      propertyList: [],
      propertyTypeList: [],
      attractionList: [],
      provinceList: [],
      shopList: [],
      categoryInShopAllList: [],
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
      propertySelectData: null,
      propertyTypeSelectData: null,
      attractionDetailData: null,
      attractionDestinationData: null,
      shopSelectData: null,
      categoryShopSelectData: null,
      categoryInShop: [],
      categoryInShopSelectData: null,
      subCategory: [],
      subCategorySelectData: null,
      has_sub_category: false,
      has_category_in_shop: false,
    }
  },
  computed: {
    categoryInShopList(){
      return this.categoryInShop.map(obj => {
        return obj
      })
    },
    subCategoryList(){
      return this.subCategory.map(obj => {
        return obj
      })
    }
  },
  watch: {
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
    provinceList: {
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
    categoryInShopSelectData:{
      handler(val){
       if(!this.$helpers.isEmpty(val)){
        this.getSubCategory(val.id)
       }else {
        this.has_sub_category = false
       }
      },
      immediate: true
    },
    categoryShopSelectData: {
      handler(val) {
        if(!this.$helpers.isEmpty(val)) {
          this.getCategoryInShop(val.id)
          this.has_category_in_shop = true
        }
        else {
          this.has_category_in_shop = false
        }
      }
    }
  },
  created() {
    this.getSelectData()
    this.get(true)
  },
  methods: {
    getSelectData() {
      let vm = this

      vm.$axios
        .$post('banner/get_select_data', {loading: false})
        .then(({data}) => {
          vm.propertyList = data.property
          vm.propertyTypeList = data.property_type
          vm.attractionList = data.attraction
          vm.provinceList = data.province
          vm.shopList = data.shop
          vm.categoryInShopAllList = data.category_in_shop_all
        })
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('banner/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /**
     * open modal for editing banner
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
     * delete selected banner
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
            vm.$axios.$post('banner/delete', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('banner'), vm.$t('done'))
              vm.get()
            })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    setFilter(){
      this.filter.description = null
        if(this.filter.banner_type == this.enums.banner_type.PROPERTY_DETAIL){
          if(this.$helpers.nullToVoid(this.propertySelectData) != ''){
            this.filter.description = this.propertySelectData.id
          }
        }else if(this.filter.banner_type == this.enums.banner_type.PROPERTY_TYPE){
          if(this.$helpers.nullToVoid(this.propertyTypeSelectData) != ''){
            this.filter.description = this.propertyTypeSelectData.id
          }
        }else if(this.filter.banner_type == this.enums.banner_type.ATTRACTION_DETAIL){
          if(this.$helpers.nullToVoid(this.attractionDetailData) != ''){
            this.filter.description = this.attractionDetailData.id
          }
        }else if(this.filter.banner_type == this.enums.banner_type.ATTRACTION_DESTINATION){
          if(this.$helpers.nullToVoid(this.attractionDestinationData) != ''){
            this.filter.description = this.attractionDestinationData.id
          }
        }else if(this.filter.banner_type == this.enums.banner_type.SHOP){
          if(this.$helpers.nullToVoid(this.shopSelectData) != ''){
            this.filter.description = this.shopSelectData.id
          }
        }else if(this.filter.banner_type == this.enums.banner_type.CATEGORY_IN_SHOP){
          if(this.$helpers.nullToVoid(this.categoryShopSelectData) != ''){
            if(this.$helpers.nullToVoid(this.subCategorySelectData) != ''){
              this.filter.description = this.subCategorySelectData.id
            }else if(this.$helpers.nullToVoid(this.categoryInShopSelectData) != ''){
              this.filter.description = this.categoryInShopSelectData.id
            }
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
    closeModal(data) {
      this.modalType = 0
      if (!this.$helpers.isEmpty(data)) {
        this.setInput(data)
      }
      this.rowItem = {}
    },
    getBannerTypeText(type) {
      let result = ''
      let data = this.enums.banner_type_list.find((obj) => obj.id == type)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    getPropertyNameByID(id) {
      let result = ''
      let data = this.propertyList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    getPropertyTypeNameByID(id) {
      let result = ''
      let data = this.propertyTypeList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    getAttractionNameByID(id) {
      let result = ''
      let data = this.attractionList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    getProvinceNameByID(id) {
      let result = ''
      let data = this.provinceList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    getCategoryNameByID(id) {
      let result = ''
      let data = this.categoryInShopAllList.find((obj) => obj.id == id)

      if (!this.$helpers.isEmpty(data)) {
        result = data.name
      }

      return result
    },
    /**
     * Change status
     */
    changeStatus(id, status) {
      let vm = this

      let title = ''
      if (status == vm.enums.banner_status.DISABLE) {
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
            vm.$axios.$post('banner/change_status', input).then(({data}) => {
              swal.close()
              vm.$notify('success', vm.$t('banner'), vm.$t('done'))
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
      let switchToStatus = vm.enums.banner_status.ENABLE

      if (status == false) {
        switchToStatus = vm.enums.banner_status.DISABLE
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
            .$post('banner/change_status', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('banner'),
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
      this.propertySelectData = null
      this.propertyTypeSelectData = null
      this.attractionDetailData = null
      this.attractionDestinationData = null
      this.shopSelectData= null
      this.categoryShopSelectData= null
      this.categoryInShopSelectData = null
      this.subCategorySelectData = null
      this.$refs.table_default.$refs.date_picker.dateTime = null
      this.filter = Object.assign({}, this.defaultFilter);
    },
    // refresh
    refresh(){
      this.resetFilterData()
      this.get()
    },
    resetPropertyDetail() {
      this.propertySelectData = null
    },
    resetPropertyType() {
      this.propertyTypeSelectData = null
    },
    resetAttractionDetail() {
      this.attractionDetailData = null
    },
    resetAttractionDestination() {
      this.attractionDestinationData = null
    },
    resetShopSelectData() {
      this.shopSelectData= null
    },
    resetCategoryShopSelectData(){
      this.categoryShopSelectData= null
    },
    resetSelectCategoryData() {
      this.categoryInShopSelectData = null
    },
    resetSubCategorySelectData() {
      this.subCategorySelectData = null
    },
    onChangeBannerType() {
      this.propertySelectData = null
      this.propertyTypeSelectData = null
      this.attractionDetailData = null
      this.attractionDestinationData= null
      this.shopSelectData= null
      this.categoryShopSelectData= null
      this.categoryInShopSelectData = null
      this.subCategorySelectData = null
    },
    onChangeShopData(){
      this.categoryInShopSelectData= null
    },
    onChangeCategoryInShopData(){
      this.subCategorySelectData = null
    },
    // get Category in Shop
    getCategoryInShop(id){
      this.$axios.$post('banner/get_category_in_shop', {id: id}).then(res => {
        this.has_category_in_shop = true
        this.categoryInShop = res
      })
    },
    // get Sub Category In Shop
    getSubCategory(id){
      this.$axios.$post('banner/get_sub_category',{id: id}).then(res =>{
        if(res.length>0){
          this.has_sub_category = true
          this.subCategory = res
        }else{
          this.has_sub_category = false
        }
      })
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
