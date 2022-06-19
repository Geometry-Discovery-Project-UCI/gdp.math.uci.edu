<template>
  <ATypographyTitle :level="1">Topics</ATypographyTitle>
  <AList itemLayout="horizontal" :dataSource="topics" :grid="defaultGridParams">
    <template #renderItem="{ item: topic }">
      <AListItem>
        <ACard hoverable>
          <template #cover>
            <AImage class="topic-image" :src="topic.snapshot" :alt="topic.name" height="22vh" />
          </template>
          <ACardMeta :title="`Topic ${topic.index}`">
            <template #description>
              <div style="height: 3rem">
                {{ topic.name }}
              </div>
            </template>
          </ACardMeta>
          <template #actions>
            <RouterLink :to="`/topic/${topic.index}`" target="_blank">
              Details
            </RouterLink>
          </template>
        </ACard>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { topics } from '@/data';
import { defaultGridParams } from '@/consts';

export default defineComponent({
  setup() {
    return {
      defaultGridParams,
    };
  },
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
