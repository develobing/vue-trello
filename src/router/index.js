import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Board from '../pages/Board.vue';
import Card from '../pages/Card.vue';
import NotFound from '../pages/NotFound.vue';
import { useStore } from '../composables/useStore';

const requireAuth = () => (from, to, next) => {
  const store = useStore();

  !!store.accessToken
    ? next()
    : next(`/login?returnPath=${encodeURIComponent(from.path)}`);
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      beforeEnter: requireAuth(),
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/board/:id',
      component: Board,
      beforeEnter: requireAuth(),
      children: [
        {
          path: 'card/:cid',
          component: Card,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFound,
    },
  ],
});

export default router;
