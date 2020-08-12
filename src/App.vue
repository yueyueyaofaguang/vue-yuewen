<template>
  <div id="app">
    <Header v-if="!['callback','Login'].includes($route.name)" :notif-size="notifiSize"></Header>
    <router-view @readNotif="loadNotif"></router-view>
    <Footer v-if="!['callback','Login'].includes($route.name)"></Footer>
  </div>
</template>

<script>
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

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
      this.loadNotif();
  },
  methods:{
    loadNotif(){
      let token = localStorage.getItem('token');
      if(token) {
        this.$axios
                .post('/notification/getNotificationLen', {
                  token: token
                })
                .then(successResponse => {
                  if (successResponse.data.rspCode == 200) {
                    this.notifiSize = successResponse.data.data.size;
                  }
                })
      }
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
