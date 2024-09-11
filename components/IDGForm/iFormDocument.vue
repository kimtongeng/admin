<template>
  <div>
    <div class="page-title" style="cursor: pointer">
      <span @click="showDocumentCollapse = !showDocumentCollapse">Document</span>
      <i
        :class="showDocumentCollapse ? 'simple-icon-arrow-down' : 'simple-icon-arrow-right'"
        style="font-size: 15px;"
        @click="showDocumentCollapse = !showDocumentCollapse"></i>
      <div class="separator mb-4"></div>
    </div>
    <b-collapse v-model="showDocumentCollapse" class="mt-2">
      <strong>i-form: </strong>
      <div class="mt-2 mb-2">
        <b-form-checkbox v-model="iFormPropsCheckbox">Properties</b-form-checkbox>
        <b-form-checkbox v-model="iFormPropsSlot">Slots</b-form-checkbox>
        <b-form-checkbox v-model="iFormPropsEvent">Events</b-form-checkbox>
      </div>
      <div v-if="iFormPropsCheckbox">
        <b-table-simple bordered hover responsive striped>
          <b-thead>
            <b-tr>
              <b-th>Properties</b-th>
              <b-th>Type</b-th>
              <b-th>Default</b-th>
              <b-th>Usage</b-th>
              <b-th>Description</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(obj, index) in iFormPropertiesData" :key="index">
              <b-td>{{ obj.properties }}</b-td>
              <b-td>{{ obj.type }}</b-td>
              <b-td>
                <template v-if="obj.default.includes('http')">
                  <a :href="obj.default" target="_blank">{{ obj.default }}</a>
                </template>
                <template v-else>{{ obj.default }}</template>
              </b-td>
              <b-td>{{ obj.usage }}</b-td>
              <b-td>{{ obj.description }}</b-td>
            </b-tr>
          </b-tbody>

        </b-table-simple>

        <div class="separator my-4"></div>
      </div>
      <div v-if="iFormPropsEvent">
        <b-table-simple bordered hover responsive striped>
          <b-thead>
            <b-tr>
              <b-th>Event</b-th>
              <b-th>Return Data</b-th>
              <b-th>Return Type</b-th>
              <b-th>Description</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="(obj, index) in iFormEventData" :key="index">
              <b-td>{{ obj.event }}</b-td>
              <b-td>{{ obj.return_data }}</b-td>
              <b-td>{{ obj.return_type }}</b-td>
              <b-td>{{ obj.description }}</b-td>
            </b-tr>
          </b-tbody>

        </b-table-simple>

        <div class="separator my-4"></div>
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: "documents",
  data() {
    return {
      showDocumentCollapse: false,
      iFormPropertiesData: [
        {
          properties: 'ref',
          type: 'String',
          default: "''",
          usage: "'table_default'",
          description: 'Use to control date picker component of all things',
        },
        {
          properties: 'module-key',
          type: 'String',
          default: "''",
          usage: "'product_list'",
          description: 'Use to check permission and can get from module table',
        },
        {
          properties: 'title',
          type: 'String',
          default: "''",
          usage: "'Product List'",
          description: "Title of module",
        },
        {
          properties: "table-header",
          type: "Array",
          default: "[]",
          usage: "[ { key: 'name', label: 'Product Name', sortable: true },...... ]",
          description: "Name of column header on table",
        },
        {
          properties: "table-data",
          type: "Array",
          default: "[]",
          description: "Data that get from api",
        },
        {
          properties: "table-tab-content",
          type: "Boolean",
          default: "false",
          description: "Table have tab or not",
        },
        {
          properties: "table-tab-content-header",
          type: "Array",
          default: "[]",
          usage: "[ { key: 'name', label: 'Product Name', icon: 'simple-icon-handbag' },...... ]",
          description: "Use when table-tab-content equal true",
        },
        {
          properties: "button-refresh",
          type: "Boolean",
          default: "true",
          description: "Button refresh and reset all data on page",
        },
        {
          properties: "button-add",
          type: "Boolean",
          default: "false",
          description: "Button add more data of table",
        },
        {
          properties: "enable-action-dropdown",
          type: "Boolean",
          default: "false",
          description: "Button action dropdown of whole table",
        },
        {
          properties: "enable-sort",
          type: "Boolean",
          default: "false",
          description: "Enable or hide of sort area",
        },
        {
          properties: "sort-by",
          type: "String",
          default: "null",
          usage: ":sort-by.sync='created_at'",
          description: "Name key of column that want to sort (Use sync for update that prop from iForm component)",
        },
        {
          properties: "sort-type",
          type: "String",
          default: "desc",
          usage: ":sort-type.sync='desc'",
          description: "Type of sort and can be: asc, desc (Use sync for update that prop from iForm component)",
        },
        {
          properties: "enable-date-picker",
          type: "Boolean",
          default: "false",
          description: "Enable or hide of date picker area",
        },
        {
          properties: "date-picker-props",
          type: "Object",
          default: "https://prnt.sc/LgBephKZNZ4x",
          description: "Properties of date picker",
        },
        {
          properties: "button-excel",
          type: "Boolean",
          default: "false",
          description: "Button excel and export excel of whole table",
        },
        {
          properties: "button-print",
          type: "Boolean",
          default: "false",
          description: "Button print pdf of whole table",
        },
        {
          properties: "enable-filter",
          type: "Boolean",
          default: "false",
          description: "Enable or hide of filter area",
        },
        {
          properties: "is-filter-collapse",
          type: "Boolean",
          default: "false",
          description: "Set default show/hide filter area",
        },
        {
          properties: "filter",
          type: "Object",
          default: "{txt_src: null}",
          usage: "{ search: null, created_at: { startDate: null, endDate: null },...... }",
          description: "Name key of column that want to filter",
        },
        {
          properties: "enable-table-action",
          type: "Boolean",
          default: "false",
          description: "Enable or hide of action dropdown on record table",
        },
        {
          properties: "pagination",
          type: "Object",
          default: "https://prnt.sc/oGX6K6W-Rs_r",
          description: "Pagination of table",
        },
      ],
      iFormEventData: [
        {
          event: "@tabChange",
          return_data: "Tab name",
          return_type: "String",
          description: "Use when click on any tab of table tab content"
        },
        {
          event: "@refreshClick",
          return_data: "",
          return_type: "",
          description: "Use when click on refresh button"
        },
        {
          event: "@addClick",
          return_data: "",
          return_type: "",
          description: "Use when click on add button"
        },
        {
          event: "@sortChange",
          return_data: "",
          return_type: "",
          description: "Use when on change sort by"
        },
        {
          event: "@datePickerSelected",
          return_data: "Date or Date Time",
          return_type: "String",
          description: "Use when on change Date Picker"
        },
        {
          event: "@excelClick",
          return_data: "",
          return_type: "",
          description: "Use when click on excel button"
        },
        {
          event: "@printClick",
          return_data: "",
          return_type: "",
          description: "Use when click on print button"
        },
        {
          event: "@filterClick",
          return_data: "",
          return_type: "",
          description: "Use when click on filter button"
        },
        {
          event: "@resetFilterClick",
          return_data: "",
          return_type: "",
          description: "Use when click on reset filter button"
        },
        {
          event: "@paginationClick",
          return_data: "",
          return_type: "",
          description: "Use when click on pagination"
        },
        {
          event: "@searchInput",
          return_data: "",
          return_type: "",
          description: "Use when input on search box"
        },
      ],
      iFormPropsCheckbox: true,
      iFormPropsSlot: false,
      iFormPropsEvent: true,
    }
  }
}
</script>

<style scoped>

</style>
