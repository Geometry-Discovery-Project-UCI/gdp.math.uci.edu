<template>
  <ATypographyTitle :level="1">Topics</ATypographyTitle>
  <AList itemLayout="horizontal" :dataSource="topics" :grid="{gutter: 16}">
    <template #renderItem="{ item: topic }">
      <AListItem>
        <RouterLink :to="`/topic/${topic.index}`" target="_blank">
          <ACard class="topic-card" hoverable>
            <template #cover>
              <AImage class="topic-image" :src="topic.snapshot" :alt="topic.name" height="22vh" :preview="false" />
            </template>
            <ACardMeta :title="`Topic ${topic.index}`">
              <template #description>
                <div style="height: 3rem">
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
.topic-image {
  padding: 1px;
}

.topic-card {
  width: 300px;
}
</style>
