

<template>

<div>
    <spinner :show="loading"></spinner>
    <table class="table table-bordered table-striped" v-if="!loading">
        <thead>
            <tr>
                <th class="col-lg-1 text-center">#Id</th>
                <th class="col-lg-2">Notification Medium
                    <!-- <select class="form-control input-sm">
                        <option value="0" selected>All</option>
                        <option v-for="item in notificationMediums" :value="item.id">{{item.name}}</option>
                    </select> -->
                </th>
                <th class="col-lg-2">
                    Notification Type
                </th>
                <th class="col-lg-2">created date</th>
                <th class="col-lg-2">scheduled date</th>
                <th class="col-lg-2">status</th>
                <th class="col-lg-1">open status</th>
            </tr>
        </thead>
        <tbody>
            <tableRowMessage v-if="!notificationsList.length" cols="7">
                No notification available
            </tableRowMessage>
            <notificationsItem v-for="(item,index) in notificationsList" :item="item" :index="index"></notificationsItem>
        </tbody>
    </table>
</div>

</template>

<script>

import notificationsItem from './notification-item.vue'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'notifications-list',
    components: { notificationsItem },
    data() {
        return {
            notificationsList: [],
            notificationMediums: [],
            notificationTypes: [],
            loading: true
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData: function(){
            this.loading = true;
            let url = apiConfig.apiHandlers.getNotificationListings().url;
            this.$apiService.get(url).then((response)=>{
                console.log(response);
                this.loading = false;
                let data  = response && response.data || {};
                this.notificationsList = data.content || [];
                this.notificationMediums = data.medium || [];
                this.notificationTypes = data.notification || [];

            }, (error)=>{
                this.loading = false;
                console.log('error-callback............');
            });
        }
    }
}

</script>
