import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import katex from "katex";
import "katex/dist/katex.min.css";

import App from "@/App.vue";
import { Layout } from "@/consts";
import SiderLayout from "@/components/layouts/SiderLayout.vue";
import NoSiderLayout from "@/components/layouts/NoSiderLayout.vue";
import TopicMeta from "@/components/TopicMeta.vue";
import router from "@/router";
import { overrides } from "@/overrides";

overrides();

createApp(App)
  .component(Layout.Sider, SiderLayout)
  .component(Layout.NoSider, NoSiderLayout)
  .component("TopicMeta", TopicMeta)
  .use(router)
  .use(Antd)
  .directive("katex", (el, binding) => {
    const isDisplay = binding.arg === "display";
    katex.render(el.innerHTML, el, { displayMode: isDisplay });
  })
  .directive("tikz", (el) => {
    const scripts = el.innerHTML;
    el.classList.add("tikz-diagram");
    el.innerHTML = null;
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/tikz";
    scriptTag.innerHTML = scripts;
    el.appendChild(scriptTag);
  })
  .mount("#app");
