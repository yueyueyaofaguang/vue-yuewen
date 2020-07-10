<template>
    <div id="#poster">
        <NavMenu></NavMenu>
        <div class="main">
            <el-row :gutter="20">
                <el-col :span="16">
                    <div class="grid-content bg-purple">
                        <h3>
                            {{post.title}}
                        </h3>
                        <p>发布于：{{ moment(post.created).format('lll') }} | 阅读数：{{post.readCount}} | 评论数：{{post.commentCount}}</p>
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

                        <h3>{{post.commentCount}}个回复</h3>

                        <CommentItem v-for="comment in comments" :key="comment.id"  :post-id="post.id" :comment-data="comment" @comment="loadComments"></CommentItem>

                        <el-pagination
                                id="pagination"
                                background
                                layout="prev, pager, next"
                                @current-change="handleCurrentChange"
                                :currentPage="currentPage"
                                :page-count="totalPage">
                        </el-pagination>

                        <h3>提交评论</h3>
                        <div class="comment-item">
                            <div class="comment-item-top">
                                <Avatar  :username="user.username"
                                         :src="user.avatar"
                                         background-color="#ccc"
                                         color="#fff"
                                         style=" vertical-align: middle;border-radius: 4px;"
                                         :inline="true"
                                         :rounded="false"
                                >
                                </Avatar>
                                <div class="comment-item-tr">
                                    <p>评论人</p>
                                    <p>{{user.username}}</p>
                                </div>
                            </div>
                        </div>
                        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                            <el-input
                                    type="textarea"
                                    :autosize="{ minRows: 6, maxRows: 8}"
                                    placeholder="请输入内容"
                                    v-model="value"
                            >
                            </el-input>
                            <el-button type="primary" icon="el-icon-edit" circle class="btn-write-comment right" @click="reply"></el-button>
                        </div>
                    </div>
                </el-col>

                <el-col :span="8">
                    <div class="grid-content bg-purple">
                       <div>
                           <h3>发起人</h3>
                           <div class="comment-item">
                               <div class="comment-item-top">
                                   <Avatar  :username="post.userBases.username"
                                            :src="post.userBases.avatar"
                                            background-color="#ccc"
                                            color="#fff"
                                            style=" vertical-align: middle;border-radius: 4px;"
                                            :inline="true"
                                            :rounded="false"
                                   >
                                   </Avatar>
                                   <div class="comment-item-tr">
                                       <p>{{post.userBases.username}}</p>
                                       <p>个人描述</p>
                                   </div>
                               </div>
                           </div>
                       </div>

                        <div>
                            <h3>推荐阅读</h3>

                        </div>

                        <div>
                            <h3>相关问题</h3>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                            </ul>
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
    import CommentItem from '@/components/common/CommentItem';
    import Avatar from "vue-avatar";

    export default {
        name: "question",
        components: {Footer, NavMenu,Avatar,CommentItem},
        data() {
            return {
                post:null,
                comments:[],
                value:'',
                loading:false,
                currentPage:1,
                user:null
            }
        },
        mounted:function () {
            //获取文章数据
            this.$axios
                .get( `/post/${this.$route.params.id}`)
                .then(successResponse=>{
                    console.log(successResponse);
                    if(successResponse.data.rspCode == 200){
                        this.post = successResponse.data.data;
                        this.post.tags = this.post.tags.split(';');
                    }
                })
            this.loadComments();
            //获取用户数据
            this.$axios
                .post('/getUserInfo',{
                    token:localStorage.getItem('token')
                })
                .then(sucessResponse=> {
                    console.log("----user-----");
                    console.log(sucessResponse.data.data);
                    if (sucessResponse.data.rspCode == 200) {
                        console.log("set user")
                        this.user = sucessResponse.data.data;
                    }
                })
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
                    })
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.loadComments();
            }
        }
    }
</script>

<style scoped>
    .comment-item{
        padding: 5px;
    }

    .comment-item-top{
        display: flex;
    }

    .comment-item-top p{
        margin: 0;
    }

    .comment-item-top p:first-child{
        margin-bottom: 5px;
    }

    .comment-item-tr{
        padding-left: 10px;
        width: 100%;
    }

    .sub-item-container,
    .sub-comment-ipt{
        margin-bottom: 10px;
    }

    .btn-write-comment{
        margin-top: 10px;
    }
</style>