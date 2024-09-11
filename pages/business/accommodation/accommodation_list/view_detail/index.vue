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
            <b-colxx class="col-left mb-4" xl="6" xxs="12">
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
                  <span>{{ getNameByLang(detailData.district_name) }}, </span>
                  <span>{{ getNameByLang(detailData.province_name) }}</span>
                </div>
                <div v-if="detailData.price > 0" class="text-danger">
                  {{ detailData.price | currency('$', 2) }}
                </div>
              </div>

              <!-- business_category, view_count-->
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <b>{{ $t('type') }}: </b>
                  <span>{{ getNameByLang(detailData.business_category_name) }}</span>
                </div>
                <div>
                  <b>{{ $t('view_count') }}: </b>
                  <span>{{ detailData.view_count }}</span>
                </div>
              </div>

              <!-- free delivery, open24h , discount -->
              <div class="mt-3">
                <b-row>
                  <b-col lg="4" xl="4">
                    <b>{{ $t('discount') }}: </b>
                    <span v-if="$helpers.nullToVoid(detailData.discount_label) != ''">
                      {{ detailData.discount_label }}
                    </span>
                  </b-col>
                </b-row>
              </div>

               <!-- description-->
              <div v-if="$helpers.nullToVoid(detailData.description) != ''" class="mt-3">
                {{ detailData.description }}
              </div>
            </b-colxx>

            <b-colxx class="col-right mb-2" xl="6" xxs="12">
              <div
                v-if="$helpers.nullToVoid(detailData.latitude) != '' && $helpers.nullToVoid(detailData.longitude) != ''">
                <GmapMap
                  ref="mapRef"
                  :center="coordinates"
                  :options="googleMapOptions"
                  :zoom="zoom"
                  style="width: 100%; height: 500px"
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
                    @click="getCurrentLocationAccommodation"
                  >
                    <b-img src="/current_location_icon.png"></b-img>
                  </div>
                </GmapMap>
              </div>
              <div class="mt-3">{{ detailData.address }}</div>

              <!-- Policy -->
              <div v-if="$helpers.nullToVoid(detailData.policy) != ''" class="mt-3">
                <b>{{ $t('policy') }} : </b>
                <span>
                  {{ detailData.policy }}
                </span>
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
          </b-row>
        </template>
      </b-card-body>
    </b-card>
    <!-- Business Attribute -->
    <div class="mt-3">
      <b-card :title="$t('attribute')">
        <b-row>
          <b-col xl="2" lg="2" md="6" cols="12"
            class="p-1"
            v-for="item in detailData.business_attribute" :key="'attribute' + item.id"
          >
            <div style="padding: 5px; background: rgba(0, 0, 0, 0.103); border-radius: 4px;">
              <b-img
                :src="$helpers.nullToVoid(item.image) != '' ? imagePath + 'accommodation/attribute_image/' + item.image : ''"
                alt="thumbnail"
                class="border-0"
                onerror="this.src='/default.jpg'"
                style="
                    width: 45px;
                    height: 100%;
                    border-radius: 0.75rem;
                "
              ></b-img>
              <span class="pl-2 text-dark">
                {{ item.name }}
              </span>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </div>

    <!-- Room list -->
    <b-card v-if="$helpers.nullToVoid(detailData)" class="mt-3">
      <b-card-title>{{ $t('room_list') }}</b-card-title>
      <b-row>
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
            </b-dropdown-item
            >
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
          <!-- Image -->
          <template #cell(image)="row">
            <i-table-image-viewer
              :image="row.item.image"
              :popover-image-height="200"
              :popover-image-width="500"
              path="accommodation/thumbnail"
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
        </b-table>
      </b-card-body>
    </b-card>
    </div>
</template>
<script>
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import * as VueGoogleMaps from 'vue2-google-maps'
import {mapGetters} from "vuex";

export default {
    layout: 'app',
  middleware: 'acl',
  moduleKey: 'accommodation_list',
  components: {
    GlideComponentThumbs
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
      roomTableHeader: [
        {
          key: 'image',
          label: this.$t('image'),
          sortable: false,
          tdClass: 'imageTdWidth'
        },
        {
          key: 'room_type_name',
          label: this.$t('room_type'),
          sortable: false,
          tdClass: 'nameTdWidth'
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
      imagePath: process.env.API_URL + 'images/',
    }
  },
  computed: {
    ...mapGetters({
      pageOptions: 'pagination/getPageOptions'
    }),
    googleMapApi: VueGoogleMaps.gmapApi
  },
  created() {
    this.getDetail()
  },
  methods: {
    back() {
      this.$router.back()
      // this.$router.push({path: this.makeLink('/business/attraction')})
    },
    getDetail(loading = true) {
      let vm = this

      let input = {
        accommodation_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('accommodation_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.getRoomList()
        vm.generateMap(data.latitude, data.longitude)
      })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/accommodation/cover/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/accommodation/logo/${this.detailData.image}`
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
    getCurrentLocationAccommodation() {
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
    getRoomList(loading = true) {
      let vm = this

      vm.roomFilter.business_id = vm.$route.query.id

      let input = {
        filter: vm.roomFilter,
        table_size: vm.roomPagination.per_page,
        page: vm.roomPagination.current_page,
        loading: loading
      }

      vm.$axios.$post('room_list/get_room_list', input).then(({data}) => {
        vm.roomList = data.data
        vm.roomPagination.total = data.pagination.total
        vm.roomPagination.from = data.pagination.from
        vm.roomPagination.to = data.pagination.to
      })
    },
  }
}
</script>
<style lang="scss" scoped>
:deep(.currentLocateIcon) {
  top: 350px;
}

.price-item {
  width: 250px;
  height: 250px;

  .card-body {
    padding: 12px !important;
  }

  img {
    object-fit: cover;
  }
}
</style>
