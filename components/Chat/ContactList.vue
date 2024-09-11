<template>
    <vue-perfect-scrollbar
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
    >
        <div class="pt-0 spaced-content pb-0">
            <div
                class="d-flex flex-row mb-3 border-bottom pt-2 pb-2 pl-2 contact-item"
                v-for="(contact, index) in contactList"
                :key="`contact${index}`"
            >
                <a
                    class="d-flex"
                    href="#"
                    @click.prevent="selectContact(contact)"
                >
                    <img
                        :alt="contact.name"
                        :src="getPhoto(contact.photo_url)"
                        onerror="this.src='/no-profile.png';"
                        class="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                    />
                    <div class="d-flex flex-grow-1 min-width-zero">
                        <div
                            class="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
                        >
                            <div
                                class="min-width-zero"
                                :id="'popover-contact-' + contact.id"
                            >
                                <p class="mb-0 truncate">
                                    {{ contact.name | truncate(25) }}
                                </p>
                            </div>
                            <b-tooltip
                                :target="'popover-contact-' + contact.id"
                                triggers="hover"
                                placement="left"
                                variant="dark"
                            >
                                {{ contact.name }}
                            </b-tooltip>
                        </div>
                    </div>
                </a>
            </div>

            <div class="text-center mt-2" v-if="contactList.length == 0">
                <span class="text-muted">{{ $t('no_contact') }}</span>
            </div>
        </div>
    </vue-perfect-scrollbar>
</template>

<script>
export default {
    props: {
        contactList: {
            type: Array,
            default: () => {
                return []
            },
        },
    },
    methods: {
        selectContact(contact) {
            this.$emit('select-contact', contact)
        },
        getPhoto(photo) {
            if (this.$helpers.nullToVoid(photo) != '') {
                return photo
            } else {
                return '/no-profile.png'
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.list-thumbnail {
    width: 40px !important;
}

.contact-item {
    &:hover {
        background-color: #008ecc;

        p {
            color: #fff !important;
        }
    }
}
</style>
