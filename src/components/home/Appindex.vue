<template>
    <div id="poster">
        <div class="main">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <h3 class="main-title"><span class="iconfont icon-zhedie"></span>首页</h3>

                        <el-input v-model="searchText" placeholder="搜索问题" @keyup.enter.native = "search(1)" clearable></el-input>

                        <el-tabs v-model="activeName" @tab-click="handleClick" class="index-tab">
                            <el-tab-pane v-for="tab in tabPane"
                                         :key="tab.label" :label="tab.label" :name="tab.name" >

                                <el-card class="box-card"  v-if="totalPage>0">
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
                                <el-card class="box-card" style="text-align: center" v-else>
                                    <img src="src/assets/emptyState.png" class="empty-state-img"/>
                                    <p><el-link type="danger">暂时没有找到你想问的问题，你来创建一个？</el-link></p>
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
                        <div v-if="todayOnHistory">
                            <h3>历史上的今天</h3>
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="todayOnHistory.eventDetail.picUrl[0].url" class="image">
                                <div style="padding: 14px;text-align: center">
                                    <span class="history-title">{{todayOnHistory.title}}</span>
                                    <div class="bottom clearfix">
                                        <time class="time">{{ todayOnHistory.date }}</time>
                                        <p class="history-content">{{todayOnHistory.eventDetail.content}}</p>
                                        <el-button type="text" class="button" @click="viewMore">view more</el-button>
                                    </div>
                                </div>
                            </el-card>
                        </div>

                        <div class="clearfix">
                            <h3>热门标签</h3>
                            <el-tag type="danger" v-for=" tag in hotTags" :key="tag.name" class="hotTag" @click="search(2,tag.name)"><span class="el-icon-sugar"></span>{{tag.name}}</el-tag>
                        </div>

                        <div>
                            <h3>联系站长</h3>
                            <img src="src/assets/weixin.png" class="image">
                            <p class="my-desc">今天天气很好，你也很可爱，那么你想跟我做朋友吗</p>
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
                ],
                searchText:'',
                hotTags:[],
                todayOnHistory:null,
                totalPage:null
            };
        },
        mounted: function () {
            this.getData({current:1});
            this.$axios
                .get('/post/getHotTags')
                .then(successResponse=>{
                    if (successResponse.data.rspCode == 200)
                        this.hotTags = successResponse.data.data;
                });
            this.$axios
                .get('/todayInHistory/')
                .then(successResponse=>{
                    if(successResponse.data.rspCode == 200){
                        this.todayOnHistory = successResponse.data.data;
                    }
                })
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
                                data[i].tags = data[i].tags.split(';');
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
                    current: current,
                    searchText: this.searchText
                };
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
            },
            search(type,val){
                if(type == 2) this.searchText = val;
                let params = {
                    current: 1,
                    searchText: type== 2? val:this.searchText
                };
                this.getData(params);
            },
            viewMore(){
                const h = this.$createElement;
                this.$msgbox({
                    title: '历史上的今天',
                    message: h('div', {style:'max-height: 450px;overflow: scroll;'},this.processContent(this.todayOnHistory.eventDetail.content))
                })
            },
            processContent(content){
                const h = this.$createElement;
                let list =[];
                let strings = content.trim().split(/\s+/);
                for (let i = 0; i < strings.length; i++) {
                    list.push(h('p',{style:'text-indent:2em;'},strings[i]));
                }
                return list;
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

    .search-container{
        display: flex;
    }

    .hotTag{
        cursor: pointer;
    }

    .image{
        max-height: 350px;
    }

    .history-title{
        font-weight: bold;
    }
    .history-content{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
    }

    .empty-state-img{
        height: 200px;
    }

    .empty-state-container,.my-desc{
        text-align: center;
    }

</style>