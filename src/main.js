import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '../src/common/element-#F56C6C/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.config.productionTip = false

const axios = require('axios');
const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Shanghai");
moment.locale('zh-cn')

axios.defaults.baseURL = 'http://localhost:8443/api'
Vue.prototype.$axios = axios;
Vue.prototype.moment = moment;

Vue.config.productionTip = false;

Vue.use(ElementUI)
Vue.use(mavonEditor)

//意思是在访问每一个路由前调用。
router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    console.log(store.state.token)
    if(store.state.token){
      console.log('has Token')
      next()
    }else{
      console.log('has not Token')
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
