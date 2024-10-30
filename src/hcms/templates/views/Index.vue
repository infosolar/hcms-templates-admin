<template>
  <v-row class="form form__content-temp-filter">
    <v-row class="form__content-temp-filter__l-block">
      <v-col cols="3">
        <div class="input__block">
          <h3 class="input__block__title">Search by title/description</h3>
          <v-text-field
            v-model="searchFilter.name"
            density="compact"
            hide-details="auto"
            placeholder="Search by title/description"
            required
            variant="outlined"
          />
        </div>
      </v-col>
    </v-row>
    <v-col cols="5" class="translates form__content-temp-filter__r-block">
      <h3 class="translates__title">Selected template type</h3>
      <div class="form__content-temp-filter__r-block__row">
        <v-col>
          <v-checkbox
            class="text-caption"
            v-model="searchFilter.type"
            :value="TemplateType.CONTENT"
            label="Content"
            :hide-details="true"
          >
            <template v-slot:label>
              <span class="text-caption text-capitalize">{{
                TemplateType.CONTENT
              }}</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            class="text-caption"
            v-model="searchFilter.type"
            :value="TemplateType.VALUE"
            label="Dictionary"
            :hide-details="true"
          >
            <template v-slot:label>
              <span class="text-caption text-capitalize">{{
                TemplateType.VALUE
              }}</span>
            </template>
          </v-checkbox>
        </v-col>
        <v-col>
          <v-checkbox
            class="text-caption"
            v-model="searchFilter.type"
            :value="TemplateType.GLOBAL"
            label="Global"
            :hide-details="true"
          >
            <template v-slot:label>
              <span class="text-caption text-capitalize">{{
                TemplateType.GLOBAL
              }}</span>
            </template>
          </v-checkbox>
        </v-col>
      </div>
    </v-col>
  </v-row>
  <v-table class="table table--primary">
    <col width="50px" />
    <col width="calc(100% - 50px - 430px - 292px)" />
    <col width="430px" />
    <col width="292px" />
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Description</th>
        <th>Type</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="template in templatesStore.items" :key="String(template.id)">
        <td>{{ template.id }}</td>
        <td>{{ template.name }}</td>
        <td>{{ template.description }}</td>
        <td>
          <v-chip
            label
            variant="flat"
            size="small"
            v-if="template.type"
            :color="getColor(template.type)"
            inline
          >
            <span class="text-overline"> {{ template.type }} </span>
          </v-chip>
        </td>
        <td>
          <router-link
            :to="{
              name: 'templates.edit',
              params: {
                id: template.id,
              },
            }"
            class="btn"
          >
            <img
              alt="Pen icon"
              class="icon"
              src="@/assets/images/icons/pen.svg"
            />
            <span>Edit</span>
          </router-link>
        </td>
      </tr>
    </tbody>
    <template v-slot:bottom>
      <v-pagination
        v-model="searchFilter.page"
        :length="lastPage"
        :total-visible="7"
        density="compact"
      ></v-pagination>
    </template>
  </v-table>
</template>

<script lang="ts" setup>
import { useTemplateStore } from "@/hcms/templates/templates-store";
import { usePaginatorStore } from "@/store/paginator-store";
import { TemplateType } from "@/hcms/types";
import { computed, onMounted, ref, watch } from "vue";

const templatesStore = useTemplateStore();
const paginator = usePaginatorStore();
const lastPage = computed(() => paginator.totalPages);

type TemplatesFilter = {
  page: any;
  name: any;
  site_id: any;
  type: any;
};

let searchFilter = ref<TemplatesFilter>({
  page: null,
  name: null,
  site_id: null,
  type: [],
});

const savedFilter = ref();

onMounted(async () => {
  savedFilter.value = localStorage.getItem("templates-filter")
    ? JSON.parse(String(localStorage.getItem("templates-filter")))
    : {};

  searchFilter.value.type = savedFilter.value.type || [TemplateType.CONTENT];
});

let searchRequest: any = null;

watch(
  searchFilter.value,
  async () => {
    clearInterval(searchRequest);

    if (searchFilter.value.name?.length && searchFilter.value.name.length < 3) {
      return;
    }

    localStorage.setItem(
      "templates-filter",
      JSON.stringify(searchFilter.value),
    );
    searchRequest = setTimeout(
      async () => await templatesStore.index(searchFilter.value),
      800,
    );
  },
  { deep: true },
);

function getColor(type: string): string {
  if (type === TemplateType.CONTENT) return "info";
  if (type === TemplateType.VALUE) return "success";
  return "error";
}
</script>
