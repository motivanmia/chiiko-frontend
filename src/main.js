import './assets/scss/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'img-comparison-slider';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; 
import axios from 'axios';

axios.defaults.withCredentials = true;

const app = createApp(App);
const pinia = createPinia(); 

pinia.use(piniaPluginPersistedstate); 
app.use(pinia); 
app.use(router);

app.mount('#app');