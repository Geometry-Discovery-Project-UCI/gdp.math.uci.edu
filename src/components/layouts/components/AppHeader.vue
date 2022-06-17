<template>
  <RouterLink to="/">
    <ALayoutHeader>
      <ASpace>
        <GdpLogo :width="36" :height="36" :preview="false" />
        <span :style="{
          color: '#fff',
          fontSize: '18px',
        }">Geometry Discovery Project @ UCI</span>
      </ASpace>
    </ALayoutHeader>
  </RouterLink>
</template>

<script setup lang="ts">
import GdpLogo from '@/components/GdpLogo.vue';
</script>
