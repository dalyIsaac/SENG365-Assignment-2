import axios from "axios";
import _Vue, { PluginObject } from "vue";
import { isString } from "lodash";
import { LoginValues } from "./auth.d";
import { baseUrl } from "../common";
import router from "@/router";

const isDefined = (s: any) => isString(s) && s !== "";

const TOKEN = "token";

const Auth: PluginObject<{}> = {
  install(Vue: typeof _Vue, options?: {}): void {
    Vue.login = async ({
      username,
      email,
      password
    }: LoginValues): Promise<boolean> => {
      if (!isDefined(username) && !isDefined(email)) {
        return false;
      }
      try {
        const { token } = (await axios.post(baseUrl + "/users/login", {
          username,
          email,
          password
        })).data;
        localStorage.setItem(TOKEN, token);
        return true;
      } catch (error) {
        console.error({ ...error });
        return false;
      }
    };

    Vue.loggedIn = (): boolean => {
      const token = localStorage.getItem(TOKEN);
      return token !== null;
    };

    Vue.logout = async (): Promise<void> => {
      try {
        await Vue.axiosAuthorized()!.post("/users/logout");
      } catch (error) {
        console.log({ ...error });
      } finally {
        localStorage.removeItem(TOKEN);
        router.push("/");
      }
    };

    Vue.isAuthorized = (): boolean => localStorage.getItem(TOKEN) !== null;

    Vue.axiosAuthorized = () => {
      const token = localStorage.getItem(TOKEN);
      if (token === null) {
        return null;
      }

      return axios.create({
        baseURL: baseUrl,
        headers: { "X-Authorization": token }
      });
    };
  }
};

_Vue.use(Auth);
