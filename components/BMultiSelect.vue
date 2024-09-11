<template>
    <div>
        <!-- :block-keys="['Tab', 'Enter']" -->
        <multiselect
            v-model="selectedData"
            :value="value"
            :label="label"
            :track-by="trackBy"
            :options="options"
            :multiple="multiple"
            :disabled="disabled"
            :taggable="taggable"
            :placeholder="placeholder"
            :select-label="selectLabel"
            :deselect-label="deselectLabel"
            :selected-label="selectedLabel"
            :close-on-select="closeOnSelect"
            :preserve-search="preserveSearch"
            :preselect-first="preselectFirst"
            :internal-search="internalSearch"
            :options-limit="optionsLimit"
            :limit="limit"
            :loading="loading"
            @input="$emit('input', selectedData)"
            @tag="tag"
            @search-change="searchChange"
            :class="disabled ? 'multiselect_disabled' : ''"
            ref="vue_multiselect"
        >
            <template slot="tag" slot-scope="{ option, remove }">
                <span class="custom__tag">
                    <span v-if="trackBy != null">{{ option[trackBy] }}</span>
                    <span v-else>{{ option }}</span>
                    <div
                        class="multiselect__tag-icon-remove"
                        @click="remove(option)"
                    ></div>
                </span>
            </template>
            <template slot="beforeList">
                <div
                    @click="reset"
                    class="text-left"
                    style="padding: 10px; cursor: pointer"
                >
                    <i class="iconsminds-repeat-2"></i>
                    <span class="w-100">{{ $t('reset') }}</span>
                </div>
            </template>
        </multiselect>
    </div>
</template>

<style lang="scss">
.multiselect,
.multiselect__input,
.multiselect__single {
    font-size: 12px;
    margin-bottom: 0;
}
.multiselect {
    min-height: 0px;
    .multiselect__placeholder {
        padding-top: 4px;
        padding-left: 4px;
        margin: 0px;
    }
    .multiselect__select {
        height: 10px;
        top: 4px;
    }
    .multiselect__select:before {
        // border-color: #343a40 transparent transparent;
        cursor: pointer;
        width: 1.5em;
        align-self: stretch;
        background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
            no-repeat center;
        background-size: 8px 10px;
        border-color: #fff transparent transparent;
        border-width: 0px 5px 5px 5px;
        position: relative;
        right: 0;
        top: 17%;
    }
    .multiselect__tags {
        font-size: 11px;
        height: auto;
        min-height: auto;
        border: 1px solid #ced4da;
        padding: 8px 40px 6px 8px;
    }
    .custom__tag {
        position: relative;
        display: inline-block;
        padding: 3px 25px 3px 10px;
        border-radius: 3px;
        margin-right: 10px;
        color: #000;
        line-height: 1;
        background: #8bc3f0;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
        text-overflow: ellipsis;
    }
}
.multiselectError {
    .multiselect__tags {
        border-color: #dc3545;
    }
}
// border: 1px solid #ced4da;
.multiselect__option--highlight {
    background: #c4c8cd;
    color: #000;
}

.multiselect__option--selected {
    background: #e4edf8 !important;
    color: #184f90;
    &:after {
        color: #184f90 !important;
    }
}

.multiselect__option--selected.multiselect__option--highlight {
    color: #184f90;
}
.multiselect--disabled {
    background: unset;
    pointer-events: none;
}
.multiselect--disabled .multiselect__select {
    background: unset;
    pointer-events: none;
}
.multiselect_disabled .multiselect__tags {
    background-color: #c4c8cd;
    opacity: 0.6;
}
.multiselect_disabled .multiselect__placeholder {
    color: #242121 !important;
}
.multiselect--active .multiselect__select {
    transform: unset;
}

.multiselect__tag-icon-remove {
    cursor: pointer;
    margin-left: 7px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-weight: 700;
    font-style: normal;
    width: 22px;
    text-align: center;
    line-height: 22px;
    transition: all 0.2s ease;
    border-radius: 5px;
}
.multiselect__tag-icon-remove:after {
    content: '\D7';
    color: #184f90;
    font-size: 14px;
}
.multiselect_disabled .multiselect__input,
.multiselect_disabled .multiselect__single {
    background: #c4c8cd !important;
    color: #000 !important;
    font-weight: bold !important;
    font-size: 12px !important;
}
</style>
<script>
import Multiselect from 'vue-multiselect'
export default {
    components: {
        Multiselect,
    },
    props: {
        value: {
            type: [String, Number, Boolean, Array, Object],
            default: null,
        },
        title: {
            type: String,
            default: null,
        },
        trackBy: {
            type: String,
            default: null,
        },
        options: {
            type: Array,
            default: () => [],
        },
        placeholder: {
            type: String,
            default: null,
        },
        taggable: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        label: {
            type: String,
            default: null,
        },
        closeOnSelect: {
            type: Boolean,
            default: true,
        },
        preserveSearch: {
            type: Boolean,
            default: false,
        },
        preselectFirst: {
            type: Boolean,
            default: false,
        },
        internalSearch: {
            type: Boolean,
            default: true,
        },
        selectLabel: {
            type: String,
            default: '',
        },
        deselectLabel: {
            type: String,
            default: '',
        },
        selectedLabel: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        optionsLimit: {
            type: Number,
            default: 1000,
        },
        limit: {
            type: Number,
            default: 99999,
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            getProjectFormat: [],
            selectedData: [],
        }
    },
    watch: {
        value: {
            handler(val) {
                this.selectedData = val
            },
            immediate: true,
        },
    },
    methods: {
        tag(newTag) {
            this.$emit('tag', newTag)
        },
        searchChange(query) {
            this.$emit('search-change', query)
        },
        reset() {
            this.selectedData = []
            this.$refs.vue_multiselect.deactivate()
            this.$emit('reset', null)
        },
    },
}
</script>
