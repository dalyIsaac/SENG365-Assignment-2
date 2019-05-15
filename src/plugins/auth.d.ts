import Vue from "vue";
import { AxiosInstance } from "axios";

export interface LoginValues {
  username?: string;
  email?: string;
  password: string;
}

declare module "vue/types/vue" {
  interface VueConstructor {
    login: ({ username, email, password }: LoginValues) => Promise<boolean>;
    loggedIn: () => boolean;
    logout: () => Promise<void>;
    isAuthorized: () => boolean;
    axiosAuthorized: () => AxiosInstance | null;
  }
}
