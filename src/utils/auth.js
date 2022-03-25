import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const SearchExpKey = 'vue_search_exp'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setSearchExp(exp) {
  return localStorage.setItem(SearchExpKey, exp);
}
export function getSearchExp(exp) {
  return localStorage.getItem(SearchExpKey);
}
export function removeSearchExp() {
  return localStorage.removeItem(SearchExpKey);
}
