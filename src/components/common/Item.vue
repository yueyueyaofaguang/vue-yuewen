<template>
    <div class="item">
        <div class="item-top">
            <div class="item-top-left">
                <el-link :href="`http://112.124.17.27/#/user/${uid}`" :underline="false">
                <Avatar  :username="username"
                         :src="avatar"
                         background-color="#ccc"
                         color="#fff"
                         :customStyle="avatarClass"
                         :inline="true"
                         :rounded="avatarRound"
                />
                </el-link>
            </div>
            <div :class="[{ 'bubble': bubble }, 'item-top-rig']">
                <div class="intro">
                    <router-link :to="path"><div class="title">{{title}}</div></router-link>
                    <div class="value">{{time}}</div>
                </div>
                <div class="content">
                    <slot name="content"></slot>
                </div>
            </div>
        </div>
        <div class="item-bot clearfix" v-if="bottom">
            <slot name="item-bot" class="item-bot clearfix"></slot>
        </div>
    </div>
</template>

<script>
    import Avatar from "vue-avatar";

    export default {
        name: "item",
        components: {Avatar},
        data(){
            return{
                avatarClass:{
                    verticalAlign: 'middle',
                    borderRadius: '5px'
                }
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            path:{
                type:String,
                default: '/index'
            },
            username:{
                type:String,
                default:''
            },
            avatar:{
                type:String,
                default:''
            },
            time:{
                type:String,
                default:''
            },
            bubble:{
                type:Boolean,
                default:false
            },
            bottom:{
                type:Boolean,
                default:true
            },
            avatarRound:{
                type:Boolean,
                default:false
            },
            uid:{
                type: Number
            }
        }
    }
</script>

<style lang="stylus" scoped>
  @import "~@/assets/stylus/init.styl"
    .item
        border: 1px solid #ededed
        margin-bottom 20px
        .item-top
            width 100%
            padding: 14px 15px;
            display flex
            .item-top-left
                margin-right 10px
            .item-top-rig
                flex 1
                .intro
                    display flex
                    justify-content space-between
                    .title
                        flex-shrink 0
                        font-weight bold
                        margin-bottom 5px
                        color $googleRed
                    .value
                        font-size 12px
                .content
                    span
                        margin-right 5px
                        font-size 14px
                        color #555
                content: '';
                &.bubble
                    position relative
                    background-color #eee
                    padding 8px 10px
                    border-radius 4px
                    &:after
                        content ''
                        width: 0;
                        height: 0;
                        border: 8px solid transparent;
                        border-right-color: #eee;
                        position: absolute;
                        top 50% - 8px
                        left -16px

        .item-bot
            background-color #fafafa;
            padding: 10px 15px;
            height 40px
            font-size 1
            .el-tag
                height 20px
                line-height 20px
</style>