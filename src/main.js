import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '../src/common/element-#F56C6C/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
import moment from 'moment-timezone'

Vue.config.productionTip = false
moment.tz.setDefault("Asia/Shanghai");
moment.locale('zh-cn')

axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://112.124.17.27:8443/api'
axios.defaults.baseURL = 'http://localhost:8443/api'

Vue.prototype.$axios = axios;
Vue.prototype.moment = moment;

Vue.config.productionTip = false;

Vue.use(ElementUI)
Vue.use(mavonEditor)

router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    if(store.state.user){
      axios.get('/authentication').then(rsep=>{
        if(rsep) next();
      })
    }else{
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
