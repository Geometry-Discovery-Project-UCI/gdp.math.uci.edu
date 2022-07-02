import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from '@/App.vue';
import router from '@/router';
import { Layout } from '@/consts';
import SiderLayout from '@/components/layouts/SiderLayout.vue';
import NoSiderLayout from '@/components/layouts/NoSiderLayout.vue';
import TopicMeta from '@/components/TopicMeta.vue';
import 'ant-design-vue/dist/antd.css';
import { overrides } from '@/overrides';

overrides();

createApp(App)
  .component(Layout.Sider, SiderLayout)
  .component(Layout.NoSider, NoSiderLayout)
  .component('TopicMeta', TopicMeta)
  .use(router)
  .use(Antd)
  .mount('#app');
