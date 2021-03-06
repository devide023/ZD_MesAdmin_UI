import router,{ constantRoutes } from '@/router'
import { get_user_menus} from '@/router/usermenu';
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
    const user_route = constantRoutes.concat(routes)
    state.addRoutes = user_route
    state.routes = user_route
    router.addRoutes(user_route)
    router.options.routes = user_route;
  }
}

const actions = {
  generateRoutes({ commit }, accessedRoutes) {
    const menus = get_user_menus(accessedRoutes);
    //console.log(menus);
    return new Promise(resolve => {
      commit('SET_ROUTES', menus)
      resolve(menus)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
