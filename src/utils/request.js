import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
})
let loadingInstance;
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadingInstance = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    loadingInstance.close();
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // if the custom code is not 20000, it is judged as an error.
    loadingInstance.close();
    let errormsg = '';
    const res = response.data;
    if (response.status !== 200) {
      switch (response.status) {
        case 400:
          errormsg = '请求错误(400)';
          break;
        case 401:
          errormsg = '未授权请重新登录(401)';
          break;
        case 403:
          errormsg = '拒绝访问(403)';
          break;
        case 404:
          errormsg = '请求出错(404)';
          break;
        case 408:
          errormsg = '请求超时(408)';
          break;
        case 500:
          errormsg = '服务器错误(500)';
          break;
        case 501:
          errormsg = '服务未实现(501)';
          break;
        case 502:
          errormsg = '网络错误(502)';
          break;
        case 503:
          errormsg = '服务不可用(503)';
          break;
        case 504:
          errormsg = '网络超时(504)';
          break;
        case 505:
          errormsg = 'Http版本不受支持(505)';
          break;
        default:
          errormsg = `错误(${response.status})`;
          break;
      }
    }
    if (errormsg !== '') {
      Message({
        message: errormsg,
        type: 'error',
        duration: 5 * 1000
      });
    }
    else if (res.code === 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 15 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 2001 || res.code === 2002) {
        // to re-login
        MessageBox.confirm('您已注销,可以取消以停留在此页面或再次登录', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // for debug
    Message({
      message: error,
      type: 'error',
      duration: 15 * 1000
    });
    loadingInstance.close();
    return Promise.reject(error)
  }
)

export default service
