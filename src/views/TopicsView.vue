<template>
  <ATypographyTitle :level="1">Topics</ATypographyTitle>
  <AList itenLayout="horizontal" :dataSource="topics"
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5, xxxl: 7 }">
    <template #renderItem="{ item: topic }">
      <AListItem>
        <ACard hoverable>
          <template #cover>
            <img class="topic-image" :src="topic.snapshot" :alt="topic.name" />
          </template>
          <a-card-meta :title="`Topic ${topic.index}`">
            <template #description>{{ topic.name }}</template>
          </a-card-meta>
        </ACard>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { topics } from '@/data';

export default defineComponent({
  name: 'TopcicsView',
  data() {
    return { topics };
  },
});
</script>

<style>
.topic-image {
  padding: 1px;
}
</style>
