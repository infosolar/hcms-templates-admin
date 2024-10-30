<script lang="ts" setup>
import { useTemplateStore } from "@/hcms/templates/templates-store";
import TemplateForm from "@/hcms/templates/views/TemplateForm.vue";
import { TemplateType } from "@/hcms/types";
import { onMounted, onUnmounted } from "vue";

const template = {
  name: null,
  description: null,
  is_global: false,
  type: TemplateType.CONTENT,
  field_templates: [],
};

const route = useRoute();
const templateStore = useTemplateStore();

onUnmounted(() => (templateStore.item = null));

onMounted(async () => {
  if (route.name === "templates.create") {
    templateStore.item = template;
    return;
  }
  await templateStore.show(Number(route.params.id));
});
</script>
<template>
  <template-form />
</template>
