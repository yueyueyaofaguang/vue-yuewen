<template>
    <div id="poster">

        <transition name="fade">
            <div class="btn-wrapper" v-if="!hasSelect">
                <div class="el-button-container">
                    <el-button round class="signUp" @click="toggleTabsByBtn('login')" >登录</el-button>
                    <el-button round class="register" @click="toggleTabsByBtn('register')">注册</el-button>
                </div>
            </div>
        </transition>

        <transition name="fade">
            <div class="pane-wrapper"  @click="toggleTabsByMask" v-if="hasSelect">
                <el-tabs class="el-tab-pane-container" type="border-card" v-model="activeName" @tab-click="handleClick">

                    <el-tab-pane label="login" name="login">

                        <ul class="social-container">
<!--                            <a href="#"><li><i class="iconfont icon-qq"></i></li></a>-->
                            <a href="https://github.com/login/oauth/authorize?client_id=1437d3540ec352a5dc9f" @click="githubLogin">
                                <li><i class="iconfont icon-github"></i></li>
                            </a>
                        </ul>

                        <el-form :rules="rule" :model="loginForm" ref="loginForm">
                            <el-form-item prop="email">
                                <el-input placeholder="请输入邮箱" v-model="loginForm.email" prefix-icon="el-icon-message"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input placeholder="请输入密码" v-model="loginForm.password" show-password prefix-icon="el-icon-key"></el-input>
                            </el-form-item>
                            <el-form-item style="width: 100%">
                                <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="login">登录</el-button>
                            </el-form-item>
                        </el-form>


                    </el-tab-pane>

                    <el-tab-pane label="register" name="register">

                        <ul class="social-container">
<!--                            <a href="#"><li><i class="iconfont icon-qq"></i></li></a>-->
                            <a href="#"><li><i class="iconfont icon-github"></i></li></a>
                        </ul>

                        <el-form :rules="rule" :model="registerForm" ref="registerForm">
                            <el-form-item prop="email">
                                <el-input placeholder="请输入邮箱"
                                          v-model="registerForm.email"
                                          prefix-icon="el-icon-message">
                                    <el-button slot="append"
                                               :icon="getCodeLoading? 'el-icon-loading':'el-icon-s-promotion'"
                                               @click="getCode"
                                    >
                                    </el-button>
                                </el-input>
                            </el-form-item>

                            <el-form-item prop="code">
                                <el-input placeholder="请输入验证码" prefix-icon="el-icon-edit" v-model="registerForm.code"></el-input>
                            </el-form-item>

                            <el-form-item prop="username">
                                <el-input placeholder="请输入用户名" v-model="registerForm.username" prefix-icon="el-icon-s-custom"></el-input>
                            </el-form-item>

                            <el-form-item prop="password">
                                <el-input placeholder="请输入密码" v-model="registerForm.password" show-password prefix-icon="el-icon-key"></el-input>
                            </el-form-item>

                            <el-form-item style="width: 100%">
                                <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="register">注册</el-button>
                            </el-form-item>
                        </el-form>

                    </el-tab-pane>

                </el-tabs>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "Login",
        created(){
          let token = localStorage.getItem('token');
          if(token)
              this.$router.replace({
                  path: '/index',
                  replace:false
              })
        },
        data(){
            let checkCode = (rule,value,callback)=>{
                if(value!=localStorage.getItem('code'))
                    callback(new Error('验证码不正确'));
                else
                    callback;
            }
            return {
                activeName: 'login',
                hasSelect:false,
                loginForm:{
                    email:'',
                    password:''
                },
                registerForm:{
                    email:'',
                    username:'',
                    password:'',
                    code:''
                },
                responseResult:[],
                getCodeLoading:false,
                rule: {
                    email:[
                        {required:true,message: '请输入邮箱', trigger: 'blur'},
                        {
                            type: 'email',//要检验的类型（number，email，date等）
                            message: '请输入正确的邮箱地址',
                            trigger: ['blur', 'change']
                        }
                    ],
                    code:[
                        {required:true,message: '请输入验证码', trigger: 'blur'},
                        { validator: checkCode, trigger: 'blur' }
                        ],
                    password:[{required:true,message: '请输入密码', trigger: 'blur'}],
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
                        {
                            required: true,
                            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
                            message: '姓名不支持特殊字符',
                            trigger: 'blur'
                        }]
                }
            }
        },
        methods:{
            login(){
                let _this = this;
                console.log({
                    email: _this.loginForm.email,
                    password: _this.loginForm.password
                });
                this.$axios
                    .post('/login',{
                        email: _this.loginForm.email,
                        password: _this.loginForm.password
                    })
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            _this.$store.commit('login',
                              successResponse.data.data
                            )

                            //获取登录前页面的路径并跳转，如果该路径不存在，则跳转到首页
                            this.$router.replace({
                                path: '/index',
                                replace:false
                            })
                        }
                        else{
                            this.$message(successResponse.data.rspMsg);
                        }
                    })
                    .catch(failResponse=>{
                        console.log(failResponse);
                    })
            },

            getCode(){

                if(this.getCodeLoading){
                    this.$message('正在加速发送中，请稍等');
                    return;
                }

                this.getCodeLoading = true;

                this.$axios
                    .get('/getCode',{params:{
                        email: this.registerForm.email
                    }})
                    .then(successResponse=>{
                        console.log(successResponse);
                        this.$message(successResponse.data.rspMsg);
                        this.getCodeLoading = false;
                        if(successResponse.data.rspCode == 200){
                            localStorage.setItem("code",successResponse.data.data.code);
                        }
                    })
            },

            register(){
                this.$axios
                    .post('/register',{
                        email:this.registerForm.email,
                        password: this.registerForm.password,
                        username: this.registerForm.username
                    })
                    .then(successResponse=>{
                        console.log(successResponse);
                        this.$message(successResponse.data.rspMsg);
                        if(successResponse.data.rspCode == 200){
                            this.activeName = 'login';
                            this.reset(this.registerForm);
                            this.code = '';
                        }
                    })
                    .catch(failResponse=>{
                        console.log(failResponse);
                    })
            },

            handleClick(tab, event) {
                console.log(tab, event);
            },

            toggleTabs(){
                this.hasSelect = !this.hasSelect;
            },

            toggleTabsByBtn(tabName){
                this.toggleTabs();
                this.activeName = tabName;
            },

            toggleTabsByMask(e){

                if(e.target.className == 'pane-wrapper'){
                    this.toggleTabs();
                    this.activeName = 'login';
                }
            },

            reset(objToClear){
                Object.keys(objToClear).forEach((param) => {
                    if ( (objToClear[param]).toString() === "[object Object]" ) {
                        this.reset(objToClear[param]);
                    } else {
                        objToClear[param] = undefined;
                    }
                })
            },

            githubLogin(){
                window.location.href = "https://github.com/login/oauth/authorize?client_id=1437d3540ec352a5dc9f"
                return false;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');
    @import "~@/assets/stylus/init.styl"

    #poster
        width 100%
        height 100%
        background $googleRed
        .btn-wrapper
        .pane-wrapper
            width: 100%
            height: 100%
            align()
        .pane-wrapper
            background rgba(0,0,0,.4);
            .el-tab-pane-container
                width 400px
                .social-container
                    align()
                    margin-bottom 10px
                    list-style-type none
                    text-align center
                    li
                        align()
                        margin 0 5px
                        height 40px
                        width 40px
                        border 1px solid #DDDDDD
                        border-radius 50%
                        background-color #fff
                    a
                        cursor pointer
                        text-decoration none
                        color #333
        .btn-wrapper
            .el-button
                padding 12px 40px
                -webkit-transition all 0.30s ease-in-out;
                -moz-transition all 0.30s ease-in-out;
                -ms-transition all 0.30s ease-in-out;
                -o-transition all 0.30s ease-in-out;
            .signUp
                background $googleRed
                border 2px solid #fff
                color #fff
                &:hover
                    background #fff
                    color $googleRed
            .register
                background #9e2c2c
                border 2px solid #9e2c2c
                color #fff
                &:hover
                    background #b13131
                    border 2px solid #b13131
        /*过渡*/
        .fade-enter-active
        .fade-leave-active
            transition opacity .5s

        .fade-enter
        .fade-leave-to
            opacity: 0
</style>