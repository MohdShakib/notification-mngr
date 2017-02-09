import Vue from 'vue'
//import vueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import vueFilters from 'vue-filter'
import locale from 'element-ui/lib/locale/lang/en'

import apiService from './services/apiService'
import 'element-ui/lib/theme-default/index.css'
import './styles/main.css'

//Vue.use(vueResource);
Vue.use(vueFilters);
Vue.use(ElementUI, { locale });

// Vue.http.options.emulateJSON = true;

Vue.prototype.$apiService = apiService;

const app = new Vue({
    router,
    render: h => h(App)
});

app.$mount('#app');
