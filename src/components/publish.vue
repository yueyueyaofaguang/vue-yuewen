<template>
    <div id="poster">
        <div class="main">
            <h3 class="main-title">
                <span class="iconfont icon-faqi"></span>
                发起
            </h3>
            <el-divider content-position="right">来发布你的问题吧~</el-divider>

            <h4>标题（简明扼要）</h4>
            <el-input placeholder="请输入标题" v-model="title"></el-input>

            <h4>描述（如果你希望他人花 1 分钟来解答你的问题，还请耐心花 10 分钟完善你的提问）</h4>
            <mavon-editor id="editor" ref=md @imgAdd="imgAdd" v-model="value"/>

            <h4>选择标签（最多选择 5 个）</h4>

            <p class="clearfix">
                <el-tag closable v-for="item in selectTags" :key="item" v-on:close="remove(item)">{{item}}</el-tag>
            </p>

            <el-tabs type="border-card" class="selectTabs" v-model="activeName">
                <el-tab-pane v-for="item in items"
                             :key="item.label"
                             :label="item.label"
                             :name = "item.name"
                >
                    <el-tag
                            v-for="taglabel in item.list"
                            :key="taglabel"
                            effect="dark"
                            v-on:click="select(taglabel)"
                    >
                        {{ taglabel }}
                    </el-tag>
                </el-tab-pane>
            </el-tabs>

            <el-button round type="primary" class="submit"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       v-on:click="submit"
            >
                发布
            </el-button>

        </div>
    </div>
</template>

<script>

    export default {
        name: "publish",
        data() {
            return {
                currentDate: new Date(),
                activeName: 'first',
                title:'',
                value:'',
                selectTags: [],
                items: [
                    {
                        name:'first',
                        label: '开发语言',
                        list: ['intellij-idea','git','github','vscode','vim','sublime','eclipse','xcode',
                            'maven','ide','svn','android-studio','atom','emacs','textmate','hg'
                    ]},
                    {
                        name:'second',
                        label: '平台框架',
                        list:['spring','springmvc','springboot','springcloud','mybatis','bootstrap','express','django'
                            ,'flask','yii','ruby-on-rails','tornado','koa','struts','laravel' ]
                    },
                    {
                        name: 'third',
                        label:'服务器',
                        list:['linux','nginx','docker','apache','ubuntu','centos','缓存','tomcat','负载均衡','unix','hadoop','windows-server']
                    },
                    {
                        name: 'fourth',
                        label: '数据库',
                        list:['mysql','redis','mongodb','sql','oracle','osql','memcached','elasticsearch','sqlserver','postgresql','sqlite']
                    },
                    {
                        name: 'fifth',
                        label: '开发工具',
                        list: ['intellij-idea','git','github','vscode','vim','sublime','eclipse','xcode','maven',
                            'ide','svn','android-studio','atom','emacs','textmate','hg' ]
                    },
                    {
                        name:'sixth',
                        label: '其他',
                        list: ['找bug','测试','冒泡','交友','生活','电影','音乐','读书','美食','游戏','科技','数码','理财' ]
                    }
                ],
                fullscreenLoading: false
            };
        },
        methods:{
            imgAdd(pos, $file) {
                var formdata = new FormData();
                formdata.append('image', $file);
                this.$axios({
                    url: '/post/uploadImg',
                    method: 'post',
                    data: formdata,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }).then((successResponse) => {
                    // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
                    // $vm.$img2Url 详情见本页末尾
                    console.log(successResponse);
                    this.$refs.md.$img2Url(pos, successResponse.data.data);
                })
            },
            select(tagName){
                this.selectTags.push(tagName);
            },
            remove(tagName){
                let selectTags = this.selectTags;
                for(var i = 0; i < selectTags.length; i++)
                {
                    if ( selectTags[i] === tagName)
                        selectTags.splice(i, 1);
                }
            },
            submit(){
                if(!this.title) {
                    this.$notify.error({
                        title: '错误',
                        message: '标题不能为空'
                    });
                    return;
                }
                if(!this.selectTags.length){
                    this.$notify.error({
                        title: '错误',
                        message: '至少选择一个标签'
                    });
                    return;
                }
                this.fullscreenLoading = true;
                this.$axios
                    .post('/post/',{
                        token:localStorage.getItem('token'),
                        title: this.title,
                        content: this.value,
                        tags: this.selectTags.join(';')
                    })
                    .then(successResponse=>{
                        this.fullscreenLoading = false;
                        if(successResponse.data.rspCode == 200){
                            this.$notify({
                                title: '成功',
                                message: '发布成功',
                                type: 'success'
                            });
                            this.title = '';
                            this.value = '';
                            this.selectTags = [];
                            this.activeName= 'first'
                        }else{
                            this.$notify.error({
                                title: '错误',
                                message: successResponse.rspMsg
                            });
                        }
                    })
                    .catch(failResponse=>{
                        console.log(failResponse);
                    })
            }
        }
    }
</script>

<style scoped>
    #editor{
        height: 600px;
    }

    .selectTabs .el-tag{
        cursor: pointer;
    }

    .submit{
        margin-top: 20px;
        float: right;
    }
</style>