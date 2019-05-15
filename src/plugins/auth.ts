import axios from "axios";
import _Vue, { PluginObject } from "vue";
import { isString } from "lodash";
import { LoginValues } from "./auth.d";
import { baseUrl } from "../common";
import router from "@/router";

const isDefined = (s: any) => isString(s) && s !== "";

const TOKEN = "token";
const USER_ID = "userId";

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
        const { token, userId } = (await axios.post(baseUrl + "/users/login", {
          username,
          email,
          password
        })).data;
        localStorage.setItem(TOKEN, token);
        localStorage.setItem(USER_ID, userId);
        return true;
      } catch (error) {
        console.error({ ...error });
        return false;
      }
    };

    Vue.isLoggedIn = (): boolean => {
      const token = localStorage.getItem(TOKEN);
      const userId = localStorage.getItem(USER_ID);
      return token !== null && userId !== null;
    };

    Vue.logout = async (): Promise<void> => {
      try {
        await Vue.axiosAuthorized().post("/users/logout");
      } catch (error) {
        console.log({ ...error });
      } finally {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem(USER_ID);
        router.push("/users/logout");
      }
    };

    Vue.axiosAuthorized = () => {
      // assumes that the token is always present
      const token = localStorage.getItem(TOKEN);

      return axios.create({
        baseURL: baseUrl,
        headers: { "X-Authorization": token }
      });
    };

    Vue.getUserId = (): number | null => {
      const userId = localStorage.getItem(USER_ID);
      if (userId === null) {
        return null;
      }
      return Number(userId);
    };
  }
};

_Vue.use(Auth);
