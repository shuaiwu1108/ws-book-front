import { asyncRoutes, constantRoutes, webRoutes } from '@/router'
import Layout from '@/layout/index.vue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit, state }, tmp) {
    return new Promise(resolve => {
      let accessedRoutes
      if (tmp.roleCodes.includes('DMIN')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        accessedRoutes = generatorRoutesByTreeMenus(tmp.treeMenus)
        accessedRoutes.forEach(tmp => {
          if (tmp.children.length > 0) {
            tmp.component = Layout
          } else {
            tmp.component = Layout
            if (tmp.redirect === '/dashboard') {
              tmp.redirect = '/dashboard'
              tmp.children = {
                path: tmp.redirect,
                component: webRoutes[tmp.component],
                meta: tmp.meta
              }
              tmp.meta = undefined
            } else {
              tmp.children = {
                path: 'index',
                component: webRoutes[tmp.component],
                meta: tmp.meta
              }
              tmp.meta = undefined
            }
          }
        })
        console.log(accessedRoutes)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export function generatorRoutesByTreeMenus(treeMenus) {
  const res = []
  treeMenus.forEach((tmp) => {
    const routerNode = {
      path: tmp.path,
      component: webRoutes[tmp.component],
      meta: {
        title: tmp.title,
        icon: tmp.icon
      }
    }
    if (tmp.children !== undefined && tmp.children !== null && tmp.children.length > 0) {
      routerNode.children = generatorRoutesByTreeMenus(tmp.children)
    }
    res.push(routerNode)
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
