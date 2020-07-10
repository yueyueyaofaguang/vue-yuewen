import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        token: localStorage.getItem('token')?localStorage.getItem('token'):''
    },
    mutations:{
        //你不能直接调用一个 mutation handler。
        // 这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”
        // 要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：
        login(state,user){
            state.token = user.token
            window.localStorage.setItem('token',user.token)
        }
    }
})