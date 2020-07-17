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
                                <div v-if="totalPage>0">
                                        <Item v-for="post in data"
                                              :key="post.id"
                                              :uid="post.userBases.id"
                                              :username="post.userBases.username"
                                              :avatar="post.userBases.avatar"
                                              :title="post.title"
                                              :time="moment(post.created).format('YYYY-MM-DD, hh:mm:ss')"
                                              :path="`/question/${post.id}`"
                                        >
                                            <p slot="content">
                                                <span>{{post.commentCount }}个评论数</span>
                                                <span>{{post.readCount}}次浏览</span>
                                            </p>
                                            <div slot="item-bot">
                                                <el-tag type="danger" v-for="tag in post.tags" :key="tag">{{tag}}</el-tag>
                                            </div>
                                        </Item>
                                        <el-pagination
                                                class="pagination"
                                                background
                                                layout="prev, pager, next"
                                                @current-change="handleCurrentChange"
                                                :currentPage="currentPage"
                                                :page-count="totalPage">
                                        </el-pagination>
                                </div>
                                <div class="empty-state-container" style="text-align: center" v-else>
                                    <img src="../../../static/img/emptyState.png" class="-img"/>
                                    <p><el-link type="danger">暂时没有找到你想问的问题，你来创建一个？</el-link></p>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <div class="todayOnHistory" v-if="todayOnHistory">
                            <h3>历史上的今天</h3>
                            <el-card :body-style="{ padding: '0px' }">
                                <img :src="todayOnHistory.eventDetail.picUrl[0].url">
                                <div style="padding: 14px;text-align: center">
                                    <span class="title">{{todayOnHistory.title}}</span>
                                    <div class="bottom clearfix">
                                        <time class="time">{{ todayOnHistory.date }}</time>
                                        <p class="content">{{todayOnHistory.eventDetail.content}}</p>
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
                            <img src="../../../static/img/weixin.png" class="image">
                            <p class="my-desc">今天天气很好，你也很可爱，那么你想跟我做朋友吗 &#62;&#60;</p>
                            <p class="my-desc">如果你的答案是YES,那请打开微信吧</p>
                        </div>

                    </div>
                </el-col>
            </el-row>
          </div>
    </div>
</template>

<script>
   import Item from "@/components/common/Item";
    export default {
        name: "Appindex",
        components: {Item},
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
            handleClick(){
                let params = this.getParams(1);
                console.log(params);
                this.getData(params);
            },
            search(type,val){
                if(type == 2) this.searchText = val;
                let params = {
                    current: 1,
                    searchText: type== 2? val:this.searchText
                };
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

<style lang="stylus" scoped>
    .todayOnHistory
        img
            width 100%
            max-height 250px
        .title
            font-weight bold
        .content
            overflow hidden
            text-overflow ellipsis
            display -webkit-box
            -webkit-line-clamp 4
            line-clamp 4
            -webkit-box-orient vertical

    .empty-state-container
        text-align center
        img
            height 200px

    .hotTag
        pointer()

    .my-desc
        text-align center
</style>