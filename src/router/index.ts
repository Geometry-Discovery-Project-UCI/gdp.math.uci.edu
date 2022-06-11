import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import TopicsView from '@/views/TopicsView.vue';
import ContributorsView from '@/views/ContributorsView.vue';
import OthersView from '@/views/OthersView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import GdpTopic01View from '@/views/topics/GdpTopic01View.vue';
import { RouteProps } from '@/types';
import {
  BookOutlined, HomeOutlined,
  UserOutlined, TagOutlined,
} from '@ant-design/icons-vue';
import { Layout } from '@/consts';

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
  {
    path: '/topic/1',
    name: 'topic01',
    component: GdpTopic01View,
    layout: Layout.NoSider
  },
];

const routes = routesProps.map((routeProp) => ({
  path: routeProp.path,
  name: routeProp.name,
  component: routeProp.component,
  meta: { layout: routeProp.layout || Layout.Sider }
}));

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
