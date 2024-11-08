import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DeviceNotFound.vue') },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: '/:deviceId',
    component: () => import('layouts/ClientLayout.vue'),
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            name: 'clientCurrentOrder',
            component: () => import('pages/Client/CurrentOrder.vue'),
          },
          {
            path: 'AddItem',
            name: 'clientAddItem',
            component: () => import('pages/Client/AddItemToOrder.vue'),
          },
        ],
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
