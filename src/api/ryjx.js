import request from '@/utils/request'
export default{
    ryjx:(data)=>{
        return request({
            baseURL:'http://172.16.201.125:8033/api',
            url: '/User/GetListPerformanceByUserCode',
            method: 'post',
            data: data
        })
    }
}