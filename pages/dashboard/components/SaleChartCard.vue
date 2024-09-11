<template>
    <b-card :title="`${$t('sales')} (30 ${$t('days')})`">
        <div class="dashboard-line-chart">
            <div v-if="lineChartShow">
                <line-chart :data="lineChartData" shadow></line-chart>
            </div>
            <div
                v-else
                class="text-center text-muted"
                style="padding-top: 98px"
            >
                <h5>{{ $t('no_sale_chart') }}</h5>
            </div>
        </div>
    </b-card>
</template>
<script>
import LineChart from '~/components/Charts/Line'
import { ThemeColors } from '~/plugins/utils/colors'
import moment from 'moment'

const colors = ThemeColors()
export default {
    props: {
        chartData: {
            type: Array,
            default: {},
        },
    },
    components: {
        'line-chart': LineChart,
    },
    data() {
        return {
            lineChartShow: false,
            listCount: [],
            listMonth: [],
            lineChartData: {},
        }
    },
    watch: {
        chartData: {
            handler(val) {
                if (!this.$helpers.isEmpty(val)) {
                    this.lineChartShow = true
                    this.setChartData(val)
                }
            },
            immediate: true,
            deep: true,
        },
    },
    methods: {
        setChartData(items) {
            let vm = this

            if (!this.$helpers.isEmpty(items)) {
                items.map((obj) => {
                    if (this.$i18n.locale == 'en') {
                        vm.listMonth.push(
                            moment(obj.day, 'YYYY-MM-DD')
                                .locale('en')
                                .format('DD/MMM')
                        )
                    } else if (this.$i18n.locale == 'kh') {
                        vm.listMonth.push(
                            moment(obj.day, 'YYYY-MM-DD')
                                .locale('km')
                                .format('DD/MMM')
                        )
                    }

                    vm.listCount.push(obj.sold_out_count)
                })

                this.setLineChart()
            }
        },
        setLineChart() {
            this.lineChartData = {
                labels: this.listMonth,
                datasets: [
                    {
                        label:
                            this.$i18n.locale == 'en'
                                ? 'Sold Out'
                                : this.$i18n.locale == 'kh'
                                ? 'ចំនួនលក់'
                                : '',
                        data: this.listCount,
                        borderColor: colors.themeColor1,
                        pointBackgroundColor: colors.foregroundColor,
                        pointBorderColor: colors.themeColor1,
                        pointHoverBackgroundColor: colors.themeColor1,
                        pointHoverBorderColor: colors.foregroundColor,
                        pointRadius: 6,
                        pointBorderWidth: 2,
                        pointHoverRadius: 8,
                        fill: false,
                    },
                ],
            }
        },
    },
}
</script>
