import Vue from "vue";

export interface LoginValues {
  username?: string;
  email?: string;
  password: string;
}

declare module "vue/types/vue" {
  interface VueConstructor {
    login: ({ username, email, password }: LoginValues) => Promise<boolean>;
    loggedIn: () => boolean;
  }
}
