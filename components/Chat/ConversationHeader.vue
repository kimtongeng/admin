<template>
    <div>
        <div class="d-flex flex-row chat-heading">
            <div class="d-flex">
                <img
                    :alt="currentContact.name"
                    :src="getPhoto(currentContact.photo_url)"
                    onerror="this.src='/no-profile.png';"
                    class="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small"
                />
            </div>
            <div class="d-flex min-width-zero">
                <div
                    class="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
                >
                    <div class="min-width-zero">
                        <div>
                            <p class="list-item-heading mb-1 truncate">
                                {{ currentContact.name }}
                            </p>
                        </div>
                        <p class="mb-0 text-muted text-small">
                            <!-- {{ currentContact.createdAt }} -->
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="separator mb-5" />
    </div>
</template>
<script>
export default {
    props: {
        currentContact: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    methods: {
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
<style scoped>
.list-thumbnail {
    width: 60px !important;
}
</style>
