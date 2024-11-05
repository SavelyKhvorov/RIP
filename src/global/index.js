import axios from "axios"
import cookies from "./cookies.js"

const global = {
  $axios: axios,
  $cookies: cookies
};

export {global as default}