<template>
  <div>
    <!-- Start modal Component -->
    <b-modal
      id="modal"
      v-model="modal"
      centered
      size="lg"
      :title="$t('address')"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      @hidden="clearForm"
    >
      <b-container fluid>
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('country')"
              :state="!veeErrors.has('country')"
              :label="$t('country')"
              label-for="country"
            >
              <b-form-select
                id="country"
                v-model="form.country"
                :state="veeErrors.has('country') ? false : null"
                data-vv-name="country"
                required
                :disabled="inProgress"
                @change="getProvinces(form.country)"
              >
                <!-- <option :value="null" disabled>{{ $t('country') }}</option> -->
                <option
                  v-for="country in countries"
                  :key="country.id"
                  :value="country"
                >
                  {{
                    getLanguageAddressName(
                      country,
                      'country_name',
                      'country_local_name',
                      addressLaguage
                    )
                  }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('province')"
              :state="!veeErrors.has('province')"
              :label="$t('province')"
              label-for="province"
            >
              <b-form-select
                id="province"
                v-model="form.province"
                :state="
                                    veeErrors.has('province') ? false : null
                                "
                data-vv-name="province"
                required
                :disabled="inProgress"
                @change="getDistricts(form.province)"
              >
                <!-- <option :value="null" disabled>{{ $t('province') }}</option> -->
                <option
                  v-for="province in provinces"
                  :key="province.id"
                  :value="province"
                >
                  {{
                    getLanguageAddressName(
                      province,
                      'province_name',
                      'province_local_name',
                      addressLaguage
                    )
                  }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('district')"
              :state="!veeErrors.has('district')"
              :label="$t('district')"
              label-for="district"
            >
              <b-form-select
                id="district"
                v-model="form.district"
                :state="
                                    veeErrors.has('district') ? false : null
                                "
                data-vv-name="district"
                required
                :disabled="inProgress"
                @change="getCommunes(form.district)"
              >
                <option
                  v-for="district in districts"
                  :key="district.id"
                  :value="district"
                >
                  {{
                    getLanguageAddressName(
                      district,
                      'district_name',
                      'district_local_name',
                      addressLaguage
                    )
                  }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('commune')"
              :state="!veeErrors.has('commune')"
              :label="$t('commune')"
              label-for="commune"
            >
              <b-form-select
                id="commune"
                v-model="form.commune"
                :state="veeErrors.has('commune') ? false : null"
                data-vv-name="commune"
                required
                :disabled="inProgress"
                @change="getVillages(form.commune)"
              >
                <option
                  v-for="commune in communes"
                  :key="commune.id"
                  :value="commune"
                >
                  {{
                    getLanguageAddressName(
                      commune,
                      'commune_name',
                      'commune_local_name',
                      addressLaguage
                    )
                  }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('village')"
              :state="!veeErrors.has('village')"
              :label="$t('village')"
              label-for="village"
            >
              <b-form-select
                id="village"
                v-model="form.village"
                v-validate="''"
                :state="veeErrors.has('village') ? false : null"
                data-vv-name="village"
                :disabled="inProgress"
                required
              >
                <option
                  v-for="village in villages"
                  :key="village.id"
                  :value="village"
                >
                  {{
                    getLanguageAddressName(
                      village,
                      'village_name',
                      'village_local_name',
                      addressLaguage
                    )
                  }}
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('house_no')"
              :state="!veeErrors.has('house_no')"
              :label="$t('house_no')"
              label-for="house_no"
            >
              <b-form-input
                v-model="form.house_no"
                v-validate="'max:100'"
                :state="
                                    veeErrors.has('house_no') ? false : null
                                "
                data-vv-name="house_no"
                type="text"
                required
                :disabled="inProgress"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('street_local')"
              :state="!veeErrors.has('street_local')"
              :label="$t('street_local')"
              label-for="street_local"
            >
              <b-form-input
                v-model="form.street_local"
                v-validate="'max:100'"
                :state="
                                    veeErrors.has('street_local') ? false : null
                                "
                data-vv-name="street_local"
                type="text"
                required
                :disabled="inProgress"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
          <b-col md="12" lg="6">
            <b-form-group
              :invalid-feedback="veeErrors.first('street_latin')"
              :state="!veeErrors.has('street_latin')"
              :label="$t('street_latin')"
              label-for="street_latin"
            >
              <b-form-input
                v-model="form.street_latin"
                v-validate="'max:100'"
                :state="
                                    veeErrors.has('street_latin') ? false : null
                                "
                data-vv-name="street_latin"
                type="text"
                required
                :disabled="inProgress"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group :label="$t('choose_language_of_address')">
              <b-form-radio-group
                id="radio-group-2"
                v-model="addressLaguage"
                name="radio-sub-component"
              >
                <b-form-radio value="1">{{
                    $t('local_name')
                  }}
                </b-form-radio>
                <b-form-radio value="2">{{
                    $t('latin_name')
                  }}
                </b-form-radio>
              </b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
      <template slot="modal-footer">
        <b-button
          variant="outline-secondary"
          :disabled="inProgress"
          @click="modal = false"
        >{{ $t('cancel') }}
        </b-button
        >
        <b-button
          variant="primary"
          :disabled="inProgress"
          @click="save"
        >{{ $t('ok') }}
        </b-button
        >
      </template>
    </b-modal>
    <!-- End modal Component -->
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        country: {},
        province: {},
        district: {},
        commune: {},
        village: {},
        street: null,
        street_latin: null,
        street_local: null,
        house_no: null,
        location_local: null,
        location_latin: null,
      },
      provinces: [],
      districts: [],
      communes: [],
      villages: [],
      inProgress: false,
      addressLaguage: 1,
      modal: false,
      item: {},
    }
  },
  computed: {
    ...mapGetters({
      countries: 'country/list',
    }),
  },
  watch: {
    modalType: {
      handler(val) {
        if (val == 1) {
          this.modal = true
          this.setData()
        } else if (val == 2) {
          this.modal = true
          this.setData()
        }
      },
      immediate: true,
    },
  },
  methods: {
    save() {
      this.form.location_local = this.getLocation(this.form)
      this.form.location_latin = this.getLocation(this.form, 2)
      this.form.street = JSON.stringify({
        latin_name: this.form.street_latin,
        local_name: this.form.street_local,
      })
      this.item = this.form
      this.modal = false
    },
    /** Get Countries */
    getProvinces(country) {
      let vm = this
      if (!this.$helpers.isEmpty(country)) {
        vm.inProgress = true
        this.$axios
          .$post('province/get', {country_id: country.id})
          .then(({data}) => {
            vm.inProgress = false
            vm.provinces = data
            vm.districts = []
            vm.communes = []
            vm.villages = []
          })
          .catch((error) => {
            vm.inProgress = false
          })
      }
    },
    /** Get Countries */
    getDistricts(province) {
      let vm = this
      if (!this.$helpers.isEmpty(province)) {
        vm.inProgress = true
        this.$axios
          .$post('district/get', {
            province_id: province.id,
          })
          .then(({data}) => {
            vm.inProgress = false
            vm.districts = data
            vm.communes = []
            vm.villages = []
          })
          .catch((error) => {
            vm.inProgress = false
          })
      }
    },
    /** Get Countries */
    getCommunes(district) {
      let vm = this
      if (!this.$helpers.isEmpty(district)) {
        vm.inProgress = true
        this.$axios
          .$post('commune/get', {district_id: district.id})
          .then(({data}) => {
            vm.inProgress = false
            vm.communes = data
            vm.villages = []
          })
          .catch((error) => {
            vm.inProgress = false
          })
      }
    },
    /** Get Countries */
    getVillages(commune) {
      let vm = this
      if (!this.$helpers.isEmpty(commune)) {
        vm.inProgress = true
        this.$axios
          .$post('village/get', {commune_id: commune.id})
          .then(({data}) => {
            vm.inProgress = false
            vm.villages = data
          })
          .catch((error) => {
            vm.inProgress = false
          })
      }
    },
    /**
     * Get address name by language
     * @param {*} name
     * @param {*} addressName
     * @param {*} optionalAddressName
     * @param {*} addressLanguage
     */
    getLanguageAddressName(
      name,
      addressName,
      optionalAddressName,
      addressLanguage = 1
    ) {
      if (addressLanguage == '2') {
        return name[addressName]
      } else {
        let localName = name.optional_name
        if (this.$helpers.nullToVoid(localName) != '') {
          let obj = JSON.parse(localName)
          return obj[optionalAddressName]
        }
      }
      return null
    },
    getLocation(data, type = 1) {
      let street =
        type == 1
          ? this.$helpers.nullToVoid(data.street_local)
          : this.$helpers.nullToVoid(data.street_latin)
      let house_no = this.$helpers.nullToVoid(data.house_no)
      let village = this.$helpers.isEmpty(data.village)
        ? ''
        : this.getLanguageAddressName(
          data.village,
          'village_name',
          'village_local_name',
          type
        )
      let commune = this.$helpers.isEmpty(data.commune)
        ? ''
        : this.getLanguageAddressName(
          data.commune,
          'commune_name',
          'commune_local_name',
          type
        )
      let district = this.$helpers.isEmpty(data.district)
        ? ''
        : this.getLanguageAddressName(
          data.district,
          'district_name',
          'district_local_name',
          type
        )
      let province = this.$helpers.isEmpty(data.province)
        ? ''
        : this.getLanguageAddressName(
          data.province,
          'province_name',
          'province_local_name',
          type
        )
      let country = this.$helpers.isEmpty(data.country)
        ? ''
        : this.getLanguageAddressName(
          data.country,
          'country_name',
          'country_local_name',
          type
        )

      let localtion = `${house_no}, ${street}, ${village}, ${commune}, ${district}, ${province}`
      return localtion
    },
    /** Set Address */
    setData() {
      let vm = this
      if (this.$helpers.nullToVoid(this.formItem.country_id) != '') {
        this.form.country = this.countries.find(
          (obj) => obj.id == this.formItem.country_id
        )
      }
      let input = {
        country_id: this.formItem.country_id,
        province_id: this.formItem.province_id,
        district_id: this.formItem.district_id,
        commune_id: this.formItem.commune_id,
        village_id: this.formItem.village_id,
      }
      this.inProgress = true
      this.$axios
        .$post('address/get', input)
        .then(({data}) => {
          vm.inProgress = false
          vm.provinces = data.provinces
          vm.districts = data.districts
          vm.communes = data.communes
          vm.villages = data.villages

          vm.form.province = vm.provinces.find(
            (obj) => obj.id == vm.formItem.province_id
          )
          vm.form.district = vm.districts.find(
            (obj) => obj.id == vm.formItem.district_id
          )
          vm.form.commune = vm.communes.find(
            (obj) => obj.id == vm.formItem.commune_id
          )
          vm.form.village = vm.villages.find(
            (obj) => obj.id == vm.formItem.village_id
          )
          vm.inProgress = false
        })
        .catch((error) => {
          vm.inProgress = false
        })
      if (this.$helpers.nullToVoid(this.formItem.house_no) != '') {
        this.form.house_no = this.formItem.house_no
      }
      if (this.$helpers.nullToVoid(this.formItem.street) != '') {
        this.form.street = this.formItem.street
        this.form.street_local = this.$helpers.getNameByLocal(
          this.form.street
        )
        this.form.street_latin = this.$helpers.getNameByLocal(
          this.form.street,
          'latin_name'
        )
      } else if (
        this.$helpers.nullToVoid(this.formItem.street_local) != '' ||
        this.$helpers.nullToVoid(this.formItem.street_latin) != ''
      ) {
        this.form.street_local = this.formItem.street_local
        this.form.street_latin = this.formItem.street_latin
      }
    },
    clearForm() {
      this.$emit('get', this.item)
      this.form = {
        country: '',
        province: '',
        district: '',
        commune: '',
        village: '',
        street: '',
        street_latin: '',
        street_local: '',
        house_no: '',
        location: '',
      }
      this.provinces = []
      this.districts = []
      this.communes = []
      this.villages = []
    },
  },
}
</script>
