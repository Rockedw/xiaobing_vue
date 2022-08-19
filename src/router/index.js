import { createRouter, createWebHistory} from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/pages/home/Index.vue"),
  },
  {
    path: "/repo_detail",
    name:'repo_detail',
    component: () => import("@/pages/detail/RepoDetail.vue"),
  },
  {
    path: "/",
    component: () => import("@/layout/BasicLayout.vue"),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import("@/pages/home/Home.vue"),
      },
      {
        path: '/promote',
        name: 'promote',
        component: () => import("@/pages/promote/PromoteList.vue"),
      },
      {
        path: '/push-history',
        name: 'push-history',
        component: () => import("@/pages/push/PushHistory.vue"),
      },
      {
        path: '/add-push-content',
        name: 'add-push-content',
        component: () => import("@/pages/push/AddPushContent.vue"),
      },
      {
        path: '/auto-push-list',
        name: 'auto-push-list',
        component: () => import("@/pages/push/AutoPushList.vue"),
      },
    ]
  }
];

export const router = createRouter({
  history: createWebHistory("/"),
  routes: routes
});

export default router;
