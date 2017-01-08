import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'

import apiService from './services/apiService'
import 'element-ui/lib/theme-default/index.css'
import './styles/main.css'

Vue.use(VueResource);
Vue.use(ElementUI);
// Vue.http.options.emulateJSON = true;

Vue.prototype.$apiService = apiService;

const app = new Vue({
    router,
    render: h => h(App)
});

app.$mount('#app');
