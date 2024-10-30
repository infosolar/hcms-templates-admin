import notify from "@/common/notify";
import templatesApi from "@/hcms/templates/templates-api";

import { FieldTemplate, Template } from "@/hcms/types";
import { usePaginatorStore } from "@/store/paginator-store";
import { AxiosError } from "axios";
import { defineStore } from "pinia";

export const useTemplateStore = defineStore("templateStore", () => {
  const item = ref<Template | null>();
  const items = ref<Template[]>();
  const errors = ref<Record<any, any>>();
  const validator = ref<{ form: any }>({ form: null });
  const paginator = usePaginatorStore();
  const router = useRouter();
  const index = async (params?: {
    name?: string | null;
    page?: number | null;
    type?: any | null;
    site_id?: number | null;
  }) => {
    const { data } = await templatesApi.index(params);
    items.value = [];
    items.value.push(...data.data);
    paginator.totalPages = data.last_page;
  };

  const show = async (id: number) => {
    try {
      const { data } = await templatesApi.show(id);
      item.value = data;
    } catch (e: any) {
      notify({
        message: e.response.body,
        type: "error",
      });
    }
  };

  const save = async () => {
    try {
      if (item.value?.id) {
        await templatesApi.update(item.value);

        notify({
          message: "Template saved",
          type: "success",
        });

        return;
      }
      const { data } = await templatesApi.create(item.value);

      router.push({
        name: "templates.edit",
        params: {
          id: data.id,
        },
      });

      notify({
        message: "Template saved",
        type: "success",
      });

      item.value = data;
    } catch (e: AxiosError | any) {
      notify({
        message: e.response?.data?.message,
        type: "error",
      });
    }
  };

  const destroyElement = async (element: FieldTemplate) => {
    if (!item.value?.id) {
      return;
    }

    try {
      await templatesApi.destroyElement(element, item.value.id);
    } catch (e: any) {
      notify({
        message: e.response.body,
        type: "error",
      });
    }
  };

  const destroy = async () => {
    if (!item.value?.id) {
      return;
    }

    try {
      await templatesApi.destroy(item.value);
    } catch (e: any) {
      notify({
        message: e.response.body,
        type: "error",
      });
    }
  };

  return {
    item,
    items,
    errors,
    validator,
    index,
    show,
    save,
    destroyElement,
    destroy,
  };
});
