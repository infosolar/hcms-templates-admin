<template>
  <router-link
    v-if="permissionGranted(Scope.TEMPLATE_CREATE)"
    class="btn btn--primary"
    :to="{
      name: 'templates.create',
    }"
  >
    Create
  </router-link>
</template>
<script setup lang="ts">
import { permissionGranted } from "@/hcms/composable/use-authorized";
import { Scope } from "@/hcms/types";
</script>
