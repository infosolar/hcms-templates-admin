<template>
  <v-form ref="form" lazy-validation>
    <div class="wrapper" v-if="templateStore.item">
      <div class="input__block input__block__content">
        <h3 class="input__block__title">Template name</h3>
        <p class="input__block__details">The name of the template</p>
        <v-text-field
          v-model="templateStore.item.name"
          :rules="validationRules"
          hint="The name of the template"
          persistent-hint
          required
          variant="outlined"
          :hide-details="true"
        />
      </div>
      <div class="input__block input__block__content">
        <h3 class="input__block__title">Template description</h3>
        <p class="input__block__details">The description of the template</p>
        <v-text-field
          v-model="templateStore.item.description"
          hint="The description of the template"
          persistent-hint
          variant="outlined"
          :hide-details="true"
        />
      </div>
      <v-radio-group
        v-model="templateStore.item.type"
        density="compact"
        inline
        label="Set type of the template"
        class="input__radiogroup"
      >
        <v-radio
          :value="TemplateType.CONTENT"
          class="mr-4"
          density="compact"
          label="Content"
        ></v-radio>
        <v-radio
          :value="TemplateType.GLOBAL"
          class="mr-4"
          density="compact"
          label="Global"
        ></v-radio>
        <v-radio
          :value="TemplateType.VALUE"
          class="mr-4"
          density="compact"
          label="Dictionary"
        ></v-radio>
      </v-radio-group>
      <button
        v-if="templateStore.item.id && permissionGranted(Scope.TEMPLATE_DELETE)"
        class="btn btn--underscore"
        type="button"
        @click="destroy"
      >
        Delete
      </button>
      <draggable
        :list="templateStore.item.field_templates"
        class="dragArea list-group w-full"
        handle=".handle"
      >
        <frame-template-view
          v-for="groupTemplate in templateStore.item.field_templates"
          :key="groupTemplate.uuid"
          :disableEditing="disableEditGroup(groupTemplate)"
          :template="groupTemplate"
          class="mt-4"
          @clone="onCloneItem"
          @remove="onRemoveItem"
        />
      </draggable>
    </div>
  </v-form>
  <div
    v-if="permissionGranted(Scope.TEMPLATE_EDIT)"
    class="text-right btn__group mt-4"
    style="width: 100%"
  >
    <v-btn
      class="btn btn--tertiary btn__group__item"
      variant="flat"
      v-if="templateStore.item"
      @click="
        templateStore.item.field_templates.push(
          JSON.parse(JSON.stringify(FRAME.template)),
        )
      "
    >
      Add {{ FRAME.name }}
    </v-btn>
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          :disabled="commonStore.requestInProgress"
          class="btn btn--quaternary btn__group__item"
          v-bind="props"
          variant="flat"
        >
          Add global Template
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(globalTemplate, index) in globalTemplates"
          :key="index"
          :value="index"
        >
          <v-list-item-title
            @click="
              addGlobalTemplatesFieldGroup(globalTemplate.field_templates)
            "
          >
            {{ globalTemplate.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import notify from "@/common/notify";
import { useAuthorizationStore } from "@/hcms/authorization/authorization-store";
import {
  disableInputs,
  permissionGranted,
} from "@/hcms/composable/use-authorized";

import { FRAME } from "@/hcms/content-builder/templates";
import FrameTemplateView from "@/hcms/content-builder/Templates/FrameTemplateView.vue";
import { cloneFieldTemplate } from "@/hcms/helpers/fields-functions";
import { useTemplateStore } from "@/hcms/templates/templates-store";
import { useCommonStore } from "@/store/common-store";

import { FieldTemplate, Scope, TemplateType } from "@/hcms/types";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const templateStore = useTemplateStore();
const globalTemplates = computed(() => templateStore.items);
const commonStore = useCommonStore();
const form = ref();
const validationRules = [(v: any) => !!v || "is required"];

onMounted(async () => {
  templateStore.validator.form = form;
  await templateStore.index({ type: [TemplateType.GLOBAL] });

  if (route.params.id) {
    await templateStore.show(Number(route.params.id));
  }
});

const authorizationStore = useAuthorizationStore();

watch(
  () => authorizationStore.authenticatedUser,
  () => {
    if (!permissionGranted(Scope.TEMPLATE_EDIT)) {
      disableInputs(form.value);
    }
  },
);

function addGlobalTemplatesFieldGroup(fieldGroups: FieldTemplate[]) {
  if (!templateStore.item) return;
  templateStore.item.field_templates.push(...fieldGroups);
}

async function onRemoveItem(fieldGroupTemplate: FieldTemplate) {
  if (!templateStore.item) return;

  if (fieldGroupTemplate.id) {
    await templateStore.destroyElement(fieldGroupTemplate);
  }

  templateStore.item.field_templates.splice(
    templateStore.item.field_templates.indexOf(fieldGroupTemplate),
    1,
  );
}

function onCloneItem(fieldGroupTemplate: FieldTemplate) {
  if (!templateStore.item) return;

  const clonedTemplate = JSON.parse(JSON.stringify(fieldGroupTemplate));
  templateStore.item.field_templates.push(
    cloneFieldTemplate(clonedTemplate) as FieldTemplate,
  );
}

async function destroy() {
  try {
    await templateStore.destroy();
    notify({
      message: "Template has been deleted",
      type: "success",
    });
    await router.push({ name: "templates.index" });
  } catch (e: any) {
    notify({
      message: e.message,
      type: "info",
    });
  }
}

function disableEditGroup(fieldTemplate: FieldTemplate) {
  if (!templateStore.item) return;

  if (!templateStore.item.id && fieldTemplate.id) {
    return true;
  } else if (templateStore.item.id && !fieldTemplate.id) {
    return false;
  } else if (templateStore.item.id && fieldTemplate.id) {
    return Number(fieldTemplate?.template_id) !== templateStore.item.id;
  }
  return false;
}
</script>
