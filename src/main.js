import Vue from 'vue'
import App from './App.vue'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

Vue.config.productionTip = false

Vue.filter('toCurrency', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })
  return formatter.format(value)
})

new Vue({
  render: h => h(App),
}).$mount('#app')
