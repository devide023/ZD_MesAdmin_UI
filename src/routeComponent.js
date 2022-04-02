import request from '@/utils/request'

function getrouteComponent() {
    request({
        url: '/common/routecomponent',
        method: 'get',
        params: {}
    }).then(res => {
        if (res.code === 1) {
            console.log(res.list);
            window.route_component = res.list.map(i => { return { routepath: i.routepath, component: i.componentname } });
        }
    });
}
getrouteComponent();