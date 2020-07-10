<template>
    <div>正在为您疯狂加载中</div>
</template>

<script>
    export default {
        name: "callback",
        created(){

            let code = this.$route.query.code;
            let _this = this;

            this.$axios
                .get('/loginByGithub?code='+code)
                .then(function (successResponse) {
                    console.log(successResponse);
                    if(successResponse.data.rspCode != 200)
                        return _this.$message(successResponse.data.rspMsg);

                    _this.$store.commit('login',
                        successResponse.data.data
                    )

                    //获取登录前页面的路径并跳转，如果该路径不存在，则跳转到首页
                    _this.$router.replace({
                        path: '/index',
                        replace:false
                    })

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

<style scoped>

</style>