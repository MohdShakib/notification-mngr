import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import templatesList from  '../views/templates/templates-list.vue'
import templatesUpdate from  '../views/templates/template-update.vue'
import notificationsList from  '../views/notifications/notifications-list.vue'
import notificationDetail from  '../views/notifications/notification-detail.vue'
import campaignsList from  '../views/campaigns-list.vue'
import notFound from '../views/404-template.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/notification/:id', name: 'notification-detail', component: notificationDetail },
    { path: '/notifications-status', name: 'notifications-status', component: notificationsList },
    { path: '/notifications-sent', name: 'notifications-sent', component: templatesList },
    { path: '/templates-list/:mediumId?', name: 'templates-list', component: templatesList },
    { path: '/template/:id', name: 'template-update', component: templatesUpdate },
    { path: '/campaigns', component: campaignsList },
    { path: '/', redirect: '/templates-list' },
    { path: '*', component: notFound}
  ]
})
