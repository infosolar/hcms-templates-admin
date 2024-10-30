<template>
  <div class="header__actions">
    <router-link
      class="btn btn--secondary"
      :to="{
        name: 'templates.index',
      }"
    >
      Back
    </router-link>
    <button
      v-if="permissionGranted(Scope.TEMPLATE_EDIT)"
      class="btn btn--primary"
      @click="save"
    >
      Save
    </button>
  </div>
</template>

<script lang="ts" setup>
import { permissionGranted } from "@/hcms/composable/use-authorized";
import { useTemplateStore } from "@/hcms/templates/templates-store";
import { Scope } from "@/hcms/types";
import { ref } from "vue";

const form = ref(null);
const templateStore = useTemplateStore();

async function save() {
  //@ts-ignore
  form.value = templateStore.validator?.form;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const result = await form.value?.validate();

  if (result.valid === true) {
    await templateStore.save();
  }
}
</script>
