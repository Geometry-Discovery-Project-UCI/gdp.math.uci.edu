<template>
  <ATypographyTitle :level="1">Contributors</ATypographyTitle>
  <AList itemLayout="horizontal" :dataSource="contributors"
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5, xxxl: 7 }">
    <template #renderItem="{ item: contributor }">
      <AListItem>
        <ACard hoverable>
          <a-card-meta :title="contributor.name">
            <template #description>
              {{ contributor.institute || "N/A" }}
            </template>
            <template #avatar>
              <a-avatar src="https://joeschmoe.io/api/v1/random" />
            </template>
          </a-card-meta>
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
import { defineComponent } from 'vue';
import { contributors } from '@/data';
import { MailOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    MailOutlined,
  },
  data() {
    return {
      contributors,
    };
  },
});
</script>
