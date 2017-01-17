module.exports = {
    sendNotification: {
        uri: 'madelyne/data/v3/entity/notification/sender'
    },
    flushApi: {
        uri: 'madelyne/data/v1/notification/removeFromCache?',
        mockUri: '/flushApiResponse.js'
    }
}
