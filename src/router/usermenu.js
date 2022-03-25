export function get_user_menus(menulist) {
  const routlist = [];
  menulist.forEach(item => {
    let mitem = {}
    let funs=[]
    let editfields=[]
    let hidefields=[]
    if(item.menu_permission)
    {
      funs = item.menu_permission.funs
      editfields=item.menu_permission.editfields 
      hidefields=item.menu_permission.hidefields
    }
    mitem = {
      path: item.routepath,
      name: item.componentname,
      component: () => import('@/layout/index.vue'),
      meta: {
        title: item.name,
        icon: item.icon,
        funs:funs,
        noCache:false,
        editfields:editfields,
        hidefields:hidefields,
        viewconf: item.viewconf,
      }
    };
    if(item.children.length > 0){
      mitem.children = submenu(item.children);
    }
    routlist.push(mitem);
  });
  routlist.push({
    path: '*',
    redirect: '/404',
    hidden: true
  });
  return routlist;
}
function submenu(sub) {
  const slist = [];
  sub.forEach((i) => {
    let mitem = {};
    let funs=[]
    let editfields=[]
    let hidefields=[]
    if(i.menu_permission)
    {
      funs = i.menu_permission.funs
      editfields=i.menu_permission.editfields 
      hidefields=i.menu_permission.hidefields
    }
      mitem = {
        path: i.routepath,
        name: i.componentname,
        component: (resolve) => require(['@/views/' + i.viewpath + '.vue'], resolve),
        meta: {
          title: i.name,
          icon: i.icon,
          noCache:false,
          funs:funs,
          editfields:editfields,
          hidefields:hidefields,
          viewconf: i.viewconf
        }
      };
      const haschild = i.children.length;
      if (haschild > 0) {
        mitem.children = submenu(i.children);
      }
      slist.push(mitem);
  });
  return slist;
}