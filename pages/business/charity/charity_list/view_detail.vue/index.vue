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
                    @click="getCurrentLocationCharity"
                  >
                    <b-img src="/current_location_icon.png"></b-img>
                  </div>
                </GmapMap>
              </div>
              <div class="mt-3">{{ detailData.address }}</div>

              <!-- related_document-->
              <div v-if="detailData.related_document.length > 0" class="mt-3">
                <b>{{ $t('related_document') }}</b>
                <glide-component
                  :settings="glideIconsOption"
                  style="display: flex; gap: 2px;"
                >
                  <div
                    v-for="(obj, index) in detailData.related_document"
                    :key="index"
                    style="width: 250px !important;"
                  >
                    <a
                      :href="`${apiUrl}images/charity/related_document/${obj.image}`"
                      target="_blank"
                    >
                      <b-img
                        :src="`${apiUrl}images/charity/related_document/${obj.image}`"
                        class="glideImage mt-2"
                      ></b-img>
                    </a>
                  </div>
                </glide-component>
              </div>
            </b-colxx>
          </b-row>

          <b-row class="mt-3">
            <b-col cols="12">
              <b-tabs>
                <b-tab :title="$t('info')" active>
                  <!-- title-->
                  <div class="text-left mt-3">
                    <b>{{ detailData.name }}</b>
                  </div>

                  <div class="mt-3">
                    <b>{{ $t('owner') }} : </b>
                    <span> {{ detailData.contact_name }} </span>
                  </div>

                  <!-- province_name-->
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="text-danger">
                      <i class="simple-icon-location-pin"></i>
                      <span>{{ getNameByLang(detailData.address) }}</span>
                    </div>
                  </div>

                  <!-- description-->
                  <div v-if="$helpers.nullToVoid(detailData.description) != ''" class="mt-3">
                    {{ detailData.description }}
                  </div>
                </b-tab>

                <b-tab :title="$t('contact')">
                  <div v-if="detailData.phone.length > 0 && $helpers.nullToVoid(detailData.website_link) != ''" class="mt-3">
                    <div v-if="detailData.phone.length > 0" class="mt-3">
                      <span>
                        {{ $t('phone') }} :
                      </span>
                      <span>
                        {{ detailData.phone }}
                      </span>
                    </div>

                    <div v-if="$helpers.nullToVoid(detailData.website_link) != ''" class="mt-3">
                      <span>
                        {{ $t('link') }} :
                      </span>
                      <a :href="detailData.website_link" target="_bland"
                      style="font-size: 14px; color: blue; cursor: pointer;">
                        Click here!
                      </a>
                    </div>

                  </div>

                  <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
                </b-tab>
                <b-tab :title="$t('video')">
                  <template v-if="!$helpers.isEmpty(detailData.video_link)">
                    <div style="position: relative; margin-top: 20px;">
                      <iframe
                        :src="`https://customer-cdz6dh390gfwsahe.cloudflarestream.com/${detailData.video_link}/iframe?poster=https%3A%2F%2Fcustomer-cdz6dh390gfwsahe.cloudflarestream.com%2F${detailData.video_link}%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`"
                        loading="lazy"
                        style="border: none; height: 35rem; width: 100%;"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowfullscreen="true"
                      ></iframe>
                    </div>
                  </template>
                  <template v-else>
                    <center><span class="text-muted">{{ $t('no_data') }}</span></center>
                  </template>
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </template>
      </b-card-body>
    </b-card>

  </div>
</template>
<script>
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import * as VueGoogleMaps from 'vue2-google-maps'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'attraction',
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
    }
  },
  computed: {
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
        charity_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('charity_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.generateMap(data.latitude, data.longitude)
      })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/charity/organization_gallery/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/charity/organization_logo/${this.detailData.image}`
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
    getCurrentLocationCharity() {
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
    getPlaceContactTypeImage(type) {
      let image = ''
      let placeContactTypeList = this.enums.place_contact_type_list

      let data = placeContactTypeList.find(obj => obj.id == type)
      if (this.$helpers.nullToVoid(data) != '') {
        image = data.image
      }

      return image
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
