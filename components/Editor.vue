<template>
    <div>
        <!-- Start modal Component -->
        <b-modal
            id="modal"
            v-model="modal"
            centered
            size="xxl"
            :title="$t('editor')"
            no-close-on-backdrop
            hide-header
            no-close-on-esc
            hide-header-close
            body-class="p-0 m-0"
        >
            <div>
                <b-row>
                    <b-col>
                        <quill-editor
                            v-model="text"
                            :options="$store.state.config.editor_option"
                        ></quill-editor>
                    </b-col>
                </b-row>
            </div>
            <template slot="modal-footer">
                <b-button
                    variant="outline-secondary"
                    :disabled="inProgress"
                    @click="clearForm"
                    >{{ $t('cancel') }}</b-button
                >
                <b-button
                    variant="primary"
                    :disabled="inProgress"
                    @click="save"
                    >{{ $t('ok') }}</b-button
                >
            </template>
        </b-modal>
        <!-- End modal Component -->
    </div>
</template>
<script>
export default {
    name: 'editor',
    props: {
        langType: {
            type: Number,
            default: 1,
        },
        input: {
            type: String,
            default: null,
        },
        modalType: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            inProgress: false,
            modal: false,
            item: null,
            text: null
        }
    },
    watch: {
        modalType: {
            handler(val) {
                if (val == true) {
                    this.modal = true
                    this.text = this.input
                }
            },
            immediate: true,
        },
    },
    methods: {
        save() {
            this.item = this.text
            this.clearForm()
        },
        clearForm() {
            this.modal = false
            this.$emit('closeModal', this.item)
            this.item = null
        },
    },
}
</script>
<style lang="scss" scoped>
.quill-editor :deep(.ql-toolbar) {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 1.75rem !important;
}
.quill-editor :deep(.ql-editor) {
    /* height: 400px; */
    height: 70vh; 
}
</style>    