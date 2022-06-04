<template>
  <ATypographyTitle :level="1">Others</ATypographyTitle>
  <ATypographyParagraph>Some extra information about geometry and us.</ATypographyParagraph>

  <AList itenLayout="horizontal" :dataSource="materials"
    :grid="{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 5, xxxl: 7 }">
    <template #renderItem="{ item: material }">
      <AListItem>
        <ACard :title="material.name">
          <AList itemLayout="horizontal" :dataSource="material.data">
            <template #renderItem="{ item: content }">
              <AListItem>
                <div>
                  <a :href="content.uri" target="_blank">
                    <ASpace>
                      <LinkOutlined />
                      <span>{{ content.name }}</span>
                    </ASpace>
                  </a>
                  <span v-if="content.author"> by {{ content.author }}</span>
                </div>
              </AListItem>
            </template>
          </AList>
        </ACard>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { otherEssays, otherLinks } from '@/data';
import { LinkOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    LinkOutlined,
  },
  data() {
    return {
      materials: [{
        name: 'Essays',
        data: otherEssays,
      }, {
        name: 'Links',
        data: otherLinks,
      }],
    };
  },
});
</script>
