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
                    @click="getCurrentLocationAttraction"
                  >
                    <b-img src="/current_location_icon.png"></b-img>
                  </div>
                </GmapMap>
              </div>
              <div class="mt-3">{{ detailData.address }}</div>
            </b-colxx>
          </b-row>

          <b-row class="mt-4">
            <b-col cols="12">
              <b-tabs>
                <b-tab :title="$t('info')" active>
                  <!-- title-->
                  <div class="text-left mt-3">
                    <b>{{ detailData.name }}</b>
                  </div>

                  <!-- province_name-->
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <div class="text-danger">
                      <i class="simple-icon-location-pin"></i>
                      <span>{{ getNameByLang(detailData.province_name) }}</span>
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
                </b-tab>

                <b-tab :title="$t('contact')">
                  <div v-if="detailData?.place_social_contact?.length > 0" class="mt-3">
                    <div v-for="(social, index) in detailData.place_social_contact" :key="index" class="mb-2">
                      <img
                        :src="`${apiUrl}images/attraction/social_contact/${getPlaceContactTypeImage(social.type)}`"
                        alt="social"
                        onerror="this.src='/thume-default.jpg'"
                        style="width: 25px; height: 25px"
                      >
                      <span class="ml-2">{{ social.value }}</span>
                    </div>
                  </div>

                  <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
                </b-tab>

                <b-tab :title="$t('video')">
                  <div v-if="detailData?.place_video_list?.length > 0" class="d-flex flex-row flex-wrap mt-3">
                    <b-card
                      v-for="(video, index) in detailData.place_video_list" :key="index"
                      class=" mr-4 mb-3"
                      no-body style="height: 170px;">
                      <iframe :src="`https://www.youtube.com/embed/${getYouTubeVideoId(video.link)}`"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
                              frameborder="0"
                              style="width: 100%; height: 100%"
                              title="YouTube video player"
                      ></iframe>
                    </b-card>
                  </div>
                  <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
                </b-tab>

                <b-tab :title="$t('price')">
                  <div v-if="detailData?.place_price_list?.length > 0" class="d-flex flex-row flex-wrap mt-3">
                    <b-card
                      v-for="(obj, index) in detailData.place_price_list"
                      :key="index"
                      :img-src="`${apiUrl}images/attraction/price_list/${obj.image}`"
                      class="price-item mr-4 mb-3"
                      img-alt="price"
                      img-height="160px"
                      img-top
                      no-body
                    >
                      <b-card-body>
                        <div>{{ obj.name }}</div>
                        <div class="text-warning mt-1">{{ obj.price | currency('$', 2) }}</div>
                      </b-card-body>
                    </b-card>
                  </div>

                  <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
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
        attraction_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('attraction_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.generateMap(data.latitude, data.longitude)
        console.log(data);
      })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/attraction/gallery/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/attraction/thumbnail/${this.detailData.image}`
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
    getCurrentLocationAttraction() {
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
