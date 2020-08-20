<template>
    <div id="#poster">
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
                                <div class="notif-item-container">
                                    <div class="notif-item" v-for="notif in data" :key="notif.id">
                                        <div class="cell">
                                            <div class="cell-left">
                                                <span v-if="notif.comment.type == 1">{{notif.comment.userInfo.username }}:</span>
                                                <span v-else>{{notif.comment.userInfo.username }} 回复 {{notif.comment.parentUserInfo.username }}:</span>
                                                <span>{{ notif.comment.commentText}}</span>
                                            </div>
                                            <div class="cell-right">
                                                <span class="right">{{moment(notif.created).format('MM-DD, h:mm:ss a')}}</span>
                                            </div>
                                        </div>
                                        <div class="cell">
                                            <div class="cell-left">
                                                <span>回复我的主题："<router-link :to="`/#/question/${notif.post.id}`" @click.native="updateStatus(notif.id,notif.post.id)">{{notif.post.title}}</router-link>"</span>
                                            </div>
                                            <div class="cell-right">
                                                <router-link :to="`/#/question/${notif.post.id}`" @click.native="updateStatus(notif.id,notif.post.id)"><span class="reply-btn el-icon-chat-dot-square right">回复</span></router-link>
                                                <span class="el-icon-delete right del-btn" @click="deletNotif(notif.id)">删除</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="totalPage<1" class="empty-state-container" style="text-align: center">
                                    <img src="@/assets/emptyState.png" class="img"/>
                                    <p><el-link type="danger">暂时还没有回复噢～</el-link></p>
                                </div>
                            </el-tab-pane>
                        </el-tabs>

                        <el-pagination
                                class="pagination"
                                background
                                layout="prev, pager, next"
                                @current-change="handleCurrentChange"
                                :currentPage="currentPage"
                                :page-count="totalPage">
                        </el-pagination>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <Clock></Clock>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Clock from "@/components/Clock";

    export default {
        name: "replies",
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
        components: {Clock},
        methods:{
            getData(){
                console.log(this.state);
                console.log(this.currentPage);
                this.$axios
                    .get(`/notification/${this.state}/${this.currentPage}`)
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
            },
            updateStatus(nid,pid){
                this.$axios
                    .get(`/notification/updateStatus/${nid}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        this.$router.app.$emit('readNotif');
                        this.$router.push(`/question/${pid}`);
                        return false;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            deletNotif(id){
                this.$axios
                    .delete(`/notification/${id}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                           this.$message("删除成功");
                        }
                    })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .notif-item
        padding 5px
        width 100%
        .cell
            display flex
            justify-content space-between
            margin-bottom 5px
        .del-btn
            margin-right 5px
            cursor pointer
            visibility hidden
        &:hover
            background-color rgba(128,138,135,0.1);
            .del-btn
                visibility visible
        .reply-btn
            color #2c3e50
    .empty-state-container
        text-align center
        img
            height 200px
</style>