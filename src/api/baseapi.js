import request from '@/utils/request'
import router from '@/router/index';
export default {
    requestapi: (method, url, data) => {
        if (method === 'post') {
            return request({
                url: url,
                method: 'post',
                data
            })
        } else if (method === 'get') {
            return request({
                url: url,
                method: 'get',
                params: data
            })
        }
    },
    request_thirdapi:(method,url,data)=>{
        if (method === 'post') {
            return request({
                baseURL:url,
                method: 'post',
                data
            })
        } else if (method === 'get') {
            return request({
                baseURL: url,
                method: 'get',
                params: data
            })
        }
    },
    pageconfig: () => {
        let fullPath = router.currentRoute.fullPath;
        let pos = fullPath.indexOf('?');
        if (pos !== -1) {
            fullPath = fullPath.substr(0, pos);
        }
        return request({
            url: '/common/pageconf',
            method: 'get',
            params: { path: fullPath }
        })
    }
}