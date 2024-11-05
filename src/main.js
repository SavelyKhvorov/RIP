import "./styles/styles.less";
import global from "./global"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';


const app = createApp(App)
const pinia = createPinia();

pinia.use(({ store }) => {
  store.$global = app.config.globalProperties;
})

Object.keys(global).forEach((method) => {
  app.config.globalProperties[method] = global[method];
})


app.config.globalProperties.$axios = axios;
app.use(pinia).use(router);

router.isReady().then(() => app.mount("#app"));
