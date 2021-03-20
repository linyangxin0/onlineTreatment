import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomePage')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/HomePage')
    },
    {
        path: '/camera/:roomId',
        name: 'Camera',
        component: () => import('../views/ChatRoomPage')
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: () => import('../views/LoginPage')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFountPage')
    },
    {
        path: '/changePassword',
        name: 'changePassword',
        component: () => import('../views/ChangePasswordPage')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterPage')
    },
    {
        path: '/doctorInfo/:id',
        name: 'doctorInfo',
        component: () => import('../views/DoctorInfoPage')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
