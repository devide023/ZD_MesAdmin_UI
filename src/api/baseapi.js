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
    pageconfig: () => {
        let fullPath = router.currentRoute.fullPath;
        return request({
            url: '/common/pageconf',
            method: 'get',
            params: { path: fullPath }
        })
    }
}