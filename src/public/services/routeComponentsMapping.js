const   templatesList   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/templates/templates-list.vue'));
            })
        }),
        createTemplate   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/templates/create-template.vue'));
            })
        }),
        updateTemplate   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/templates/update-template.vue'));
            })
        }),
        scheduleTemplate   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/templates/schedule-template.vue'));
            })
        }),
        notificationsList   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/notifications/notifications-list.vue'));
            })
        }),
        notificationDetail   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/notifications/notification-detail.vue'));
            })
        }),
        campaignsList   = (resolve => {
            require.ensure([], () => {
                resolve(require('../views/campaigns/campaigns-list.vue'));
            })
        }),
        createCampaign  =  (resolve => {
            require.ensure([], () => {
                resolve(require('../views/campaigns/create-campaign.vue'));
            })
        }),
        updateCampaign  =  (resolve => {
            require.ensure([], () => {
                resolve(require('../views/campaigns/update-campaign.vue'));
            })
        }),
        notFound  =  (resolve => {
            require.ensure([], () => {
                resolve(require('../views/404-template.vue'));
            })
        });


module.exports = {
    templatesList,
    createTemplate,
    updateTemplate,
    scheduleTemplate,
    notificationsList,
    notificationDetail,
    campaignsList,
    createCampaign,
    updateCampaign,
    notFound
}
