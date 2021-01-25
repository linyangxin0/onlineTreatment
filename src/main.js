import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from "vue-socket.io";


Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://192.168.21.102:8088',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
