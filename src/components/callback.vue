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

            let code = this.$route.query.code;
            this.$axios
                .get('/loginByGithub?code='+code)
                .then(function (successResponse) {
                    if(successResponse.data.rspCode == 200) {
                        _this.percentage = 100;
                        _this.$message("登录成功！正在为您跳转主页");
                        _this.$store.commit('login',
                            successResponse.data.data
                        );
                        //获取登录前页面的路径并跳转，如果该路径不存在，则跳转到首页
                        _this.$router.replace({
                            path: '/index',
                            replace:false
                        })
                    }else{
                        _this.$message(successResponse.data.rspMsg);
                        _this.$router.replace({
                            path: '/login',
                            replace:false
                        })
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