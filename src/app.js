import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource'

Vue.use(VueResource);

const app = new Vue({
    router,
    render: h => h(App)
});

app.$mount('#app');
