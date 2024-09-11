<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    :size="bannerType == enums.banner_type.DETAIL ? 'xl' : 'lg'"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    :title="modalHeader"
  >
    <!-- Start modal-cropper-image Component -->
    <div v-if="modalShowCropperImage">
      <modal-cropper-image
        :modal-show="modalShowCropperImage"
        :target-file="targetFile"
        :aspect-ratio="aspectRatio"
        :preview-width="cropWidth"
        :preview-height="cropHeight"
        :cropBoxResizable="false"
        @closeModal="closeModalCropperImage"
        @save="saveModalCropperImage"
      />
    </div>
    <!-- End modal-cropper-image Component -->

    <b-row>
      <!-- Form Block -->
      <b-col cols="12" sm="12" md="7" xl="8">
        <b-row>
          <!-- status -->
          <b-col
            cols="12"
            :lg="bannerType == enums.banner_type.DETAIL ? 6 : 12"
            :xl="bannerType == enums.banner_type.DETAIL ? 6 : 12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('status')"
              :state="!veeErrors.has('status')"
              :label="$t('status')"
              label-for="status"
              label-class="control-label"
              class="required"
            >
              <b-form-select
                v-model="form.status"
                v-validate="'required'"
                :state="veeErrors.has('status') ? false : null"
                data-vv-name="status"
                :data-vv-as="$t('status')"
                type="text"
                :placeholder="$t('status')"
                @keydown.enter="save"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('status') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.banner_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.banner_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- platform_type -->
          <!--          <b-col-->
          <!--            cols="12"-->
          <!--            :lg="bannerType == enums.banner_type.DETAIL ? 6 : 12"-->
          <!--            :xl="bannerType == enums.banner_type.DETAIL ? 6 : 12"-->
          <!--          >-->
          <!--            <b-form-group-->
          <!--              :invalid-feedback="veeErrors.first('platform_type')"-->
          <!--              :state="!veeErrors.has('platform_type')"-->
          <!--              :label="$t('platform_type')"-->
          <!--              label-for="platform_type"-->
          <!--              label-class="control-label"-->
          <!--              class="required"-->
          <!--            >-->
          <!--              <b-form-select-->
          <!--                v-model="form.platform_type"-->
          <!--                v-validate="'required'"-->
          <!--                :state="veeErrors.has('platform_type') ? false : null"-->
          <!--                data-vv-name="platform_type"-->
          <!--                :data-vv-as="$t('platform_type')"-->
          <!--                type="text"-->
          <!--                :placeholder="$t('platform_type')"-->
          <!--                @change="onChangePlatformType"-->
          <!--                :disabled="disabledPlatformType"-->
          <!--              >-->
          <!--                <template slot="first">-->
          <!--                  <b-form-select-option :value="null" disabled-->
          <!--                    >{{ $t('please_select') }}-->
          <!--                  </b-form-select-option>-->
          <!--                </template>-->

          <!--                <b-form-select-option :value="enums.banner_platform_type.WEB"-->
          <!--                  >{{ $t('web') }}-->
          <!--                </b-form-select-option>-->
          <!--                <b-form-select-option :value="enums.banner_platform_type.MOBILE"-->
          <!--                  >{{ $t('mobile') }}-->
          <!--                </b-form-select-option>-->
          <!--              </b-form-select>-->
          <!--            </b-form-group>-->
          <!--          </b-col>-->

          <!-- image_type -->
          <b-col
            cols="12"
            :lg="bannerType == enums.banner_type.DETAIL ? 6 : 12"
            :xl="bannerType == enums.banner_type.DETAIL ? 6 : 12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('image_type')"
              :state="!veeErrors.has('image_type')"
              :label="$t('image_type')"
              label-for="image_type"
              label-class="control-label"
              class="required"
            >
              <b-form-select
                v-model="form.image_type"
                v-validate="'required'"
                :state="veeErrors.has('image_type') ? false : null"
                data-vv-name="image_type"
                :data-vv-as="$t('image_type')"
                type="text"
                :placeholder="$t('image_type')"
                @change="onChangeImageType"
                :disabled="disabledImageType"
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('please_select') }}
                  </b-form-select-option>
                </template>

                <b-form-select-option :value="enums.banner_image_type.SQUARE"
                >{{ $t('square') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.banner_image_type.RECTANGLE"
                >{{ $t('rectangle') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- name -->
          <b-col
            cols="12"
            :lg="bannerType == enums.banner_type.DETAIL ? 6 : 12"
            :xl="bannerType == enums.banner_type.DETAIL ? 6 : 12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('name')"
              :state="!veeErrors.has('name')"
              :label="$t('name')"
              label-for="name"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.name"
                v-validate="'required'"
                :state="veeErrors.has('name') ? false : null"
                data-vv-name="name"
                :data-vv-as="$t('name')"
                type="text"
                required
                :placeholder="$t('name')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- type -->
          <b-col
            cols="12"
            :lg="bannerType == enums.banner_type.DETAIL ? 6 : 12"
            :xl="bannerType == enums.banner_type.DETAIL ? 6 : 12"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('banner_type')"
              :state="!veeErrors.has('banner_type')"
              :label="$t('banner_type')"
              label-for="banner_type"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="bannerTypeSelect"
                v-validate="'required'"
                data-vv-name="banner_type"
                :data-vv-as="$t('banner_type')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="bannerTypeList"
                :placeholder="$t('banner_type')"
                @input="onChangeType"
                @reset="resetBannerType"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- link -->
          <b-col cols="12" v-if="bannerType == enums.banner_type.LINK">
            <b-form-group
              :invalid-feedback="veeErrors.first('link')"
              :state="!veeErrors.has('link')"
            >
              <label class="control-label" for="link">
                <span>{{ $t('link') }}</span>
                <span style="color: red"> *</span>
                <span class="text-muted">http://www.example.com</span>
              </label>

              <b-form-input
                autocomplete="off"
                autofocus
                v-model="form.description"
                v-validate="'required|url_http_or_https'"
                :state="veeErrors.has('link') ? false : null"
                data-vv-name="link"
                :data-vv-as="$t('link')"
                type="text"
                :placeholder="$t('link')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>

          <!-- property_detail -->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.PROPERTY_DETAIL"
          >
            <b-form-group
              :invalid-feedback="
                                veeErrors.first('property_detail')
                            "
              :state="!veeErrors.has('property_detail')"
              :label="$t('property_detail')"
              label-for="property_detail"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="form.description"
                v-validate="'required'"
                data-vv-name="property_detail"
                :data-vv-as="$t('property_detail')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="propertyList"
                :placeholder="$t('property_detail')"
                @reset="resetPropertyDetailSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- property_type -->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.PROPERTY_TYPE"
          >
            <b-form-group
              :invalid-feedback="
                                veeErrors.first('property_type')
                            "
              :state="!veeErrors.has('property_type')"
              :label="$t('property_type')"
              label-for="property_type"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="form.description"
                v-validate="'required'"
                data-vv-name="property_type"
                :data-vv-as="$t('property_type')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="propertyTypeList"
                :placeholder="$t('property_type')"
                @reset="resetPropertyTypeSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- attraction_detail -->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.ATTRACTION_DETAIL"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('attraction_detail')"
              :state="!veeErrors.has('attraction_detail')"
              :label="$t('attraction_detail')"
              label-for="attraction_detail"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="form.description"
                v-validate="'required'"
                data-vv-name="attraction_detail"
                :data-vv-as="$t('attraction_detail')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="attractionList"
                :placeholder="$t('attraction_detail')"
                @reset="resetAttractionDetailSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- attraction_destination -->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.ATTRACTION_DESTINATION"
          >
            <b-form-group
              :invalid-feedback="veeErrors.first('attraction_destination')"
              :state="!veeErrors.has('attraction_destination')"
              :label="$t('attraction_destination')"
              label-for="attraction_destination"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="form.description"
                v-validate="'required'"
                data-vv-name="attraction_destination"
                :data-vv-as="$t('attraction_destination')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="provinceList"
                :placeholder="$t('attraction_destination')"
                @reset="resetAttractionDestinationSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- description -->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.DETAIL"
          >
            <label
            >{{ $t('description') }} <span style="color: red"> *</span></label
            >
            <quill-editor
              v-model="form.description"
              :options="editorOptionDescription"
              ref="quillDescription"
            ></quill-editor>
            <input
              ref="imageDescription"
              type="file"
              @change="uploadImageDescription"
              id="imageDescription"
              hidden
            />
          </b-col>

          <!-- shop select by enums shop-->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.SHOP"
          >
            <b-form-group
              :invalid-feedback="
              veeErrors.first('shop')
              "
              :state="!veeErrors.has('shop')"
              :label="$t('shop')"
              label-for="shop"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="form.description"
                v-validate="'required'"
                data-vv-name="shop"
                :data-vv-as="$t('shop')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="shopList"
                :placeholder="$t('shop')"
                @reset="resetShopSelectData"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- shop select by enums Category in Shop-->
          <b-col
            cols="12"
            v-if="bannerType == enums.banner_type.CATEGORY_IN_SHOP"
          >
            <b-form-group
              :state="!veeErrors.has('shop')"
              :label="$t('shop')"
              label-for="shop"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="shopSelectData"
                v-validate="'required'"
                data-vv-name="shop"
                :data-vv-as="$t('shop')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="shopList"
                :placeholder="$t('shop')"
                @input="onChangeShopData"
                @reset="resetShopSelectData"
              ></b-multi-select>
            </b-form-group>
          </b-col>

          <!-- Category In Shop -->
          <b-col
            cols="12"
            v-if="has_category_in_shop && bannerType == enums.banner_type.CATEGORY_IN_SHOP"
          >
            <b-form-group
                :invalid-feedback="
                veeErrors.first('category')
                "
                :state="!veeErrors.has('category')"
                :label="$t('category')"
                label-for="category"
                label-class="control-label"
                class="required"
              >
                <b-multi-select
                  v-model="selectCategoryData"
                  v-validate="'required'"
                  data-vv-name="category"
                  :data-vv-as="$t('category')"
                  :multiple="false"
                  label="name"
                  track-by="name"
                  :options="categoryInShopList"
                  :placeholder="$t('category')"
                  @input="onChangeSubCategoryData"
                  @reset="resetSelectCategoryData"
                ></b-multi-select>
              </b-form-group>
          </b-col>

          <!-- Sub Category -->
          <b-col
            cols="12"
            class="mb-3"
            v-if="has_sub_category && bannerType == enums.banner_type.CATEGORY_IN_SHOP"
          >
            <b-form-group
                :invalid-feedback="
                veeErrors.first('sub_category')
                "
                :state="!veeErrors.has('sub_category')"
                :label="$t('sub_category')"
                label-for="sub_category"
                label-class="control-label"
                class="required"
              >
                <b-multi-select
                  v-model="subCategorySelectData"
                  v-validate="'required'"
                  data-vv-name="sub_category"
                  :data-vv-as="$t('sub_category')"
                  :multiple="false"
                  label="name"
                  track-by="name"
                  :options="subCategoryList"
                  :placeholder="$t('sub_category')"
                  @reset="resetSubCategorySelectData"
                ></b-multi-select>
              </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <!-- Image Block -->
      <b-col cols="12" sm="12" md="5" xl="4" class="text-center">
        <div v-if="$helpers.nullToVoid(form.image) == ''" class="text-center">
          <i
            id="image"
            class="simple-icon-picture"
            style="font-size: 135px; color: rgba(0, 0, 0, 0.54)"
          ></i>
        </div>
        <div v-else class="text-center" style="margin-bottom: 20px">
          <b-img
            :src="imagePath + form.image"
            alt="image"
            width="155"
            height="155"
            style="margin-top: 20px"
          />
        </div>

        <div class="text-center">
          <template v-if="$helpers.nullToVoid(form.image_type) != ''">
            <div class="mb-2">
              <template
                v-if="form.image_type == enums.banner_image_type.SQUARE"
              >
                {{ $t('square') }}
              </template>
              <template
                v-if="form.image_type == enums.banner_image_type.RECTANGLE"
              >
                {{ $t('rectangle') }}
              </template>
            </div>

            <div class="mb-2">
              <b>{{ $t('image_size') }}: </b>
              <template
                v-if="form.image_type == enums.banner_image_type.SQUARE"
              >
                <span>250px&nbsp; X &nbsp;250px</span>
                <div class="mt-1">{{ $t('less_than') }} 15MB</div>
              </template>
              <template
                v-if="form.image_type == enums.banner_image_type.RECTANGLE"
              >
                <span>1200px&nbsp; X &nbsp;700px</span>
                <div class="mt-1">{{ $t('less_than') }} 15MB</div>
              </template>
            </div>
          </template>
          <b-button variant="outline-primary" @click="chooseImage" class="ml-2"
          >{{ $t('choose_image') }}
          </b-button>
          <input
            ref="fileInput"
            style="display: none"
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            :multiple="false"
            @change="onFileChange"
          />
        </div>
      </b-col>
    </b-row>

    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="clearForm"
      >{{ $t('cancel') }}
      </b-button>
      <b-button size="xs" variant="primary" @click="save"
      >{{ modalOk }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import swal from 'sweetalert2'

export default {
  components: {
    ModalCropperImage: () => import('~/components/ModalCropperImage'),
  },
  props: {
    formFilter: {
      type: Object,
      default: () => {
        return {}
      },
    },
    formItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
    platformType: {
      type: Number,
      default: 0,
    },
    imageType: {
      type: Number,
      default: 0,
    },
    propertyList: {
      type: Array,
      default: () => {
        return []
      },
    },
    propertyTypeList: {
      type: Array,
      default: () => {
        return []
      },
    },
    attractionList: {
      type: Array,
      default: () => {
        return []
      },
    },
    provinceList: {
      type: Array,
      default: () => {
        return []
      },
    },
    shopList: {
      type: Array,
      default: () => {
        return []
      },
    },
    categoryInShopAll: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      has_sub_category: false,
      has_category_in_shop: false,
      form: {
        id: null,
        name: null,
        type: null,
        description: null,
        status: 1,
        platform_type: null,
        image_type: null,
        image: null,
        old_image: null,
      },
      defaultForm: {
        id: null,
        name: null,
        type: null,
        description: null,
        status: 1,
        platform_type: null,
        image_type: null,
        image: null,
        old_image: null,
      },
      bannerType: 0,
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      mediaPath: null,
      listItems: {},
      editorOptionDescription: {
        theme: 'snow',
        placeholder: '',
        modules: {
          toolbar: {
            container: [
              'bold',
              'underline',
              'italic',
              'strike',
              'blockquote',
              'image',
              {list: 'ordered'},
              {list: 'bullet'},
              {script: 'sub'},
              {script: 'super'},
              {indent: '-1'},
              {indent: '+1'},
              {direction: 'rtl'},
              {header: [1, 2, 3, 4, 5, 6, false]},
              {color: []},
              {background: []},
              {font: []},
              {align: []},
              'clean',
              'link',
              'video',
            ],
            handlers: {
              image: function () {
                document.getElementById('imageDescription').click()
              },
            },
          },
          // imageResize: {
          //   modules: ['Resize', 'DisplaySize'],
          // },
        },
      },
      targetFile: null,
      aspectRatio: null,
      cropWidth: null,
      cropHeight: null,
      modalShowCropperImage: false,
      modalTypeCropperImage: 0,
      oldPlatformType: null,
      oldImageType: null,
      disabledPlatformType: false,
      disabledImageType: false,
      shopSelectData: null,
      categoryInShop: [],
      selectCategoryData: null,
      subCategory: [],
      subCategorySelectData: null,
      bannerTypeList: [],
      bannerTypeSelect: null
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1 || this.modalType == 3
        ? `${this.$t('add')} ${this.$t('banner')}`
        : `${this.$t('update')} ${this.$t('banner')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
    categoryInShopList(){
      return this.categoryInShop.map(obj => {
        return obj
      })
    },
    subCategoryList(){
      return this.subCategory.map(obj => {
        return obj
      })
    }
  },
  watch: {
    modalType: {
      handler(val) {
        this.imagePath = this.apiUrl + 'images/banner/'
        this.mediaPath = this.apiUrl + 'images/media/'

        this.form.platform_type = 2 //Mobile

        this.oldPlatformType = this.form.platform_type
        this.oldImageType = this.form.image_type

        this.disabledPlatformType = false
        this.disabledImageType = false
        this.bannerTypeList = JSON.parse(JSON.stringify(this.enums.banner_type_list))

        if (val == 1) {
          this.modal = true
        } else if (val == 2) {
          this.setData()
          this.modal = true
        } else if (val == 3) {
          //Open Modal from another module
          this.form.platform_type = JSON.parse(JSON.stringify(this.platformType))
          this.form.image_type = JSON.parse(JSON.stringify(this.imageType))

          this.oldPlatformType = this.form.platform_type
          this.oldImageType = this.form.image_type

          this.disabledPlatformType = true
          this.disabledImageType = true
          this.modal = true
        }
      },
      immediate: true,
    },
    'form.platform_type': {
      handler(newVal, oldVal) {
        this.oldPlatformType = oldVal
      },
    },
    'form.image_type': {
      handler(newVal, oldVal) {
        this.oldImageType = oldVal
      },
    },
    selectCategoryData:{
      handler(val){
       if(this.$helpers.isEmpty(val)){
        this.has_sub_category = false
       }
      },
      immediate: true
    },
    shopSelectData: {
      handler(val) {
        if(!this.$helpers.isEmpty(val)) {
          this.has_category_in_shop = true
        }else {
          this.has_category_in_shop = false
        }
      },
      immediate: true
    },
    bannerTypeList: {
      handler(val) {
        if (!this.$helpers.isEmpty(val)) {
          val.map((obj) => {
            obj.name = this.$t(obj.name)
            return obj
          })
        }
      },
      immediate: true,
    },
  },
  methods: {
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'banner/store'
          if (this.modalType == 2) {
            url = 'banner/update'
          }
          if(vm.$helpers.nullToVoid(vm.bannerTypeSelect) != ''){
            vm.form.type = vm.bannerTypeSelect.id
          }

          let input = JSON.parse(JSON.stringify(vm.form))
          input.page = vm.formFilter.page
          input.table_size = vm.formFilter.table_size
          input.filter = vm.formFilter.filter

          if (
            vm.form.type == vm.enums.banner_type.DETAIL &&
            vm.$helpers.nullToVoid(input.description) == ''
          ) {
            swal.fire({
              icon: 'warning',
              title: vm.$t('banner'),
              text:
                vm.$i18n.locale == 'en'
                  ? 'Please input description.'
                  : vm.$i18n.locale == 'kh'
                    ? 'សូមបញ្ចូលការពិពណ៌នា'
                    : '',
            })
            return
          }

          if (vm.$helpers.nullToVoid(input.image) == '') {
            swal.fire({
              icon: 'warning',
              title: vm.$t('banner'),
              text:
                vm.$i18n.locale == 'en'
                  ? 'Please upload image.'
                  : vm.$i18n.locale == 'kh'
                    ? 'សូមបង្ហោះរូបភាព'
                    : '',
            })
            return
          }

          if (
            vm.form.type == vm.enums.banner_type.PROPERTY_DETAIL ||
            vm.form.type == vm.enums.banner_type.PROPERTY_TYPE ||
            vm.form.type == vm.enums.banner_type.ATTRACTION_DETAIL ||
            vm.form.type == vm.enums.banner_type.ATTRACTION_DESTINATION ||
            vm.form.type == vm.enums.banner_type.SHOP ||
            vm.form.type == vm.enums.banner_type.CATEGORY_IN_SHOP
          ) {
            if(vm.$helpers.nullToVoid(vm.subCategorySelectData) != ''){
              input.description = vm.subCategorySelectData.id
            }
            else if(vm.$helpers.nullToVoid(vm.selectCategoryData) != ''){
              input.description = vm.selectCategoryData.id
            }
            else {
              input.description = vm.form.description.id
            }
          }

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data

            vm.clearForm()

            vm.$notify('success', vm.$t('banner'), vm.$t('done'))
          })
        } else {
          this.$notify(
            'warning',
            this.$t('banner'),
            this.$t('validation_failed')
          )
        }
      })
    },
    clearForm() {
      this.modal = false
      this.form = Object.assign({}, this.defaultForm)
      this.shopSelectData = null
      this.selectCategoryData = null
      this.subCategorySelectData = null
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.$emit('closeModal', this.listItems)

      this.listItems = {}
      this.bannerType = 0
      this.bannerTypeSelect = null
      this.disabledPlatformType = false
      this.disabledImageType = false
    },
    setData() {
      this.form = Object.assign({}, this.formItem)
      this.form.old_image = this.form.image
      this.bannerType = this.formItem.type

      let bannerTypeData = this.bannerTypeList.find(obj => obj.id == this.formItem.type)
      if(this.$helpers.nullToVoid(bannerTypeData) != ''){
        this.bannerTypeSelect = bannerTypeData
      }

      this.oldPlatformType = this.form.platform_type
      this.oldImageType = this.form.image_type

      if(this.formItem.status == "true"){
        this.form.status = this.enums.banner_status.ENABLE;
      }else {
        this.form.status = this.enums.banner_status.DISABLE;
      }

      if (this.formItem.type == this.enums.banner_type.PROPERTY_DETAIL) {
        let property = this.propertyList.find((obj) => obj.id == this.form.description)
        this.form.description = property
      } else if (this.formItem.type == this.enums.banner_type.PROPERTY_TYPE) {
        let proeprtyType = this.propertyTypeList.find((obj) => obj.id == this.form.description)
        this.form.description = proeprtyType
      }else if (this.formItem.type == this.enums.banner_type.ATTRACTION_DETAIL) {
        let attraction = this.attractionList.find((obj) => obj.id == this.form.description)
        this.form.description = attraction
      }else if (this.formItem.type == this.enums.banner_type.ATTRACTION_DESTINATION) {
        let province = this.provinceList.find((obj) => obj.id == this.form.description)
        this.form.description = province
      }else if (this.formItem.type == this.enums.banner_type.SHOP) {
        let shop = this.shopList.find((obj) => obj.id == this.form.description)
        this.form.description = shop
      }
      else if (this.formItem.type == this.enums.banner_type.CATEGORY_IN_SHOP) {
        let categoryData = this.categoryInShopAll.find((obj) => obj.id == this.form.description)
        this.has_category_in_shop = false
        this.has_sub_category = false

        if(this.$helpers.nullToVoid(categoryData) != ''){
          // Shop Has Category
          if(this.$helpers.nullToVoid(categoryData.business_id) != ''){
            let shop = this.shopList.find(obj => obj.id == categoryData.business_id)
            if(this.$helpers.nullToVoid(shop) != ''){
              this.shopSelectData = shop
              this.getCategoryInShop(categoryData.business_id)
              this.has_category_in_shop = true
              //Has Sub
              if(this.$helpers.nullToVoid(categoryData.parent_id) != ''){
                let mainCategory = this.categoryInShopAll.find(obj => obj.id == categoryData.parent_id)
                if(this.$helpers.nullToVoid(mainCategory) != ''){
                  this.selectCategoryData = mainCategory
                  this.form.description = mainCategory
                }
                this.getSubCategory(categoryData.parent_id)
                this.subCategorySelectData = categoryData
                this.has_sub_category = true

              }else {
                //No Sub
                this.selectCategoryData = categoryData
                this.form.description = categoryData
              }
            }
          }
        }
      }
    },
    onChangeType() {
      this.form.description = null
      this.bannerType = 0

      if(this.$helpers.nullToVoid(this.bannerTypeSelect) != ''){
        this.bannerType = this.bannerTypeSelect.id
      }
    },
    onChangePlatformType() {
      //Ask when already selected
      this.clearImageOnChange('platform_type')

      //Clear Image when platform type null
      if (this.$helpers.nullToVoid(this.form.platform_type) == '') {
        this.form.image_type = null
        this.form.image = null
      }
    },
    onChangeImageType() {
      let vm = this

      //Check Select Platform
      if (this.$helpers.nullToVoid(this.form.platform_type) == '') {
        vm.form.image_type = this.oldImageType

        swal.fire({
          icon: 'warning',
          title: vm.$t('banner'),
          text:
            vm.$i18n.locale == 'en'
              ? 'Please select platform type.'
              : vm.$i18n.locale == 'kh'
                ? 'សូមជ្រើសរើសប្រភេទ Platform'
                : '',
        })

        this.$nextTick().then(() => {
          this.veeErrors.clear()
        })

        return
      }

      //Ask when already selected
      this.clearImageOnChange('image_type')

      //Clear Image when image type null
      if (this.$helpers.nullToVoid(this.form.image_type) == '') {
        this.form.image = null
      }
    },
    clearImageOnChange(onChangeType) {
      if (
        this.$helpers.nullToVoid(this.form.platform_type) != '' &&
        this.$helpers.nullToVoid(this.form.image_type) != '' &&
        this.$helpers.nullToVoid(this.form.image) != ''
      ) {
        swal
          .fire({
            title: this.$t('are_you_sure'),
            text:
              this.$i18n.locale == 'en'
                ? 'It will delete the image above.'
                : this.$i18n.locale == 'kh'
                  ? 'វានឹងលុបរូបភាពខាងលើចោល។'
                  : '',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !swal.isLoading(),
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.form.image = null
            } else if (result.isDismissed) {
              if (onChangeType == 'platform_type') {
                this.form.platform_type = this.oldPlatformType
              } else if(onChangeType == 'image_type'){
                this.form.image_type = this.oldImageType
              }
            }

            swal.close()
          })
      }
    },
    resetPropertyDetailSelect() {
      this.form.description = null
    },
    resetPropertyTypeSelect() {
      this.form.description = null
    },
    resetAttractionDetailSelect() {
      this.form.description = null
    },
    resetAttractionDestinationSelect() {
      this.form.description = null
    },
    resetShopSelectData() {
      this.shopSelectData= null
    },
    resetSelectCategoryData() {
      this.selectCategoryData = null
    },
    resetSubCategorySelectData() {
      this.subCategorySelectData = null
    },
    resetBannerType() {
      this.bannerTypeSelect = null
      this.form.description = null
      this.bannerType = 0
    },

    //Image
    uploadImageDescription($event) {
      let vm = this
      const files = $event.target.files || $event.dataTransfer.files

      if (files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
          let input = {
            image: e.target.result,
          }

          //upload image to server
          vm.$axios
            .$post('banner/upload_media', input)
            .then((response) => {
              let imageResponse = response.data

              //this code to set your position cursor
              const range = vm.$refs.quillDescription.quill.getSelection()
              //this code to set image on your server to quill editor
              vm.$refs.quillDescription.quill.insertEmbed(
                range.index,
                'image',
                `${vm.mediaPath}${imageResponse}`
              )

              //Clear file and can upload the same image again
              vm.$refs.imageDescription.value = ''
            })
            .catch((e) => {
              console.log('error')
            })
        }
        reader.readAsDataURL(files[0])
      }
    },
    chooseImage() {
      if (this.$helpers.nullToVoid(this.form.platform_type) == '') {
        swal.fire({
          icon: 'warning',
          title: this.$t('banner'),
          text:
            this.$i18n.locale == 'en'
              ? 'Please select platform type.'
              : this.$i18n.locale == 'kh'
                ? 'សូមជ្រើសរើសប្រភេទ Platform'
                : '',
        })
        return
      }
      if (this.$helpers.nullToVoid(this.form.image_type) == '') {
        swal.fire({
          icon: 'warning',
          title: this.$t('banner'),
          text:
            this.$i18n.locale == 'en'
              ? 'Please select image type first.'
              : this.$i18n.locale == 'kh'
                ? 'សូមជ្រើសរើសប្រភេទរូបភាពជាមុនសិន។'
                : '',
        })
        return
      }

      this.$refs.fileInput.click()
    },
    onFileChange($event) {
      let vm = this
      const files = $event.target.files || $event.dataTransfer.files

      if (files[0].size > 15000000) {
        vm.$refs.fileInput.value = ''
        vm.$notify(
          'warning',
          vm.$t('image'),
          vm.$i18n.locale == 'en'
            ? 'Image file must be less than 15 MB.'
            : vm.$i18n.locale == 'kh'
              ? 'ទំហំរូបភាពត្រូវតែតិចជាង ១៥ មេកាបៃ'
              : ''
        )
        return
      } else {
        if (vm.form.platform_type == vm.enums.banner_platform_type.MOBILE) {
          if (vm.form.image_type == vm.enums.banner_image_type.SQUARE) {
            vm.aspectRatio = 1 / 1
            vm.cropWidth = 250
            vm.cropHeight = 250
          } else if (
            vm.form.image_type == vm.enums.banner_image_type.RECTANGLE
          ) {
            vm.aspectRatio = 1.71 / 1
            vm.cropWidth = 1200
            vm.cropHeight = 700
          }
        }

        vm.targetFile = $event
        vm.openModalCropperImage()
      }
    },
    //Cropper
    openModalCropperImage() {
      this.modalShowCropperImage = true
    },
    closeModalCropperImage(data) {
      this.modalShowCropperImage = false
      this.$refs.fileInput.value = ''
      this.targetFile = null
      this.aspectRatio = null
      this.cropWidth = null
      this.cropHeight = null
    },
    saveModalCropperImage(base64) {
      this.imagePath = ''
      this.form.image = base64
      this.closeModalCropperImage()
    },
    onChangeShopData(val){
      this.selectCategoryData = null
      if(!this.$helpers.isEmpty(val)) {
        this.getCategoryInShop(val.id)
        this.has_category_in_shop = true
      }
      else {
        this.has_category_in_shop = false
      }
    },
    onChangeSubCategoryData(val){
      this.subCategorySelectData = null
      if(!this.$helpers.isEmpty(val)){
        this.getSubCategory(val.id)
      }
      else {
        this.has_sub_category = null
      }
    },
    getCategoryInShop(id){
      this.$axios.$post('banner/get_category_in_shop', {id: id}).then(res => {
        this.has_category_in_shop = true
        this.categoryInShop = res
      })
    },
    getSubCategory(id){
      this.$axios.$post('banner/get_sub_category',{id: id}).then(res =>{
        if(res.length>0){
          this.has_sub_category = true
          this.subCategory = res
        }else{
          this.has_sub_category = false
        }
      })
    }
  },
}
</script>
<style scoped>
:deep(.ql-editor) {
  min-height: 250px !important;
}
</style>
