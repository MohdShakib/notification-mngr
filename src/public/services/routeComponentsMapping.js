function resolvePath(path){
    return (resolve => {
        require.ensure([], () => {
            resolve(require(`../views/${path}.vue`));
        })
    });
}

const   templatesList       = resolvePath('templates/templates-list'),
        createTemplate      = resolvePath('templates/create-template'),
        updateTemplate      = resolvePath('templates/update-template'),
        scheduleTemplate    = resolvePath('templates/schedule-template'),

        notificationsList   = resolvePath('notifications/notifications-list'),
        notificationDetail  = resolvePath('notifications/notification-detail'),

        campaignsList       = resolvePath('campaigns/campaigns-list'),
        createCampaign      = resolvePath('campaigns/create-campaign'),
        updateCampaign      = resolvePath('campaigns/update-campaign'),
        notFound            = resolvePath('404-template');


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
