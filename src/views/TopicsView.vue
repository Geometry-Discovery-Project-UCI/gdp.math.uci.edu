<template>
  <ATypographyTitle :level="1">Topics</ATypographyTitle>
  <AList itemLayout="horizontal" :dataSource="topics" :grid="{gutter: 16}">
    <template #renderItem="{ item: topic }">
      <AListItem>
        <RouterLink :to="`/topic/${topic.index}`" target="_blank">
          <ACard class="topic-card" hoverable>
            <template #cover>
              <img :src="topic.snapshot" class="topic-image" />
            </template>
            <ACardMeta :title="`Topic ${topic.index}`">
              <template #description>
                <div style="height: 3rem; width: 250px;">
                  {{ topic.name }}
                </div>
              </template>
            </ACardMeta>
          </ACard>
        </RouterLink>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { topics } from "@/data";
import { defaultGridParams } from "@/consts";

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
.topics-description {
  width: 50%;
}

.topic-image {
  height: 200px;
  width: 300px;
  padding: 1px;
}
</style>
