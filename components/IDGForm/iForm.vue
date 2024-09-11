<template>
  <div>
    <b-card>
      <div class="page-header-nav">
        <b-row class="mt-2">
          <b-col cols="12" xl="6">
            <div class="page-title">
              <div>{{ title }}</div>
            </div>
          </b-col>

          <b-col class="text-right" cols="12" xl="6">
            <b-button
              v-if="buttonRefresh"
              size="xs"
              variant="primary"
              @click="refreshClick"
            >
              <i class="simple-icon-refresh"></i>
              {{ $t('refresh') }}
            </b-button>
            <b-button
              v-if="buttonAdd && checkModuleAuthorize(moduleKey, 'create')"
              size="xs"
              variant="primary"
              @click="addClick"
            >
              <i class="simple-icon-plus"></i>
              {{ $t('add') }}
            </b-button>
            <b-dropdown
              v-if="enableActionDropdown"
              :text="$t('action')"
              right
              size="xs"
              variant="primary"
            >
              <slot name="action-dropdown"></slot>
            </b-dropdown>
            <slot name="top-right-area"></slot>
          </b-col>
        </b-row>

        <div class="separator my-3"></div>

        <b-row>
          <b-col cols="4">
            <b-dropdown
              :text="`${pagination.per_page}`"
              class="d-inline-block"
              right
              size="xs"
              variant="outline-dark"
            >
              <b-dropdown-item
                v-for="(size, index) in pageOptions"
                :key="index"
                @click="
                  pagination.per_page = size
                  paginationClick()
                "
              >{{ size }}
              </b-dropdown-item>
            </b-dropdown>
            <b-dropdown
              v-if="enableSort"
              :text="$helpers.nullToVoid(sortBy) == '' ? $t('sort') : $t('sort_by') + ': ' + sortByLabel"
              menu-class="scrollable"
              size="xs"
              variant="outline-dark"
            >
              <b-dropdown-item @click="resetSortClick">{{
                  $t('reset')
                }}
              </b-dropdown-item>
              <b-dropdown-item
                v-for="(sort, index) in sortList"
                :key="index"
                @click="onChangeSortBy(sort.key, sort.label)"
              >{{ sort.label }}
              </b-dropdown-item
              >
            </b-dropdown>
            <b-dropdown
              v-if="enableSort && $helpers.nullToVoid(sortBy) != ''"
              :text="sortType == 'asc' ? $t('ascending') : $t('descending')"
              menu-class="scrollable"
              size="xs"
              variant="outline-dark"
            >
              <b-dropdown-item
                @click="onChangeSortType('asc')"
              >{{ $t('ascending') }}
              </b-dropdown-item
              >
              <b-dropdown-item
                @click="onChangeSortType('desc')"
              >{{ $t('descending') }}
              </b-dropdown-item
              >
            </b-dropdown>
          </b-col>
          <b-col class="text-right" cols="8">
            <b-date-picker
              v-if="enableDatePicker"
              ref='date_picker'
              :date-time-value='datePickerProps.range == true ? datePickerProps.date_time_value : []'
              :editable='datePickerProps.editable'
              :format="datePickerProps.format"
              :range="datePickerProps.range"
              :show-confirm-btn="datePickerProps.show_confirm_btn"
              :show-select-time-btn="datePickerProps.show_select_time_btn"
              :single-date-time='datePickerProps.range == false ? datePickerProps.single_date_time : ""'
              :type="datePickerProps.type"
              :value-type="datePickerProps.value_type"
              @input='dateTimeSelected'
            ></b-date-picker>
            <b-button v-if="buttonExcel && checkModuleAuthorize(moduleKey, 'export_excel')" :disabled="tableData.length == 0" size="xs" variant="outline-dark"
                      @click="excelClick">
              Excel
            </b-button>
            <b-button v-if="buttonPrint && checkModuleAuthorize(moduleKey, 'print_pdf')" :disabled="tableData.length == 0" size="xs" variant="outline-dark"
                      @click="printClick">
              {{
                $t('print')
              }}
            </b-button>
            <div class="search-sm d-inline-block mr-1">
              <b-input v-model="filter.search" :placeholder="$t('search')" @input="searchInput"/>
            </div>
            <b-button v-if="enableFilter" size="xs" variant="primary"
                      @click="showFilterCollapse = !showFilterCollapse">
              <i class="iconsminds-filter-2"></i>
            </b-button>
          </b-col>
        </b-row>

        <div v-if="enableFilter">
          <b-row>
            <b-col>
              <b-collapse v-model="showFilterCollapse" class="mt-2">
                <div class="separator my-2"></div>
                <b-row>
                  <slot name="filter"></slot>
                </b-row>

                <div class="separator my-2"></div>

                <div class="text-right">
                  <b-button size="xs" variant="outline-danger" @click="resetFilterClick">{{
                      $t('reset')
                    }}
                  </b-button>
                  <b-button size="xs" variant="primary" @click="filterClick">{{
                      $t('filter')
                    }}
                  </b-button>
                </div>
              </b-collapse>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-card>

    <div class="separator my-2"></div>

    <b-card>
      <b-tabs v-if="tableTabContent" style="font-size: 13px">
        <b-tab
          v-for="(tab, index) in tableTabContentHeader"
          :key="index"
          @click="tabChange(tab.key)">
          <template #title>
            <i :class="`${tab.icon} p-0 mb-1`"></i>
            {{ tab.label }}
          </template>
        </b-tab>
      </b-tabs>

      <b-table
        :current-page="pagination.current_page"
        :empty-text="$t('no_data')"
        :fields="tableHeader"
        :items="tableData"
        :no-local-sorting="true"
        :per-page="pagination.perPage"
        borderless
        class="custom-table"
        hover
        responsive
        select-mode="single"
        selectable
        selected-variant="primary"
        show-empty
        striped
        @row-selected="rowSelected"
      >
        <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="row">
          <slot :name="slot" v-bind="row"/>
        </template>
      </b-table>

      <b-row>
        <b-col cols='12'>
          <b-card-title class='float-right'>
            <slot name="footer-total-amount"></slot>
          </b-card-title>
        </b-col>
      </b-row>

      <b-row>
        <b-col cols="2" style="margin-top: 11px;">
          <span
            class="text-muted text-small"
            style="vertical-align: text-bottom"
          >
            {{ pagination.from }} - {{ pagination.to }} {{ this.$t('of') }}
            {{ pagination.total }}
          </span>
        </b-col>
        <b-col cols="10">
          <b-pagination
            v-model="pagination.current_page"
            :per-page="pagination.per_page"
            :total-rows="pagination.total"
            align="center"
            size="sm"
            @input="paginationClick"
          >
            <template v-slot:next-text>
              <i class="simple-icon-arrow-right"/>
            </template>
            <template v-slot:prev-text>
              <i class="simple-icon-arrow-left"/>
            </template>
            <template v-slot:first-text>
              <i class="simple-icon-control-start"/>
            </template>
            <template v-slot:last-text>
              <i class="simple-icon-control-end"/>
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  props: {
    moduleKey: {
      type: String,
      default: '',
    },
    tableHeader: {
      type: Array,
      default: () => {
        /**
         * key (Name field from api)
         * label (Name Display)
         * sortable
         */
        return []
      },
    },
    tableData: {
      type: Array,
      default: [],
    },
    tableTabContent: {
      type: Boolean,
      default: false,
    },
    tableTabContentHeader: {
      type: Array,
      default: () => {
        /**
         * key (Name for do condition)
         * label (Name display)
         * icon
         */
        return []
      },
    },
    title: {
      type: String,
      default: '',
    },
    buttonRefresh: {
      type: Boolean,
      default: true,
    },
    buttonAdd: {
      type: Boolean,
      default: false,
    },
    enableActionDropdown: {
      type: Boolean,
      default: false,
    },
    buttonExcel: {
      type: Boolean,
      default: false,
    },
    buttonPrint: {
      type: Boolean,
      default: false,
    },
    enableFilter: {
      type: Boolean,
      default: false,
    },
    isFilterCollapse: {
      type: Boolean,
      default: false,
    },
    enableTableAction: {
      type: Boolean,
      default: false,
    },
    // enableVerifyAction: {
    //   type: Boolean,
    //   default: false,
    // },
    enableDatePicker: {
      type: Boolean,
      default: false,
    },
    enableSort: {
      type: Boolean,
      default: false,
    },
    datePickerProps: {
      type: Object,
      default() {
        return {
          editable: true,
          type: 'datetime',
          range: true,
          date_time_value: [],
          single_date_time: '',
          show_select_time_btn: true,
          show_confirm_btn: true,
          format: 'DD/MM/YYYY HH:mm:ss',
          value_type: 'YYYY-MM-DD HH:mm:ss',
          disabled: false
        }
      }
    },
    pagination: {
      type: Object,
      default() {
        return {
          current_page: 1,
          per_page: 10,
          total: 0,
          to: 0,
          from: 0,
          last_page: 0,
        }
      },
    },
    filter: {
      type: Object,
      default() {
        return {
          txt_src: null
        }
      },
    },
    sortBy: {
      type: String,
      default: null,
    },
    sortType: {
      type: String,
      default: "desc",
    },
  },
  data() {
    return {
      rowSelectedItem: {},
      showFilterCollapse: false,
      sortByLabel: null
    }
  },
  computed: {
    ...mapGetters({
      pageOptions: 'pagination/getPageOptions',
      enums: 'enums/getAllEnum',
    }),
    sortList() {
      return this.tableHeader.filter(obj => obj.sortable == true);
    }
  },
  watch: {
    enableTableAction: {
      handler(val) {
        if (val) {
          this.tableHeader.unshift({
            key: 'action',
            label: this.$t('action'),
            sortable: false,
            tdClass: 'actionTdWidth',
          })
        } else {
          let indexActionHeader = this.tableHeader.findIndex(item => item.key == 'action')
          if (indexActionHeader > -1) {
            this.tableHeader.splice(indexActionHeader, 1)
          }
        }
      },
      immediate: true,
    },
    // enableVerifyAction: {
    //   handler(val) {
    //     if (val) {
    //       this.tableHeader.unshift({
    //         key: 'verify',
    //         label: this.$t('verify'),
    //         sortable: false,
    //         tdClass: 'actionTdWidth',
    //       })
    //     } else {
    //       let indexActionHeader = this.tableHeader.findIndex(item => item.key == 'verify')
    //       if (indexActionHeader > -1) {
    //         this.tableHeader.splice(indexActionHeader, 1)
    //       }
    //     }
    //   },
    //   immediate: true,
    // }
  },
  created() {
    this.showFilterCollapse = JSON.parse(JSON.stringify(this.isFilterCollapse))
    this.sortByLabel = JSON.parse(JSON.stringify(this.$t(this.sortBy)))
  },
  methods: {
    refreshClick() {
      this.$emit('refreshClick')
    },
    addClick() {
      this.$emit('addClick')
    },
    paginationClick() {
      this.$emit('paginationClick')
    },
    dateTimeSelected(dateTime) {
      this.$emit('datePickerSelected', dateTime)
    },
    rowSelected(items) {
      if (items.length > 0) {
        this.rowSelectedItem = items[0]
      } else {
        this.rowSelectedItem = {}
      }

      this.$emit('rowSelected', this.rowSelectedItem)
    },
    onChangeSortBy(key, label) {
      this.sortByLabel = label
      this.$emit('update:sortBy', key)
      this.$emit('sortChange')
    },
    onChangeSortType(type) {
      this.$emit('update:sortType', type)
      this.$emit('sortChange')
    },
    resetSortClick() {
      this.sortByLabel = null
      this.$emit('update:sortBy', null)
      this.$emit('update:sortType', 'desc')
      this.$emit('sortChange')
    },
    resetFilterClick() {
      this.pagination.current_page = 1
      this.$emit('resetFilterClick')
    },
    filterClick() {
      this.$emit('filterClick')
    },
    searchInput() {
      this.$emit('searchInput')
    },
    excelClick() {
      this.$emit('excelClick')
    },
    printClick() {
      this.$emit('printClick')
    },
    tabChange(tab) {
      this.$emit('tabChange', tab)
    }
  },
}
</script>
<style scoped>
/*Remove sort style on table header*/
:deep(.table thead th[aria-sort][aria-sort=ascending]) {
  box-shadow: none;
}

:deep(.table thead th[aria-sort][aria-sort=descending]) {
  box-shadow: none;
}

:deep(.table.b-table > thead > tr > [aria-sort=none]) {
  background-image: none;
}

:deep(.table.b-table > thead > tr > [aria-sort=ascending]) {
  background-image: none;
}

:deep(.table.b-table > thead > tr > [aria-sort=descending]) {
  background-image: none;
}

/*End Remove sort style on table header*/

:deep(.mx-input) {
  border-radius: 15px;
  height: 28px;
  padding: 0.25rem 0.75rem 0.25rem 0.75rem;
}
</style>
