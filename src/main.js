import './assets/scss/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
// import 'img-comparison-slider'; //滑動對比套件

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
