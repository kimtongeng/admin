<template>
  <div>
    <b-card class="shadow mb-4">
      <b-card-header
        class="px-0 card-header-content"
        header-bg-variant="transparent"
        style="border-bottom: 0px"
      >
        <b-row>
          <b-col class="text-left" col cols="6" sm="6">
            <h5 v-if="$i18n.locale == 'en'" class="m-0">
              Add Role
            </h5>
            <h5 v-if="$i18n.locale == 'kh'" class="m-0">
              បន្ថែមតួនាទី
            </h5>
          </b-col>

          <b-col class="text-right" col cols="6" sm="6">
            <nuxt-link
              :disabled="inProgress"
              :to="makeLink('/setting/user/role')"
              no-prefetch
            >
              <b-button size="xs" variant="outline-secondary">{{
                  $t('cancel')
                }}
              </b-button>
            </nuxt-link>
            <b-button
              :disabled="inProgress"
              size="xs"
              variant="primary"
              @click="save"
            >{{ saveButtonTitle }}
            </b-button
            >
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body class="px-0">
        <b-row>
          <b-col cols="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('role_name')"
              :label="$t('role_name')"
              :state="!veeErrors.has('role_name')"
              class="required"
              label-class="control-label"
              label-for="role_name"
            >
              <b-form-input
                id="role_name"
                v-model="form.role_name"
                v-validate="'required|max:50'"
                :data-vv-as="$t('role_name')"
                :placeholder="$t('role_name')"
                :readonly="inProgress"
                :state="
                                    veeErrors.has('role_name') ? false : null
                                "
                data-vv-name="role_name"
                required
                type="text"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('user_type')"
              :label="$t('user_type')"
              :state="!veeErrors.has('user_type')"
              class="required"
              label-class="control-label"
              label-for="user_type"
            >
              <b-form-select
                id="user_type"
                v-model="form.user_type_id"
                v-validate="'required'"
                :data-vv-as="$t('user_type')"
                :disabled="inProgress"
                :options="this.getUserTypeByLevel()"
                :placeholder="$t('user_type')"
                :readonly="inProgress"
                :state="
                                    veeErrors.has('user_type') ? false : null
                                "
                data-vv-name="user_type"
                required
                text-field="type"
                type="text"
                value-field="id"
                @keydown.enter="save"
              >
                <template slot="first">
                  <option :value="null" disabled>
                    {{ $t('user_type') }}
                  </option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              :invalid-feedback="veeErrors.first('description')"
              :label="$t('description')"
              :state="!veeErrors.has('description')"
              label-for="description"
            >
              <b-form-input
                id="description"
                v-model="form.role_desc"
                v-validate="'max:255'"
                :placeholder="$t('description')"
                :readonly="inProgress"
                :state="
                                    veeErrors.has('description') ? false : null
                                "
                data-vv-name="description"
                required
                type="text"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col lg="4" md="4" sm="12">
            <h6 class="m-0">
              {{ $t('modules') }} & {{ $t('permission') }}
            </h6>
          </b-col>
          <b-col lg="4" md="4" sm="12">
            <b-form-checkbox
              v-model="check_all_module_permission"
              style="margin-left: 36px"
              @change="selectAllModulePermission()"
            >
              {{ $t('select_all_module') }}
            </b-form-checkbox>
          </b-col>
          <b-col cols="12">
            <hr/>
          </b-col>
        </b-row>
        <b-row>
          <b-table-simple hover>
            <b-tbody>
              <b-tr
                v-for="(item, index) in this.moduleItems"
                :key="index"
              >
                <b-td style="width: 50px">
                  <b-form-checkbox
                    v-model="item.checked"
                    class="pt-3 pb-3"
                    @change="tickAllPermission(item, index)"
                  >
                                        <span
                                          class="ml-3"
                                          style="
                                                font-size: 14px;
                                                text-decoration: underline;
                                                cursor: pointer;
                                            "
                                        >{{ $t(item.module_key) }}</span
                                        >
                  </b-form-checkbox>
                </b-td>

                <b-td>
                  <b-form-checkbox
                    v-for="(
                                            permission_item, permission_index
                                        ) in item.permission"
                    :key="permission_index"
                    v-model="permission_item.checked"
                    class="pt-3 pb-3"
                    @change="checkTickAllPermission"
                  >
                                        <span style="cursor: pointer">
                                          {{ $t(permission_item.permission_name) }} {{ $t(item.module_key) }}</span>
                  </b-form-checkbox>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-row>
      </b-card-body>
      <b-card-footer class="text-right">
        <nuxt-link
          :disabled="inProgress"
          :to="makeLink('/setting/user/role')"
          no-prefetch
        >
          <b-button size="xs" variant="outline-secondary">{{
              $t('cancel')
            }}
          </b-button>
        </nuxt-link>
        <b-button
          :disabled="inProgress"
          size="xs"
          variant="primary"
          @click="save"
        >{{ saveButtonTitle }}
        </b-button
        >
      </b-card-footer>
    </b-card>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import swal from 'sweetalert2'
import {isEmpty} from '~/plugins/utils/string'

export default {
  layout: 'app',
  head() {
    return {
      title:
        this.modalType == 1
          ? `${this.$t('add')}  ${this.$t('user_role')}`
          : `${this.$t('update')}  ${this.$t('user_role')}`,
    }
  },
  props: {},
  data() {
    return {
      form: {
        id: null,
        role_name: null,
        user_type_id: 3,
        role_desc: null,
        created_at: null,
        created_by: null,
        updated_at: null,
        updated_by: null,
      },
      defaultForm: {
        id: null,
        role_name: null,
        user_type_id: 3,
        role_desc: null,
        created_at: null,
        created_by: null,
        updated_at: null,
        updated_by: null,
      },
      modulesHeader: [
        {
          key: 'module_name',
          label: this.$t('module_name'),
          sortable: false,
        },
        {
          key: 'create',
          label: this.$t('create'),
          sortable: false,
          class: 'text-center',
        },
        {
          key: 'update',
          label: this.$t('update'),
          sortable: false,
          class: 'text-center',
        },
        {
          key: 'delete',
          label: this.$t('delete'),
          sortable: false,
          class: 'text-center',
        },
        {
          key: 'view',
          label: this.$t('view'),
          sortable: false,
          class: 'text-center',
        },
      ],
      passwordValidate: 'required|min:6|max:50',
      modal: false,
      inProgress: false,
      moduleItems: [],
      roleModule: [],
      isRefresh: false,
      modalType: 0,
      listPermissions: [],
      check_all_module_permission: false,
    }
  },
  computed: {
    ...mapGetters({
      userTypes: 'user_type/getUserType',
    }),
    saveButtonTitle() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
  },
  watch: {},
  created() {
    if (this.$route.query.type == 'add') {
      this.modalType = 1
      this.getUpdateForNew()
    } else if (this.$route.query.type == 'edit') {
      this.modalType = 2
      let input = {
        role_id: this.$route.query.id,
      }
      this.getUpdateForUpdate(input)
    } else {
      this.$router.push({
        path: this.makeLink('/errors/404'),
      })
    }
  },
  methods: {
    save(evt) {
      evt.preventDefault()

      let vm = this
      vm.$validator.validateAll().then((result) => {
        if (result) {
          vm.inProgress = true
          let input = vm.form
          input.module_items = vm.moduleItems
          let url = 'role/store'
          if (vm.modalType == 2) {
            url = 'role/update'
          }
          vm.$axios
            .$post(url, input)
            .then((response) => {
              vm.inProgress = false
              vm.$notify(
                'success',
                vm.$t('user_role'),
                vm.$t('done')
              )
              vm.$router.push({
                path: vm.makeLink('/setting/user/role'),
              })
            })
            .catch((error) => {
              vm.inProgress = false
            })
        } else {
          vm.$notify(
            'warning',
            vm.$t('user_role'),
            vm.$t('validation_failed')
          )
        }
      })
    },
    /** Get Module Permission */
    getUpdateForNew() {
      let vm = this
      vm.inProgress = true
      this.$axios
        .$post('role/get_module_permission', {})
        .then((response) => {
          vm.inProgress = false
          vm.moduleItems = response.data
        })
        .catch((error) => {
          vm.inProgress = false
        })
    },
    getUpdateForUpdate(input) {
      let vm = this
      vm.inProgress = true
      this.$axios
        .$post('role/get_update', input)
        .then((response) => {
          vm.inProgress = false
          vm.form = response.data.role
          //set default user_type_id
          vm.form.user_type_id = response.data.role.user_type_id
          vm.mapPermission(
            response.data.module_item,
            response.data.role_module
          )
        })
        .catch((error) => {
          vm.inProgress = false
        })
    },
    tickAllPermission(module_item, module_index) {
      //Checked in moduleItem->permission
      let vm = this
      this.moduleItems[module_index].permission.forEach((obj) => {
        if (vm.moduleItems[module_index].checked) {
          obj.checked = true
        } else {
          obj.checked = false
        }
      })

      //Tick all permission of all module or not
      this.moduleItems.forEach((module) => {
        if (module.checked == false) {
          this.check_all_module_permission = false
        } else if (module.checked == true) {
          this.check_all_module_permission = true
        }
      })
    },
    mapPermission(module_item, role_module) {
      module_item.forEach((module_item_obj) => {
        module_item_obj.permission.forEach((permission_obj) => {
          module_item_obj.checked = false
          role_module.forEach((role_module_obj) => {
            if (
              role_module_obj.permission_id === permission_obj.id
            ) {
              permission_obj.checked = true
            }
          })
        })
      })
      this.roleModule = role_module
      this.moduleItems = module_item

      //checkTickAllPermission
      this.checkTickAllPermission()

      //update select_all_module checkbox
      this.moduleItems.forEach((module) => {
        if (module.checked == false) {
          this.check_all_module_permission = false
        } else if (module.checked == true) {
          this.check_all_module_permission = true
        }
      })
    },
    checkTickAllPermission() {
      let total_module_items = this.moduleItems.length;
      let total_check_module = 0;

      this.moduleItems.forEach((module_obj) => {
        let total_permission = module_obj.permission.length
        let total_check_permission = 0
        module_obj.permission.forEach((permission_obj) => {
          if (permission_obj.checked == true) {
            total_check_permission++
          }
        })

        //Tick all permission of current select module or not
        if (
          total_permission == total_check_permission &&
          total_check_permission > 0
        ) {
          module_obj.checked = true
          total_check_module++;
        } else {
          module_obj.checked = false
        }
      })

      //Tick all permission of all module or not
      if (total_module_items == total_check_module && total_check_module > 0) {
        this.check_all_module_permission = true;
      } else {
        this.check_all_module_permission = false;
      }
    },
    selectAllModulePermission() {
      this.moduleItems.forEach((module) => {
        if (this.check_all_module_permission == false) {
          module.checked = false
          module.permission.forEach((permission) => {
            permission.checked = false
          })
        } else if (this.check_all_module_permission == true) {
          module.checked = true
          module.permission.forEach((permission) => {
            permission.checked = true
          })
        }
      })
    },
  },
}
</script>
