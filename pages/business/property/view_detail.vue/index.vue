<template>
  <div>
    <div v-if="showAssetImageGalleryModal">
      <modal-asset-image-gallery :form-item="assetItem" @closeModal="closeModalAssetImageGallery"/>
    </div>


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

              <!-- property_type_name, view_count-->
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div>
                  <b>{{ $t('type') }}: </b>
                  <span>{{ getNameByLang(detailData.property_type_name) }}</span>
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

              <!-- youtube-->
              <div v-if="$helpers.nullToVoid(detailData.youtube_link) != ''" class="mt-4">
                <iframe
                  :src="`https://www.youtube.com/embed/${getYouTubeVideoId(detailData.youtube_link)}`"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen frameborder="0"
                  style="width: 100%; height: 350px"
                  title="YouTube video player">
                </iframe>
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
                    @click="getCurrentLocationProperty"
                  >
                    <b-img src="/current_location_icon.png"></b-img>
                  </div>
                </GmapMap>
              </div>

              <!-- commission-->
              <div class="d-flex justify-content-between align-items-center mb-2" style="margin-top: 45px">
                <div>
                  <b>{{ $t('sale_assistance_commission') }}</b>
                  <div v-if="detailData.sale_assistance_commission_type == enums.commission_type.AMOUNT">
                    <p class="text-center">{{ parseFloat(detailData.sale_assistance_commission) | currency('$', 2) }}</p>
                  </div>
                  <div v-else-if="detailData.sale_assistance_commission_type == enums.commission_type.PERCENTAGE">
                    <p class="text-center">{{ parseFloat(detailData.sale_assistance_commission) }} %</p>
                  </div>
                </div>
                <div>
                  <b>{{ $t('agency_commission') }}</b>
                  <div v-if="detailData.sale_assistance_commission_type == enums.commission_type.AMOUNT">
                    <p class="text-center">{{ parseFloat(detailData.agency_commission) | currency('$', 2) }}</p>
                  </div>
                  <div v-else-if="detailData.sale_assistance_commission_type == enums.commission_type.PERCENTAGE">
                    <p class="text-center">{{ parseFloat(detailData.agency_commission) }} %</p>
                  </div>
                </div>
                <div>
                  <b>{{ $t('ref_agency_commission') }}</b>
                  <div v-if="detailData.sale_assistance_commission_type == enums.commission_type.AMOUNT">
                    <p class="text-center">{{ parseFloat(detailData.ref_agency_commission) | currency('$', 2) }}</p>
                  </div>
                  <div v-else-if="detailData.sale_assistance_commission_type == enums.commission_type.PERCENTAGE">
                    <p class="text-center">{{ parseFloat(detailData.ref_agency_commission) }} %</p>
                  </div>
                </div>
              </div>

              <!-- phone-->
              <div v-if="$helpers.nullToVoid(detailData.phone) != ''" style="max-width: 375px">
                <b>{{ $t('phone') }}: </b>
                <span>{{ detailData.phone }}</span>
              </div>

              <!-- telegram_number-->
              <div v-if="$helpers.nullToVoid(detailData.telegram_number) != '' || $helpers.nullToVoid(detailData.telegram_qr_code) != ''"
                   class="mt-2">
                <b>{{ $t('telegram_number') }}: </b>
                <template v-if="$helpers.nullToVoid(detailData.telegram_number) != ''">
                  <span>{{ detailData.telegram_number }}</span>
                </template>

                <template v-if="$helpers.nullToVoid(detailData.telegram_qr_code) != ''">
                  <a
                    id="popover-telegram-qr-code"
                    :href="`${apiUrl}images/real_estate/property/telegram_qr_code/${detailData.telegram_qr_code}`"
                    target="_blank"
                  >
                    <i class="iconsminds-qr-code text-primary" style="font-size: 18px"></i>
                  </a>
                  <b-popover
                    custom-class="image-popover"
                    placement="right"
                    target="popover-telegram-qr-code"
                    triggers="hover"
                  >
                    <a
                      :href="`${apiUrl}images/real_estate/property/telegram_qr_code/${detailData.telegram_qr_code}`"
                      target="_blank"
                    >
                      <b-img
                        :src="`${apiUrl}images/real_estate/property/telegram_qr_code/${detailData.telegram_qr_code}`"
                        height="300"
                        width="300"
                      />
                    </a>
                  </b-popover>
                </template>
              </div>

              <!-- identity_image-->
              <div v-if="detailData.id_card_image.length > 0" class="mt-2">
                <b>{{ $t('identity_image') }}</b>
                <glide-component
                  :settings="glideIconsOption"
                >
                  <div
                    v-for="(obj, index) in detailData.id_card_image"
                    :key="index"
                  >
                    <a
                      :href="`${apiUrl}images/real_estate/property/id_card/${obj.image}`"
                      target="_blank"
                    >
                      <b-img
                        :src="`${apiUrl}images/real_estate/property/id_card/${obj.image}`"
                        class="glideImage mt-2"
                      ></b-img>

                    </a>
                  </div>
                </glide-component>
              </div>

              <!-- related_document-->
              <div v-if="detailData.related_document.length > 0" class="mt-3">
                <b>{{ $t('related_document') }}</b>
                <glide-component
                  :settings="glideIconsOption"
                >
                  <div
                    v-for="(obj, index) in detailData.related_document"
                    :key="index"
                  >
                    <a
                      :href="`${apiUrl}images/real_estate/property/related_document/${obj.image}`"
                      target="_blank"
                    >
                      <b-img
                        :src="`${apiUrl}images/real_estate/property/related_document/${obj.image}`"
                        class="glideImage mt-2"
                      ></b-img>
                    </a>
                  </div>
                </glide-component>
              </div>

            </b-colxx>
          </b-row>
        </template>
      </b-card-body>
    </b-card>

    <b-card v-if="$helpers.nullToVoid(detailData) && detailData.property_type == enums.property_type.MULTI"
            class="mt-3">
      <b-card-title>{{ $t('asset_list') }}</b-card-title>
      <b-row>
        <b-col class="text-left" cols="6">
          <div class="search-sm d-inline-block">
            <b-input v-model="assetFilter.search" :placeholder="$t('search')" @input="getAssetList(false)"/>
          </div>
        </b-col>
        <b-col class="text-right" cols="6">
          <span class='text-muted text-small mr-1 mb-2'>
            {{ assetPagination.from }} - {{ assetPagination.to }}
            {{ this.$t('of') }} {{ assetPagination.total }}
          </span>
          <b-dropdown
            :text='`${assetPagination.per_page}`'
            class='d-inline-block'
            right
            size='xs'
            variant='outline-secondary'
          >
            <b-dropdown-item
              v-for='(size, index) in pageOptions'
              :key='index'
              @click='assetPagination.per_page = size; getAssetList()'
            >
              {{ size }}
            </b-dropdown-item
            >
          </b-dropdown>
        </b-col>
      </b-row>
      <b-card-body>
        <b-table
          :current-page='assetPagination.current_page'
          :empty-text="$t('no_data')"
          :fields='assetTableHeader'
          :items='assetList'
          :per-page='assetPagination.perPage'
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
          <template #cell(action)="row">
            <i-table-action-dropdown
              :enable-delete-action="false"
              :enable-edit-action="false"
              module-key="transaction_fee_list"
            >
              <b-dropdown-item @click="viewAssetGallery(row.item)">
                <i class="iconsminds-photo"></i>
                <span class="ml-3 mb-2">{{ $t('image_gallery') }}</span>
              </b-dropdown-item>
            </i-table-action-dropdown>
          </template>

          <template #cell(image)="row">
            <i-table-image-viewer
              :image="row.item.image"
              :popover-image-height="200"
              :popover-image-width="500"
              path="real_estate/property/thumbnail"
            ></i-table-image-viewer>
          </template>

          <template #cell(size)="row">
            <span>{{ row.item.size }}</span>
            <span>m <sup>2</sup></span>
          </template>

          <template #cell(status)="row">
            <b-badge v-if="row.item.status == enums.property_asset_status.NOT_BOOKING" pill variant="secondary">
              {{ $t('not_yet_book') }}
            </b-badge>
            <b-badge v-if="row.item.status == enums.property_asset_status.BOOKING" pill variant="warning">
              {{ $t('booking') }}
            </b-badge>
            <b-badge v-else-if="row.item.status == enums.property_asset_status.COMPLETED_BOOKING" pill
                     variant="success">{{
                $t('sold_out')
              }}
            </b-badge>
          </template>
        </b-table>
        <b-row>
          <b-col cols='12'>
            <b-pagination
              v-model='assetPagination.current_page'
              :per-page='assetPagination.per_page'
              :total-rows='assetPagination.total'
              align='center'
              @input='getAssetList()'
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
    </b-card>
  </div>
</template>

<script>
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import GlideComponent from '~/components/Carousel/GlideComponent'
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
import ModalAssetImageGallery from "./components/ModalAssetImageGallery";
import * as VueGoogleMaps from 'vue2-google-maps'
import {mapGetters} from "vuex";

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'property',
  components: {
    GlideComponentThumbs,
    GlideComponent,
    iTableActionDropdown,
    iTableImageViewer,
    ModalAssetImageGallery
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
      assetList: [],
      assetItem: {},
      assetPagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0
      },
      assetTableHeader: [
        {
          key: 'action',
          label: this.$t('action'),
          sortable: false,
          tdClass: 'actionTdWidth'
        },
        {
          key: 'image',
          label: this.$t('image'),
          sortable: false,
          tdClass: 'imageTdWidth'
        },
        {
          key: 'asset_category_name',
          label: this.$t('category_name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'code',
          label: this.$t('code'),
          sortable: true,
        },
        {
          key: 'size',
          label: this.$t('size'),
          sortable: true,
        },
        {
          key: 'description',
          label: this.$t('description'),
          sortable: false,
          tdClass: 'descriptionTdWidth'
        },
        {
          key: 'status',
          label: this.$t('status'),
          sortable: false,
        }
      ],
      assetSearch: null,
      assetFilter: {
        property_id: null,
        search: null
      },
      showAssetImageGalleryModal: false
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
        property_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('property_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.generateMap(data.latitude, data.longitude)

        if (vm.detailData.property_type == vm.enums.property_type.MULTI) {
          vm.getAssetList(false)
        }
      })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/real_estate/property/gallery/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/real_estate/property/thumbnail/${this.detailData.image}`
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
    getCurrentLocationProperty() {
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
    getAssetList(loading = true) {
      let vm = this

      vm.assetFilter.property_id = vm.$route.query.id

      let input = {
        filter: vm.assetFilter,
        table_size: vm.assetPagination.per_page,
        page: vm.assetPagination.current_page,
        loading: loading
      }

      vm.$axios.$post('property_list/get_asset_list', input).then(({data}) => {
        vm.assetList = data.data
        vm.assetPagination.total = data.pagination.total
        vm.assetPagination.from = data.pagination.from
        vm.assetPagination.to = data.pagination.to
      })
    },
    viewAssetGallery(item) {
      this.assetItem = item
      this.showAssetImageGalleryModal = true
    },
    closeModalAssetImageGallery() {
      this.assetItem = {}
      this.showAssetImageGalleryModal = false
    }
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
