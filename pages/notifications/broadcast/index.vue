<template>
  <div>
    <i-form
      module-key="broadcast"
      :title="$t('broadcast')"
      :button-add="true"
      :table-header="header"
      :table-data="items"
      :pagination="pagination"
      :filter="filter"
      :enable-table-action="true"
      @refreshClick="get()"
      @addClick="add()"
      @paginationClick="get()"
      @searchInput="get(false)"
    >
      <template #cell(action)="row">
        <i-table-action-dropdown
          module-key="broadcast"
          @editClick="editItem(row.item)"
          @deleteClick="deleteItem(row.item)"
        >
          <b-dropdown-item
            v-if="checkModuleAuthorize('broadcast', 'send')"
            @click="resendBroadcast(row.item.id)">
            <i class="simple-icon-cursor"></i>
            <span class="ml-3">{{ $t('send') }}</span>
          </b-dropdown-item>
        </i-table-action-dropdown>
      </template>

      <template #cell(image)="row">
        <i-table-image-viewer
          :image="row.item.image"
          :popover-image-width="500"
          :popover-image-height="200"
          path="notification"
        ></i-table-image-viewer>
      </template>

      <template #cell(description)="row">
        <template v-if="row.item.contact_noti_type == enums.contact_noti_type.LINK">
          <a :href="row.item.description" target="_blank">{{ row.item.description }}</a>
        </template>
        <template v-else>
          {{ row.item.description }}
        </template>
      </template>

      <template #cell(contact_noti_type)="row">
        <div>{{ getContactNotiTypeText(row.item.contact_noti_type) }}</div>
        <b>{{ getContactNotiTypeTitleText(row.item.contact_noti_type) }}</b>
        <span>{{
            getContactNotiTypeDetailText(row.item.contact_noti_type, row.item.reference_name) | truncate(30)
          }}</span>
      </template>

      <template #cell(created_at)="row">
        {{ getTimeAgoFromNow(row.item.created_at) }}
      </template>

    </i-form>
  </div>
</template>
<script>
import iForm from '~/components/IDGForm/iForm'
import iTableActionDropdown from '~/components/IDGForm/iTableActionDropdown'
import iTableImageViewer from '~/components/IDGForm/iTableImageViewer'
import swal from "sweetalert2";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'broadcast',
  components: {
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
          tdClass: 'imageTdWidth',
        },
        {
          key: 'title',
          label: this.$t('title'),
          sortable: true,
          tdClass: 'nameTdWidth',
        },
        {
          key: 'description',
          label: this.$t('description'),
          sortable: true,
          tdClass: 'descriptionTdWidth',
        },
        {
          key: 'contact_noti_type',
          label: this.$t('type'),
          sortable: true,
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
      filter: {
        search: null
      }
    }
  },
  created() {
    this.get()
  },
  methods: {
    get(loading = true) {
      let vm = this
      let input = this.getInput()
      input.loading = loading
      this.$axios.$post('broadcast/get', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    /** get input */
    getInput() {
      return {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
      }
    },
    /** Set input */
    setInput(data) {
      this.items = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
    getContactNotiTypeText(type) {
      let text = ''
      let data = this.enums.contact_noti_type_list.find(
        (obj) => obj.id == type
      )

      if (this.$helpers.nullToVoid(data) != '') {
        text = this.$t(data.name)
      }
      return text
    },
    getContactNotiTypeTitleText(type) {
      let text = ''
      if (type == this.enums.contact_noti_type.PROPERTY_DETAIL) {
        text = this.$t('property') + ': '
      } else if (type == this.enums.contact_noti_type.PROPERTY_TYPE) {
        text = this.$t('type') + ': '
      }
      return text
    },
    getContactNotiTypeDetailText(type, detail) {
      let text = ''
      if (type == this.enums.contact_noti_type.PROPERTY_DETAIL) {
        text = detail
      } else if (type == this.enums.contact_noti_type.PROPERTY_TYPE) {
        text = this.getNameByLang(detail)
      }
      return text
    },
    add() {
      this.$router.push({path: this.makeLink('/notifications/broadcast/action?type=add')});
    },
    resendBroadcast(id) {
      let vm = this
      swal.fire({
        title: vm.$t('are_you_sure'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('ok'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return new Promise((resolve) => {
            let input = vm.getInput()
            input.notification_id = id
            input.loading = false
            vm.$axios
              .$post('broadcast/resend', input)
              .then(function (response) {
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('broadcast'),
                  vm.$t('done')
                )
                vm.get()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
    editItem(item) {
      this.$router.push({path: this.makeLink('/notifications/broadcast/action?type=update&id=' + item.id)})
    },
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
              .$post('broadcast/delete', input)
              .then(function (response) {
                swal.close()
                vm.$notify(
                  'success',
                  vm.$t('broadcast'),
                  vm.$t('done')
                )
                vm.get()
              })
          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })
    },
  },
}
</script>
