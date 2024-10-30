import { TOKEN_STORAGE_KEY } from "@/hcms/authorization/authorization-store";
import { useCommonStore } from "@/store/common-store";
import axios, { InternalAxiosRequestConfig } from "axios";

const a = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

a.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem(
      TOKEN_STORAGE_KEY,
    )}`;
    const commonStore = useCommonStore();

    commonStore.requestInProgress = true;

    return config;
  },
  (error) => {
    const commonStore = useCommonStore();
    commonStore.requestInProgress = false;

    return Promise.reject(error);
  },
);

a.interceptors.response.use(
  function (response) {
    const commonStore = useCommonStore();
    commonStore.requestInProgress = false;

    return response;
  },
  function (error) {
    const commonStore = useCommonStore();
    commonStore.requestInProgress = false;

    return Promise.reject(error);
  },
);

export default a;
