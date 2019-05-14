import axios from "axios";
import _Vue, { PluginObject } from "vue";
import { isString } from "lodash";
import { LoginValues } from "./auth.d";
import { baseUrl } from "../common";

const isDefined = (s: any) => isString(s) && s !== "";

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
        localStorage.setItem("token", token);
        return true;
      } catch (error) {
        console.error({ ...error });
        return false;
      }
    };
  }
};

_Vue.use(Auth);
