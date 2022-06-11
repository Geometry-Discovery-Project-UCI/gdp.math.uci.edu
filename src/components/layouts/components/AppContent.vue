<template>
  <ALayout :style="{ padding: '0 12px' }">
    <ALayoutContent id="app-content" :style="{
      margin: '24px 16px',
      padding: '24px',
      background: '#fff',
      height: '100%',
      overflowY: 'auto'
    }">
      <RouterView />
    </ALayoutContent>
  </ALayout>
</template>
