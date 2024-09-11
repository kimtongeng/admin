<template>
  <div>
    <i-form
      ref="table_default"
      module-key="news_recipient"
      :title="$t('recipient')"
      :table-header="header"
      :table-data="items"
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
    > 
      <template #filter>
        <!-- position_group-->
        <b-col cols="12" lg="4" xl="4">
          <b-form-group
            :label="$t('position_group')"
            label-for="position_group"
            label-class="control-label"
          >
            <b-multi-select
              v-model="positionGroupData"
              :multiple="false"
              label="name"
              track-by="name"
              :options="positionGroupList"
              :placeholder="$t('position_group')"
              @reset="resetPositionGroupList"
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
      </template>
      <!-- Table Custom Field Area -->
      <template #cell(profile_image)="row">
        <i-table-image-viewer
          :image="row.item.profile_image"
          :popover-image-width="500"
          :popover-image-height="200"
          path="/contact"
        ></i-table-image-viewer>
      </template>

      <template #cell(province_name)="row">
        {{ getNameByLang(row.item.province_name) }}
      </template>

      <template #cell(district_name)="row">
        {{ getNameByLang(row.item.district_name) }}
      </template>
    </i-form>
  </div>
</template>
<script>
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'news_recipient',
  head() {
    return {
      title: this.$t('recipient')
    }
  },
  data() {
    return {
      header: [
        {
          key: 'profile_image',
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
          key: 'phone',
          label: this.$t('phone'),
          sortable: false,
        },
        {
          key: 'position_group_name',
          label: this.$t('position_group'),
          sortable: false,
        },
        {
          key: 'province_name',
          label: this.$t('province'),
          sortable: false,
        },
        {
          key: 'district_name',
          label: this.$t('district'),
          sortable: false,
        },
      ],
      apiUrl: process.env.API_URL,
      items: [],
      filter: {
        search: null,
        position_group_id: null,
        province_id: null,
        district_id: null,
      },
      defaultFilter: {
        search: null,
        position_group_id: null,
        province_id: null,
        district_id: null,
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      sortBy: 'name',
      sortType: 'desc',
      positionGroupList: [],
      positionGroupData: null,
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
    refresh() {
      this.resetSort()
      this.resetFilterData()
      this.get()
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('news_recipient/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    getInputFilter() {
      if (this.$helpers.nullToVoid(this.positionGroupData) != '') {
        this.filter.position_group_id = this.positionGroupData.id
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
    getSelectData(loading = true) {
      let vm = this

      vm.$axios
        .$post('news_recipient/get_select_data', {loading: loading})
        .then(({data}) => {
          vm.positionGroupList = data.position_group
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
      this.sortBy = 'name'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.positionGroupData = null
      this.provinceData = null
      this.districtData = null

      this.filter = Object.assign({}, this.defaultFilter)
    },
    resetPositionGroupList() {
      this.positionGroupData = null
      this.filter.position_group_id = null
    },  
    resetProvinceList() {
      this.provinceData = null
      this.filter.province_id = null
    },
    resetDistrictList() {
      this.districtData = null
      this.filter.district_id = null
    },
  }
}
</script>
