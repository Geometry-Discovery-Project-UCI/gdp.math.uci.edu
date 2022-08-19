<template>
    <TopicMeta :topic="topic" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";

const topic = indexTopicMap.get(23) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
    },
);
</script>
