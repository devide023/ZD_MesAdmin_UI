window.winconfig = {
    production: {
        VUE_APP_BASE_API: 'http://172.16.201.125:7002/api',
        VUE_APP_ROOT: 'http://172.16.201.125:7002',
        VUE_APP_THIRD_URL:'http://172.16.201.125:8033',
    },
    development: {
        VUE_APP_BASE_API: 'http://localhost:52655/api',
        VUE_APP_ROOT: 'http://localhost:52655',
        VUE_APP_THIRD_URL: 'http://172.16.201.125:8033',
    },
    staging: {
        VUE_APP_BASE_API: 'http://2d01d491.r2.cpolar.cn/api',
        VUE_APP_ROOT: 'http://2d01d491.r2.cpolar.cn',
        VUE_APP_THIRD_URL: 'http://172.16.201.125:8033',
    },
    logintitle: '机加MES后台登录'
}