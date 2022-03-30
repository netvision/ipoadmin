const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue'), name: 'UserProfile' },
      { path: '/ipo/:id', component: () => import('pages/Ipo.vue') },
      { path: '/registrars', component: () => import('pages/Registrar.vue') },
      { path: '/sectors', component: () => import('pages/Sectors.vue') },
      { path: '/brlms', component: () => import('pages/Brlms.vue') },
      { path: '/anchors', component: () => import('pages/Anchors.vue') },
      { path: '/gmp', component: () => import('pages/Gmp.vue') },
      { path: '/oldIpos', component: () => import('pages/OldIpos.vue') },
      { path: '/old-ipo/:id', component: () => import('pages/OldIpoDetail.vue') },
      { path: '/financials/:id', component: () => import('pages/Financials.vue') },
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
      { path: '/auth/login', component: () => import('pages/Signin.vue'), name: 'Authenticate' }
      
    ],
    
  }
]

export default routes