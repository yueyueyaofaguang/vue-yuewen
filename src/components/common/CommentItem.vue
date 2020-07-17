<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="comment-item-top">
            <Item :username="commentData.userInfo.username"
                  :avatar="commentData.userInfo.avatar"
                  :title="commentData.userInfo.username"
                  :uid="commentData.userInfo.id"
                  :time="moment(commentData.created).format('YYYY-MM-DD, hh:mm:ss')"
                  :path="`/user/${commentData.userInfo.id}`"
            >
                <span slot="content">{{commentData.commentText}}</span>
                <div slot="item-bot">
                    <span class="el-icon-s-comment right" @click="boxshow = !boxshow">{{ commentData.subComments.length }}条回复</span>
                    <span v-show="commentData.userInfo.id ==commentData.uid" class="el-icon-delete right" @click="deleteComment(commentData.id)">删除</span>
                </div>
            </Item>
        </div>
        <transition name="draw">
        <div class="comment-item-bottom">
            <el-card class="box-card" v-show="boxshow">
            <div class="sub-item-container" >
                <Item v-for="comment in commentData.subComments"
                      :key="comment.id"
                      :username="comment.userInfo.username"
                      :avatar="comment.userInfo.avatar"
                      :bubble="true"
                >
                    <p class="content" slot="content">
                        <el-link :href="`http://localhost:8080/user/${comment.userInfo.id}`" v-if="comment.parentId == commentData.id" :underline="false"><span>{{comment.userInfo.username }}:</span></el-link>
                        <span v-else>
                            <el-link :href="`http://localhost:8080/user/${comment.userInfo.id}`" :underline="false">{{comment.userInfo.username }}</el-link>
                                <span class="commentText">回复</span>
                            <el-link :href="`http://localhost:8080/user/${comment.parentUserInfo.id}`" :underline="false">{{comment.parentUserInfo.username }}</el-link>:
                        </span>
                        <span class="commentText">{{ comment.commentText}}</span>
                    </p>
                    <p slot="item-bot">
                        <span>{{moment(comment.created).format('YYYY-MM-DD, hh:mm:ss')}}</span>
                        <span class="el-icon-chat-dot-square replyBtn right" @click="replySubComment(comment.userInfo.username,comment.id)">回复</span>
                    </p>
                </Item>
            </div>
                <el-button type="primary" class="right" @click="replyComment(commentData.id)">我也说一句</el-button>

                <div v-show="replyIpt">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            :placeholder="placeholder"
                            v-model="value"
                    >
                    </el-input>
                    <el-button type="primary" class="right" @click="reply">提交</el-button>
                </div>
            </el-card>
        </div>
        </transition>
    </div>
</template>

<script>
    import Item from "@/components/common/Item";
    export default {
        name: "commentItem",
        props: ['commentData', 'postId']
        ,
        components: {Item},
        data(){
            return{
                boxshow:false,
                replyIpt:false,
                placeholder:'',
                value:'',
                replyToId:null,
                loading:false
            }
        },
        methods:{
            replySubComment(username,id){
                this.value = '';
                this.replyIpt = true;
                this.placeholder = `回复用户${username} :`;
                this.replyToId = id;
            },
            replyComment(id){
                this.value = '';
                this.replyIpt = true;
                this.placeholder = '';
                this.replyToId = id;
            },
            reply(){
                this.loading = true;
                this.$axios
                    .post(`/comment/${this.$props.postId}`,{
                        commentText:this.value,
                        parentId:this.replyToId,
                        token:localStorage.getItem('token'),
                        type:2
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
                            this.replyToId = null;
                            this.placeholder = '';
                        }
                        this.$emit('comment');
                    })

            },
            deleteComment(id){
                this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios
                        .delete(`/comment/${id}`)
                        .then(successResponse=>{
                            console.log(successResponse);
                            if(successResponse.data.rspCode == 200){
                                console.log("删除评论成功");
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.$emit('del');
                            }
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .comment-item-top
        .item
            margin-bottom 8px

        .el-icon-delete
            margin-right 5px
            cursor pointer
        .el-icon-s-comment
            cursor pointer
    .comment-item-bottom
        .el-card
            margin-left 5%
            margin-bottom 10px
        .el-button
            margin-bottom 10px
        .el-textarea
            margin-bottom 10px
        .commentText
            vertical-align middle


    .draw-enter-active
    .draw-leave-active
        transition all 1s ease

    .draw-enter
    .draw-leave-to
        height: 0
</style>