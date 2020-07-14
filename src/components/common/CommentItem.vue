<template>
    <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="comment-item">
            <Avatar  :username="commentData.userInfo.username"
                     :src="commentData.userInfo.avatar"
                     background-color="#ccc"
                     color="#fff"
                     style=" vertical-align: middle;border-radius: 4px;"
                     :inline="true"
                     :rounded="false"
            >
            </Avatar>
            <div class="comment-item-tr">
                <p>{{commentData.userInfo.username}}</p>
                <p>{{commentData.commentText}}</p>
            </div>
        </div>
        <div class="comment-item-bottom">
            <p class="el-icon-s-comment replySubBtn" @click="boxshow = !boxshow">{{ commentData.subComments.length }}条回复</p>
            <transition name="draw">
                <el-card class="box-card" v-show="boxshow">
                <div class="sub-item-container" >
                    <div class="comment-item sub-item" v-for="comment in commentData.subComments" :key="comment.id">
                        <Avatar  :username="commentData.userInfo.username"
                                 :src="commentData.userInfo.avatar"
                                 background-color="#ccc"
                                 color="#fff"
                                 style=" vertical-align: middle;border-radius: 4px;"
                                 :inline="true"
                                 :rounded="false"
                        >
                        </Avatar>
                        <div class="comment-item-right">
                            <p class="content">
                                <span v-if="comment.parentId == commentData.id">{{comment.userInfo.username }}:</span>
                                <span v-else>
                                     {{comment.userInfo.username }} 回复 {{comment.parentUserInfo.username }}:
                                </span>
                                <span>{{ comment.commentText}}</span>
                            </p>

                            <p>
                                <span class="el-icon-chat-dot-square replyBtn right" @click="replySubComment(comment.userInfo.username,comment.id)">回复</span>
                                <span class="right">{{ moment(comment.created).format('YYYY-MM-DD h:mm:ss') }}</span>
                            </p>
                        </div>
                    </div>
                </div>
                    <el-button type="primary" class="right sub-comment-btn" @click="replyComment(commentData.id)">我也说一句</el-button>

                    <div v-show="replyIpt">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                :placeholder="placeholder"
                                v-model="value"
                                class="sub-comment-ipt"
                        >
                        </el-input>
                        <el-button type="primary" class="right sub-comment-btn" @click="reply">提交</el-button>
                    </div>
            </el-card>
            </transition>
        </div>
    </div>
</template>

<script>
    import Avatar from "vue-avatar";
    export default {
        name: "commentItem",
        props: ['commentData', 'postId']
        ,
        components: {Avatar},
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

            }
        }
    }
</script>

<style scoped>
    .box{
        height:200px;width: 200px;
        background-color:black;
    }
    .draw-enter-active, .draw-leave-active {
        transition: all 1s ease;
    }
    .draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
        height: 0;
    }



    /*new*/
    .comment-item{
        display: flex;
        padding:5px;
    }

    .comment-item p{
        margin:0
    }

    .comment-item-right{
        flex:1;
    }

    .vue-avatar--wrapper{
        flex-shrink: 0;
        margin-right: 10px;
    }

    .comment-item .content{
        margin-bottom: 5px;
        word-break: break-all;
        white-space: normal;
    }

    .replyBtn{
        cursor: pointer;
        margin-left: 8px;
        line-height: inherit;
    }

    .sub-item-container,
    .sub-comment-ipt{
        margin-bottom: 10px;
    }

    .sub-item:hover{
        background-color: rgba(0,0,0,0.1);
    }

    .el-button--primary{
        margin-bottom: 10px;
    }

    .replySubBtn{
        cursor: pointer;
    }
</style>