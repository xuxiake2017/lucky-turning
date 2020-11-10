import Vue from 'vue'
import App from './App.vue'
import LuckyTurning from '../packages/index'

Vue.config.productionTip = false
Vue.use(LuckyTurning)

new Vue({
  render: h => h(App),
}).$mount('#app')
