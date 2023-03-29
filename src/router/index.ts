import { createRouter, createWebHashHistory } from "vue-router";
import TopicsView from "@/views/TopicsView.vue";
import ContributorsView from "@/views/ContributorsView.vue";
import OthersView from "@/views/OthersView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import GdpTopic01View from "@/views/topics/GdpTopic01View.vue";
import GdpTopic02View from "@/views/topics/GdpTopic02View.vue";
import GdpTopic03View from "@/views/topics/GdpTopic03View.vue";
import GdpTopic04View from "@/views/topics/GdpTopic04View.vue";
import GdpTopic05View from "@/views/topics/GdpTopic05View.vue";
import GdpTopic06View from "@/views/topics/GdpTopic06View.vue";
import GdpTopic07View from "@/views/topics/GdpTopic07View.vue";
import GdpTopic08View from "@/views/topics/GdpTopic08View.vue";
import GdpTopic09View from "@/views/topics/GdpTopic09View.vue";
import GdpTopic10View from "@/views/topics/GdpTopic10View.vue";
import GdpTopic11View from "@/views/topics/GdpTopic11View.vue";
import GdpTopic12View from "@/views/topics/GdpTopic12View.vue";
import GdpTopic13View from "@/views/topics/GdpTopic13View.vue";
import GdpTopic14View from "@/views/topics/GdpTopic14View.vue";
import GdpTopic15View from "@/views/topics/GdpTopic15View.vue";
import GdpTopic16View from "@/views/topics/GdpTopic16View.vue";
import GdpTopic17View from "@/views/topics/GdpTopic17View.vue";
import GdpTopic18View from "@/views/topics/GdpTopic18View.vue";
import GdpTopic19View from "@/views/topics/GdpTopic19View.vue";
import GdpTopic20View from "@/views/topics/GdpTopic20View.vue";
import GdpTopic21View from "@/views/topics/GdpTopic21View.vue";
import GdpTopic22View from "@/views/topics/GdpTopic22View.vue";
import GdpTopic23View from "@/views/topics/GdpTopic23View.vue";
import GdpTopic24View from "@/views/topics/GdpTopic24View.vue";
import GdpTopic25View from "@/views/topics/GdpTopic25View.vue";
import GdpTopic26View from "@/views/topics/GdpTopic26View.vue";
import GdpTopic27View from "@/views/topics/GdpTopic27View.vue";
import GdpTopic28View from "@/views/topics/GdpTopic28View.vue";
import GdpTopic29View from "@/views/topics/GdpTopic29View.vue";
import GdpTopic30View from "@/views/topics/GdpTopic30View.vue";
import GdpTopic31View from "@/views/topics/GdpTopic31View.vue";
import GdpTopic32View from "@/views/topics/GdpTopic32View.vue";
import GdpTopic33View from "@/views/topics/GdpTopic33View.vue";
import GdpTopic34View from "@/views/topics/GdpTopic34View.vue";
import GdpTopic35View from "@/views/topics/GdpTopic35View.vue";
import GdpTopic36View from "@/views/topics/GdpTopic36View.vue";
import GdpTopic37View from "@/views/topics/GdpTopic37View.vue";
import GdpTopic38View from "@/views/topics/GdpTopic38View.vue";
import GdpTopic39View from "@/views/topics/GdpTopic39View.vue";
import GdpTopic40View from "@/views/topics/GdpTopic40View.vue";
import PresentationsView from "@/views/PresentationsView.vue";
import { RouteProps } from "@/types";
import {
  BookOutlined, UserOutlined, TagOutlined,
} from "@ant-design/icons-vue";
import { Layout } from "@/consts";

export const routesProps: RouteProps[] = [
  {
    path: "/",
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
    layout: Layout.NoSider
  },
  {
    path: "/topic/1",
    name: "topic01",
    component: GdpTopic01View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/2",
    name: "topic02",
    component: GdpTopic02View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/3",
    name: "topic03",
    component: GdpTopic03View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/4",
    name: "topic04",
    component: GdpTopic04View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/5",
    name: "topic05",
    component: GdpTopic05View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/7",
    name: "topic07",
    component: GdpTopic07View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/8",
    name: "topic08",
    component: GdpTopic08View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/6",
    name: "topic06",
    component: GdpTopic06View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/9",
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
    path: "/topic/17",
    name: "topic17",
    component: GdpTopic17View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/18",
    name: "topic18",
    component: GdpTopic18View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/19",
    name: "topic19",
    component: GdpTopic19View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/20",
    name: "topic20",
    component: GdpTopic20View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/21",
    name: "topic21",
    component: GdpTopic21View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/22",
    name: "topic22",
    component: GdpTopic22View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/23",
    name: "topic23",
    component: GdpTopic23View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/24",
    name: "topic24",
    component: GdpTopic24View,
    layout: Layout.NoSider,
  },
  {
    path: "/topic/25",
    name: "topic25",
    component: GdpTopic25View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/26",
    name: "topic26",
    component: GdpTopic26View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/27",
    name: "topic27",
    component: GdpTopic27View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/28",
    name: "topic28",
    component: GdpTopic28View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/29",
    name: "topic29",
    component: GdpTopic29View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/30",
    name: "topic30",
    component: GdpTopic30View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/31",
    name: "topic31",
    component: GdpTopic31View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/32",
    name: "topic32",
    component: GdpTopic32View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/33",
    name: "topic33",
    component: GdpTopic33View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/34",
    name: "topic34",
    component: GdpTopic34View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/35",
    name: "topic35",
    component: GdpTopic35View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/36",
    name: "topic36",
    component: GdpTopic36View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/37",
    name: "topic37",
    component: GdpTopic37View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/38",
    name: "topic38",
    component: GdpTopic38View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/39",
    name: "topic39",
    component: GdpTopic39View,
    layout: Layout.NoSider
  },
  {
    path: "/topic/40",
    name: "topic40",
    component: GdpTopic40View,
    layout: Layout.NoSider
  },
  {
    path: "/presentations",
    name: "presentations",
    component: PresentationsView,
    layout: Layout.NoSider
  }
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
