import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

// 新增加的页面修需要改此处，对象中的key需要与数据库中的code保持一致
export const routeList = {
  // 一级菜单
  index: {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'dashboard'}
    }]
  },
  form: {
    path: '/form',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/form/index'),
      meta: {title: '表单', icon: 'form'}
    }]
  },
  video: {
    path: '/video',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/video/video.vue'),
      meta: {title: '监控视频', icon: 'el-icon-video-camera-solid'}
    }]
  },
  webrtc: {
    path: '/webrtc',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/video/webrtc.vue'),
      meta: {title: 'webrtc', icon: 'el-icon-video-camera-solid'}
    }]
  },
  system: {
    path: '/system',
    component: Layout,
    meta: {title: '系统配置', icon: 'el-icon-s-help'}
  },
  // 二级菜单
  user: {
    path: 'user',
    component: () => import('@/views/system/user.vue'),
    meta: {title: '用户管理', icon: 'user'}
  },
  role: {
    path: 'role',
    component: () => import('@/views/system/role.vue'),
    meta: {title: '角色管理', icon: 'el-icon-s-custom'}
  },
  menu: {
    path: 'menu',
    component: () => import('@/views/system/menu.vue'),
    meta: {title: '菜单管理', icon: 'table'}
  },
  error: {path: '*', redirect: '/404', hidden: true} // 404页面放在最后
}
