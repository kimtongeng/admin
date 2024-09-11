<template>
  <div>
    <i-form
    ref="table_default"
      module-key="app_country"
      :title="$t('app_country')"
      :table-header="header"
      :table-data="items"
      :filter="filter"
      @searchInput="get(false)"
      :pagination="pagination"
      @paginationClick="get()"
      @refreshClick="refresh()"
    >
      <!-- Table Custom Field Area -->
      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-width="500"
          :popover-image-height="200"
          path="flag_country"
        ></i-table-image-viewer>
      </template>

      <template #cell(created_at)="row">
        {{ row.item.created_at | dateTimeFormat }}
      </template>
    </i-form>
  </div>
</template>
<script>
export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'app_country',
  head() {
    return {
      title: this.$t('app_country'),
    }
  },
  data() {
    return {
      header: [
        {
          key: 'image',
          label: this.$t('image'),
          sortable: false,
          tdClass: 'imageTdWidth'
        },
        {
          key: 'name',
          label: this.$t('name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'key',
          label: this.$t('key'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
          sortable: false,
        },
      ],
      items: [],
      filter: {
        search: null,
      },
      defaultFilter: {
        search: null,
      },
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
      apiUrl: process.env.API_URL,
    }
  },
  created() {
    this.get(false)
  },
  methods: {
    refresh() {
      this.get()
    },
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading

      this.$axios.$post('app_country/get', input).then(({data}) => {
        vm.setInput(data)
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
    setInput(data) {
      this.items = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
  },
}
</script>
