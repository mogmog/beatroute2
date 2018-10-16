export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [

      {
        path: '/admin',
        name: 'admin',
        icon: 'admin',
        routes: [
          {
            path: '/admin',
            name: 'admin',
            component: './Forms/BasicForm',
          }
        ],
      },

      {
        path: '/map',
        name: 'map',
        icon: 'map',
        routes: [
          {
            path: '/map',
            name: 'map',
            component: './Dashboard/Analysis',
          }
        ],
      }

    ],
  },
];
