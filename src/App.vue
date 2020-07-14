<template>
  <div id="app">
    <Header v-if="!['callback','Login'].includes($route.name)"></Header>
    <router-view></router-view>
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
  }
}
</script>

<style lang="stylus">
  @import "stylus-reset"
  reset();
  #app
    height: 100%
    font-family: Avenir, Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    /*text-align: center;*/
    color: #2c3e50

</style>
