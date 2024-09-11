<template>
  <div>
    <!-- Start modal detail Component -->
    <div v-if="modalDetailShow">
      <modal-detail
        :form-item="detailItem"
        :modal-show="modalDetailShow"
        @closeModal="closeViewNotificationDetail"
      />
    </div>
    <!-- End modal detail Component -->

    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2">
        <b-col cols="12" xl="6">
          <div class="page-title">
            <div>
              {{ $t('notification') }}
              <span v-if="totalNotiNotRead != 0" class="text-dark"
              >({{ totalNotiNotRead }})</span
              >
            </div>
          </div>
        </b-col>

        <b-col class="text-right" cols="12" xl="6">
          <b-button size="xs" variant="outline-info" @click="refresh">
            <i class="simple-icon-refresh"></i>
            {{ $t('refresh') }}
          </b-button
          >
        </b-col>
      </b-row>
      <div class="mb-2 mt-2">
        <b-button
          v-b-toggle.displayOptions
          class="pt-0 pl-0 d-inline-block d-md-none"
          variant="empty"
        >
          {{ $t('display_options') }}
          <i class="simple-icon-arrow-down"></i>
        </b-button>
        <b-collapse id="displayOptions" class="d-md-block">
          <b-row class="mt-4">
            <b-col col cols="12" xl="6">
              <div
                class="search-sm d-inline-block float-md-left mr-1 align-top"
              >
                <b-input
                  v-model="filter.search"
                  :placeholder="$t('search')"
                  @input="get(false)"
                />
              </div>
            </b-col>
            <b-col class="text-right" sm="12" xl="6">
                            <span class="text-muted text-small mr-1 mb-2">
                                {{ pagination.from }} - {{ pagination.to }}
                                {{ this.$t('of') }} {{ pagination.total }}
                            </span>
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
                                        get()
                                    "
                >{{ size }}
                </b-dropdown-item
                >
              </b-dropdown>
            </b-col>
          </b-row>
        </b-collapse>
      </div>
      <div class="separator mb-4"></div>
    </div>

    <!-- List -->
    <b-list-group>
      <b-card v-if="notificationList.length == 0" class="text-center">
        <span class="text-muted">{{ $t('no_notification') }}</span>
      </b-card>

      <b-list-group-item
        v-for="noti in notificationList"
        :key="noti.id"
        :class="getNotificationBackgroundColor(noti.status)"
        class="mb-2 d-flex notification shadow"
        @click="viewNotificationDetail(noti)"
      >
        <div>
          <b-img
            class="image-notify-list"
            :src="getNotificationImage(noti.image)"
            alt="thumbnail"
            :style="$helpers.nullToVoid(noti.image) == '' ? 'opacity: 0.3' : ''"
          />
        </div>
        <div class="noti-title">
          <h6 class="mt-0 mb-1 noti-text">{{ noti.title }}</h6>
          <h6 class="mt-0 mb-2 noti-text">
            {{ noti.description }}
          </h6>
        </div>
        <div
          class="ml-auto align-self-center d-flex flex-column"
          style="font-size: 18px; text-align: right"
        >
          <p class="noti-date">
            {{ getTimeAgoFromNow(noti.created_at) }}
          </p>
        </div>
      </b-list-group-item>
    </b-list-group>

    <b-row class="mt-2" v-if="notificationList.length > 0">
      <b-col cols="12">
        <b-pagination
          v-model="pagination.current_page"
          :per-page="pagination.per_page"
          :total-rows="pagination.total"
          align="center"
          @input="get(true)"
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
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'admin_notification_list',
  head() {
    return {
      title: this.$t('admin_notification_list'),
    }
  },
  components: {
    // ModalDetail: () =>
    //     import('~/pages/product_management/product/components/ModalDetail'),
  },
  data() {
    return {
      apiUrl: process.env.API_URL,
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
      },
      notificationList: [],
      modalDetailShow: false,
      detailItem: {},
    }
  },
  computed: {
    ...mapGetters({
      pageOptions: 'pagination/getPageOptions',
      totalNotiNotRead: 'notification_badge/getTotalNotRead',
    }),
  },
  watch: {
    totalNotiNotRead: {
      handler(val) {
        if(this.$helpers.nullToVoid(val)){
          this.get(false)
        }
      },
      immediate: true,
    },
  },
  created() {
    this.refresh()
  },
  methods: {
    get(loading = true) {
      let vm = this

      let input = {
        page: this.pagination.current_page,
        table_size: this.pagination.per_page,
        filter: this.filter,
        loading: loading,
      }

      this.$axios.$post('notifications/list', input).then(({data}) => {
        vm.setInput(data)
      })
    },
    refresh() {
      this.$store.dispatch('notification_badge/fetchData')
      this.get()
    },
    /** Set input */
    setInput(data) {
      this.notificationList = data.data
      this.pagination.total = data.pagination.total
      this.pagination.from = data.pagination.from
      this.pagination.to = data.pagination.to
    },
    viewNotificationDetail(noti) {
      let vm = this

      //Link to detail by type
      this.viewDetailNotificationAdmin(noti);

      //Set Notification Read Or Not
      if (noti.status == this.enums.notification_status.NOT_READ) {
        vm.setNotificationRead(noti.id, vm.notificationList)
      }
    },
    closeViewNotificationDetail(type) {
      this.modalDetailShow = false
      this.detailItem = {}
    },
  },
}
</script>
<style scoped>
.notification {
  padding: 0px 25px 0px 25px !important;
}

.notification:hover {
  cursor: pointer;
  background-color: #f9fbfd !important;
}

.swal2-icon .swal2-info,
.swal2-icon .swal2-success,
.swal2-icon .swal2-warning,
.swal2-icon .swal2-error {
  height: 55px;
  width: 55px;
}

.swal2-icon::before {
  height: unset;
  font-size: 2em;
}


.image-notify-list {
  width: 120px;
  height: 120px;
  margin-right: 22px;
  margin-left: -25px;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}
</style>
