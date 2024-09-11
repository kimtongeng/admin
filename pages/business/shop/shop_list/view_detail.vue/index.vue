<template>
  <div>
    <!-- Start modal Detail Component -->
    <!-- Product -->
    <div v-if="modal">
      <modal-product-detail
        :product-data="productItem"
        @closeModalProduct="closeModalProduct"
      />
    </div>
    <!-- Sub Category -->
    <div v-if="showModal">
      <modal-sub-category
        :form-data="subCategoryData"
        @closeModal="closeModal"
      />
    </div>
    <!-- End modal Detail Component -->


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

              <!-- province_name-->
              <div class="d-flex align-items-center mt-3">
                <div class="text-danger">
                  <i class="simple-icon-location-pin"></i>
                  <span>{{ detailData.address }} </span>
                </div>
              </div>

              <!-- business Type, view_count-->
              <div class="mt-3">
                <b-row>
                  <b-col lg="6" xl="6">
                    <b>{{ $t('business_type') }}: </b>
                    <span>{{ getNameByLang(detailData.business_type_name) }}</span>
                  </b-col>
                  <b-col lg="6" xl="6">
                    <b>{{ $t('view_count') }}: </b>
                    <span>{{ detailData.view_count }}</span>
                  </b-col>
                </b-row>
              </div>

              <!-- Business Category -->
              <div class="mt-3">
                <b-row>
                  <b-col lg="12" xl="12">
                    <b>{{ $t('shop_category') }}:</b>
                    <span v-if="$helpers.nullToVoid(detailData.business_category) != ''">
                      <b-badge
                        v-for="business_category in detailData.business_category"
                        :key="business_category.id"
                        variant="primary"
                        class="mr-2 mb-2"
                      >
                        {{ getNameList(business_category.business_category_name) }}
                      </b-badge>
                    </span>
                  </b-col>
                </b-row>
              </div>

              <!-- free delivery, open24h , discount -->
              <div class="mt-3">
                <b-row>
                  <b-col lg="4" xl="4">
                    <b>{{ $t('discount') }}: </b>
                    <span v-if="$helpers.nullToVoid(detailData.discount_label) != ''">
                      {{ detailData.discount_label }} %
                    </span>
                    <span v-else-if="$helpers.nullToVoid(detailData.discount_label) == ''">
                      0 %
                    </span>
                  </b-col>
                  <b-col lg="4" xl="4">
                    <span v-if="detailData.free_delivery == enums.is_free_delivery.YES">
                      {{ $t('free_delivery') }}
                    </span>
                  </b-col>
                  <b-col lg="4" xl="4">
                    <span v-if="detailData.open_24_hour == enums.is_open_24_hour.YES">
                    {{ $t('open_24_hour') }}
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
                    @click="getCurrentLocationAttraction"
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
                    >
                      <div v-for="bank in bankAccountList" :key="bank.id"
                        class="card my-2"
                        >
                        <b-row class="box-width">
                          <b-col xl="4" xxs="12">
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
                          <b-col xl="8" xxs="12" class="d-flex flex-column" style="padding: 20px 0 0 20px !important;">
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

    <b-card class="mt-4">
      <b-row>
        <b-col cols="12">
          <b-tabs>
            <b-tab :title="$t('category')" active>
              <div class="mt-3">
                <div v-if="$helpers.nullToVoid(categoryList) != ''">
                  <b-row>
                    <b-col xl="2" lg="2" md="3" cols="4"
                      v-for="category in categoryList" :key="category.id"
                    >
                      <div class="card mb-4"
                        @click="viewDetailSubCategory(category)"
                      >
                        <div class="count-sub bg-danger rounded" v-if="category.sub_category.length > 0 ">
                          <span>
                            {{ category.sub_category.length }}
                          </span>
                        </div>
                        <center>
                          <b-img
                            :src="$helpers.nullToVoid(category.image) != '' ? imagePathShop + 'category/' + category.image : ''"
                            alt="thumbnail"
                            class="border-0"
                            onerror="this.src='/default.jpg'"
                            style="
                                width: 100%;
                                height: 110px;
                                border-radius: 0.75rem;
                            "
                          ></b-img>
                          <p class="mt-2">{{ category.name }}</p>
                        </center>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
              </div>
            </b-tab>
            <b-tab :title="$t('brand')">
              <div class="mt-3">
                <div v-if="$helpers.nullToVoid(brandList) != ''" class="d-flex flex-wrap">
                  <b-row>
                    <b-col xl="2" lg="2"
                      v-for="brand in brandList" :key="brand.id"
                    >
                      <div class="card mb-3">
                        <center>
                          <b-img
                            :src="$helpers.nullToVoid(brand.image) != '' ? imagePathShop + 'brand/' + brand.image : ''"
                            alt="thumbnail"
                            class="border-0"
                            onerror="this.src='/default.jpg'"
                            style="
                              width: 100%;
                              height: 110px;
                              border-radius: 0.75rem;
                            "
                          ></b-img>
                          <p class="mt-2">{{ brand.name }}</p>
                        </center>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
              </div>
            </b-tab>
            <b-tab :title="$t('modifier')">
              <div v-if="$helpers.nullToVoid(modifierList) != ''">
                <b-table
                :empty-text="$t('no_data')"
                :fields='modifierHeader'
                :items='modifierList'
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
                  <!-- Choice -->
                  <template #cell(choice)="row">
                    <span v-if="row.item.choice == enums.modifier_choice.SINGLE">
                      {{ $t('single') }}
                    </span>
                    <span v-else-if="row.item.choice == enums.modifier_choice.MULTI">
                      {{ $t('multi') }}
                    </span>
                  </template>

                  <!-- Required -->
                  <template #cell(is_required)="row">
                    <span v-if="row.item.is_required == enums.is_required_modifier.YES">
                      {{ $t('is_required') }}
                    </span>
                    <span v-if="row.item.is_required == enums.is_required_modifier.NO">
                      {{ $t('not_required') }}
                    </span>
                  </template>

                  <!-- option -->
                  <template #cell(modifier_option)="row">
                    <div v-if="$helpers.nullToVoid(row.item.modifier_option) != ''">
                      <b-badge v-for="option in row.item.modifier_option" :key="option.id" variant="light"
                        style="font-size: 10px;" class="mr-2 mb-2">
                        {{ option.name }} - {{ option.price | currency('$',2) }}
                      </b-badge>
                    </div>
                    <div v-else class="text-muted">
                      <b-badge variant="light" style="font-size: 11px;">
                        {{ $t('no_data') }}
                      </b-badge>
                    </div>
                  </template>
                <!-- End Custom Fields Area -->
                </b-table>
              </div>
              <div v-else class="text-muted text-center mt-4">{{ $t('no_data') }}</div>
            </b-tab>
          </b-tabs>
        </b-col>
    </b-row>
    </b-card>

    <b-card v-if="$helpers.nullToVoid(detailData)" class="mt-3">
      <b-card-title>{{ $t('product_list') }}</b-card-title>
      <b-row>
        <b-col class="text-left" cols="6">
          <div class="search-sm d-inline-block">
            <b-input v-model="productFilter.search" :placeholder="$t('search')" @input="getProductList(false)"/>
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
              @click='productPagination.per_page = size; getProductList()'
            >
              {{ size }}
            </b-dropdown-item
            >
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
              module-key="shop_list"
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
              path="shop/profile/product/thumbnail"
            ></i-table-image-viewer>
          </template>

          <!-- Product Modifier -->
          <template #cell(product_modifier)="row">
            <div v-if="$helpers.nullToVoid(row.item.product_modifier) != ''">
              <b-badge v-for="product in row.item.product_modifier" :key="product.id" variant="light"
                style="font-size: 10px;" class="mr-2 mb-2">
                {{ product.name }}
              </b-badge>
            </div>
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
              @input='getProductList()'
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
import swal from 'sweetalert2'
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import GlideComponent from '~/components/Carousel/GlideComponent'
import * as VueGoogleMaps from 'vue2-google-maps'
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
import {mapGetters} from "vuex";
export default{
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'shop_list',
  components: {
    GlideComponentThumbs,
    GlideComponent,
    iTableActionDropdown,
    iTableImageViewer,
    ModalSubCategory: () => import("./components/ModalSubCategory"),
    ModalProductDetail: () => import("./components/ModalProductDetail.vue"),
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
      productList: [],
      categoryList: [],
      brandList: [],
      modifierList: [],
      bankAccountList: [],
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
          key: 'action',
          label: this.$t('action'),
          sortable: false
        },
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
          key: 'category_name',
          label: this.$t('category'),
          sortable: false,
        },
        {
          key: 'brand_name',
          label: this.$t('brand'),
          sortable: false,
        },
        {
          key: 'product_modifier',
          label: this.$t('modifier'),
          sortable: false,
          tdClass: 'descriptionTdWidth',
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
      modifierHeader: [
        {
          key: 'name',
          label: this.$t('name'),
          sortable: false,
          tdClass: 'nameTdWidth'
        },
        {
          key: 'choice',
          label: this.$t('choice'),
          sortable: false,
        },
        {
          key: 'is_required',
          label: this.$t('is_required'),
          sortable: false,
        },
        {
          key: 'modifier_option',
          label: this.$t('modifier_option'),
          sortable: false,
          tdClass: 'descriptionTdWidth'
        },
      ],
      productSearch: null,
      showModal: false,
      modal: false,
      subCategoryData: {},
      productFilter: {
        business_id: null,
        search: null
      },
      imagePath: process.env.API_URL + 'images/',
      imagePathShop: process.env.API_URL + 'images/shop/profile/',
      glideIconsOption: {
        perView: 2,
        hideNav: true,
        gap: 10,
        breakpoints: {
          600: {perView: 2},
          1200: {perView: 3}
        }
      },
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
      // this.$router.push({path: this.makeLink('/business/shop/shop_list')})
    },
    getNameList(name) {
      if (!name) return '';

      let parsedName = JSON.parse(name);
      let data;
      if (Array.isArray(parsedName)) {
        data = parsedName.map(item => item.en_US).join(', ');
      } else {
        data = parsedName.en_US || '';
      }
      return data;
    },
    getDetail(loading = true) {
      let vm = this

      let input = {
        shop_id: vm.$route.query.id,
        loading: loading
      }

      vm.clearGenerateMap()
      vm.$axios.$post('shop_list/get_detail', input).then(({data}) => {
        vm.detailData = data
        vm.setImageGallery()
        vm.generateMap(data.latitude, data.longitude)
        vm.getProductList()
        vm.getSelectShopDetail()
      })
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.detailData)) {
        //alias with image path
        this.detailData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/shop/cover/${obj.image}`
          return obj
        })

        //push thumbnail image
        this.detailData.gallery_photo.unshift({
          id: this.detailData.id,
          image: `${this.apiUrl}images/shop/logo/${this.detailData.image}`
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
    getProductList(loading = true) {
      let vm = this

      vm.productFilter.business_id = vm.$route.query.id

      let input = {
        filter: vm.productFilter,
        table_size: vm.productPagination.per_page,
        page: vm.productPagination.current_page,
        loading: loading
      }

      vm.$axios.$post('product_list/get_product_list', input).then(({data}) => {
        vm.productList = data.data
        vm.productPagination.total = data.pagination.total
        vm.productPagination.from = data.pagination.from
        vm.productPagination.to = data.pagination.to
      })
    },
    getSelectShopDetail(loading = true) {
      let vm = this

      let input = {
        business_id: vm.$route.query.id,
        loading: loading
      }

      vm.$axios.$post('shop_list/get_select_shop_detail', input)
        .then(({data}) => {
          vm.categoryList = data.category,
          vm.brandList = data.brand,
          vm.modifierList = data.modifier
          vm.bankAccountList = data.bank_account
        })
    },
    viewProductDetail(item) {
      this.modal = true
      this.productItem = item
    },
    viewDetailSubCategory(category) {
      if(category.sub_category.length > 0) {
        this.showModal = true
        this.subCategoryData = category
      }
    },
    closeModalProduct() {
      this.modal = false
    },
    closeModal() {
      this.showModal = false
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
            .$post('product_list/change_status_suspend', input)
            .then(({data}) => {
              swal.close()
              vm.$notify(
                'success',
                vm.$t('product_list'),
                vm.$t('done')
              )
              vm.getProductList(false)
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
<style lang="scss" scoped>
:deep(.currentLocateIcon) {
  top: 350px;
}
:deep(.count-sub){
  background: #000;
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  padding: 1px 6px;
  font-size: 12px;
}

:deep(.box-width) {
  width: 300px;
}
</style>
