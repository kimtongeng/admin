<template>
  <b-modal
    v-model="modal"
    :title="modalHeader"
    size="lg"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    scrollable
  >
    <template>
      <b-form>
        <b-row>
          <b-col md="12">
            <b-form-group
              :label="$t('module')"
              :invalid-feedback="veeErrors.first('module')"
              :state="!veeErrors.has('module')"
              :label-for="$t('module')"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autofocus
                autocomplete="off"
                v-model="form.module_name"
                v-validate="'required|alpha_spaces'"
                :state="veeErrors.has('module') ? false : null"
                data-vv-name="module"
                :data-vv-as="$t('module')"
                :placeholder="$t('input') + ' ' + $t('module')"
                name="module"
                type="text"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="12">
            <b-form-group
              :label="$t('module_key')"
              :invalid-feedback="veeErrors.first('module_key')"
              :state="!veeErrors.has('module_key')"
              :label-for="$t('module_key')"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                :state="
                                    veeErrors.has('module_key') ? false : null
                                "
                autocomplete="off"
                :placeholder="
                                    $t('input') + ' ' + $t('module_key')
                                "
                v-model="form.module_key"
                v-validate="'required|alpha_dash'"
                data-vv-name="module_key"
                :data-vv-as="$t('module_key')"
                name="module_key"
                type="text"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="12">
            <b-form-group
              :label="$t('menu_title')"
              :invalid-feedback="veeErrors.first('menu_title')"
              :state="!veeErrors.has('menu_title')"
              :label-for="$t('menu_title')"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.menu_title"
                :state="
                                    veeErrors.has('menu_title') ? false : null
                                "
                :placeholder="
                                    $t('input') + ' ' + $t('menu_title')
                                "
                v-validate="'alpha_dash'"
                data-vv-name="menu_title"
                :data-vv-as="$t('menu_title')"
                name="menu_title"
                type="text"
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="12">
            <b-form-group
              :label="$t('featured')"
              :label-for="$t('featured')"
              class="required"
              label-class="control-label"
              :invalid-feedback="veeErrors.first('featured')"
              :state="!veeErrors.has('featured')"
            >
              <b-form-radio-group
                v-model="form.featured"
                :options="features"
                v-validate="'required'"
                data-vv-name="featured"
                :data-vv-as="$t('featured')"
                :state="
                                    veeErrors.has('featured') ? false : null
                                "
              >
              </b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>

        <b-row>
          <b-col md="12">
            <b-form-group
              :label="$t('sequence')"
              :label-for="$t('sequence')"
              :invalid-feedback="veeErrors.first('sequence')"
              :state="!veeErrors.has('sequence')"
              class="required"
              label-class="control-label"
            >
              <b-form-input
                autocomplete="off"
                v-model="form.sequence"
                v-validate="'required|numeric'"
                :state="
                                    veeErrors.has('sequence') ? false : null
                                "
                data-vv-name="sequence"
                :data-vv-as="$t('sequence')"
                name="sequence"
                type="text"
                :placeholder="
                                    $t('input') + ' ' + $t('sequence')
                                "
                @keydown.enter="save"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row class="permission-block">
          <b-col md="12">
            <label :for="$t('permission')" class="control-label">
              {{
                $t('permission')
              }}<span style="color: red"> *</span>
            </label>
            <i class="iconsminds-add text-primary" style="cursor: pointer; font-size: 16px"
               @click="addPermission"></i>
            <b-table-simple>
              <b-thead>
                <b-tr>
                  <b-th>{{ $t('action') }}</b-th>
                  <b-th>{{ $t('name') }}</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr
                  v-for="(item, index) in this.form
                                        .permission"
                  :key="index"
                >
                  <b-td
                    style="width: 10px"
                    class="text-center"
                  >
                    <i class="simple-icon-trash text-danger" style="cursor: pointer; font-size: 16px;"
                       @click="deletePermission(index)"></i>

                  </b-td>
                  <b-td>
                    <b-form-group
                      :invalid-feedback="
                                                veeErrors.first(
                                                    'permission_name_' + index
                                                )
                                            "
                      :state="
                                                !veeErrors.has(
                                                    'permission_name_' + index
                                                )
                                            "
                    >
                      <b-form-input
                        :ref="`permission-name-input-${index}`"
                        v-model="item.permission_name"
                        type="text"
                        v-validate="'required'"
                        :state="
                                                    veeErrors.has(
                                                        'permission_name_' +
                                                            index
                                                    )
                                                        ? false
                                                        : null
                                                "
                        :data-vv-name="
                                                    'permission_name_' + index
                                                "
                        :data-vv-as="
                                                    $t('permission_name')
                                                "
                        required
                        :placeholder="
                                                    $t('permission_name')
                                                "
                        @keydown.enter="addPermission"
                      />
                    </b-form-group>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
          </b-col>
        </b-row>
      </b-form>
    </template>

    <template slot="modal-footer">
      <b-skeleton-wrapper :loading="inProgress">
        <template #loading>
          <b-skeleton
            type="button"
            width="100px"
            class="float-left mr-3"
          ></b-skeleton>
          <b-skeleton type="button" width="100px"></b-skeleton>
        </template>

        <b-button
          size="xs"
          variant="outline-secondary"
          @click="clearForm"
        >{{ $t('cancel') }}
        </b-button
        >

        <b-button size="xs" variant="primary" @click="save">{{
            modalOk
          }}
        </b-button>
      </b-skeleton-wrapper>
    </template>
  </b-modal>
</template>

<script>
import {mapGetters} from 'vuex'
import swal from 'sweetalert2'

export default {
  props: {
    modalType: {
      type: Number,
      default: 0,
    },
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
        module_name: null,
        module_key: null,
        featured: 0,
        sequence: null,
        menu_title: null,
        permission: [{id: null, name: null}], // Must be an array reference!
      },
      defaultForm: {
        module_name: null,
        module_key: null,
        featured: 0,
        sequence: null,
        menu_title: null,
        permission: [{id: null, permission_name: null}], // Must be an array reference!
      },
      features: [
        {
          text: this.$t('main_menu'),
          value: 1,
        },
        {
          text: this.$t('sub_menu'),
          value: 0,
        },
      ],
      deletedPermission: [],
      modal: false,
      listItems: {},
    }
  },
  computed: {
    modalHeader() {
      return this.modalType == 1
        ? this.$store.state.lang.locale == 'en'
          ? 'Add Module'
          : 'បន្ថែម​​​ មូ៉ឌុល'
        : this.$store.state.lang.locale == 'en'
          ? 'Update Module'
          : 'កែប្រែ មូ៉ឌុល'
    },
    modalOk() {
      return this.modalType == 1 ? this.$t('save') : this.$t('update')
    },
    featuredState() {
      return Boolean(this.form.featured)
    },
    ...mapGetters({
      inProgress: 'loading/getInProgress',
    }),
  },
  watch: {
    modalType: {
      handler(val) {
        if (val == 1) {
          this.modal = true
        } else if (val == 2) {
          this.modal = true
          this.setData()
        }
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * Save Form
     */
    save(evt) {
      evt.preventDefault()

      this.$validator.validate().then((valid) => {
        if (valid) {
          let url = 'module/store'
          if (this.modalType == 2) {
            url = 'module/update'
          }

          let input = this.form
          input.deleted_permission = this.deletedPermission

          this.$axios.$post(url, input).then((response) => {
            this.listItems = response
            this.clearForm()
            this.$notify(
              'success',
              this.$t('module'),
              this.$t('done')
            )
          })
        } else {
          this.$notify(
            'warning',
            this.$t('module'),
            this.$t('validation_failed')
          )
        }
      })
    },

    /**
     * Clear Form
     */
    clearForm() {
      this.modal = false

      this.form = Object.assign({}, this.defaultForm)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })

      this.$emit('closeModal', this.listItems)

      this.listItems = {}
      this.deletedPermission = []
    },
    /**
     * Get Data
     */
    setData() {
      this.form = Object.assign(
        {},
        JSON.parse(JSON.stringify(this.formItem))
      )
    },
    addPermission() {
      this.form.permission.push({id: null, permission_name: null})

      let inputIndex = this.form.permission.length - 1

      this.$nextTick().then(() => {
        this.$refs[`permission-name-input-${inputIndex}`][0].focus()
      })
    },
    deletePermission(index) {
      if (
        this.$helpers.nullToVoid(this.form.permission[index].id) != ''
      ) {
        this.deletedPermission.push({
          id: this.form.permission[index].id,
        })
      }
      this.$delete(this.form.permission, index)

      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
    },
  },
}
</script>
<style scoped>
.permission-block .form-group {
  margin-bottom: 0 !important;
}
</style>
