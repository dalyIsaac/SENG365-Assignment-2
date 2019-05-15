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
    isLoggedIn: () => boolean;
    logout: () => Promise<void>;
    axiosAuthorized: () => AxiosInstance;
  }
}
