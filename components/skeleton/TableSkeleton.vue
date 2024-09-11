<template>
    <div>
        <div v-show="loading">
            <b-row class="mt-2">
                <b-col cols="2">
                    <div class="page-title">
                        <b-skeleton width="50px"></b-skeleton>
                    </div>
                </b-col>
                <b-col cols="10" class="text-right">
                    <div style="display: flex; justify-content: flex-end">
                        <b-skeleton
                            type="button"
                            style="float: left"
                            width="100px"
                        ></b-skeleton>
                        <b-skeleton
                            type="button"
                            class="ml-2"
                            style="float: left"
                            width="100px"
                        ></b-skeleton>
                        <b-skeleton
                            type="button"
                            class="ml-2"
                            style="float: left"
                            width="100px"
                        ></b-skeleton>
                    </div>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col cols="2">
                    <b-skeleton type="input"></b-skeleton>
                </b-col>
                <b-col style="display: flex; justify-content: flex-end">
                    <b-skeleton type="input" width="100px"></b-skeleton>
                </b-col>
            </b-row>
            <div class="mb-2 mt-2"></div>
            <div class="separator mb-4"></div>
            <b-card>
                <b-skeleton-table
                    :rows="10"
                    :columns="4"
                    :table-props="{ striped: true }"
                ></b-skeleton-table>
            </b-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'tableSkeleton',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style></style>
