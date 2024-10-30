import { Scope } from "@/hcms/types";
import { defineAsyncComponent } from "vue";
import { RouteRecordRaw } from "vue-router";

export default <RouteRecordRaw[]>[
  {
    path: "templates",
    component: () => import("@/modules/Index.vue"),
    children: [
      {
        path: "",
        name: "templates.index",
        component: () => import("@/hcms/templates/views/Index.vue"),
        meta: {
          title: "Templates",
          auth: true,
          actions: defineAsyncComponent(
            () => import("@/hcms/templates/views/header/Create.vue"),
          ),
          scope: Scope.TEMPLATES_INDEX,
        },
      },
      {
        path: ":id/edit",
        name: "templates.edit",
        component: () =>
          import("@/hcms/templates/views/TemplateFormWrapper.vue"),
        meta: {
          title: "Update Template",
          auth: true,
          actions: defineAsyncComponent(
            () => import("@/hcms/templates/views/header/Actions.vue"),
          ),
          scope: Scope.TEMPLATE_EDIT,
        },
      },
      {
        path: "create",
        name: "templates.create",
        component: () =>
          import("@/hcms/templates/views/TemplateFormWrapper.vue"),
        meta: {
          title: "Create content templates",
          auth: true,
          actions: defineAsyncComponent(
            () => import("@/hcms/templates/views/header/Actions.vue"),
          ),
          scope: Scope.TEMPLATE_CREATE,
        },
      },
    ],
    meta: {
      title: "Templates",
      auth: true,
      permissions: [],
    },
  },
];
