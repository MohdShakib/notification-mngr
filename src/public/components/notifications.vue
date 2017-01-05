<style>

.notifications {
    position: fixed;
    right: 10px;
    top: 70px;
    width: 500px;
    z-index: 1;
}

.notification p {
    margin-right: 20px;
}

</style>

<template id="notifications">

<div class="notifications">
    <notification v-for="notification in notifications" :notification="notification" @close-notification="removeNotification" transition="fade" inline-template>
        <div class="notification callout animated alert" :class="notification.type ? 'alert-'+notification.type : 'alert-success'" transition="fade">
            <!-- <button @click="triggerClose(notification)" class="close-button" aria-label="Close alert" type="button">
                <span aria-hidden="true">&times;</span>
            </button> -->
            <button type="button" class="close" data-dismiss="modal" @click="triggerClose(notification)" >&times;</button>
            <h5 v-if="notification.title">{{notification.title}}</h5>
            <p>
                {{notification.text}}
            </p>
        </div>
    </notification>
</div>

</template>

<script>

import NotificationStore from '../store/notificationStore'

export default {
    components: {
        notification: {
            props: ['notification'],
            data() {
                return { timer: null };
            },
            mounted() {
                let timeout = this.notification.hasOwnProperty('timeout') ? this.notification.timeout : true;
                if (timeout) {
                    let delay = this.notification.delay || 3000;
                    this.timer = setTimeout(function() {
                        this.triggerClose(this.notification);
                    }.bind(this), delay)
                }
            },

            methods: {
                triggerClose: function(notification) {
                    clearTimeout(this.timer);
                    this.$emit('close-notification', notification);
                }
            }
        }
    },
    data() {
        return {
            notifications: NotificationStore.state
        }
    },
    methods: {
        removeNotification: function(notification) {
            NotificationStore.removeNotification(notification)
        }
    }
}

</script>
