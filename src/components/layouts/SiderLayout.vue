<template>
  <ALayout :style="{ height: '100vh' }">
    <AppHeader />
    <ALayout>
      <AppSider />
      <AppContent />
    </ALayout>
  </ALayout>
</template>

<script setup lang='ts'>
import AppSider from "@/components/layouts/components/AppSider.vue";
import AppHeader from "@/components/layouts/components/AppHeader.vue";
import AppContent from "@/components/layouts/components/AppContent.vue";
</script>
