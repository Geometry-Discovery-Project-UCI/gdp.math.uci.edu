<template>
  <ATypographyTitle :level="1">{{ topic.name }}</ATypographyTitle>

  <ATypographyTitle :level="5" v-if="topic.essayContributors?.length > 0">
    Essay Contributors: {{ topic.essayContributors.map((t) => (t.name)).join(', ') }}
  </ATypographyTitle>
  <ATypographyTitle :level="5" v-if="topic.animationContributors?.length > 0">
    Animation Contributors: {{ topic.animationContributors.map((t) => (t.name)).join(', ') }}
  </ATypographyTitle>

  <ATypographyTitle :level="4">Readings</ATypographyTitle>
  <ATypographyLink :href="topic.essay" v-if="topic.essay?.length > 0">
    Essay PDF (Click to preview/download)
  </ATypographyLink>
  <ATypographyText v-else>Essay comming soon...</ATypographyText>
</template>

<script setup lang="ts">
import { defineProps, PropType } from 'vue';
import { Topic } from '@/types';

defineProps({
  topic: {
    type: Object as PropType<Topic>,
    required: true,
  },
});
</script>
