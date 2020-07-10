<template>
    <div id="poster">
        <NavMenu></NavMenu>
        <div class="main">
            <div class="user-home-page">
                <div class="bg">
                    <img src="../../static/img/home_page_bg.jpg" class="img-home-page">
                </div>
                <div class="user-data">
                    <el-card :body-style="{ padding: '20px',display:'flex' }">
                        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
                        <div style="padding: 14px; flex: 1; display: flex;flex-direction:column;justify-content: center;">
                            <p>{{user.username}}</p>
                            <p><span class="el-icon-chat-round"></span>{{user.email}}</p>
                        </div>
                    </el-card>
                </div>
                <el-card class="box-card">
                    <h3 class="main-title">
                        <span class="iconfont icon-tiwen"></span>
                        我的提问
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
                </el-card>
                <el-pagination
                        id="pagination"
                        background
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :currentPage="currentPage"
                        :page-count="totalPage">
                </el-pagination>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
    import Footer from "@/components/common/Footer";
    import NavMenu from "@/components/common/NavMenu";

    export default {
        name: "user",
        components: {Footer, NavMenu},
        data(){
            return{
                data:null,
                currentPage:1,
                user:null
            }
        },
        mounted: function () {
            this.getData();
        },
        methods:{
            getData(){
                this.$axios
                    .post(`/post/me/${this.currentPage}`,{
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
                            this.user = data[0].userGetDto;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
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
</style>