import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import VueSocketIO from "vue-socket.io";
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: false,
  connection: 'https://192.168.21.105:8088',
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
