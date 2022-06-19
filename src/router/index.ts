
import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import TopicsView from '@/views/TopicsView.vue';
import ContributorsView from '@/views/ContributorsView.vue';
import OthersView from '@/views/OthersView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import GdpTopic01View from '@/views/topics/GdpTopic01View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic09View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic10View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic11View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic12View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic13View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic14View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic15View.vue';
import GdpTopic09View from '@/views/topics/GdpTopic16View.vue';
import GdpTopic17View from '@/views/topics/GdpTopic17View.vue';
import GdpTopic18View from '@/views/topics/GdpTopic18View.vue';
import GdpTopic19View from '@/views/topics/GdpTopic19View.vue';
import GdpTopic20View from '@/views/topics/GdpTopic20View.vue';
import GdpTopic21View from '@/views/topics/GdpTopic21View.vue';
import GdpTopic22View from '@/views/topics/GdpTopic22View.vue';
import GdpTopic23View from '@/views/topics/GdpTopic23View.vue';
import GdpTopic24View from '@/views/topics/GdpTopic24View.vue';
import { RouteProps } from '@/types';
import {
  BookOutlined, HomeOutlined,
  UserOutlined, TagOutlined,
} from '@ant-design/icons-vue';
import { Layout } from '@/consts';

export const routesProps: Array<RouteProps> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    icon: HomeOutlined,
  },
  {
    path: "/topics",
    name: "topics",
    component: TopicsView,
    icon: BookOutlined,
  },
  {
    path: "/contributors",
    name: "contributors",
    component: ContributorsView,
    icon: UserOutlined,
  },
  {
    path: "/others",
    name: "others",
    component: OthersView,
    icon: TagOutlined,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFoundView,
  },
  {
    path: "/topic/1",
    name: "topic01",
    component: GdpTopic01View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/09",
    name: "topic09",
    component: GdpTopic09View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/10",
    name: "topic10",
    component: GdpTopic10View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/11",
    name: "topic11",
    component: GdpTopic11View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/12",
    name: "topic12",
    component: GdpTopic12View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/13",
    name: "topic13",
    component: GdpTopic13View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/14",
    name: "topic14",
    component: GdpTopic14View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/15",
    name: "topic15",
    component: GdpTopic15View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/16",
    name: "topic16",
    component: GdpTopic16View,
    layout: Layout.NoSider,
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
];

const routes = routesProps.map((routeProp) => ({
  path: routeProp.path,
  name: routeProp.name,
  component: routeProp.component,
  meta: { layout: routeProp.layout || Layout.Sider },
}));

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
