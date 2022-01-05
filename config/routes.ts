export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: '监控列表',
    icon: 'table',
    path: '/monitor',
    routes: [
      {
        name: 'jvm监控',
        path: '/monitor/jvm',
        component: './monitor/jvm-monitor-list',
      },
      {
        name: 'JVM监控明细',
        layout: false,
        target: '_blank',
        hideInMenu: true,
        icon: 'table',
        path: '/monitor/jvm/info',
        component: './monitor/jvm-monitor-info',
      },
      {
        name: 'point监控',
        path: '/monitor/point',
        component: './monitor/point-monitor-list',
      },
      {
        name: '接口监控',
        layout: false,
        target: '_blank',
        hideInMenu: true,
        icon: 'table',
        path: '/monitor/point/info',
        component: './monitor/point-monitor-info',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
