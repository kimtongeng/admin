<template>
  <b-modal
    v-model="modal"
    scrollable
    centered
    no-close-on-esc
    hide-footer
    hide-header
    size="md"
    @hidden="clearForm"
  >
    <div class="card">
      <img
        class="card-img-top"
        :src="getCoverImage(form.cover_image)"
        alt="cover"
      />
      <div class="card-body little-profile">
        <div class="pro-img text-center">
          <img
            :src="getProfileImage(form.profile_image)"
            alt="profile"
          />
        </div>
        <div class="d-flex justify-content-center">
          <div>
            <h3 class="mb-1 text-center">
              <template
                v-if="$helpers.nullToVoid(form.fullname) != ''"
              >{{ form.fullname }}
              </template
              >
              <template v-else>{{ $t('name') }}</template>
            </h3>
            <p v-if="$helpers.nullToVoid(form.email) != ''">
              <b>{{ $t('email') }}: </b>
              <span>{{ form.email }}</span>
            </p>
            <p v-if="$helpers.nullToVoid(form.google) != ''">
              <b>{{ $t('google') }}: </b>
              <span>{{ form.google }}</span>
            </p>
            <p v-if="$helpers.nullToVoid(form.apple_id) != ''">
              <b>{{ $t('apple_id') }}: </b>
              <span>{{ form.apple_id }}</span>
            </p>
            <p v-if="$helpers.nullToVoid(form.phone) != ''">
              <b>{{ $t('phone') }}: </b>
              <span>{{ form.phone }}</span>
            </p>
            <p>
              <b>{{ $t('gender') }}: </b>
              <span>
                  <template
                    v-if="
                          form.gender == enums.contact_gender.MALE
                      "
                  >{{ $t('male') }}</template
                  >
                  <template
                    v-if="
                          form.gender ==
                          enums.contact_gender.FEMALE
                      "
                  >{{ $t('female') }}</template
                  >
                  <template
                    v-if="
                          form.gender ==
                          enums.contact_gender.OTHER
                      "
                  >{{ $t('other') }}</template
                  >
              </span>
            </p>
            <p>
              <b>{{ $t('type') }}: </b>
              <span>{{ $t('customer') }}</span>
              <span
                v-if="form.is_property_owner == enums.is_true.YES || form.is_property_owner == enums.is_true.SUSPEND">
                 | {{ $t('property_owner') }}
              <template v-if="form.is_property_owner == enums.is_true.SUSPEND">
                (<span class="text-danger">{{ $t('suspend') }}</span>)</template>
            </span>
              <span v-if="form.is_agency == enums.is_true.YES">
                 | {{ $t('agency') }}
            </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'
import moment from 'moment'

export default {
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      form: {
        id: null,
        name: null,
        email: null,
        phone: null,
        gender: null,
        profile_image: null,
        cover_image: null,
        register_type: null,
        status: null,
      },
      defaultForm: {
        id: null,
        name: null,
        email: null,
        phone: null,
        gender: null,
        profile_image: null,
        cover_image: null,
        register_type: null,
        status: null,
      },
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
    }
  },
  computed: {
    ...mapGetters({
      inProgress: 'loading/getInProgress',
    }),
    modalHeader() {
      return this.$t('contact_detail')
    },
  },
  created() {
    this.modal = true

    this.imagePath = this.apiUrl + 'images/contact/'

    this.setData()
  },

  methods: {
    /**
     * Set data
     */
    setData() {
      this.form = Object.assign({}, this.formItem)
    },
    /**
     * Clear Form
     */
    clearForm() {
      this.modal = false

      this.form = Object.assign({}, this.defaultForm)

      this.imagePath = null

      this.$emit('closeModal', this.modal)
    },
    getProfileImage(image) {
      if (this.$helpers.nullToVoid(image) != '') {
        return this.apiUrl + 'images/contact/' + image
      } else {
        return '/no-profile.png'
      }
    },
    getCoverImage(image) {
      if (this.$helpers.nullToVoid(image) != '') {
        return this.apiUrl + 'images/contact/' + image
      } else {
        return '/no-cover.png'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
:deep(.modal-body),
:deep(.modal-footer) {
  padding: 0px !important;
}

.card-img-top {
  height: 240px;
}

.card-no-border .card {
  border-color: #d7dfe3;
  border-radius: 4px;
  margin-bottom: 30px;
  // -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  // box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  box-shadow: none;
}

.card-body {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}

.pro-img {
  margin-top: -80px;
  margin-bottom: 20px;
}

.little-profile .pro-img img {
  width: 128px;
  height: 128px;
  // -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  // box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 100%;
  box-shadow: none;
}

.m-b-0 {
  margin-bottom: 0px;
}

h3 {
  line-height: 30px;
  font-size: 21px;
}

.btn-rounded.btn-md {
  padding: 12px 35px;
  font-size: 16px;
}

.m-t-10 {
  margin-top: 10px;
}

.btn-primary,
.btn-primary.disabled {
  background: #7460ee;
  border: 1px solid #7460ee;
  -webkit-box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
  0 3px 1px -2px rgba(116, 96, 238, 0.2),
  0 1px 5px 0 rgba(116, 96, 238, 0.12);
  box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14),
  0 3px 1px -2px rgba(116, 96, 238, 0.2),
  0 1px 5px 0 rgba(116, 96, 238, 0.12);
  -webkit-transition: 0.2s ease-in;
  -o-transition: 0.2s ease-in;
  transition: 0.2s ease-in;
}

.btn-rounded {
  border-radius: 60px;
  padding: 7px 18px;
}

.m-t-20 {
  margin-top: 20px;
}

.text-center {
  text-align: center !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #455a64;
  font-family: 'Kantumruy', sans-serif !important;
  font-weight: 400;
}

p {
  font-family: 'Kantumruy', sans-serif !important;
  margin-top: 0;
  margin-bottom: 1px;
}
</style>
