<template>
  <ALayout :style="{ height: '100vh' }">
    <AppHeader></AppHeader>
    <ALayout>
      <AppSider />
      <AppContent />
    </ALayout>
  </ALayout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import AppSider from '@/components/AppSider.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppContent from '@/components/AppContent.vue';

export default defineComponent({
  name: 'LayoutView',
  components: {
    AppSider,
    AppHeader,
    AppContent,
  },
});
</script>
