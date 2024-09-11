<template>
    <div class="icon-row-item">
        <b-card class="mb-4 text-center">
            <div>
                <b-icon :icon="icon" />
            </div>
            <div class="card-text font-weight-bold mb-0">{{ title }}</div>
            <p
                class="lead text-center"
                style="font-size: 22px"
            >{{ value }}</p>
            <!-- <p
                class="lead font-weight-bold text-center"
                style="font-size: 22px"
            >{{ value }}</p> -->
        </b-card>
    </div>
</template>
<script>
export default {
    props: {
        title: { type: String, default: 'icon-card-title' },
        icon: { type: String, default: 'iconsminds-clock' },
        value: {},
    },
}
</script>
