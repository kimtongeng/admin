<template>
    <b-modal
        id="modal"
        v-model="modal"
        scrollable
        centered
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
        :title="modalHeader"
    >
        <b-row>
            <!--type-->
            <b-col cols="12">
                <b-form-group
                    :invalid-feedback="veeErrors.first('type')"
                    :state="!veeErrors.has('type')"
                    :label="$t('type')"
                    label-for="type"
                    class="required"
                    label-class="control-label"
                >
                    <b-form-input
                        autocomplete="off"
                        id="type"
                        v-model="form.type"
                        v-validate="'required|max:255'"
                        :state="veeErrors.has('type') ? false : null"
                        data-vv-name="type"
                        data-vv-as="Prefix Code"
                        type="text"
                        required
                        :placeholder="$t('type')"
                        @keydown.enter="save"
                    />
                </b-form-group>
            </b-col>
            <!--prefix-->
            <b-col cols="12">
                <b-form-group
                    :invalid-feedback="veeErrors.first('prefix')"
                    :state="!veeErrors.has('prefix')"
                    :label="$t('prefix')"
                    label-for="prefix"
                    class="required"
                    label-class="control-label"
                >
                    <b-form-input
                        autocomplete="off"
                        id="prefix"
                        v-model="form.prefix"
                        v-validate="'required|max:255'"
                        :state="veeErrors.has('prefix') ? false : null"
                        data-vv-name="prefix"
                        data-vv-as="Prefix"
                        type="text"
                        required
                        :placeholder="$t('prefix')"
                        @keydown.enter="save"
                    />
                </b-form-group>
            </b-col>
            <!--prefix-->
            <b-col cols="12">
                <b-form-group
                    :invalid-feedback="veeErrors.first('code_length')"
                    :state="!veeErrors.has('code_length')"
                    :label="$t('code_length')"
                    label-for="code_length"
                    class="required"
                    label-class="control-label"
                >
                    <b-form-input
                        autocomplete="off"
                        id="prefix"
                        v-model="form.code_length"
                        v-validate="'required|max:11'"
                        :state="veeErrors.has('code_length') ? false : null"
                        data-vv-name="code_length"
                        data-vv-as="Code length"
                        type="number"
                        required
                        :placeholder="$t('code_length')"
                        @keydown.enter="save"
                    />
                </b-form-group>
            </b-col>
        </b-row>
        <template slot="modal-footer">
            <b-button size="xs" variant="outline-secondary" @click="clearForm"
                >{{ $t('cancel') }}
            </b-button>
            <b-button size="xs" variant="primary" @click="save">{{
                modalOk
            }}</b-button>
        </template>
    </b-modal>
</template>
<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
import getNameByLocal from '../../../../plugins/utils/string/getNameByLocal'
export default {
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
    },
    data() {
        return {
            form: {
                id: null,
                type: null,
                prefix: null,
                code_length: null,
            },
            defaultForm: {
                id: null,
                type: null,
                prefix: null,
                code_length: null,
            },
            modal: false,
            apiUrl: process.env.API_URL,
            impagePath: null,
            listItems: {},
            parents: null,
        }
    },
    computed: {
        modalHeader() {
            return this.modalType == 1
                ? `${this.$t('add')} ${this.$t('prefix_code')}`
                : `${this.$t('update')} ${this.$t('prefix_code')}`
        },
        modalOk() {
            return this.modalType == 1 ? this.$t('save') : this.$t('update')
        },
    },
    watch: {
        modalType: {
            handler(val) {
                if (val == 1) {
                    this.modal = true
                } else if (val == 2) {
                    this.setData()
                }
            },
            immediate: true,
        },
    },
    methods: {
        /**
         * Insert or Update unit_type
         */
        save(evt) {
            // prevent close popup
            evt.preventDefault()
            // check validation
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let url = 'prefix_code/store'
                    if (this.modalType == 2) {
                        url = 'prefix_code/update'
                    }

                    this.form.branch_id = null
                    let input = this.form

                    input.filter = this.formFilter
                    this.$axios.$post(url, input).then(({ data }) => {
                        this.listItems = data
                        this.clearForm()

                        this.$notify(
                            'success',
                            this.$t('prefix_code'),
                            this.$t('done')
                        )
                    })
                } else {
                    this.$notify(
                        'warning',
                        this.$t('prefix_code'),
                        this.$t('validation_failed')
                    )
                }
            })
        },
        /**
         * Set data
         */
        setData() {
            this.form = Object.assign({}, this.formItem)
            this.modal = true
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
        },
    },
}
</script>
