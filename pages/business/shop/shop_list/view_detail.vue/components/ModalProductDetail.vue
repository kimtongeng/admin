<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    size="xl"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    :title="modalHeader"
  >
    <b-row>
      <!-- Detail Product -->
      <b-col lg='6' md='6' sm='12' xl='6'>
        <b-row>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('code') }}</b> :
              <span>{{ productData.code }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('name') }}</b> :
              <span>{{ productData.name }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('category') }}</b> :
              <span>{{ productData.category_name }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('brand') }}</b> :
              <span>{{ productData.brand_name }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6" v-if="productData.has_variant == enums.is_has_variant.NO">
            <div class="size-text mb-3">
              <b>{{ $t('price') }}</b> :
              <span>{{ productData.price | currency($,2) }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6" v-if="productData.has_variant == enums.is_has_variant.NO">
            <div class="size-text mb-3">
              <b>{{ $t('discount') }}</b> :
              <span>{{ productData.discount_amount | currency($,2) }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6" v-if="productData.has_variant == enums.is_has_variant.NO">
            <div class="size-text mb-3">
              <b>{{ $t('price') }}</b> :
              <span>{{ productData.sell_price | currency($,2) }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('stock') }}</b> :
              <span v-if="productData.is_track_stock == enums.is_track_stock.YES">
                {{ $t('has_stock') }}
              </span>
              <span v-else-if="productData.is_track_stock == enums.is_track_stock.NO">
                 {{ $t('not_stock') }}
              </span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('variant') }}</b> :
              <span v-if="productData.has_variant == enums.is_has_variant.YES">
                {{ $t('has_variant') }}
              </span>
              <span v-else-if="productData.has_variant == enums.is_has_variant.NO">
                 {{ $t('not_variant') }}
              </span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div class="size-text mb-3">
              <b>{{ $t('order_count') }}</b> :
              <span>{{ productData.order_count }}</span>
            </div>
          </b-col>
          <b-col lg="6" xl="6">
            <div  v-if="productData.is_track_stock == enums.is_track_stock.YES && 
            productData.has_variant == enums.is_has_variant.NO"
              class="size-text mb-3">
              <b>{{ $t('quantity') }}</b> :
              <span>
                {{ productData.qty }}
              </span>
            </div>
          </b-col>
          <b-col lg="12" xl="12">
            <div class="size-text mb-3">
              <b>{{ $t('modifier') }}</b> :
              <span v-for="product in productData.product_modifier" :key="product.id" variant="light"
                class="mr-2">
                {{ product.name }},
              </span>
            </div>
          </b-col>
          <b-col lg="12" xl="12">
            <div class="size-text mb-3">
              <b>{{ $t('description') }}</b> :
              <span v-if="$helpers.nullToVoid(productData.description) != ''">
                {{ productData.description | truncate(150) }}
              </span>
            </div>
          </b-col>
          <!-- <b-col lg="12" xl="12" class="mt-4" v-if="$helpers.nullToVoid(productData.product_modifier) != ''">
            <h5>{{ $t('modifier_option') }}</h5>
            <div class="d-flex flex-wrap">
              <b-card v-for="product2 in productData.product_modifier" :key="product2.id"
                class="p-0 m-2">
                <b>{{ product2.name }}</b>
                <span v-for="option2 in product2.modifier_option" :key="option2.id">
                  {{ option2.name }} ,
                </span>
              </b-card>
            </div>
          </b-col> -->
        </b-row>
      </b-col>
      <b-col lg='6' md='6' sm='12' xl='6'>
        <!-- Thumbnail -->
        <div>
          <glide-component-thumbs
            :settingsImages="{ bound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 1, data: productData.gallery_photo}"
            :settingsThumbs="{ bbound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 5, data: productData.gallery_photo, breakpoints: { 576: { perView: 4 }, 420: { perView: 3 } } }"
          />
        </div>
      </b-col>
    </b-row>

    <!-- Product Variant -->
    <div 
      class="mt-4" 
      v-if="$helpers.nullToVoid(productData.product_variant) != '' &&
      productData.has_variant == enums.is_has_variant.YES"
    >
      <!-- Title -->
      <h3>
        {{ $t('product_variant') }}
      </h3>

      <b-table
        :empty-text="$t('no_data')"
        :fields='productVariantHeader'
        :items='productData.product_variant'
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
        <!-- Custom Fields -->
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

          <template #cell(qty)="row">
            {{ parseFloat(row.item.qty) }}
          </template>
          <template #cell(alert_qty)="row">
            {{ parseFloat(row.item.alert_qty) }}
          </template>
        <!-- End-->
      </b-table>
    </div>

    <!-- Footer -->
    <template slot="modal-footer">
      <b-button size="xs" variant="outline-danger" @click="closeModal"
      >{{ $t('close') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import GlideComponentThumbs from '~/components/Carousel/GlideComponentThumbs'
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
export default {
  props: {
    productData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
   components: {
    GlideComponentThumbs,
    iTableImageViewer,
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      productVariantHeader: [
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
          key: 'qty',
          label: this.$t('quantity'),
          sortable: false,
          tdClass: 'text-center',
        },
        {
          key: 'alert_qty',
          label: this.$t('alert_quantity'),
          sortable: false,
          tdClass: 'text-center',
        },
      ],
    }
  },
  created() {
    this.modal = true
    this.setImageGallery()
    this.dynamicHeader()
  },
  computed: {
    modalHeader() {
      return this.productData.name
    },
  },
  methods: {
    closeModal() {
      this.modal = false
      this.$emit('closeModalProduct', this.modal)
    },
    setImageGallery() {
      if (!this.$helpers.isEmpty(this.productData)) {
        //alias with image path
        this.productData.gallery_photo.map(obj => {
          obj.image = `${this.apiUrl}images/shop/profile/product/gallery${obj.image}`
          return obj
        })

        //push thumbnail image
        this.productData.gallery_photo.unshift({
          id: this.productData.id,
          image: `${this.apiUrl}images/shop/profile/product/thumbnail${this.productData.image}`
        })
      }
    },
    dynamicHeader() {
      if(this.productData.is_track_stock == this.enums.is_track_stock.YES) {
       this.productVariantHeader = this.productVariantHeader 
      } else if(this.productData.is_track_stock == this.enums.is_track_stock.NO) {
        this.productVariantHeader = [
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
        ];
      }
    }
  }
}
</script>
<style scoped>
:deep(.glide.details .glide__slide img){
  height: 250px !important;
}

.size-text {
  font-size: 0.910rem;
}
</style>
