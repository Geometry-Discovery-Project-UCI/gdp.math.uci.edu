<template>
  <ATypographyTitle :level="1">Contributors</ATypographyTitle>
  <AList itemLayout="horizontal" :dataSource="contributors" :grid="defaultGridParams">
    <template #renderItem="{ item: contributor }">
      <AListItem>
        <ACard hoverable>
          <ACardMeta :title="contributor.name">
            <template #description>
              {{ contributor.institute || "N/A" }}
            </template>
            <template #avatar>
              <AAvatar :src="avatarGenerator" />
            </template>
          </ACardMeta>
          <template #actions>
            <a :aria-label="contributor.email" :href="`mailto:${contributor.email}`">
              <MailOutlined />
            </a>
          </template>
        </ACard>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { contributors } from "@/data";
import { MailOutlined } from "@ant-design/icons-vue";
import { defaultGridParams, avatarGenerator } from "@/consts";

export default defineComponent({
  components: {
    MailOutlined,
  },
  setup() {
    return { defaultGridParams, avatarGenerator };
  },
  data() {
    return {
      contributors,
    };
  },
});
</script>
