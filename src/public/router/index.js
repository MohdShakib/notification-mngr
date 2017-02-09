import Vue from 'vue'
import Router from 'vue-router'
import components from '../services/routeComponentsMapping'
import { isUserLoggedIn } from '../services/loginService'

Vue.use(Router);

let router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/notifications', name: 'notifications-list', component: components.notificationsList, meta: { title: 'notifications list' }  },
    { path: '/notification/:id', name: 'notification-detail', component: components.notificationDetail,  meta: { title: 'notification detail' }  },

    { path: '/templates/:mediumId?', name: 'templates-list', component: components.templatesList, meta: { title: 'templates list' }},
    { path: '/template/update/:id', name: 'update-template', component: components.updateTemplate,  meta: { title: 'update template', requiresAuth: true } },
    { path: '/template/create/:notificationTypeId/:mediumId', name: 'create-template', component: components.createTemplate, meta: { title: 'create template', requiresAuth: true }},
    { path: '/template/schedule/:id', name: 'schedule-template', component: components.scheduleTemplate,  meta: { title: 'schedule template', requiresAuth: true } },

    { path: '/campaigns', name: 'campaigns-list', component: components.campaignsList, meta: { title: 'campaigns list' } },
    { path: '/campaign/:id', name: 'campaign-detail', component: components.updateCampaign, meta: { title: 'campaign view', onlyView: true } },
    { path: '/campaigns/create', name: 'create-campaign', component: components.createCampaign, meta: { title: 'create campaign', requiresAuth: true } },
    { path: '/campaigns/update/:id', name: 'update-campaign', component: components.updateCampaign, meta: { title: 'update campaign', requiresAuth: true } },

    { path: '/', redirect: '/templates'},
    { path: '*', component: components.notFound,  meta: { title: '404 page' }}
  ]
})

router.beforeEach((to, from, next) => {
    let appInstance = router.app;
    if (to.matched.some(record => record.meta.requiresAuth)) {
        isUserLoggedIn().then((res)=>{
            next();
        },(err)=>{
            appInstance.$message.warning({
                message: 'Authencation neededy! Please login.'
            });
        });
    } else {
        next();
    }
});

export default router;
