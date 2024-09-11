<template>
  <div>
    <!-- Page Heading -->
    <div class='page-header-nav'>
      <b-row>
        <b-col lg='6' md='6' sm='12' xl='6'>
          <div class='page-title'>
            <span>{{ detailData.name | truncate(50) }}</span>
          </div>
        </b-col>
        <b-col lg='6' md='6' sm='12' xl='6'>
          <b-button
            class='float-right mb-2'
            size='xs'
            variant='primary'
            @click="back"
          >
            <i class="simple-icon-arrow-left" style="font-size: 10px;"></i>
            <span>{{ $t('back') }}</span>
          </b-button>
          <b-button
            class='float-right mb-2 mr-2'
            size='xs'
            variant='primary'
            @click="getDetail()"
          >
            <i class="simple-icon-refresh" style="font-size: 10px;"></i>
            <span>{{ $t('refresh') }}</span>
          </b-button>
        </b-col>
      </b-row>
    </div>
    <div class='separator mb-2 mt-2'></div>

    <b-card no-body>
      <b-card-body>
        <template v-if="!$helpers.isEmpty(detailData)">
          <b-row>
            <b-colxx class="col-left mb-5" xl="6" xxs="12">
              <div>
                <glide-component-thumbs
                  :settingsImages="{ bound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 1, data: detailData.gallery_photo}"
                  :settingsThumbs="{ bbound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 5, data: detailData.gallery_photo, breakpoints: { 576: { perView: 4 }, 420: { perView: 3 } } }"
                />
              </div>

              <!-- title-->
              <div class="text-left" style="margin-top: 65px">
                <b>{{ detailData.name }}</b>
              </div>

              <!-- province_name,district_name, commune_name , price-->
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="text-danger">
                  <i class="simple-icon-location-pin"></i>
                  <span>{{ getNameByLang(detailData.commune_name) }}, </span>
                  <span>{{ getNameByLang(detailData.district_name) }}, </span>
                  <span>{{ getNameByLang(detailData.province_name) }}</span>
                </div>
                <div v-if="detailData.price > 0" class="text-danger">
                  {{ detailData.price | currency('$', 2) }}
                </div>
              </div>

              <!-- business Type, view_count-->
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <b>{{ $t('business_type') }}: </b>
                  <span>{{ getNameByLang(detailData.business_type_name) }}</span>
                </div>
                <div>
                  <b>{{ $t('view_count') }}: </b>
                  <span>{{ detailData.view_count }}</span>
                </div>
              </div>

              <!-- description-->
              <div v-if="$helpers.nullToVoid(detailData.description) != ''" class="mt-3">
                {{ detailData.description }}
              </div>

              <!-- Video -->
              <div v-if="!$helpers.isEmpty(detailData.video_link)" class="mt-3">
                <iframe
                  :src="`https://customer-cdz6dh390gfwsahe.cloudflarestream.com/${detailData.video_link}/iframe?poster=https%3A%2F%2Fcustomer-cdz6dh390gfwsahe.cloudflarestream.com%2F${detailData.video_link}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
                  loading="lazy"
                  style="border: none; height: 25rem; width: 100%;"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowfullscreen="true"
                ></iframe>
              </div>
            </b-colxx>

            <b-colxx class="col-right mb-2" xl="6" xxs="12">
              <!-- location-->
              <div
                v-if="$helpers.nullToVoid(detailData.latitude) != '' && $helpers.nullToVoid(detailData.longitude) != ''">
                <GmapMap
                  ref="mapRef"
                  :center="coordinates"
                  :options="googleMapOptions"
                  :zoom="zoom"
                  style="width: 100%; height: 530px"
                >
                  <GmapMarker
                    v-for="(m, index) in markers"
                    :key="index"
                    :clickable="false"
                    :draggable="false"
                    :position="m.position"
                  />
                  <div
                    class="currentLocateIcon"
                    @click="getCurrentLocationMassage"
                  >
                    <b-img src="/current_location_icon.png"></b-img>
                  </div>

                </GmapMap>
              </div>

              <!-- Payment Methods -->
              <div class="mt-3">
                <b>{{ $t('payment_methods') }}</b>
                  <div v-if="$helpers.nullToVoid(bankAccountList) != ''">
                    <glide-component
                      :settings="glideIconsOption"
                      class="box-width"
                    >
                      <div v-for="bank in bankAccountList" :key="bank.id"
                        class="card my-2"
                      >
                        <b-row>
                          <b-col xl="4" xxs="12" style="margin-right: 15px !important;">
                          <b-img
                            :src="$helpers.nullToVoid(bank.bank_image) != '' ? imagePath + 'bank/' + bank.bank_image : ''"
                            alt="thumbnail"
                            class="border-0"
                            onerror="this.src='/default.jpg'"
                            style="
                                width: 100px;
                                height: 100%;
                                border-radius: 0.75rem;
                            "
                          ></b-img>
                          </b-col>
                          <b-col xl="7" xxs="12" class="d-flex flex-column" style="padding: 20px 0 0 20px !important;">
                            <h5>{{ bank.bank_name }}</h5>
                            <span>Name:   {{ bank.account_name }}</span>
                            <span>Number: {{ bank.account_number }}</span>
                          </b-col>
                        </b-row>
                      </div>
                    </glide-component>
                  </div>
                  <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
                </div>
            </b-colxx>
          </b-row>
        </template>
      </b-card-body>
    </b-card>

    <b-card class="mt-3">
      <b-tabs>
        <b-tab :title="$t('food_list')" active>
          <b-row class="mt-3">
            <b-col class="text-left" cols="6">
              <div class="search-sm d-inline-block">
                <b-input v-model="productFilter.search" :placeholder="$t('search')" @input="getFoodList(false)"/>
              </div>
            </b-col>
            <b-col class="text-right" cols="6">
              <span class='text-muted text-small mr-1 mb-2'>
                {{ productPagination.from }} - {{ productPagination.to }}
                {{ this.$t('of') }} {{ productPagination.total }}
              </span>
              <b-dropdown
                :text='`${productPagination.per_page}`'
                class='d-inline-block'
                right
                size='xs'
                variant='outline-secondary'
              >
                <b-dropdown-item
                  v-for='(size, index) in pageOptions'
                  :key='index'
                  @click='productPagination.per_page = size; getFoodList()'
                >
                  {{ size }}
                </b-dropdown-item>
              </b-dropdown>
            </b-col>
          </b-row>
          <b-card-body>
            <b-table
              :current-page='productPagination.current_page'
              :empty-text="$t('no_data')"
              :fields='productTableHeader'
              :items='productList'
              :per-page='productPagination.perPage'
              borderless
              class="custom-table"
              hover
              responsive
              select-mode='single'
              selectable
              selected-variant='primary'
              show-empty
              striped
            >
              <!-- Custom Fields Area -->
              <!-- Action -->
              <template #cell(action)="row">
                <i-table-action-dropdown
                  module-key="ktv_list"
                  :enable-edit-action="false"
                  :enable-delete-action="false"
                >
                  <b-dropdown-item @click="viewProductDetail(row.item)">
                    <i class="simple-icon-eye"></i>
                    <span class="ml-3 mb-2">{{ $t('detail') }}</span>
                  </b-dropdown-item>
                </i-table-action-dropdown>
              </template>

              <!-- Image -->
              <template #cell(image)="row">
                <i-table-image-viewer
                  :image="row.item.image"
                  :popover-image-height="200"
                  :popover-image-width="500"
                  path="ktv/profile/product/thumbnail/"
                ></i-table-image-viewer>
              </template>

              <!-- Price -->
              <template #cell(price)="row">
                {{ row.item.price | currency('$', 2) }}
              </template>
              <template #cell(discount_amount)="row">
                {{ row.item.discount_amount | currency('$', 2) }}
              </template>
              <template #cell(sell_price)="row">
                {{ row.item.sell_price | currency('$', 2) }}
              </template>

              <!-- Status -->
              <template #cell(status)="row">
                <span v-if="row.item.status == enums.product_status.ENABLE">
                  <b-badge variant="primary">
                    {{ $t('enable') }}
                  </b-badge>
                </span>
                <span v-else-if="row.item.status == enums.product_status.DISABLE">
                  <b-badge variant="danger">
                    {{ $t('disable') }}
                  </b-badge>
                </span>
                <span v-else-if="row.item.status == enums.product_status.SUSPEND">
                  <b-badge variant="warning">
                    {{ $t('suspend') }}
                  </b-badge>
                </span>
              </template>

              <!-- Suspend -->
              <!-- updated change Suspend -->
              <template #cell(suspend)="row">
                <b-form-checkbox
                  v-model="row.item.suspend" switch
                  @change="suspendShowSwitch(row.item.id, row.item.suspend, row.index)"
                >
                </b-form-checkbox>
              </template>

              <!-- End Custom -->
              </b-table>
              <b-row>
                <b-col cols='12'>
                  <b-pagination
                    v-model='productPagination.current_page'
                    :per-page='productPagination.per_page'
                    :total-rows='productPagination.total'
                    align='center'
                    @input='getFoodList()'
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
          </b-card-body>
        </b-tab>
        <b-tab :title="$t('ktv_girl')">
          <div v-if="$helpers.nullToVoid(ktvGirlList) != ''"
            class="mt-3 d-flex flex-wrap">
            <div v-for="ktv_girl in ktvGirlList" :key="ktv_girl.id">
               <div
                style="border: 1px solid rgba(172, 170, 170, 0.6); border-radius: 7px; box-shadow: 0px 0px 5px -2px; position: relative;"
                class="m-2 p-2"
              >
                <b-badge variant="warning" style="position: absolute; top: 15px; left: 10px;">
                  {{ ktv_girl.code }}
                </b-badge>
                <b-img
                  v-if="$helpers.nullToVoid(ktv_girl.image) == ''"
                  src="/default.jpg"
                  style="
                    width: 170px;
                    height: 150px;
                    border-radius: 0.50rem;
                  "
                ></b-img>
                <b-img
                  v-else
                  :src="$helpers.nullToVoid(ktv_girl.image) != '' ? imagePath + 'contact_business_info/' + ktv_girl.image : ''"
                  alt="thumbnail"
                  class="border-0"
                  onerror="this.src='/default.jpg'"
                  style="
                      width: 200px;
                      height: 150px;
                      border-radius: 0.75rem;
                  "
                ></b-img>
                <p class="mt-2 mb-0">
                  <b>{{ $t('name') }}</b> : {{ ktv_girl.name }}
                </p>
                <p class="mt-2 mb-0">
                  <b>{{ $t('gender') }}</b> :
                  <span v-if="ktv_girl.gender == 1">
                    {{ $t('male') }}
                  </span>
                  <span v-else-if="ktv_girl.gender == 2">
                    {{ $t('female') }}
                  </span>
                </p>
                <p class="mt-2 mb-0">
                  <b>{{ $t('phone') }}</b> : {{ ktv_girl.phone }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
        </b-tab>
        <b-tab :title="$t('room_list')">
          <b-row class="mt-3">
            <b-col class="text-left" cols="6">
              <div class="search-sm d-inline-block">
                <b-input v-model="roomFilter.search" :placeholder="$t('search')" @input="getRoomList(false)"/>
              </div>
            </b-col>
            <b-col class="text-right" cols="6">
              <span class='text-muted text-small mr-1 mb-2'>
                {{ roomPagination.from }} - {{ roomPagination.to }}
                {{ this.$t('of') }} {{ roomPagination.total }}
              </span>
              <b-dropdown
                :text='`${roomPagination.per_page}`'
                class='d-inline-block'
                right
                size='xs'
                variant='outline-secondary'
              >
                <b-dropdown-item
                  v-for='(size, index) in pageOptions'
                  :key='index'
                  @click='roomPagination.per_page = size; getRoomList()'
                >
                  {{ size }}
                </b-dropdown-item>
              </b-dropdown>
            </b-col>
          </b-row>
          <b-card-body>
            <b-table
              :current-page='roomPagination.current_page'
              :empty-text="$t('no_data')"
              :fields='roomTableHeader'
              :items='roomList'
              :per-page='roomPagination.perPage'
              borderless
              class="custom-table"
              hover
              responsive
              select-mode='single'
              selectable
              selected-variant='primary'
              show-empty
              striped
            >
              <!-- Custom Fields Area -->
              <!-- Action -->
              <template #cell(action)="row">
                <i-table-action-dropdown
                  module-key="ktv_list"
                  :enable-edit-action="false"
                  :enable-delete-action="false"
                >
                  <b-dropdown-item @click="viewRoomDetail(row.item)">
                    <i class="simple-icon-eye"></i>
                    <span class="ml-3 mb-2">{{ $t('detail') }}</span>
                  </b-dropdown-item>
                </i-table-action-dropdown>
              </template>

              <!-- Image -->
              <template #cell(image)="row">
                <i-table-image-viewer
                  :image="row.item.image"
                  :popover-image-height="200"
                  :popover-image-width="500"
                  path="ktv/profile/room/thumbnail/"
                ></i-table-image-viewer>
              </template>

              <!-- Price -->
              <template #cell(price)="row">
                {{ row.item.price | currency('$', 2) }}
              </template>
              <template #cell(discount_amount)="row">
                {{ row.item.discount_amount | currency('$', 2) }}
              </template>
              <template #cell(sell_price)="row">
                {{ row.item.sell_price | currency('$', 2) }}
              </template>
              <!-- End Custom -->
              </b-table>
              <b-row>
                <b-col cols='12'>
                  <b-pagination
                    v-model='roomPagination.current_page'
                    :per-page='roomPagination.per_page'
                    :total-rows='roomPagination.total'
                    align='center'
                    @input='getRoomList()'
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
          </b-card-body>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import GlideComponent from '~/components/Carousel/GlideComponent'
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
import * as VueGoogleMaps from 'vue2-google-maps'
import {mapGetters} from "vuex";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'ktv_list',
  components: {
    GlideComponentThumbs,
    GlideComponent,
    iTableActionDropdown,
    iTableImageViewer,
  },
  data() {
    return {
      apiUrl: process.env.API_URL,
      detailData: {},
      zoom: 13,
      coordinates: {lat: 0, lng: 0},
      markers: [
        {
          position: {
            lat: 0,
            lng: 0,
          },
        },
      ],
      googleMapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        disableDefaultUi: false,
      },
      glideIconsOption: {
        perView: 3,
        hideNav: true,
        gap: 10,
        breakpoints: {
          600: {perView: 2},
          1200: {perView: 3}
        }
      },
      productList: [],
      bankAccountList: [],
      ktvGirlList: [],
      productItem: {},
      productPagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0
      },
      productTableHeader: [
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
          key: 'price',
          label: this.$t('price'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center'
        },
        {
          key: 'discount_amount',
          label: this.$t('discount'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center',
        },
        {
          key: 'sell_price',
          label: this.$t('sell_price'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center',
        },
        {
          key: 'description',
          label: this.$t('description'),
          sortable: false,
          tdClass: 'descriptionTdWidth',
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: false,
        },
        {
          key: 'suspend',
          label: this.$t('suspend'),
          sortable: false,
        }
      ],
      productFilter: {
        business_id: null,
        search: null
      },
      roomTableHeader: [
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
          key: 'price',
          label: this.$t('price'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center'
        },
        {
          key: 'discount_amount',
          label: this.$t('discount'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center',
        },
        {
          key: 'sell_price',
          label: this.$t('sell_price'),
          sortable: false,
          tdClass: 'moneyTdWidth text-center',
        },
        {
          key: 'description',
          label: this.$t('description'),
          sortable: false,
          tdClass: 'descriptionTdWidth',
        },
      ],
      roomList: [],
      roomFilter: {
        business_id: null,
        search: null
      },
      roomPagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0
      },
      KTVGirlFilter: {
        business_id: null,
      },
      imagePath: process.env.API_URL + 'images/',
    }
  },
  computed: {
    ...mapGetters({
      pageOptions: 'pagination/getPageOptions'
    }),
    googleMapApi: VueGoogleMaps.gmapApi,
  },
  created() {
    this.getDetail()
  },
  methods: {
    back() {
      this.$router.back()
      // this.$router.push({path: this.makeLink('/business/property')})
    },
    getDetail(loading = true) {
      let vm = this

      let input = {
        ktv_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('ktv_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.generateMap(data.latitude, data.longitude)
        vm.getFoodList()
        vm.getRoomList()
        vm.getSelectShopDetail()
        vm.getKTVGirlList()
      })
    },
    getRoomList(loading = true) {
      let vm = this

      vm.roomFilter.business_id = vm.$route.query.id

      let input = {
        filter: vm.roomFilter,
        table_size: vm.roomPagination.per_page,
        page: vm.roomPagination.current_page,
        loading: loading
      }

      vm.$axios.$post('room_ktv_list/get_room_ktv_list', input).then(({data}) => {
        vm.roomList = data.data
        vm.roomPagination.total = data.pagination.total
        vm.roomPagination.from = data.pagination.from
        vm.roomPagination.to = data.pagination.to
      })
    },
    getFoodList(loading = true) {
      let vm = this

      vm.productFilter.business_id = vm.$route.query.id

      let input = {
        filter: vm.productFilter,
        table_size: vm.productPagination.per_page,
        page: vm.productPagination.current_page,
        loading: loading
      }

      vm.$axios.$post('food_list/get_food_list', input).then(({data}) => {
        vm.productList = data.data
        vm.productPagination.total = data.pagination.total
        vm.productPagination.from = data.pagination.from
        vm.productPagination.to = data.pagination.to
      })
    },
    getKTVGirlList(loading = true) {
      let vm = this

      vm.KTVGirlFilter.business_id = vm.$route.query.id

      let input = {
        filter: vm.KTVGirlFilter,
        loading: loading
      }

      vm.$axios.$post('ktv_girl_list/get_ktv_girl_list', input).then(({data}) => {
        vm.ktvGirlList = data
      })
    },
    getSelectShopDetail(loading = true) {
      let vm = this

      let input = {
        business_id: vm.$route.query.id,
        loading: loading
      }

      vm.$axios.$post('ktv_list/get_select_ktv_detail', input)
        .then(({data}) => {
          vm.bankAccountList = data.bank_account
        })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/ktv/cover/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/ktv/logo/${this.detailData.image}`
        })
      }
    },
    generateMap(lat, lng) {
      if (this.$helpers.nullToVoid(lat) != '' && this.$helpers.nullToVoid(lng) != '') {
        this.coordinates = {lat: Number(lat), lng: Number(lng)}
        this.markers = [{position: this.coordinates}]
      } else {
        this.clearGenerateMap()
      }
    },
    clearGenerateMap() {
      this.coordinates = {lat: 0, lng: 0}
      this.markers = [{position: this.coordinates}]
    },
    getCurrentLocationMassage() {
      this.coordinates = {lat: Number(this.detailData.latitude), lng: Number(this.detailData.longitude)}
      this.markers[0].position = this.coordinates

      let bounds = new this.googleMapApi.maps.LatLngBounds();
      bounds.extend(this.coordinates);
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.fitBounds(bounds);
        map.setCenter(this.coordinates)
        map.setZoom(16)
      })
    },
    /**
     * Change status Suspend
     */
    suspendShowSwitch(id, suspend, index) {
      let vm = this
      let switchToSuspend = vm.enums.product_status.ENABLE

      if (suspend == false) {
        switchToSuspend = vm.enums.product_status.SUSPEND
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
            suspend: switchToSuspend,
            loading: true,
          }
          vm.$axios
            .$post('food_list/change_status_suspend', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('food_list'),
                vm.$t('done')
              )
              vm.getFoodList(false)
            }).catch(error => {
              this.productList[index].suspend = !suspend
          })
        } else if (result.isDismissed) {
          this.productList[index].suspend = !suspend
        }
      })
    },
  }
}
</script>
<style scoped>
:deep(.currentLocateIcon) {
  top: 375px;
}

:deep(.glideImage) {
  width: 100%;
  height: 210px;
  object-fit: cover;
  object-position: center;
  border-radius: 0.75rem;
}
</style>
