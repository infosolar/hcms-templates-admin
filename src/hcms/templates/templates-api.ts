import httpClient from "@/api/http";
import { FieldTemplate, Template } from "@/hcms/types";
import { AxiosResponse } from "axios";

const index = async (params?: {
  name?: string | null;
  page?: number | null;
  is_global?: boolean | null;
  site_id?: number | null;
}): Promise<AxiosResponse> => {
  return httpClient.get("/templates", { params });
};

const show = async (id: number): Promise<AxiosResponse> => {
  return httpClient.get("/templates/" + id);
};

const create = async (data: any): Promise<AxiosResponse> => {
  return httpClient.post("/templates", data);
};

const update = async (data: any): Promise<AxiosResponse> => {
  return httpClient.put("/templates/" + data.id, data);
};

const destroyElement = async (
  element: FieldTemplate,
  template_id?: null | number,
) => {
  return httpClient.delete(`/templates/${element?.id}/field`, {
    data: {
      template_id,
      parent_template_id: element.template_id,
    },
  });
};

const destroy = async (template: Template): Promise<AxiosResponse> => {
  return httpClient.delete(`/templates/${template?.id}`);
};

export default {
  index,
  show,
  create,
  update,
  destroyElement,
  destroy,
};
