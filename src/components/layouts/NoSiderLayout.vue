<template>
  <ALayout :style="{ height: '100vh' }">
    <AppHeader />
    <ALayout>
      <AppContent />
    </ALayout>
  </ALayout>
</template>

<script setup lang='ts'>
import AppHeader from "@/components/layouts/components/AppHeader.vue";
import AppContent from "@/components/layouts/components/AppContent.vue";
</script>
