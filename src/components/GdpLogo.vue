<template>
  <AImage :src="logoImage"></AImage>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import logoLight from "@/assets/logo-light.png";

const props = defineProps<{
  isLight: boolean
}>();

const logoImage = props.isLight ? logoLight : logo;
</script>
