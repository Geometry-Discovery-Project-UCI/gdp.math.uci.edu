<template>
  <ALayoutSider :style="{
    width: '200px', background: '#fff',
  }">
    <AMenu :style="{
      heigh: '100%', borderRight: 0
    }" v-model:selectedKeys="selectedKey" mode="inline">
      <template v-for="route in routesProps" :key="route.name">
        <MenuItem v-if="route.icon" :routeProps="route" />
      </template>
    </AMenu>
  </ALayoutSider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { routesProps } from '@/router';
import MenuItem from '@/components/MenuItem.vue';
import { useRouter } from 'vue-router';

await useRouter().isReady();
const routeName = useRouter().currentRoute.value.name as string;

const selectedKey = ref<Array<string>>([routeName]);
</script>
