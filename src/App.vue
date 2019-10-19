<template>
  <div id="app" class="container">
    <div class="row">

      <div class="column col-sm-12 col-lg-8">
        <table class="table">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Positions</th>
            <th scope="col">Monthly cost</th>
            <th scope="col">Yearly cost</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <SingleRow v-for="(row, idx) in rows" :key="idx" :position="idx" :row="row" @deleteRow="deleteRow"/>
          </tbody>
          <tfoot>
          <tr>
            <th scope="col"></th>
            <th scope="col">Sum</th>
            <th scope="col">{{ monthlySum | toCurrency }}</th>
            <th scope="col">{{ yearlySum | toCurrency }}</th>
            <th></th>
          </tr>
          </tfoot>
        </table>

        <div class="input-group">
          <input type="text" class="form-control" placeholder="new position" aria-label="Cost description" v-model="description">
          <input type="text" class="form-control" placeholder="category" aria-label="Cost category" v-model="category">
          <input type="number" class="form-control" placeholder="cost" aria-label="Cost" v-model="cost">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">cadence</button>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#" @click="addRow('montly')">monthly</a>
              <a class="dropdown-item" href="#" @click="addRow('yearly')">yearly</a>
            </div>
          </div>
        </div>
      </div>

      <div class="column col-sm-12 col-lg-4">
        <pie-chart :chart-data="datacollection" :categorized="categorized"></pie-chart>
      </div>
    </div>
  </div>
</template>

<script>
  import SingleRow from './components/SingleRow'
  import PieChart from './components/Chart'

  export default {
    name: 'App',
    components: {
      SingleRow,
      PieChart
    },
    data () {
      return {
        rows: [],
        cost: '',
        description: '',
        category: '',
        datacollection: null,
        categorized: {
          labels: null,
          percents: null,
          sums: null
        }
      }
    },
    mounted () {
      this.rows = JSON.parse(window.localStorage.getItem('data')) || []
    },
    watch: {
      rows () {
        this.setStorage()
        this.categorize()
        this.fillData()
      }
    },
    computed: {
      monthlySum () {
        return this.rows.reduce((acc, row) => acc + row.monthlyCost, 0)
      },
      yearlySum () {
        return this.rows.reduce((acc, row) => acc + row.yearlyCost, 0)
      }
    },
    methods: {
      addRow (type) {
        if (!type || this.description === '' || this.cost === '') {
          return
        }
        const row = {
          name: this.description,
          category: this.category,
          monthlyCost: type === 'yearly' ? this.cost / 12 : Number(this.cost),
          yearlyCost: type === 'yearly' ? Number(this.cost) : this.cost * 12
        }
        this.rows.push(row)
        this.cost = ''
        this.description = ''
        this.category = ''
      },
      deleteRow (position) {
        this.rows.splice(position, 1)
      },
      setStorage () {
        window.localStorage.setItem('data', JSON.stringify(this.rows))
      },
      fillData () {
        // const labels = [...new Set(this.rows.map(row => row.category || 'other'))]
        // const data = []
        // labels.forEach(label => {
        //   let sum = 0
        //   this.rows.forEach(row => {
        //     const category = row.category || 'other'
        //     if (category === label) sum += row.yearlyCost
        //   })
        //   data.push(sum)
        // })
        this.datacollection = {
          labels: this.categorized.labels,
          datasets: [{
            data: this.categorized.percents,
            backgroundColor: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC']
          }]
        }
      },
      categorize () {
        this.categorized.labels = [...new Set(this.rows.map(row => row.category || 'other'))]
        this.categorized.sums = []
        this.categorized.percents = []

        this.categorized.labels.forEach(label => {
          let categoryYearlySum = 0
          let categoryMonthlySum = 0
          this.rows.forEach(row => {
            const category = row.category || 'other'
            if (category === label) {
              categoryYearlySum += row.yearlyCost
              categoryMonthlySum += row.monthlyCost
            }
          })
          const percent = (categoryYearlySum / this.yearlySum) * 100
          this.categorized.sums.push({categoryYearlySum, categoryMonthlySum})
          this.categorized.percents.push(percent.toFixed(2))
        })
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    margin-bottom: 60px;
  }
</style>
