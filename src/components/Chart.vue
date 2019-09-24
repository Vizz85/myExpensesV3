<script>
import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['categorized'],
  data () {
    return {
      options: {
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const idx = tooltipItem.index
              return `${data.labels[idx]}: ${data.datasets[0].data[idx]}%`
            },
            afterLabel: (tooltipItem) => {
              return `Yearly: ${
                this.$options.filters.toCurrency(this.categorized.sums[tooltipItem.index].categoryYearlySum)
              }\nMonthly: ${
                this.$options.filters.toCurrency(this.categorized.sums[tooltipItem.index].categoryMonthlySum)
              }`
            }
          }
        }
      }
    }
  },
  mounted () {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style>
</style>
