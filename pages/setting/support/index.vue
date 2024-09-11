<template>
    <div>
        <!-- Page Heading -->
        <div class="page-header-nav">
            <b-row class="mt-2">
                <b-col cols="12" xl="6">
                    <div class="page-title">
                        <div>{{ $t('support') }}</div>
                    </div>
                </b-col>

                <b-col cols="12" xl="6" class="text-right mb-2">
                    <b-button variant="primary" size="xs" @click="clearForm">
                        <i class="iconsminds-repeat-2"></i>
                        {{ $t('refresh') }}</b-button
                    >
                    <b-button
                        v-if="checkModuleAuthorize('support', 'update')"
                        variant="primary"
                        size="xs"
                        @click="update"
                        ><i class="simple-icon-pencil"></i>
                        {{ $t('update') }}</b-button
                    >
                </b-col>
            </b-row>
            <div class="separator mt-2 mb-4"></div>
        </div>
        <b-card class="shadow">
            <b-row>
                <b-col cols="12">
                    <b-row v-for="item in supportItems" :key="item.id">
                        <b-col cols="4" sm="4" md="3" xl="2">
                            <label class="control-label">{{
                                item.support_type
                            }}</label>
                        </b-col>
                        <b-col cols="8" sm="8" md="9" xl="10">
                            <b-form-group>
                                <b-form-input
                                    v-if="item.support_type != 'ADDRESS'"
                                    autocomplete="off"
                                    v-model="item.support_value"
                                    type="text"
                                    :placeholder="item.support_type"
                                    @keydown.enter="update"
                                />
                                <b-form-textarea
                                    v-if="item.support_type == 'ADDRESS'"
                                    v-model="item.support_value"
                                    type="text"
                                    :placeholder="item.support_type"
                                    @keydown.enter="update"
                                    rows="5"
                                ></b-form-textarea>
                            </b-form-group>
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
        </b-card>
    </div>
</template>
<script>
import swal from 'sweetalert2'
import { mapGetters } from 'vuex'
export default {
    layout: 'app',
    middleware: 'acl',
    moduleKey: 'support',
    head() {
        return {
            title: this.$t('support'),
        }
    },
    data() {
        return {
            supportItems: [],
            apiUrl: process.env.API_URL,
        }
    },
    computed: {
        ...mapGetters({
            pageOptions: 'pagination/getPageOptions',
        }),
    },
    created() {
        this.get()
    },
    methods: {
        get() {
            let vm = this
            this.$axios.$post('support/get').then(({ data }) => {
                vm.setInput(data)
            })
        },
        /**
         * Insert or Update support
         */
        update(evt) {
            // prevent close popup
            evt.preventDefault()
            // check validation
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let url = 'support/update'

                    let input = {
                        supportItem: this.supportItems,
                    }

                    this.$axios.$post(url, input).then(({ data }) => {
                        this.clearForm()

                        this.$notify(
                            'success',
                            this.$t('support'),
                            this.$t('done')
                        )
                    })
                } else {
                    this.$notify(
                        'warning',
                        this.$t('support'),
                        this.$t('validation_failed')
                    )
                }
            })
        },
        /** Set input */
        setInput(data) {
            this.supportItems = data
        },
        /**
         * Clear Form
         */
        clearForm() {
            this.supportItems = []
            this.get()
        },
    },
}
</script>
