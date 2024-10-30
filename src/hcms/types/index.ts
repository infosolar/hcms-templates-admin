export type AuthCredentials = {
  email: string | null;
  password: string | null;
};

export type Language = {
  id: number | null;
  name: string | null;
  code: string | null;
  origin?: string | null;
  active?: boolean;
};

export type Media = {
  id?: number;
  uuid: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  preview: string;
  src: Record<string, string>;
  breakpoints: string[];
  created_at: string;
};

export type Template = {
  id?: number | null;
  name: string | null;
  description: string | null;
  is_global: boolean;
  type: string;
  field_templates: FieldTemplate[];
};

export type FieldTemplate = {
  uuid?: string;
  id?: number;
  template_id?: number;
  name: string | null;
  reference_name: string | null;
  description: string | null;
  type_name: string;
  config?: Record<any, any>;
  field_templates: FieldTemplate[];
  dictionary_id?: number | null;
};

export enum PublishStatus {
  PUBLISH = "publish",
  BLOCKED = "blocked",
  HIDDEN = "hidden",
}

export enum TemplateType {
  CONTENT = "content",
  VALUE = "value",
  GLOBAL = "global",
}

export type Value = {
  id?: number;
  name: string;
  reference_name: string;
  template: Template | null;
  fields: Field[];
};

export type Content = {
  uri: string;
  url?: string;
  parent_id: null | number;
  nested?: Content[];
  publish_status: PublishStatus | null;
  reference_name: string | null;
  published_date: string | null;
  created_at?: string | null;
  breadcrumbs?: Record<string, any>[];
  ancestors_and_self?: Content[];
} & Value;

export type FContent = {
  _formatted: Content;
} & Content;

export type Field = {
  id?: number;
  uuid?: string;
  type_name: string;
  template?: FieldTemplate;
  template_id?: number;
  state: any;
  parent_id?: number;
  dictionary?: Dictionary | null;
  config: Record<any, any>;
  fields: Field[];
  media: Media | null;
  content: Content | null;
  values?: Value[];
  dictionary_id?: number | null;
};

export type Notification = {
  type: "error" | "success" | "warning" | "info" | undefined;
  message: string;
};

export type ContentReference = {
  id?: number | null;
  reference: string;
};

export type Dictionary = {
  id?: number | null;
  name: string;
  reference_name: string | null;
  template_id: number | null;
  template: Template | null;
};

export type Redirect = {
  id?: number | null;
  url: string | null;
  redirect: string | null;
};

export interface ListItem<T = any> {
  title: string;
  props: {
    [key: string]: any;
    title: string;
    value: any;
  };
  children?: ListItem<T>[];
}

export type TextTemplate = {
  id?: number;
  reference_name: string;
  pattern: Record<string, string>;
};

export type Administrator = {
  id?: number;
  name: string;
  email: string;
  position_description?: string | null;
  scopes: Scope[];
  active: boolean;
  password?: string | null;
};

export enum Scope {
  ALLOW_ALL = "allow:all",
  TEMPLATES_INDEX = "templates:index",
  TEMPLATE_CREATE = "template:create",
  TEMPLATE_EDIT = "template:save",
  TEMPLATE_DELETE = "template:delete",
  CONTENTS_INDEX = "contents:index",
  CONTENT_CREATE = "content:create",
  CONTENT_EDIT = "content:edit",
  CONTENT_DELETE = "content:delete",
  ADMINISTRATORS_INDEX = "administrators:index",
  ADMINISTRATOR_EDIT = "administrator:edit",
  ADMINISTRATOR_CREATE = "administrator:create",
}
