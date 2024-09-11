<template>
  <b-modal
    id="modal"
    v-model="modal"
    centered
    size="lg"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    :title="modalHeader"
  >
    <!-- Form Input -->
    <b-row>
      <!-- form Block -->
      <b-col xl="8" lg="8" md="7">
        <!-- attribute group -->
          <b-col
            cols="12" xl="12" lg="12"
          >
            <b-form-group
              :invalid-feedback="
                veeErrors.first('attribute_group')
              "
              :state="!veeErrors.has('attribute_group')"
              :label="$t('attribute_group')"
              label-for="attribute_group"
              label-class="control-label"
              class="required"
            >
              <b-multi-select
                v-model="attributeGroupSelectData"
                v-validate="'required'"
                data-vv-name="attribute_group"
                :data-vv-as="$t('attribute_group')"
                :multiple="false"
                label="name"
                track-by="name"
                :options="attributeGroupList"
                :placeholder="$t('attribute_group')"
                @reset="resetAttributeGroupSelect"
              ></b-multi-select>
            </b-form-group>
          </b-col>

        <!-- name -->
          <b-col xl="12" lg="12">
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
                :placeholder="$t('name')"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        <!-- status -->
          <b-col
            cols="12" lg="12" xl="12"
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
              >
                <template slot="first">
                  <b-form-select-option :value="null" disabled
                  >{{ $t('status') }}
                  </b-form-select-option>
                </template>
                <b-form-select-option :value="enums.attribute_status.ENABLE"
                >{{ $t('enable') }}
                </b-form-select-option>
                <b-form-select-option :value="enums.attribute_status.DISABLE"
                >{{ $t('disable') }}
                </b-form-select-option>
              </b-form-select>
            </b-form-group>
          </b-col>
      </b-col>
      <!-- Image Block -->
      <b-col xl="4" lg="4" md="5">
        <div v-if="$helpers.nullToVoid(form.image) == ''" class="text-center">
          <i
            id="image"
            class="simple-icon-picture"
            style="font-size: 80px; color: rgba(0, 0, 0, 0.54)"
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
    <!-- End Form Input -->

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
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
    attributeGroupList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      form: {
        id: null,
        attribute_group_id: 1,
        name: null,
        status: 1,
        image: null,
        old_image: null
      },
      defaultForm: {
        id: null,
        attribute_group_id: null,
        name: null,
        status: 1,
        image: null,
        old_image: null
      },
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      listItems: {},
      attributeGroupSelectData: null,
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if(val == 1) {
          this.imagePath = null
          this.modal = true
        }else if(val == 2) {
          this.imagePath = this.apiUrl + 'images/accommodation/attribute_image/'
          this.modal = true
          this.setData()
        }
      },
      immediate: true,
    },
    attributeGroupList:{
      handler(val){
        if(this.$helpers.nullToVoid(val) != ''){
          val.find((obj)=>{
            if(obj.id == this.form.attribute_group_id){
              this.attributeGroupSelectData = obj
            }
          })
        }
      },
      immediate:true,
      deep:true,
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('attribute')}`
        : `${this.$t('update')} ${this.$t('attribute')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },

  },
  methods: {
    save(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'attribute/store'
          if (this.modalType == 2) {
            url = 'attribute/update'
          }
          let input = vm.form

          if(vm.$helpers.nullToVoid(vm.attributeGroupSelectData) != '') {
            input.attribute_group_id = vm.attributeGroupSelectData.id
          }

          vm.$axios.$post(url, input).then(({data}) => {
            vm.listItems = data
            vm.clearForm()
            vm.$notify('success', vm.$t('attribute'), vm.$t('done'))
          })
        } else {
          vm.$notify(
            'warning',
            vm.$t('attribute'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    setData(){
      this.form = Object.assign({}, this.formData)
      this.form.old_image = this.form.image

      let attributeGroupData = this.attributeGroupList.find(obj => obj.id == this.formData.attribute_group_id)
      if(this.$helpers.nullToVoid(attributeGroupData) != ''){
        this.attributeGroupSelectData = attributeGroupData
      }

      if(this.formData.status == "true"){
        this.form.status = this.enums.attribute_status.ENABLE;
      }else {
        this.form.status = this.enums.attribute_status.DISABLE;
      }
    },
    chooseImage() {
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
      }else {
        var reader = new FileReader()
        reader.onload = function (e) {
            vm.imagePath = ''
            vm.form.image = ''
            vm.form.image = e.target.result
            vm.$refs.fileInput.value = ''
        }
        reader.readAsDataURL(files[0])
      }
    },
    clearForm() {
      this.modal = false
      this.form = Object.assign({}, this.defaultForm)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.$emit('closeModal', this.listItems)
    },
    resetAttributeGroupSelect() {
      this.attributeGroupSelectData = null
    }
  },
}
</script>
