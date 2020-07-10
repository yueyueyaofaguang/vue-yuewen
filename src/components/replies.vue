<template>
    <div id="#poster">
        <NavMenu></NavMenu>
        <div class="main">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <h3 class="main-title">
                            <span class="iconfont icon-huifu"></span>
                            回复
                        </h3>
                        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane v-for="tab in tabPane"
                                         :key="tab.label"
                                         :label="tab.label"
                                         :name="tab.name">
                                <div v-for="notif in data" :key="notif.id" class="text item">
                                            <div class="card-item">
                                                <div class="card-item-content">
                                                    <p>
                                                        <router-link to="/question/${notif.post.id}">
                                                            <span v-if="notif.comment.type == 1">{{notif.comment.userInfo.username }}:</span>
                                                            <span v-else>{{notif.comment.userInfo.username }} 回复 {{notif.comment.parentUserInfo.username }}:</span>
                                                            <span>{{ notif.comment.commentText}}</span>
                                                        </router-link>
                                                        <span class="right">{{moment(notif.created).format('MMDD, h:mm:ss a')}}</span>
                                                    </p>
                                                    <p>
                                                        <span>回复我的主题："<router-link to="/question/${notif.post.id}">{{notif.post.title}}</router-link>"</span>
                                                        <router-link to="/question/${notif.post.id}"><span class="el-icon-chat-dot-square right">回复</span></router-link>
                                                        <span class="el-icon-delete right del-btn">删除</span>

                                                    </p>
                                                </div>
                                            </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>

                        <el-pagination
                                id="pagination"
                                background
                                layout="prev, pager, next"
                                @current-change="handleCurrentChange"
                                :currentPage="currentPage"
                                :page-count="totalPage">>
                        </el-pagination>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <div>
                            <h3>日日鲜鸡汤</h3>
                            <el-card :body-style="{ padding: '0px' }">
                                <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                                <div style="padding: 14px;">
                                    <span>好吃的汉堡</span>
                                    <div class="bottom clearfix">
<!--                                        <time class="time">{{ currentDate }}</time>-->
                                        <el-button type="text" class="button">操作按钮</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from "@/components/common/Footer";
    import NavMenu from "@/components/common/NavMenu";

    export default {
        name: "replies",
        components: {Footer, NavMenu},
        data(){
            return {
                activeName: "news",
                state:0,
                currentPage:1,
                tabPane:[
                    {
                        label:"最新回复",
                        name:"news",
                    },
                    {
                        label:"历史回复",
                        name:"history",
                    }
                ],
                data:[]
            }
        },
        mounted:function () {
            this.getData();
        },
        methods:{
            getData(){
                console.log(this.state);
                console.log(this.currentPage);
                this.$axios
                    .post(`/notification/${this.state}/${this.currentPage}`,{token:localStorage.getItem('token')})
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                            let data = successResponse.data.data.data;
                            this.data = data;
                            this.totalPage = successResponse.data.data.totalPage;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            handleClick(){
                let tabPane = this.tabPane;
                for (let i = 0; i < tabPane.length; i++) {
                    if(this.tabPane[i].name == this.activeName) {
                        this.state = i;
                        break;
                    }
                }
                this.getData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            }
        }
    }
</script>

<style scoped>
    .del-btn{
        margin-right: 5px;
        visibility: hidden;
    }

    .card-item:hover{
        background-color: rgba(128,138,135,0.1);
    }

    .card-item:hover .del-btn{
        visibility: visible;
    }

</style>