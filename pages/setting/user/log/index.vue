<template>
  <div>
    <i-form
      ref="table_default"
      :date-picker-props="datePickerProps"
      :enable-date-picker="true"
      :enable-filter="true"
      :enable-sort="true"
      :enable-table-action="false"
      :filter="filter"
      :pagination="pagination"
      :sort-by.sync="sortBy"
      :sort-type.sync="sortType"
      :table-data="items"
      :table-header="header"
      :title="$t('user_log')"
      module-key="user_log"
      @datePickerSelected="datePickerSelected"
      @filterClick="get()"
      @paginationClick="get()"
      @refreshClick="refresh()"
      @resetFilterClick="resetFilterData(); get()"
      @searchInput="get(false)"
      @sortChange="get()"
    >
      <!-- Filter Area-->
      <template #filter>
        <!-- module-->
        <b-col v-if="isSuper()" cols="6">
          <b-form-group
            :label="$t('modules')"
            label-class="control-label"
          >
            <b-form-select
              v-model="filter.module"
            >
              <template slot="first">
                <option :value="null" disabled>
                  {{ $t('modules') }}
                </option>
              </template>
              <option :value="null">
                {{ $t('select_all') }}
              </option>
              <option
                v-for="(mod, index) in modules"
                :key="index"
                :value="mod.module_key"
              >
                {{ $t(mod.module_key) }}
              </option>
            </b-form-select>
          </b-form-group>
        </b-col>

        <!-- action-->
        <b-col :cols="isSuper() ? 6 : 12">
          <b-form-group
            :label="$t('action')"
            label-class="control-label"
          >
            <b-form-select
              v-model="filter.action"
            >
              <option :value="null">
                {{ $t('select_all') }}
              </option>
              <option value="login">Login</option>
              <option value="create">{{ $t('create') }}</option>
              <option value="update">{{ $t('update') }}</option>
              <option value="delete">{{ $t('delete') }}</option>
              <option value="view">{{ $t('view') }}</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </template>

      <!-- Table Custom Field Area -->
      <template #cell(module)="row">
        <div v-if="$helpers.nullToVoid(row.item.module_name) == ''">
          {{ row.item.module }}
        </div>
        <div v-else>{{ row.item.module_name }}</div>
      </template>

      <template #cell(action_log)="row">
        <div>{{ row.item.action }}</div>
      </template>

      <template #cell(detail)="row">
        <div :id="'popover-detail-' + row.item.id">
          {{ row.item.detail | truncate(50) }}
        </div>

        <b-popover
          v-if="row.item.detail.length > 50"
          :target="'popover-detail-' + row.item.id"
          placement="left"
          triggers="hover"
          variant="dark"
        >
          <div>
            {{ row.item.detail }}
          </div>
        </b-popover>
      </template>

      <template #cell(created_at)="row">{{
          row.item.created_at | dateTimeFormat
        }}
      </template>
    </i-form>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import moment from 'moment'
import {mapGetters} from 'vuex'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'user_log',
  head() {
    return {
      title: this.$t('user_log'),
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
          key: 'user_name',
          label: this.$t('user_name'),
          sortable: true,
        },
        {
          key: 'module',
          label: this.$t('module'),
          sortable: true,
        },
        {
          key: 'action_log',
          label: this.$t('action'),
          sortable: true,
        },
        {
          key: 'detail',
          label: this.$t('description'),
          sortable: false,
        },
        {
          key: 'browser',
          label: this.$t('browser'),
          sortable: true,
        },
        {
          key: 'device',
          label: this.$t('device'),
          sortable: false,
        },
        {
          key: 'ip',
          label: this.$t('ip'),
          sortable: true,
        },
        {
          key: 'platform',
          label: this.$t('platform'),
          sortable: false,
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
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
        action: null,
        module: null
      },
      defaultFilter: {
        search: null,
        date_time_picker: null,
        action: null,
        module: null
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
      modules: [],
    }
  },
  created() {
    this.get()
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

      this.$axios.$post('user_log/get', input).then((response) => {
        vm.setInput(response)
      })
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
    setInput(response) {
      this.items = response.data.list
      this.modules = response.data.module
      this.pagination.total = response.pagination.total
      this.pagination.from = response.pagination.from
      this.pagination.to = response.pagination.to
    },
    resetSort() {
      this.sortBy = 'created_at'
      this.sortType = 'desc'
    },
    resetFilterData() {
      this.$refs.table_default.$refs.date_picker.dateTime = null;
      this.filter = Object.assign({}, this.defaultFilter)
    },
    datePickerSelected(date) {
      this.filter.date_time_picker = date
      this.get()
    }
  },
}
</script>
