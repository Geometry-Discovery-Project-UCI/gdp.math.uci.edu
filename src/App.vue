<template>
  <Suspense>
    <Component :is="layout" />
  </Suspense>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

<script lang="ts">
import { Layout } from "ant-design-vue";
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    layout() {
      return (this.$route.meta.layout || Layout.Sider);
    }
  },
});
</script>

<style>
canvas {
  border: 1px solid #ccc;
  margin-bottom: 6px;
}
</style>
