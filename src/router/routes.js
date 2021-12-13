const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'UserProfile' },
      { path: '/ipo/:id', component: () => import('pages/Ipo.vue') }
    ],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    name: 'Login',
    children: [
      { path: '/auth/login', component: () => import('pages/Signin.vue'), name: 'Authenticate' },
      
    ],
    
  }
]

export default routes