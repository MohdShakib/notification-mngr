import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import templatesList from  '../views/templates/templates-list.vue'
import campaignsList from  '../views/campaigns-list.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/notifications-status', component: templatesList },
    { path: '/notifications-sent', name: 'new', component: templatesList },
    { path: '/templates-list', component: templatesList },
    { path: '/campaigns', component: campaignsList },
    { path: '/', redirect: '/templates-list' }
  ]
})
