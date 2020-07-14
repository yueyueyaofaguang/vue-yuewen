import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import Appindex from "@/components/home/Appindex";
import callback from "@/components/callback";
import publish from "@/components/publish";
import user from "@/components/user";
import replies from "@/components/replies";
import question from "@/components/question";

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes:[
        {
        path: '/login',
        name: 'Login',
        component: Login
        },
        {
        path: '/index',
        name: 'AppIndex',
        component: Appindex
        },
        {
            path:'/callback',
            name: 'callback',
            component: callback
        },
        {
            path:'/publish',
            name: 'publish',
            component: publish,
            meta: {
                requireAuth: true
            }
        },
        {
            path:'/user/:id',
            name: 'user',
            component: user
        },
        {
            path:'/replies',
            name: 'replies',
            component: replies
        },
        {
            path: '/question/:id',
            name: 'question',
            component: question
        }
    ]
})