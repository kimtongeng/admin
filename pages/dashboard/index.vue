<template>
  <div class="space-box">
    <div class="p-2">
      <b-row class="px-1">
        <b-col xl="6" lg="6" md="6" sm="6" cols="12" class="mb-3 padding-box">
           <div class="bg-primary card-banner">
              <b-row class="h-100">
                <b-col xl="4" lg="4" md="12" sm="12" cols="12">
                  <div class="d-flex h-100 align-items-center justify-content-center flex-column">
                    <i class="simple-icon-user mb-3 mt-3" style="font-size: 3.7rem;"></i>
                    <h3 style="font-size: 1rem;" class="text-light">{{ $t('users') }}</h3>
                  </div>
                </b-col>
                <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="p-1">
                    <div class="d-flex h-100 align-items-start justify-content-center flex-column text">
                      <h4 class="m-3">{{ $t('total') }}</h4>
                      <h4 class="m-3">{{ $t('new_users') }}</h4>
                      <h4 class="m-3">{{ $t('block') }}</h4>
                    </div>
                </b-col>
                <b-col xl="4" lg="3" md="6" sm="6" cols="6" class="p-1">
                  <div class="d-flex h-100 align-items-end justify-content-center flex-column text" style="padding-right: 1rem;">
                      <h4 class="m-3">{{ countUserData.total_contact }}</h4>
                      <h4 class="m-3"> {{ countUserData.total_contact_current_month }} </h4>
                      <h4 class="m-3">{{ countUserData.total_block_contact }}</h4>
                    </div>
                </b-col>
              </b-row>
          </div>
        </b-col>
        <b-col xl="6" lg="6" md="6" sm="6" cols="12" class="padding-box">
           <div class="bg-primary card-banner">
              <b-row class="h-100">
                <b-col xl="4" lg="3" md="12" sm="12" cols="12">
                  <div class="d-flex h-100 align-items-center justify-content-center flex-column">
                    <i class="iconsminds-bank mb-1" style="font-size: 3.7rem;"></i>
                    <h3 style="font-size: 1rem;" class="text-light">{{ $t('app_fee') }}</h3>
                  </div>
                </b-col>
                <b-col xl="4" lg="4" md="6" sm="6" cols="6" class="p-1">
                    <div class="d-flex h-100 align-items-start justify-content-center flex-column text">
                      <h4 class="m-3">{{ $t('total') }}</h4>
                      <h4 class="m-3">{{ $t('paid') }}</h4>
                      <h4 class="m-3">{{ $t('outstanding') }}</h4>
                    </div>
                </b-col>
                <b-col xl="4" lg="5" md="6" sm="6" cols="6" class="p-1">
                  <div class="d-flex h-100 align-items-end justify-content-center flex-column text" style="padding-right: 1rem;">
                    <h4 class="m-3">{{ countTransactionFeeData.grand_total | currency('$',2) }}</h4>
                    <h4 class="m-3"> {{ countTransactionFeeData.total_paid_amount | currency('$',2) }} </h4>
                    <h4 class="m-3">{{ countTransactionFeeData.total_outstanding_amount | currency('$',2) }}</h4>
                    </div>
                </b-col>
              </b-row>
          </div>
        </b-col>
      </b-row>

      <b-row class="mt-3 p-1">
        <b-col xl="6" lg="6" md="12" sm="12" cols="12" class="mb-4">
            <b-row>
              <b-col xl="6" lg="6" md="6" sm="6" cols="12" class="mb-4 padding-box">
                <div class="small-box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/property.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('real_estate') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('agency') }}</h6>
                      <h6>{{ $t('all_property') }}</h6>
                      <h6>{{ $t('selling') }}</h6>
                      <h6>{{ $t('booking') }}</h6>
                      <h6>{{ $t('sold_out') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column align-items-end text-info">
                      <h6>{{ countRealEstate.owner }}</h6>
                      <h6>{{ countRealEstate.agency }}</h6>
                      <h6>{{ countRealEstate.all_property }}</h6>
                      <h6>{{ countRealEstate.selling }}</h6>
                      <h6>{{ countRealEstate.booking }}</h6>
                      <h6>{{ countRealEstate.sold_out }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col xl="6" lg="6" md="6" sm="6" cols="12" class="mb-4 padding-box">
                <div class="small-box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/accommodation.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('hotel') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('agency') }}</h6>
                      <h6>{{ $t('all_property') }}</h6>
                      <h6>{{ $t('selling') }}</h6>
                      <h6>{{ $t('sold_out') }}</h6>
                      <h6>{{ $t('booking') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column align-items-end text-info">
                      <h6>{{ countHotel.owner }}</h6>
                      <h6>{{ countHotel.agency }}</h6>
                      <h6>{{ countHotel.all_property }}</h6>
                      <h6>{{ countHotel.selling }}</h6>
                      <h6>{{ countHotel.booking }}</h6>
                      <h6>{{ countHotel.sold_out }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-0">
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="mb-4 margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/shop_retail.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('shop_retail') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('store') }}</h6>
                      <h6>{{ $t('product') }}</h6>
                      <h6>{{ $t('category') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column text-info align-items-end">
                      <h6>{{ countRetail.owner }}</h6>
                      <h6>{{ countRetail.store }}</h6>
                      <h6>{{ countRetail.product }}</h6>
                      <h6>{{ countRetail.category }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="mb-4 margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/shop_wholesale.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('shop_wholesale') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('store') }}</h6>
                      <h6>{{ $t('product') }}</h6>
                      <h6>{{ $t('category') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column text-info align-items-end">
                      <h6>{{ countWholesale.owner }}</h6>
                      <h6>{{ countWholesale.store }}</h6>
                      <h6>{{ countWholesale.product }}</h6>
                      <h6>{{ countWholesale.category }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="mb-4 margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/restaurant.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('restaurant') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('store') }}</h6>
                      <h6>{{ $t('product') }}</h6>
                      <h6>{{ $t('category') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column text-info align-items-end">
                      <h6>{{ countFood.owner }}</h6>
                      <h6>{{ countFood.store }}</h6>
                      <h6>{{ countFood.product }}</h6>
                      <h6>{{ countFood.category }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="mb-4 margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/delivery.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('delivery') }}</h4>
                  </div>
                  <b-row class="text-box">
                    <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column">
                      <h6>{{ $t('owner') }}</h6>
                      <h6>{{ $t('store') }}</h6>
                      <h6>{{ $t('product') }}</h6>
                      <h6>{{ $t('category') }}</h6>
                    </b-col>
                    <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column text-info align-items-end">
                      <h6>{{ countDelivery.owner }}</h6>
                      <h6>{{ countDelivery.store }}</h6>
                      <h6>{{ countDelivery.product }}</h6>
                      <h6>{{ countDelivery.category }}</h6>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="mb-4 margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/attraction.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('attraction') }}</h4>
                  </div>
                  <div class="d-flex justify-content-center align-items-center flex-column space-box">
                    <h1 class="text-info m-0" style="font-size: 1.5rem;">{{ countAttraction }}</h1>
                    <p style="font-size: 0.8rem;">{{ $t('place') }}</p>
                  </div>
                </div>
              </b-col>
              <b-col xl="4" lg="6" md="4" sm="6" cols="6" class="margin-top padding-box">
                <div class="small-box box">
                  <div class="w-100 header-box">
                    <img src="@/static/business_type/news.svg" width="25" alt="" class="float-left mr-2">
                    <h4>{{ $t('society') }}</h4>
                  </div>
                  <div class="d-flex justify-content-center align-items-center flex-column space-box">
                    <h1 class="text-info m-0" style="font-size: 1.5rem;">{{ countSociety }}</h1>
                    <p style="font-size: 0.8rem;">{{ $t('cases') }}</p>
                  </div>
                </div>
              </b-col>
            </b-row>
        </b-col>

        <b-col xl="6" lg="6" md="12" sm="12" cols="12" class="padding-box">
          <RecentRealEstate :recent-real-estate-data="recentRealEstateData" />
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import RecentRealEstate from './components/RecentRealEstate'

export default {
  name: 'dashboard',
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'dashboard',
  head() {
    return {
      title: this.$t('dashboard'),
    }
  },
  components: {
    RecentRealEstate,
  },
  data() {
    return {
      countUserData: {
        total_contact: 0,
        total_contact_current_month: 0,
        total_block_contact: 0
      },
      countTransactionFeeData: {
        grand_total: 0,
        total_paid_amount: 0,
        total_outstanding_amount: 0
      },
      countRealEstate: {
        owner: 0,
        agency: 0,
        all_property: 0,
        selling: 0,
        booking: 0,
        sold_out: 0
      },
      countHotel: {
        owner: 0,
        agency: 0,
        all_property: 0,
        selling: 0,
        booking: 0,
        sold_out: 0
      },
      countRetail: {
        owner: 0,
        store: 0,
        product: 0,
        category: 0
      },
      countWholesale: {
        owner: 0,
        store: 0,
        product: 0,
        category: 0
      },
      countFood: {
        owner: 0,
        store: 0,
        product: 0,
        category: 0
      },
      countDelivery: {
        owner: 0,
        store: 0,
        product: 0,
        category: 0
      },
      countAttraction: 0,
      countSociety: 0,
      saleLineChartData: [],
      recentRealEstateData: [],
    }
  },
  created() {
    this.get()
  },
  methods: {
    get() {
      this.$axios.$post('dashboard/get_all_data').then(({data}) => {
        //Count User
        this.countUserData = data.count_user_data

        //Count Transaction
        this.countTransactionFeeData = data.count_transaction_fee_data

        //Recent Real Estate
        this.recentRealEstateData = data.recent_real_estate_data

        //Count Owner By Business Type
        this.countRealEstate.owner = data.count_owner_by_business_type.real_estate
        this.countHotel.owner = data.count_owner_by_business_type.hotel
        this.countRetail.owner = data.count_owner_by_business_type.retail
        this.countWholesale.owner = data.count_owner_by_business_type.wholesale
        this.countFood.owner = data.count_owner_by_business_type.food
        this.countDelivery.owner = data.count_owner_by_business_type.delivery

        //Count Agency In Business Real Estate
        this.countRealEstate.agency = data.count_agency_in_business_real_estate

        //Count Total Business By Business Type
        this.countRealEstate.all_property = data.count_business_by_business_type.real_estate
        this.countHotel.all_property = data.count_business_by_business_type.hotel
        this.countRetail.product = data.count_business_by_business_type.retail
        this.countWholesale.product = data.count_business_by_business_type.wholesale
        this.countFood.product = data.count_business_by_business_type.food
        this.countDelivery.product = data.count_business_by_business_type.delivery
        this.countAttraction = data.count_business_by_business_type.attraction
        this.countSociety = data.count_business_by_business_type.society

        //Count Status Business Real Estate
        this.countRealEstate.selling = data.count_status_business_real_estate.selling
        this.countRealEstate.booking = data.count_status_business_real_estate.booking
        this.countRealEstate.sold_out = data.count_status_business_real_estate.sold_out
      })
    },
  },
}
</script>

<style lang="scss" scoped>
// card banner
  .card-banner {
    border-radius: 0.6rem !important;
    .text h4 {
      font-size: 0.8rem;
    }
  }
// box app
  .small-box {
    border-radius: 0.6rem;
    position: relative;
    box-shadow: 0 0 5px -2px gray;
    background-color: white;
    .header-box {
      padding-top: 0.9rem;
      padding-bottom: 0.3rem;
      padding-left: 0.6rem;
      padding-right: 0.1rem;
      border-bottom: 1px solid gray;
      h4 {
        font-size: 1rem;
      }
    }
    .text-box {
      padding: 0.9rem;
      h6 {
        font-size: 0.8rem;
      }
    }

    .space-box {
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
// width box
  .box {
    height: 10rem;
  }
// right box
  .box-right {
    border-radius: 10px;
    box-shadow: 0 0 5px -2px gray;
    height: 40rem;

    // badge popup
    .pop-up {
      position: absolute;
      top: 2.1rem;
      left: 3.4rem;
    }
  }

// space Box
  .space-box{
    margin-top: -0.3rem;
    margin-left: -1.5rem;
    margin-right: -1.6rem;
  }

// Margin All Box
  .padding-box {
    padding: 0 1.25rem;
  }

  .margin-top {
    margin-top: 1.1rem;
  }

// Media Screen Response

/* Mobile Phone */

@media (max-width: 575.98px) {
  // space Box
  .space-box{
    margin-top: -0.3rem;
    margin-left: -0.1rem;
    margin-right: -0.3rem;
  }

// Margin All Box
  .padding-box {
    padding: 0 0.9rem;
  }


  .small-box .space-box {
      position: absolute;
      top: 50%;
      left: 44%;
    }
}

/* landscape */
@media (min-width: 576px) and (max-width: 767.98px) {
  // space Box
  .space-box{
    margin-top: -0.3rem;
    margin-left: -0.1rem;
    margin-right: -0.2rem;
  }

// Margin All Box
  .padding-box {
    padding: 0 0.5rem;
  }

  .margin-top {
    margin-top: 0.2rem;
  }
}

/* ipad*/
@media (min-width: 768px) and (max-width: 991.98px) {
  // space Box
  .space-box{
    margin-top: -0.3rem;
    margin-left: -1rem;
    margin-right: -1rem;
  }

// Margin All Box
  .padding-box {
    padding: 0 0.9rem;
  }
}

/* ipad pro */
@media (min-width: 992px) and (max-width: 1199.98px) {
  // Margin All Box
  .padding-box {
    padding: 0 0.6rem;
  }

  .margin-top {
    margin-top: 0.3rem;
  }

  .small-box .space-box {
      position: absolute;
      top: 50%;
      left: 50%;
    }
}

/* Laptop*/
@media (min-width: 1200px) {
  // space Box
  .space-box{
    margin-top: -1.5rem;
    margin-left: -2.3rem;
    margin-right: -2.4rem;
  }
  .padding-box {
    padding: 0 1rem;
  }

  .margin-top {
    margin-top: 0.3rem;
  }

  .small-box .space-box {
      position: absolute;
      top: 57%;
      left: 60%;
    }
}

</style>
