import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/admins',
        component: () => import('pages/UsersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/caregivers',
        component: () => import('pages/CaregiversPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/patients',
        component: () => import('pages/PatientsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/devices',
        component: () => import('pages/DevicesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/options',
        component: () => import('pages/OptionsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),

    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') },
    //   { path: '/users', component: () => import('pages/UsersPage.vue') },
    // ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
