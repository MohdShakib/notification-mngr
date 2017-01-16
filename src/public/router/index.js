import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import templatesList from  '../views/templates/templates-list.vue'
import updateTemplate from  '../views/templates/update-template.vue'
import addTemplate from  '../views/templates/add-template.vue'
import notificationsList from  '../views/notifications/notifications-list.vue'
import notificationDetail from  '../views/notifications/notification-detail.vue'
import scheduleTemplate from '../views/templates/schedule-template.vue'
import createCampaign from  '../views/campaigns/create-campaign.vue'
import notFound from '../views/404-template.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/notification/:id', name: 'notification-detail', component: notificationDetail },
    { path: '/notifications-status', name: 'notifications-status', component: notificationsList },
    { path: '/schedule-template/:id', name: 'schedule-template', component: scheduleTemplate },
    { path: '/update-template/:id', name: 'update-template', component: updateTemplate },
    { path: '/add-template/:notificationTypeId/:mediumId', name: 'add-template', component: addTemplate },
    { path: '/templates-list/:mediumId?', name: 'templates-list', component: templatesList },
    { path: '/campaigns', component: createCampaign },
    { path: '/', redirect: '/templates-list' },
    { path: '*', component: notFound}
  ]
})
