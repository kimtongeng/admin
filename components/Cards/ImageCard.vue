<template>
    <b-card class="mb-1" no-body style="overflow: hidden; border-radius: 1px">
        <div class="position-relative">
            <img
                :src="img"
                onerror="this.src='/thume-default.jpg';"
                class="ml-1"
                :alt="img"
                :title="img"
                style="width: 130px; height: 125px"
            />
            <b-badge
                variant="primary"
                pill
                class="position-absolute badge-top-left"
                style="margin-top: -12px"
            >
                {{ badge | dateTimeFormat }}
            </b-badge>
        </div>
        <b-card-footer style="margin-top: 5px">
            <label
                class="mb-0 card-subtitle text-1-line"
                style="margin-left: -16px"
            >
                {{ title }}
            </label>
            <div class="piaf-rater">
                <span
                    class="card-text text-muted text-small"
                    style="font-size: 10px; margin-left: -16px"
                >
                    {{ $t('total_sale') }}: ({{ count }})
                </span>
            </div>
        </b-card-footer>
    </b-card>
</template>
<script>
export default {
    props: {
        badge: { type: String, default: 'badge' },
        img: { type: String, default: '/thume-default.jpg' },
        title: { type: String, default: 'title' },
        count: { type: Number, default: 0 },
    },
}
</script>
