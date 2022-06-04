import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import TopicsView from '@/views/TopicsView.vue';
import ContributorsView from '@/views/ContributorsView.vue';
import OthersView from '@/views/OthersView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import { RouteProps } from '@/types';
import {
  BookOutlined, HomeOutlined,
  UserOutlined, TagOutlined,
} from '@ant-design/icons-vue';

export const routesProps: Array<RouteProps> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    icon: HomeOutlined,
  },
  {
    path: '/topics',
    name: 'topics',
    component: TopicsView,
    icon: BookOutlined,
  },
  {
    path: '/contributors',
    name: 'contributors',
    component: ContributorsView,
    icon: UserOutlined,
  },
  {
    path: '/others',
    name: 'others',
    component: OthersView,
    icon: TagOutlined,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView,
  },
];

const routes = routesProps.map((routeProp) => ({
  path: routeProp.path,
  name: routeProp.name,
  component: routeProp.component,
}));

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
