<template>
        <div id="el-menu-container">
            <el-menu
            class="el-menu"
            mode="horizontal"
            background-color="#d83d3d"
            text-color="#fff"
            router
        >
            <span class="logo" index="/index">YUEWEN</span>
            <el-menu-item index="/login" v-if="!hasLogin">登录</el-menu-item>

            <el-submenu index="3" v-else>
                <template slot="title">
                    <Avatar  :username="user.username"
                             :src="user.avatar"
                             background-color="#ccc"
                             color="#fff"
                             style=" vertical-align: middle;border-radius: 4px;"
                             :rounded="false"
                             :inline="true"
                             :size = "30"
                    >
                    </Avatar>
                    {{user.username}}
                </template>
                <el-menu-item index="/user" title="123">我的主页</el-menu-item>
                <el-menu-item index="3-2">设置</el-menu-item>
                <el-menu-item index="3-3">退出登录</el-menu-item>
            </el-submenu>

            <el-menu-item index="/replies">
                <i class="iconfont icon-notification">99</i>
            </el-menu-item>
            <el-menu-item index="/publish">提问</el-menu-item>
            <el-menu-item @click="tip">须知</el-menu-item>

    </el-menu>
        </div>
</template>

<script>
    import Avatar from "vue-avatar";

    export default {
        name: "NavMenu",
        components: {Avatar},
        data() {
            return {
                hasLogin:false,
                user:null
            };
        },
        created(){
            let token = localStorage.getItem('token');
            if(token){
                this.hasLogin = true;
                this.$axios
                    .post('/getUserInfo',{
                        token: token
                    })
                    .then(successResponse=>{
                        if(successResponse.data.rspCode == 200){
                            console.log("setUser");
                            this.user = successResponse.data.data;
                        }
                    })
            }
        },
        methods:{
            tip(){
                const h = this.$createElement;
                this.$msgbox({
                    title: '用户使用说明手册111',
                    message: h('div', null,[h('p',{ style: 'color: teal;margin-bottom: 10px;'},' 欢迎大家来到本站，为了您的良好体验，如果发现bug请务必联系我， 您也可以提出对本站的建议，非常感谢，可以扫描首页右下的二维码加我好友， 顺便交个朋友~'),
                        h('p',null,[h('span',{class:'el-icon-right',style: 'margin-right:3px'}),h('el-link',{attrs:{href:"https://github.com/yueyueyaofaguang/vue-yuewen"}},'戳源码地址，如果对您有帮助，请点个star，爱您！'),h('span',null,'')])]),
                    confirmButtonText: '好滴',
                })
            },
            logout(){
                localStorage.removeItem('token');
            }
        }
    }
</script>

<style scoped>
    .el-menu--horizontal>.el-menu-item.logo{
        float: left;
        font-weight: bold;
        font-size: 16px;
        margin-left: -20px;
    }

    .el-menu--horizontal>.el-menu-item,
    .el-menu--horizontal>.el-submenu{
        float: right;
    }

    #el-menu-container{
        background-color: #d83d3d;
    }

    .el-menu{
        width: 80%;
        margin:0 auto;
    }

    #el-menu-container .el-menu-item i,
    #el-menu-container .el-submenu__title i{
        color:#fff;
    }

    #el-menu-container .el-menu.el-menu--horizontal{
       border-bottom: none;
    }

    .icon-notification:before{
        vert-align: middle;
    }

    #el-menu-container .el-menu-item.is-active {
        background-color: #d83d3d !important;
        color: #fff;
    }
</style>