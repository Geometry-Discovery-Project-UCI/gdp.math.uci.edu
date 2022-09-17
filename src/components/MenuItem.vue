<template>
  <AMenuItem :key="routeProps.name">
    <RouterLink :to="routeProps.path">
      <Component :is="routeProps.icon"></Component>
      <span> {{ routeProps.name.charAt(0).toUpperCase() + routeProps.name.slice(1) }} </span>
    </RouterLink>
  </AMenuItem>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { RouteProps } from "@/types";

defineProps({
  routeProps: {
    type: Object as PropType<RouteProps>,
    required: true,
  },
});
</script>
