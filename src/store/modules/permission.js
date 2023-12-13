import { constantRoutes, routeList } from '@/router'
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
  generateRoutes({ commit, state }, treeMenus) {
    return new Promise(resolve => {
      const accessedRoutes = generatorRoutesByTreeMenus(treeMenus)
      accessedRoutes.push(routeList['error'])
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export function generatorRoutesByTreeMenus(treeMenus) {
  const res = []
  treeMenus.forEach((tmp) => {
    const routerNode = routeList[tmp.code]
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
