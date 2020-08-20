<template>
  <div id="app">
    <Header v-if="!['callback','Login'].includes($route.name)" :notif-size="notifiSize"></Header>
    <router-view></router-view>
    <Footer v-if="!['callback','Login'].includes($route.name)"></Footer>
  </div>
</template>

<script>

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import axios from "axios";

export default {
  name: 'App',
  components: {
    Footer,Header
  },
  data(){
    return {
      notifiSize:0
    }
  },
  created(){
      // this.loadNotif();
      axios.get('/authentication').then(res=>{
      console.log(res);})
            .catch(error => {
              console.log(error);
            });
      let _this = this;
      this.$router.app.$on('readNotif', () => { _this.loadNotif() });
  },
  methods:{
    loadNotif(){
      let user = localStorage.getItem('user');
      if(user == null) return;

      this.$axios
              .get('/notification/getNotificationLen')
              .then(successResponse => {
                if (successResponse.data.rspCode == 200) {
                  console.log(successResponse.data.data.size);
                  this.notifiSize = successResponse.data.data.size;
                }
              })
    }
  }
}
</script>

<style lang="stylus">
  @import "~@/assets/stylus/reset.css"
  #app
    height: 100%
    font-family: Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    /*text-align: center;*/
    color: #2c3e50

</style>
