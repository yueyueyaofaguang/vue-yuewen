<template>
    <div id="poster">
        <div class="main">
            <div class="user-home-page">
                <div class="bg">
                    <img src="src/assets/home_page_bg.jpg" class="img-home-page">
                </div>
                <div class="user-data" v-if="!editable">
                    <el-card :body-style="{ padding: '20px',display:'flex' }">
<!--                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">-->
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
                <el-card class="box-card">
                    <div  v-if="!editable" class="question-container">
                        <h3 class="main-title">
                            <span class="iconfont icon-tiwen"></span>
                            {{ isMyself? "我的提问":"ta的提问" }}
                        </h3>
                        <div class="text item">
                            <div class="card-item" v-for="post in data" :key="post.id">
                                <div class="card-item-content">
                                    <h3>{{post.title}}<span class="el-icon-delete right del-btn" v-on:click="deletePost(post.id)">删除</span></h3>

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
                        </div>

                        <el-pagination
                                id="pagination"
                                background
                                layout="prev, pager, next"
                                @current-change="handleCurrentChange"
                                :currentPage="currentPage"
                                :page-count="totalPage">
                        </el-pagination>
                    </div>

                    <div v-else class="edit-container" >
                        <h2>头像</h2>

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

                            <h2>用户名</h2>
                            <el-form-item prop="username">
                                <el-input placeholder="请输入用户名" v-model="form.username" prefix-icon="el-icon-s-custom"></el-input>
                            </el-form-item>

                            <el-form-item style="width: 100%">
                                <el-button type="danger" style="width: 100%;background: #505458;border: none" v-on:click="editProfile">更新个人资料</el-button>
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
        components: {Avatar},
        data(){
            return{
                data:null,
                currentPage:1,
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
                }
            }
        },
        mounted: function () {
            this.loadUserInfo();
            this.loadPosts();
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
            loadPosts(){
                this.$axios
                    .get(`/post/${this.$route.params.id}/${this.currentPage}`,{
                        token:localStorage.getItem('token')})
                    .then(successResponse=>{
                        console.log(successResponse);
                        if(successResponse.data.rspCode==200){
                            let data = successResponse.data.data.data;
                            this.totalPage = successResponse.data.data.totalPage;
                            for (let i = 0; i < data.length; i++) {
                                data[i].tags = data[i].tags.split(',');
                            }
                            this.data =  data;
                            this.user = data[0].userBases;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.loadPosts();
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
                this.editable = true;
                this.form.username = this.user.username;
                this.form.avatar = this.user.avatar;
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

<style scoped>
    .user-data{
        margin-top: -50px;
    }

    .img-home-page{
        height: 300px;
        width: 100%;
    }

    .card-item:hover{
        cursor: pointer;
        background-color: rgba(128,138,135,0.1);
    }

    .del-btn{
        font-size: 14px;
        visibility: hidden;
    }

    .card-item:hover .del-btn{
        visibility: visible;
    }

    /*/avatr*/
    .avatar{
        height: 235px;
        width: 235px;
    }
    .edit-container{
        width: 60%;
        margin: 0 auto;
    }

    .alter-avatar-container{
        display: flex;
    }

    .avatar-uploader .avatar-uploader-icon{
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .avatar-uploader-icon:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        margin-right: 20px;
    }
    /*//user*/
    .username{
        font-size: 30px;
        font-weight: bold;
    }

    .edit-btn{
        cursor: pointer;
    }
</style>