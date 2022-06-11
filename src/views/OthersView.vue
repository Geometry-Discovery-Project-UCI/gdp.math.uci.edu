<template>
  <ATypographyTitle :level="1">Others</ATypographyTitle>
  <ATypographyParagraph>Some extra information about geometry and us.</ATypographyParagraph>

  <AList itenLayout="horizontal" :dataSource="materials" :grid="defaultGridParams">
    <template #renderItem="{ item: material }">
      <AListItem>
        <ACard :title="material.name">
          <AList itemLayout="horizontal" :dataSource="material.data">
            <template #renderItem="{ item: content }">
              <AListItem>
                <ATypographyText>
                  <ATypographyLink :href="content.uri" target="_blank">
                    <ASpace>
                      <LinkOutlined />
                      <span>{{ content.name }}</span>
                    </ASpace>
                  </ATypographyLink>
                  <ATypographyText v-if="content.author"> by {{ content.author }}</ATypographyText>
                </ATypographyText>
              </AListItem>
            </template>
          </AList>
        </ACard>
      </AListItem>
    </template>
  </AList>

  <ATypographyTitle :level="2">GDP Group</ATypographyTitle>
  <AList itenLayout="horizontal" :dataSource="otherImages" :grid="defaultGridParams">
    <template #renderItem="{ item: image }">
      <AListItem :style="{
        textAlign: 'center',
      }">
        <AImage :src="image.image" />
        <ATypographyText>{{ image.title }}</ATypographyText>
      </AListItem>
    </template>
  </AList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { otherEssays, otherLinks, otherImages } from '@/data';
import { LinkOutlined } from '@ant-design/icons-vue';
import { defaultGridParams } from '@/consts';

export default defineComponent({
  components: {
    LinkOutlined,
  },
  setup() {
    return {
      defaultGridParams,
    };
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
      otherImages,
    };
  },
});
</script>
