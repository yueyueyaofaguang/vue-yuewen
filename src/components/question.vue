<template>
    <div id="#poster">
        <div class="main">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <div class="post-container">
                            <h3>
                                {{post.title}}
                            </h3>
                            <p class="desc">
                                <span class="text">发布于：{{ moment(post.created).format('lll') }} | 阅读数：{{post.readCount}} | 评论数：{{post.commentCount}}</span>
                                <el-link v-show="hasLogin && user && post.uid == user.id" type="primary" :underline="false" v-on:click="deletePost(post.id)">
                                    删除
                                </el-link>
                            </p>
                            <mavon-editor
                                    class="md"
                                    :value="post.content"
                                    :subfield = "false"
                                    :defaultOpen = "'preview'"
                                    :toolbarsFlag = "false"
                                    :editable="false"
                                    :scrollStyle="true"
                                    :ishljs = "true"
                            />
                            <p class="card-item-tags clearfix">
                                <el-tag type="success" v-for="tag in post.tags" :key="tag" >{{tag}}</el-tag>
                            </p>
                        </div>

                        <div class="comment-container">
                            <h3>{{post.commentCount}}个回复</h3>
                            <CommentItem v-for="comment in comments" :key="comment.id"  :post-id="post.id" :comment-data="comment" @comment="loadComments" @del="deleteComment"></CommentItem>

                            <el-pagination
                                    class="pagination"
                                    background
                                    layout="prev, pager, next"
                                    @current-change="handleCurrentChange"
                                    :currentPage="currentPage"
                                    :page-count="totalPage">
                            </el-pagination>
                        </div>

                        <div class="reply-container">
                            <h3>提交评论</h3>
                            <div v-if="hasLogin && user">
                                <Item v-if="user"
                                      :username="user.username"
                                      :avatar="user.avatar"
                                      :uid="user.id"
                                      :bottom="false"
                                      :avatar-round="true"
                                      title="评论人"
                                >
                                    <span slot="content" v-if="user">{{user.username}}</span>
                                </Item>
                                <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                                    <el-input
                                            type="textarea"
                                            :autosize="{ minRows: 6, maxRows: 8}"
                                            placeholder="请输入内容"
                                            v-model="value"
                                    >
                                    </el-input>
                                    <el-button icon="el-icon-edit" class="btn-write-comment right" @click="reply">写评论</el-button>
                                </div>
                            </div>
                            <div v-else class="tip">
                                <el-link type="primary" href="http://112.124.17.27/#/login.html"><span class="el-icon-water-cup"></span>嘟噜噜！温馨提醒：登录后才能评论！</el-link>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content bg-purple">
                        <Clock></Clock>

                        <div>
                           <h3>发起人</h3>
                            <Item :username="post.userBases.username"
                                  :avatar="post.userBases.avatar"
                                  :id = "post.userBases.id"
                                  :bottom="false"
                                  :avatar-round="true"
                            >
                                <span slot="content">{{post.userBases.username}}</span>
                            </Item>
                       </div>

                        <div>
                            <h3>相关问题</h3>
                            <ul>
                                <li v-for="post in relativePost" :key="post.id">
                                    <el-link :href="`http://112.124.17.27/#/question/${post.id}`" target="_blank">
                                       {{post.title}}
                                    </el-link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import CommentItem from '@/components/common/CommentItem';
    import Item from "@/components/common/Item";
    import Clock from "@/components/Clock";

    export default {
        name: "question",
        components: {CommentItem,Clock,Item},
        data() {
            return {
                post:null,
                comments:[],
                value:'',
                loading:false,
                currentPage:1,
                user:null,
                relativePost:[],
                totalPage:null,
                hasLogin:false
            }
        },
        mounted:function () {
            //增加阅读数量
            this.$axios(`/post/addReadCount/${this.$route.params.id}`)
                .then(sucessResponse=>{
                    console.log("增加阅读量");
                    if(sucessResponse.data.rspCode==200){
                        console.log(sucessResponse);
                        //获取文章数据
                        this.loadPost();
                    }
                })

            this.loadComments();
            //获取用户数据
            this.loadUserInfo();
        },
        methods: {
            reply(){
                this.loading = true;
                this.$axios
                    .post(`/comment/${this.post.id}`,{
                        commentText:this.value,
                        parentId:this.post.id,
                        token:localStorage.getItem('token'),
                        type:1
                    })
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            this.loading = false;
                            this.$notify({
                                title: '成功',
                                message: '发布成功',
                                type: 'success'
                            });
                            this.value = '';
                        }
                        this.loadComments();
                        this.loadPost();
                    })
            },
            loadComments(){
                this.$axios
                    .get(`/comment/${this.$route.params.id}`,{params:{current:this.currentPage}})
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            this.totalPage = successResponse.data.data.totalPage;
                            this.comments = successResponse.data.data.data;
                        }
                        this.loadPost();
                    })
            },
            loadUserInfo() {
                if(localStorage.getItem('token')) {
                    this.hasLogin = true;
                    this.$axios
                        .post('/getUserInfo', {
                            token: localStorage.getItem('token')
                        })
                        .then(sucessResponse => {
                            if (sucessResponse.data.rspCode == 200) {
                                console.log("set user")
                                this.user = sucessResponse.data.data;
                            }
                        })
                }
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.loadComments();
            },
            loadPost(){
                this.$axios
                    .get( `/post/${this.$route.params.id}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            this.post = successResponse.data.data;
                            this.post.tags = this.post.tags.split(';');
                            this.loadRelative(this.post.tags[0],this.post.id);
                        }
                    })
            },
            loadRelative(text,id){
                this.$axios
                    .get('/post/getRelative',
                        {params:{
                            searchText:text,
                            id:id
                        }}
                    )
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            this.relativePost = successResponse.data.data;
                        }
                    })
            },
            deletePost(id){
                this.$confirm('此操作将永久删除该问题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .delete(`/post/${id}`)
                        .then(successResponse=>{
                            console.log(successResponse);
                            if(successResponse.data.rspCode == 200){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.$router.replace({
                                    path: '/index',
                                    replace:false
                                })
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteComment(){
                console.log("删除评论啦")
                this.loadPost();
                this.loadComments();
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .post-container
        .desc
            margin-bottom 10px
            .text
                vertical-align middle
                margin-right: 10px;
        .v-note-wrapper
            margin-bottom 10px
    .reply-container
        .item
            border none
            margin 0 px
            >>>.item-top
                padding 0 0 10px 0
        .el-textarea
            margin-bottom 10px
        .tip
            text-align center
            font-size 16px
</style>