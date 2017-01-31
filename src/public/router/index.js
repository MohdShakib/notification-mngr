import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import templatesList from  '../views/templates/templates-list.vue'
import updateTemplate from  '../views/templates/update-template.vue'
import createTemplate from  '../views/templates/create-template.vue'
import notificationsList from  '../views/notifications/notifications-list.vue'
import notificationDetail from  '../views/notifications/notification-detail.vue'
import scheduleTemplate from '../views/templates/schedule-template.vue'
import campaignsList from '../views/campaigns/campaigns-list.vue'
import createCampaign from  '../views/campaigns/create-campaign.vue'
import updateCampaign from  '../views/campaigns/update-campaign.vue'
import notFound from '../views/404-template.vue'

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/notification/:id', name: 'notification-detail', component: notificationDetail,  meta: { title: 'notification detail' }  },
    { path: '/notifications-status', name: 'notifications-status', component: notificationsList, meta: { title: 'notifications list' }  },
    { path: '/schedule-template/:id', name: 'schedule-template', component: scheduleTemplate,  meta: { title: 'schedule template' } },
    { path: '/update-template/:id', name: 'update-template', component: updateTemplate,  meta: { title: 'update template' } },
    { path: '/add-template/:notificationTypeId/:mediumId', name: 'add-template', component: createTemplate, meta: { title: 'create template' }},
    { path: '/templates-list/:mediumId?', name: 'templates-list', component: templatesList, meta: { title: 'templates list' }},

    { path: '/campaigns', name: 'campaigns-list', component: campaignsList, meta: { title: 'campaigns list' } },
    { path: '/campaign/:id', name: 'campaign-detail', component: updateCampaign, meta: { title: 'campaign view', onlyView: true } },
    { path: '/campaigns/create', name: 'create-campaign', component: createCampaign, meta: { title: 'create campaign' } },
    { path: '/campaigns/update/:id', name: 'update-campaign', component: updateCampaign, meta: { title: 'update campaign' } },

    { path: '/', redirect: '/templates-list'},
    { path: '*', component: notFound,  meta: { title: '404 page' }}
  ]
})
