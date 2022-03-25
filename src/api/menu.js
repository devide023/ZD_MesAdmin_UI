import request from '@/utils/request'
export default {
    pagefields: (data) => {
        return request({
            url: '/common/pagefields',
            method: 'get',
            params: data
        })
    }
}