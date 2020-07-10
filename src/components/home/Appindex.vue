<template>
    <div id="poster">
        <div class="main">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <h3 class="main-title"><span class="iconfont icon-zhedie"></span>首页</h3>
                        <el-tabs v-model="activeName" @tab-click="handleClick" class="index-tab">
                            <el-tab-pane v-for="tab in tabPane"
                                         :key="tab.label" :label="tab.label" :name="tab.name" >

                                <el-card class="box-card">
                                    <div v-for="post in data" :key="post.id" class="text">
                                        <router-link :to="`/question/${post.id}`">
                                            <div class="card-item">
                                            <Avatar  :username="post.userBases.username"
                                                     :src="post.userBases.avatar"
                                                     background-color="#ccc"
                                                     color="#fff"
                                                     style=" vertical-align: middle;"
                                                     :inline="true">
                                            </Avatar>
                                            <div class="card-item-content">
                                                <h3>{{post.title}}</h3>

                                                <p class="card-item-text">
                                                    <span>{{post.commentCount }}个评论数</span>
                                                    <span>{{post.readCount}}次浏览</span>
                                                    <span>{{ moment(post.created).format('MMMM Do YYYY, h:mm:ss a') }}</span>
                                                </p>

                                                <p class="card-item-tags">
                                                    <el-tag type="success" v-for="tag in post.tags" :key="tag">{{tag}}</el-tag>
                                                </p>
                                            </div>
                                        </div>
                                        </router-link>
                                    </div>
                                </el-card>

                                <el-pagination
                                        id="pagination"
                                        background
                                        layout="prev, pager, next"
                                        @current-change="handleCurrentChange"
                                        :currentPage="currentPage"
                                        :page-count="totalPage">
                                </el-pagination>
                            </el-tab-pane>
                        </el-tabs>
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
                                        <time class="time">{{ currentDate }}</time>
                                        <el-button type="text" class="button">操作按钮</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>

                        <div class="clearfix">
                            <h3>热门标签</h3>
                            <el-tag type="success">标签二</el-tag>
                            <el-tag type="info">标签三</el-tag>
                            <el-tag type="warning">标签四</el-tag>
                            <el-tag type="danger">标签五</el-tag>
                        </div>

                        <div>
                            <h3>联系站长</h3>
                            <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
                        </div>

                    </div>
                </el-col>
            </el-row>
          </div>
    </div>
</template>

<script>
    import Avatar from 'vue-avatar'
    export default {
        name: "Appindex",
        components: {Avatar},
        data() {
            return {
                currentDate: new Date(),
                activeName: 'news',
                data:null,
                currentPage:1,
                tabPane:[
                    {
                        label:"最新",
                        name:"news"
                    },{
                        label:"7天最热",
                        name:"hotSevenDay"
                    },{
                        label:"历史最热",
                        name:"hotHistory"
                    },{
                        label:"消灭零回复",
                        name:"noReply"
                    }
                ]
            };
        },
        mounted: function () {
            this.getData({current:1});
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val;
                let params = this.getParams(val);
                this.getData(params);
            },
            getData(params){
                this.$axios
                    .get('/post/',{params:params})
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                            let data = successResponse.data.data.data;
                            this.totalPage = successResponse.data.data.totalPage;
                            if(params.current == 1) {
                                this.currentPage = 1;
                            } else {
                                this.currentPage =  params.current;
                            }
                            for (let i = 0; i < data.length; i++) {
                                data[i].tags = data[i].tags.split(',');
                            }
                            this.data =  data;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            handleClick(){
                let params = this.getParams(1);
                this.getData(params);
            },
            getParams(current){
                let params = {
                    current: current
                }
                switch (this.activeName) {
                    case "hotSevenDay":
                        params.days = 7;
                        break;
                    case "hotMonth":
                        params.days = 30;
                        break;
                    case "hotHistory":
                        params.sort = true;
                        break;
                    case"noReply":
                        params.noReply = true;
                        break;
                }
                return params;
            }
        }
    }
</script>

<style scoped>
    .vue-avatar--wrapper{
        margin-right: 20px;
    }
    .text {
        font-size: 14px;
    }

    .card-item:hover{
        cursor: pointer;
        background-color: rgba(128,138,135,0.1);
    }
</style>