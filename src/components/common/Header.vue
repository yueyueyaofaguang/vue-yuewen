<template>
    <nav class="header">
        <!-- 顶部导航 -->
        <div class="container">
            <ul class="container-left-ul">
                <li @click="navigateTo('index')">
                    <img id="icon" src="@/assets/logo.png"/>
                </li>
            </ul>
            <ul class="container-right-ul">
                <li @click="tip" class="container-right-li"><span class="el-icon-info"></span>须知</li>
                <li @click="navigateTo('publish')" class="container-right-li" v-show="hasLogin">提问</li>
                <li @click="navigateTo('replies')" class="container-right-li" v-show="hasLogin">
                    <el-badge v-if="notifSize>0" :value="notifSize" class="item" type="warning">
                        <i class="iconfont icon-notification"/>
                    </el-badge>
                    <i v-else class="iconfont icon-notification"/>
                </li>

                <li v-if="!hasLogin" @click="navigateTo('login')" class="container-right-li">登录</li>
                <li v-else id="user" @click="toggleSubMenu('user','turnlg')" :class="subMenuList.user.turnlg ? 'menu-item-active' : 'container-right-li'">
                    <span v-if="user">{{user.username}}</span><span class="el-icon-caret-bottom"></span>
                    <ul v-show="subMenuList.user.turnlg">
                        <li @click="navigateTo('user')">我的主页</li>
                        <li>退出登录</li>
                    </ul>
                </li>

                <li id="bars" @click="dropDownShow = !dropDownShow">
                    &#9776;
                </li>
            </ul>
        </div>

        <!-- 下拉菜单 -->
        <transition name="dropdown-fade-show">
            <div v-show="dropDownShow" class="dropdown">
                <ul>
                    <li @click="navigateTo('index')">首页</li>
                    <li>须知</li>
                    <li @click="navigateTo('replies')">
                        <i class="iconfont icon-notification"></i>9
                    </li>
                    <li @click="navigateTo('publish')">提问</li>

                    <li @click="toggleSubMenu('user','turnsm')" v-if="user">
                       <span v-if="user">{{user.username}}</span><span class="el-icon-caret-bottom"></span>
                        <ul v-show="subMenuList.user.turnsm">
                            <li @click="navigateTo('user')">我的主页</li>
                            <li>编辑资料</li>
                            <li @click="logout">退出登录</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </transition>

    </nav>
</template>

<script>
    export default {
        name: "Footer",
        props:['notifSize'],
        created(){
            this.loadData();
            document.addEventListener('click',(e)=>{
                if(!this.subMenuList['user']['turnlg']) return;
                var sp = document.getElementById("user");
                if(sp){
                    if(!sp.contains(e.target)){
                        console.log('in');
                        this.subMenuList['user']['turnlg']= false;
                    }
                }
            })
        },
        data() {
            return {
                dropDownShow: false, // 控制下拉菜单显示
                navigateList:{
                    index:'/index',
                    publish:'/publish',
                    login:'/login',
                    replies: '/replies'
                },
                subMenuList:{
                    user:{
                        activeName:'user',
                        turnlg: false,
                        turnsm: false
                    }
                },
                hasLogin:false,
                user:null,
            };
        },
        methods: {
            navigateTo (path) { // 激活导航菜单
                console.log(path);
                this.$router.push(this.navigateList[path]);
            },
            tip(){
                const h = this.$createElement;
                this.$msgbox({
                    title: '用户使用说明手册',
                    message: h('div', null,[h('p',{ style: 'color: teal;margin-bottom: 10px;'},' 欢迎大家来到本站，为了您的良好体验，如果发现bug请务必联系我， 您也可以提出对本站的建议，非常感谢，可以扫描首页右下的二维码加我好友， 顺便交个朋友~'),
                        h('p',null,[h('span',{class:'el-icon-right',style: 'margin-right:3px'}),h('el-link',{attrs:{href:"https://github.com/yueyueyaofaguang/vue-yuewen"}},'戳源码地址，如果对您有帮助，请点个star，爱您！'),h('span',null,'')])]),
                    confirmButtonText: '好滴',
                })
            },
            toggleSubMenu(name,turn){
                this.subMenuList[name][turn] = !this.subMenuList[name][turn];
            },
            logout(){
                this.hasLogin = false;
                localStorage.removeItem('token');
            },
            loadData(){
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
                                this.navigateList.user = `/user/${this.user.id}`
                            }
                        })
                }
            }
        },
        watch:{
            $route:{
                handler(val,oldval){
                    console.log(val);//新路由信息
                    console.log(oldval);//老路由信息
                    this.loadData();
                },
                deep:true
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "/Users/etsugatsukoshietsu/Projects/yuewen-vue-test/src/assets/stylus/fade.styl" // 初始化导航栏参数
    @import "/Users/etsugatsukoshietsu/Projects/yuewen-vue-test/src/assets/stylus/init.styl" // 实现导航栏下拉展示动画效果
    .header
        color $headerTextColor
        background $headerBg
        height $header-height
        width 100%
        ul
            margin:0
            padding:0
        li
            cursor pointer
        .container
            width 80%
            height 100%
            margin 0 auto
            .container-left-ul
                float left
                li
                    height 100%
                    line-height $header-height
                    min-width $header-li-width
                    display inline-block
                    text-align center
                #icon
                    height 65px
                    vertical-align middle
                    transition transform 0.5s
                #icon:hover
                    transform scale(1.5, 1.5)
            .container-right-ul
                float right
                li
                    height 100%
                    line-height $header-height
                    min-width $header-li-width
                    display inline-block
                    text-align center
                    >>>.el-badge__content
                        transform: translateX(100%);
                    ul
                        position absolute;
                        top $header-height+5px
                        z-index 10
                        list-style none
                        background $headerBg
                        padding 0
                        li
                            display list-item
                            height 40px
                            padding 0 20px
                            line-height 40px
                            text-align center
                            color #fff
                            box-shadow none
                        li:hover
                            background #9e2c2c
                            color $menu-active-color
                >li:hover
                    color $menu-active-color
                    box-shadow 0px -4px 0px $menu-active-color inset
                .notificationNumber
                    display inline-block
                    width 40px
                    height 40px
                    color #ffffff
                    border-radius 100%
                    background-color  $menu-active-color
                #bars > i
                    padding 8px 14px
                    border 1px $headerTextColor solid
                    border-radius 5px
        .dropdown
            position: absolute;
            z-index 10
            width 100%
            background $headerBg
            ul
                list-style none
                padding 0
            li
                height 40px
                line-height 40px
                text-align center
                ul
                    background $headerBg
            li:hover
                background #9e2c2c

    .menu-item-active
        color $menu-active-color
        box-shadow 0px -4px 0px $menu-active-color inset

    @media screen and (max-width: 992px) {
        .header {
            padding 0
        }
    }
    @media screen and (max-width: 768px) {
        .container-left-li {
            display none !important
        }
        .container-right-li {
            display none !important
        }
    }
    @media screen and (min-width: 768px) {
        #bars {
            display none
        }
        .dropdown {
            display none
        }
    }
</style>