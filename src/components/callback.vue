<template>
    <div id="post">
        <div class="loader">
            <p class="title">loading</p>
            <p>正在为您疯狂加载中～</p>
            <p class="number">{{percentage}}%</p>
            <el-progress  :stroke-width="18" :percentage="percentage"></el-progress>
        </div>
    </div>
</template>

<script>
    export default {
        name: "test",
        data(){
            return{
                percentage:49,
                status:''
            }
        },
        created(){
            let _this = this;
            let int = setInterval(()=>{
                if(_this.percentage>98)
                    clearInterval(int);
                else{
                    _this.percentage++;
                }
            },40);

            let href = window.location.href;
            let start = href.indexOf("?");
            let end = href.indexOf("#");
            let subHref = href.slice(start+1,end);
            let code = subHref.split("=")[1];

            this.$axios
                .get('/loginByGithub?code='+code)
                .then(function (successResponse) {
                    console.log(code);
                    console.log(successResponse);
                    if(successResponse.data.code == 200) {
                        _this.percentage = 100;
                        _this.$message("登录成功！正在为您跳转主页");
                        _this.$store.commit('login',{
                            email:successResponse.data.result
                        }
                        );
                        window.location.href = "http://112.124.17.27/#/index";
                    }else{
                        _this.$message(successResponse.data.message);
                        setTimeout(_=>{
                            console.log(_);
                            window.location.href = "http://112.124.17.27/#/login";
                        },1000);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }
    }
</script>

<style lang="stylus" scoped>
    #post
        display flex
        flex-direction column
        justify-content center
        width 100%
        height 100%
        background #ffbc32
        text-align center
        .loader
            width 60%
            margin 0 auto
        p
            padding 0
            margin 0
        .title
            font-size 40px
            color #d83d3d
        .number
            font-size 50px
            color #fff
</style>