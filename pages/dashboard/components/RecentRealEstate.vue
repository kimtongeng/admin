<template>
  <b-card :title="$t('real_estate_recent_post')" style="margin-bottom: 20px">

    <vue-perfect-scrollbar
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      class="scroll dashboard-list-with-thumbs"
    >
      <div
        v-if="recentRealEstateData.length == 0"
        class="text-center text-muted"
        style="margin-top: 190px"
      >
        <h5>{{ $t('no_data') }}</h5>
      </div>

      <div
        v-for="(product, index) in recentRealEstateData"
        v-else
        :key="index"
        class="d-flex flex-row mb-3"
        @click="viewDetail(product)"
      >
        <b-link :to="'#'" class="d-block position-relative" tag="a">
          <b-img
            v-if="$helpers.nullToVoid(product.image) == ''"
            src="/default.jpg"
            style="
                    width: 85px;
                    height: 85px;
                    border-radius: 0.75rem;
                "
          ></b-img>
          <b-img
            v-else
            :src="$helpers.nullToVoid(product.image) != '' ? imagePath + product.image : ''"
            alt="thumbnail"
            class="border-0"
            onerror="this.src='/default.jpg'"
            style="
                            width: 85px;
                            height: 85px;
                            border-radius: 0.75rem;
                        "
          ></b-img>
          <b-badge
            v-if="product.property_type == enums.property_type.SINGLE"
            :variant="productStatusColor(product.status)"
            class="position-absolute badge-top-right text-white"
            pill
          >{{ productStatusText(product.status) }}
          </b-badge
          >
        </b-link>
        <div class="pl-3 pt-2 pr-2 pb-2">
          <b-link :to="'#'" tag="a">
            <div class="list-item-heading product-name mb-1">
              {{ getLessText(product.name) }}
              <template
                v-if="getLessText(product.name).length >= 80"
              >....
              </template
              >
            </div>
            <div
              v-if="$helpers.nullToVoid(product.description) != ''"
              class="pr-4"
            >
              <p class="text-muted mb-2 text-small">
                <span>
                  {{ getLessText(product.description) }}
                  <template v-if="getLessText(product.description).length >= 80">....</template>
                </span>
              </p>
            </div>
            <div
              class="text-small font-weight-medium d-none d-sm-block"
            >
              <span>{{ $t('created_at') }}:</span>
              <span>{{
                  createdAtFormat(product.created_at)
                }}</span>
            </div>
          </b-link>
        </div>
      </div>
    </vue-perfect-scrollbar>
  </b-card>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    recentRealEstateData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      apiUrl: process.env.API_URL,
      imagePath: null,
    }
  },
  watch: {
    recentRealEstateData: {
      handler(val) {
        if (val.length > 0) {
          this.imagePath = this.apiUrl + 'images/real_estate/property/thumbnail/'
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    productStatusText(status) {
      if (status == this.enums.business_status.APPROVED) {
        return this.$t('not_yet_book')
      } else if (status == this.enums.business_status.BOOKING) {
        return this.$t('booking')
      } else if (status == this.enums.business_status.COMPLETED_BOOKING) {
        return this.$t('sold_out')
      }
    },
    productStatusColor(status) {
      if (status == this.enums.business_status.APPROVED) {
        return 'secondary'
      } else if (status == this.enums.business_status.BOOKING) {
        return 'warning'
      } else if (status == this.enums.business_status.COMPLETED_BOOKING) {
        return 'success'
      }
    },
    createdAtFormat(date) {
      if (this.$i18n.locale == 'en') {
        return moment(date, 'YYYY-MM-DD HH:mm:ss')
          .locale('en')
          .format('DD/MM/YYYY hh:mm A')
      } else if (this.$i18n.locale == 'kh') {
        return moment(date, 'YYYY-MM-DD HH:mm:ss')
          .locale('km')
          .format('DD/MM/YYYY hh:mm A')
      }
    },
    getLessText(text) {
      return text.substring(0, 80)
    },
    viewDetail(item) {
      this.$router.push('/business/property/view_detail?id=' + item.id);
    },
  },
}
</script>
<style scoped>
.product-name {
  font-family: 'Kantumruy', sans-serif !important;
}

.position-absolute {
  position: absolute !important;
}
</style>
