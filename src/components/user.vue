<template>
    <div id="poster">
        <div class="main">
            <div class="user-home-page">
                <div class="bg">
                    <img src="@/assets/home_page_bg.jpg">
                </div>
                <div class="user-data" v-if="!editable">
                    <el-card :body-style="{ padding: '20px',display:'flex' }">
                        <Avatar  :username="user.username"
                                 :src="user.avatar"
                                 background-color="#ccc"
                                 color="#fff"
                                 :size = 235
                                 :inline="true"
                                 :rounded="false"
                        >
                        </Avatar>
                        <div style="padding: 14px; flex: 1; display: flex;flex-direction:column;justify-content: center;">
                            <p v-if="isMyself" @click="toggleEditPancel"><span class="right el-icon-edit edit-btn"></span></p>
                            <p class="username">{{user.username}}</p>
                            <p><span class="el-icon-chat-round"></span>{{user.email}}</p>
                        </div>
                    </el-card>
                </div>

                <el-tabs v-if="!editable" type="border-card" @tab-click="handleClick" v-model="activeName">
                    <el-tab-pane name="post">
                        <span slot="label"><i class="el-icon-question"></i>
                            {{isMyself?'我':'TA'}}的提问
                        </span>
                        <div v-if="postData.data" class="question-item-container">
                            <div v-for="post in postData.data" :key="post.id" class="question-item">
                                <el-link :href="`http://112.124.17.27/#/question/${post.id}`" type="primary" :underline="false">{{post.title}}</el-link>
                                <span class="desc">回复({{post.commentCount}})</span>
                                <span class="right desc">{{moment(post.created).subtract(10, 'days').calendar()}}</span>
                            </div>
                            <el-pagination
                                    class="pagination"
                                    background
                                    layout="prev, pager, next"
                                    @current-change="handleCurrentChange"
                                    :currentPage="postData.currentPage"
                                    :page-count="postData.totalPage">
                            </el-pagination>
                        </div>
                        <div v-else class="empty-state-container" style="text-align: center">
                            <img src="@/assets/emptyState.png" class="img"/>
                            <p><el-link type="danger">
                                {{isMyself?'你':'他'}}暂时还没有发布问题{{isMyself?'，快去提问吧':''}}</el-link></p>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane name="reply" label="我的回复" v-if="isMyself">
                        <div v-if="replyData.data" class="reply-item-container">
                            <div v-for="reply in replyData.data" :key="reply.id" class="reply-item">
                                <div class="reply-item-left">
                                    <img src="@/assets/reply.png">
                                </div>
                                <div class="reply-item-right">
                                    <div class="item-right-top">
                                        <div class="intro">
                                            <div class="title">
                                                <el-link type="primary">{{user.username}}</el-link>
                                                <span>{{reply.type == 1?'回复':'评论'}}</span>
                                            </div>
                                            <div class="value">{{moment(reply.created).subtract(10, 'days').calendar()}}</div>
                                        </div>
                                        <div class="content">
                                            <i class="iconfont icon-baojiaquotation2"></i>
                                                {{reply.commentText}}
                                            <i class="iconfont icon-baojiaquotation"></i>
                                        </div>
                                    </div>
                                    <div class="item-right-bottom">
                                        <el-link :href="`http://112.124.17.27/#/question/${reply.post.id}`" type="primary" :underline="false">
                                            {{reply.post.title}}
                                        </el-link>
                                        <span>回复({{reply.post.commentCount}})</span>
                                    </div>
                                </div>
                            </div>
                            <el-pagination
                                    class="pagination"
                                    background
                                    layout="prev, pager, next"
                                    @current-change="handleCurrentChange"
                                    :currentPage="replyData.currentPage"
                                    :page-count="replyData.totalPage">
                            </el-pagination>
                        </div>
                        <div v-else class="empty-state-container" style="text-align: center">
                            <img src="@/assets/emptyState.png" class="img"/>
                            <p><el-link type="danger">您暂时还没有评论快去评论吧</el-link></p>
                        </div>

                    </el-tab-pane>
                </el-tabs>
                <el-card v-else >
                    <div class="edit-container">
                        <h2>修改个人资料<i class="iconfont icon-return right" @click="toggleEditPancel"></i></h2>

                        <h3>头像</h3>
                        <div class="alter-avatar-container">
                            <img v-if="imageUrl!=null" :src="imageUrl" class="avatar">
                            <el-upload class="avatar-uploader"
                                       action="#"
                                       :show-file-list="false"
                                       :before-upload="beforeAvatarUpload"
                                       :http-request="uploadImg">
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>

                        <el-form :rules="rule" :model="form" ref="form">
                            <h3>用户名</h3>
                            <el-form-item prop="username">
                                <el-input placeholder="请输入用户名" v-model="form.username" prefix-icon="el-icon-s-custom"></el-input>
                            </el-form-item>

                            <el-form-item style="width: 100%">
                                <el-button type="primary" style="width: 100%;border: none" v-on:click="editProfile">更新个人资料</el-button>
                            </el-form-item>
                        </el-form>

                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import Avatar from "vue-avatar";
    export default {
        name: "user",
        components: { Avatar},
        data(){
            return{
                postData:{
                    currentPage:1,
                    data:null
                },
                replyData:{
                    currentPage:1,
                    data:null
                },
                user:null,
                isMyself:false,
                imageUrl: null,
                editable:false,
                form:{
                    username:'',
                    avatar:''
                },
                getCodeLoading:false,
                rule: {
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
                        {
                            required: true,
                            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
                            message: '姓名不支持特殊字符',
                            trigger: 'blur'
                        }]
                },
                activeName:'post'
            }
        },
        mounted: function () {
            this.loadUserInfo();
            this.loadPosts(1);
            this.loadReply(1);
            //判断用户
            this.$axios
                .post(`/isMyself/${this.$route.params.id}`,{
                    token:localStorage.getItem('token')
                })
                .then(successResponse=>{
                    console.log(successResponse);
                    if(successResponse.data.rspCode==200){
                        this.isMyself = true;
                    }
                })
        },
        methods:{
            loadPosts(currentPage){
                this.$axios
                    .get(`/post/${this.$route.params.id}/${currentPage}`,{
                        token:localStorage.getItem('token')})
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                            let postData = successResponse.data.data;
                            let posts = postData.data;
                            for(let i = 0;i<posts.length;i++)
                                posts[i].tags = posts[i].tags.split(';');
                            this.postData.totalPage = postData.totalPage;
                            this.postData.data = posts;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            loadReply(currentPage){
                this.$axios
                    .get(`/comment/getReply/${this.$route.params.id}/${currentPage}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                            let replyData = successResponse.data.data;
                            this.replyData.data = replyData.data;
                            this.replyData.totalPage = replyData.totalPage;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            loadPancelData(val){
                switch (this.activeName) {
                    case "post":
                        this.loadPosts(val);
                        break;
                    case "reply":
                        this.loadReply(val);
                }
            },
            handleCurrentChange(val) {
                this[`${this.activeName}Data`].currentPage = val;
                this.loadPancelData(val);
            },
            handleClick() {
                this.loadPancelData(1);
            },
            deletePost(id){
                this.$axios
                    .delete(`/post/${id}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode == 200){
                            this.$message("删除成功");
                            let data = this.data;
                            for(var i = 0; i < data.length; i++)
                            {
                                if ( data[i].id == id) {
                                    data.splice(i, 1);
                                }
                            }
                            this.data =  data;
                        }
                    })
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            uploadImg (f) {
                console.log(f)
                var formdata = new FormData();
                formdata.append('image', f.file);
                this.$axios({
                    url: '/post/uploadImg',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((successResponse) => {
                    console.log(successResponse);
                    this.imageUrl = successResponse.data.data;
                })

            },
            toggleEditPancel(){
                this.editable = !this.editable;
                this.form.username = this.user.username || '';
                this.form.avatar = this.user.avatar || '';
            },
            loadUserInfo(){
                this.$axios
                    .get(`/getUserInfo/${this.$route.params.id}`)
                    .then(successResponse=>{
                        console.log(successResponse);
                        console.log(successResponse.data.data);
                        if(successResponse.data.rspCode==200){
                            this.user = successResponse.data.data;
                        }
                    })
            },
            editProfile(){
                let form = this.form;
                form.avatar = this.imageUrl
                form.token = localStorage.getItem('token');
                this.$axios
                    .post('/editProfile',form)
                    .then((successResponse) => {
                        console.log(successResponse);
                        this.editable = false;
                        this.loadUserInfo();
                    })

            }
        }
    }
</script>

<style lang="stylus" scoped>
    .bg
        img
            height 300px
            width 100%

    .user-data
        margin-top -50px
        .username
            font-size 30px
            font-weight bold
        .edit-btn
            cursor pointer
    .question-item-container
        .question-item
            padding 10px 0
            border-bottom 2px dashed #eee
            .el-link
                margin-right 5px
            .desc
                font-size 12px
                color #7f7f7f
    .reply-item-container
        .reply-item
            display flex
            padding 14px 15px
            border-bottom 2px dashed #eee
            .reply-item-left
                margin-right 20px
            .reply-item-right
                flex 1
                .item-right-top
                    .intro
                        display flex
                        justify-content space-between
                        font-size 14px
                        margin-bottom 6px
                        .title
                            .el-link
                                margin-right 4px
                                vertical-align middle
                            span
                                vertical-align middle
                    .content
                        font-size 12px
                        margin-bottom 10px
                .item-right-bottom
                    position relative
                    padding 14px 15px
                    border-radius 4px
                    background-color #fafafa
                    font-size 12px
                    .el-link
                        font-size 12px
                        vertical-align middle
                    span
                        vertical-align middle
                    &:after
                        content ''
                        width: 0;
                        height: 0;
                        border: 8px solid transparent;
                        border-bottom-color: #fafafa;
                        position: absolute;
                        top -16px
                        left 8px

    .edit-container
        width 60%
        margin 0 auto
        .alter-avatar-container
            display flex
            .avatar-uploader
                .avatar-uploader-icon
                    font-size: 28px;
                    color: #8c939d;
                    width: 178px;
                    height: 178px;
                    line-height: 178px;
                    text-align: center;
                    border 1px dashed #d9d9d9
                    border-radius 6px
                    cursor pointer
                    position relative
                    overflow hidden
                &:hover
                    border-color: #409EFF;
            .avatar
                width 178px
                height 178px
                display block
                margin-right 20px
        .icon-return
            cursor pointer
    .empty-state-container
        text-align center
        img
            height 200px
</style>