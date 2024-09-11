<template>
  <b-modal
    id="modal"
    ref="userModal"
    v-model="modal"
    scrollable
    centered
    no-close-on-backdrop
    no-close-on-esc
    :title="modalHeader"
    :form-item="formItem"
    :modal-type="modalType"
    hide-header-close
    @hidden="clearForm"
    size="lg"
  >
    <!-- Start modal-cropper-image Component -->
    <div v-if="modalShowCropperImage">
      <modal-cropper-image
        :modal-show="modalShowCropperImage"
        :target-file="targetFile"
        :aspect-ratio="aspectRatio"
        :cropBoxResizable="false"
        :preview-width="350"
        :preview-height="350"
        @closeModal="closeModalCropperImage"
        @save="saveModalCropperImage"
      />
    </div>
    <!-- End modal-cropper-image Component -->

    <b-form>
      <b-row>
        <!--image-->
        <b-col lg="4" cols="12" class="text-center mb-3">
          <div v-if="$helpers.nullToVoid(form.image) == ''">
            <i
              id="image"
              class="simple-icon-picture"
              style="font-size: 80px; color: rgba(0, 0, 0, 0.54)"
            ></i>

            <b-tooltip target="image" :title="$t('image')"/>
          </div>
          <div v-else style="margin-bottom: 20px">
            <b-img
              :src="imagePath + form.image"
              width="155"
              height="155"
              rounded
              style="margin-top: 20px"
            />
          </div>
          <div class="mb-2">
            <b>{{ $t('image_size') }}: </b>
            <span>350px&nbsp; X &nbsp;350px</span>
            <div> {{ $t('less_than') }} 15MB</div>
          </div>
          <b-button variant="outline-primary" @click="chooseImage">{{
              $t('choose_file')
            }}
          </b-button>
          <input
            ref="fileInput"
            style="display: none"
            type="file"
            accept=".png, .jpg"
            :multiple="false"
            @change="onFileChange"
          />
        </b-col>

        <b-col lg="8" cols="12">
          <b-row>
            <b-col cols="12" md="6" xl="6">
              <!--full_name-->
              <b-form-group
                :invalid-feedback="veeErrors.first('full_name')"
                :state="!veeErrors.has('full_name')"
                :label="$t('full_name')"
                label-for="full_name"
                class="required"
                label-class="control-label"
              >
                <b-form-input
                  autocomplete="off"
                  id="full_name"
                  v-model="form.full_name"
                  v-validate="'required|max:50'"
                  :state="
                                        veeErrors.has('full_name')
                                            ? false
                                            : null
                                    "
                  data-vv-name="full_name"
                  type="text"
                  required
                  :readonly="inProgress"
                  :placeholder="$t('full_name')"
                  @keydown.enter="save"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6" xl="6">
              <!--email-->
              <b-form-group
                :invalid-feedback="veeErrors.first('email')"
                :state="!veeErrors.has('email')"
                :label="$t('email')"
                label-for="email"
                label-class="control-label"
              >
                <b-form-input
                  autocomplete="off"
                  v-model="form.email"
                  v-validate="'email'"
                  :state="
                                        veeErrors.has('email') ? false : null
                                    "
                  data-vv-name="email"
                  :placeholder="$t('email')"
                  name="email"
                  type="text"
                  :readonly="inProgress"
                  @keydown.enter="save"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" xl="6">
              <!--username-->
              <b-form-group
                :invalid-feedback="veeErrors.first('username')"
                :state="!veeErrors.has('username')"
                :label="$t('username')"
                label-for="username"
                class="required"
                label-class="control-label"
              >
                <b-form-input
                  autocomplete="off"
                  id="username"
                  v-model="form.username"
                  v-validate="'required|alpha_dash|max:50'"
                  :state="
                                        veeErrors.has('username') ? false : null
                                    "
                  data-vv-name="username"
                  :data-vv-as="$t('username')"
                  type="text"
                  required
                  :readonly="inProgress"
                  :placeholder="$t('username')"
                  @keydown.enter="save"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6" xl="6"
            ><!--password-->
              <b-form-group
                :invalid-feedback="veeErrors.first('password')"
                :state="!veeErrors.has('password')"
                :label="$t('password')"
                label-for="password"
                :description="passwordDescription"
                :class="modalType == 1 ? 'required' : ''"
                label-class="control-label"
              >
                <b-form-input
                  id="password"
                  v-model="form.password"
                  v-validate="checkPasswordValidate"
                  type="password"
                  autocomplete="off"
                  :state="
                                        veeErrors.has('password') ? false : null
                                    "
                  data-vv-name="password"
                  :data-vv-ass="$t('password')"
                  :placeholder="$t('password')"
                  :readonly="inProgress"
                  @keydown.enter="save"
                />
              </b-form-group
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" xl="6">
              <!--user_type-->
              <b-form-group
                :invalid-feedback="veeErrors.first('user_type')"
                :state="!veeErrors.has('user_type')"
                :label="$t('user_type')"
                label-for="user_type"
                class="required"
                label-class="control-label"
              >
                <b-form-select
                  id="user_type"
                  v-model="form.user_type_id"
                  v-validate="'required'"
                  :state="
                                        veeErrors.has('user_type')
                                            ? false
                                            : null
                                    "
                  data-vv-name="user_type"
                  :data-vv-as="$t('user_type')"
                  type="text"
                  required
                  :readonly="inProgress"
                  :placeholder="$t('user_type')"
                  :options="getAccessUserTypes"
                  value-field="id"
                  text-field="type"
                  @change="getRole(form.user_type_id)"
                >
                  <template slot="first">
                    <option :value="null" disabled>
                      {{ $t('user_type') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="12" md="6" xl="6"
            ><!--role-->
              <b-form-group
                :invalid-feedback="veeErrors.first('role')"
                :state="!veeErrors.has('role')"
                :label="$t('role')"
                label-for="role"
                class="required"
                label-class="control-label"
              >
                <b-form-select
                  id="role"
                  v-model="form.role_id"
                  v-validate="roleValidate"
                  value-field="id"
                  text-field="role_name"
                  :state="
                                        veeErrors.has('role') ? false : null
                                    "
                  data-vv-name="role"
                  :data-vv-as="$t('role')"
                  required
                  :options="roles"
                >
                  <template slot="first">
                    <option :value="null" disabled>
                      {{ $t('role') }}
                    </option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col
            >
          </b-row>
        </b-col>
      </b-row>
    </b-form>
    <template slot="modal-footer">
      <b-button
        size="xs"
        variant="outline-secondary"
        :disabled="inProgress"
        @click="modal = false"
      >{{ $t('cancel') }}
      </b-button
      >
      <b-button
        size="xs"
        variant="primary"
        :disabled="inProgress"
        @click="save"
      >{{ modalOk }}
      </b-button
      >
    </template>
  </b-modal>
</template>
<script>
import {mapGetters} from 'vuex'
import swal from 'sweetalert2'

export default {
  props: {
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
  },
  components: {
    ModalCropperImage: () => import('~/components/ModalCropperImage'),
  },
  data() {
    return {
      form: {
        id: null,
        username: null,
        full_name: null,
        image: null,
        old_image: null,
        email: null,
        role_id: null,
        role_name: null,
        user_type_id: 3,
        user_type: null,
        password: null,
      },
      defaultForm: {
        id: null,
        username: null,
        full_name: null,
        image: null,
        old_image: null,
        email: null,
        role_id: null,
        role_name: null,
        user_type_id: 3,
        user_type: null,
        password: null,
      },
      roles: [],
      passwordValidate: 'required|min:6|max:50',
      roleValidate: 'required',
      modal: false,
      isRefresh: false,
      inProgress: false,
      apiUrl: process.env.API_URL,
      imagePath: null,
      modalShowCropperImage: false,
      targetFile: null,
      aspectRatio: null,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      authLevel: 'auth/authLevel',
      userLevel: 'user_type/level',
      userTypes: 'user_type/getUserType',
      type_id: 'user_type/USER_TYPE_ID',
    }),
    modalHeader() {
      return this.modalType == 1
        ? `${this.$t('add')} ${this.$t('user')}`
        : `${this.$t('update')} ${this.$t('user')}`
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
    checkPasswordValidate() {
      if (this.modalType == 1) {
        return 'required|min:6|max:50'
      } else {
        return 'min:6|max:50'
      }
    },
    passwordDescription() {
      return this.modalType == 1 ? '' : this.$t('password_can_empty')
    },
    checkRoleAccessCompany() {
      if (this.isSuper()) {
        return true
      }
      return false
    },
    checkRoleAccessBranch() {
      if (
        this.isSuper() ||
        this.user.user_type_id == this.$store.state.permission.COMPANY
      ) {
        return true
      }
      return false
    },
    getAccessUserTypes() {
      return this.userTypes.filter((obj) => obj.level < this.authLevel)
    },
  },
  watch: {
    modalType: {
      handler(val) {
        if (val == 1) {
          this.getRole(this.form.user_type_id)
          this.modal = true
          this.imagePath = this.apiUrl + 'images/users/'
        } else if (val == 2) {
          this.setData()
          this.modal = true
          this.imagePath = this.apiUrl + 'images/users/'
        }
      },
      immediate: true,
    },
    'form.user_type_id': function (val) {
      if (this.$helpers.nullToVoid(val) != '') {
        if (val == this.type_id.SUPER_ADMIN) {
          this.roleValidate = ''
        } else {
          this.roleValidate = 'required'
        }
      }
    },
  },
  methods: {
    /** Get Role */
    getRole(userTypeId) {
      let vm = this
      let input = {
        user_type_id: userTypeId,
        loading: false,
      }
      vm.inProgress = true
      this.$axios
        .post('role/get_by_user_type', input)
        .then((response) => {
          vm.inProgress = false
          vm.roles = response.data.data
        })
        .catch((error) => {
          vm.inProgress = false
        })
    },

    /**
     * Insert or Update User
     */
    save(evt) {
      let vm = this
      // prevent close popup
      evt.preventDefault()
      // check validation
      vm.$validator.validateAll().then((result) => {
        if (result) {
          vm.inProgress = true
          let input = this.form

          let url = 'user/store'
          if (vm.modalType == 2) {
            url = 'user/update'
          }
          vm.$axios
            .$post(url, input)
            .then((response) => {
              vm.isRefresh = true
              vm.modal = false
              vm.inProgress = false

              vm.$notify('success', vm.$t('user'), vm.$t('done'))
              vm.get()
            })
            .catch((error) => {
              vm.inProgress = false
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('user'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    setData() {
      this.form = Object.assign({}, this.formItem)

      this.getRole(this.formItem.user_type_id)
      this.form.old_image = this.form.image
    },
    /**
     * Clear Form
     */
    clearForm() {
      let vm = this
      vm.modal = false
      vm.form = Object.assign({}, vm.defaultForm)
      vm.$nextTick().then(() => {
        vm.veeErrors.clear()
      })
      vm.$emit('closeModal', vm.isRefresh)
      vm.isRefresh = false
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
      } else {
        vm.targetFile = $event
        vm.aspectRatio = 1 / 1
        vm.openModalCropperImage()
      }
    },
    openModalCropperImage() {
      this.modalShowCropperImage = true
    },
    closeModalCropperImage(data) {
      this.modalShowCropperImage = false
      this.$refs.fileInput.value = ''
      this.targetFile = null
    },
    saveModalCropperImage(base64) {
      this.imagePath = ''
      this.form.image = base64
      this.closeModalCropperImage()
    },
  },
}
</script>
