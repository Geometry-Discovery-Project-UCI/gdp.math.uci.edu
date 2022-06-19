import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import TopicsView from '@/views/TopicsView.vue';
import ContributorsView from '@/views/ContributorsView.vue';
import OthersView from '@/views/OthersView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import GdpTopic01View from '@/views/topics/GdpTopic01View.vue';
import GdpTopic17View from '@/views/topics/GdpTopic17View.vue';
import GdpTopic18View from '@/views/topics/GdpTopic18View.vue';
import GdpTopic19View from '@/views/topics/GdpTopic19View.vue';
import GdpTopic20View from '@/views/topics/GdpTopic20View.vue';
import GdpTopic21View from '@/views/topics/GdpTopic21View.vue';
import GdpTopic22View from '@/views/topics/GdpTopic22View.vue';
import GdpTopic23View from '@/views/topics/GdpTopic23View.vue';
import GdpTopic24View from '@/views/topics/GdpTopic24View.vue';
import GdpTopic33View from '@/views/topics/GdpTopic33View.vue';
import GdpTopic34View from '@/views/topics/GdpTopic34View.vue';
import GdpTopic35View from '@/views/topics/GdpTopic35View.vue';
import GdpTopic36View from '@/views/topics/GdpTopic36View.vue';
import GdpTopic37View from '@/views/topics/GdpTopic37View.vue';
import GdpTopic38View from '@/views/topics/GdpTopic38View.vue';
import GdpTopic39View from '@/views/topics/GdpTopic39View.vue';
import GdpTopic40View from '@/views/topics/GdpTopic40View.vue';
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
  {
    path: '/topic/17',
    name: 'topic17',
    component: GdpTopic17View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/18',
    name: 'topic18',
    component: GdpTopic18View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/19',
    name: 'topic19',
    component: GdpTopic19View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/20',
    name: 'topic20',
    component: GdpTopic20View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/21',
    name: 'topic21',
    component: GdpTopic21View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/22',
    name: 'topic22',
    component: GdpTopic22View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/23',
    name: 'topic23',
    component: GdpTopic23View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/24',
    name: 'topic24',
    component: GdpTopic24View,
    layout: Layout.NoSider
  },
  {
    path: '/topic/33',
    name: 'topic33',
    component: GdpTopic33View,
    layout: Layout.NoSider
  },
  {
      path: '/topic/34',
      name: 'topic34',
      component: GdpTopic34View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/35',
      name: 'topic35',
      component: GdpTopic35View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/36',
      name: 'topic36',
      component: GdpTopic36View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/37',
      name: 'topic37',
      component: GdpTopic37View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/38',
      name: 'topic38',
      component: GdpTopic38View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/39',
      name: 'topic39',
      component: GdpTopic39View,
      layout: Layout.NoSider
  },
  {
      path: '/topic/40',
      name: 'topic40',
      component: GdpTopic40View,
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
