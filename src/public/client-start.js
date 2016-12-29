import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'
import spinner from './components/Spinner.vue'

Vue.use(VueResource);
Vue.component('spinner', spinner);

const app = new Vue({
    router,
    render: h => h(App)
});

app.$mount('#app');
