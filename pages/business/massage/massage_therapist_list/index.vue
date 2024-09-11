<template>
    <div>
        <i-form
        module-key="massage_therapist_list"
        :title="$t('massage_therapist_list')"
        :table-header="header"
        :table-data="items"
        :pagination="pagination"
        @paginationClick="get()"
        @refreshClick="refresh()"
        @searchInput="get(false)"
        :filter="filter"
        >
          <!-- Table Custom Field Area -->
          <template #cell(profile_image)="row">
            <i-table-image-viewer
                :image="row.item.profile_image"
                :popover-image-width="500"
                :popover-image-height="200"
                path="contact/"
              ></i-table-image-viewer>
          </template>

          <template #cell(gender)="row">
            <span v-if="row.item.gender == enums.contact_gender.MALE">
              {{ $t('male') }}
            </span>
            <span v-else-if="row.item.gender == enums.contact_gender.FEMALE">
              {{ $t('female') }}
            </span>
             <span v-else-if="row.item.gender == enums.contact_gender.OTHER">
              {{ $t('other') }}
            </span>
          </template>

          <template #cell(created_at)="row">
            {{ row.item.created_at | dateTimeFormat }}
          </template>

          <template #cell(show)="row">
            <b-form-checkbox
              v-model="row.item.show" switch
              @change="activeShowSwitch(row.item.id, row.item.show, row.index)"
            >
            </b-form-checkbox>
          </template>
        </i-form>
    </div>
</template>
<script>
export default {
    layout: 'app',
    middleware: 'acl',
    moduleKey: 'massage_therapist_list',
    head() {
    return {
      title: this.$t('massage_therapist_list'),
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
                sortable: false,
                thClass: 'nameThWidth',
            },
            {
                key: 'gender',
                label: this.$t('gender'),
                sortable: false,
            },
            {
                key: 'phone',
                label: this.$t('phone'),
                sortable: false,
                thClass: 'nameThWidth',
            },
            {
              key: 'created_at',
              label: this.$t('created_at'),
              sortable: true,
            },
            // {
            //   key: 'show',
            //   label: this.$t('show'),
            //   sortable: true,
            //   thClass: 'text-center',
            //   tdClass: 'text-center',
            // },
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
      apiUrl: process.env.API_URL,
      filter: {
        search: null,
        business_owner_id: null,
        open_time: null,
        close_time: null,
        status: null,
        date_time_picker: null,
      },
      defaultFilter: {
        search: null,
        business_owner_id: null,
        status: null,
        date_time_picker: null,
      },
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

      this.$axios.$post('massage_therapist_list/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /** get input */
    getInput() {
      // this.getInputFilter()
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
  }
}
</script>
