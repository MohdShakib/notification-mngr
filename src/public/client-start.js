import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import spinner from './components/Spinner.vue'
import apiService from './services/apiService'

Vue.use(VueResource);
// Vue.http.options.emulateJSON = true;

Vue.prototype.$apiService = apiService;
Vue.component('spinner', spinner);

const app = new Vue({
    router,
    render: h => h(App)
});

app.$mount('#app');
