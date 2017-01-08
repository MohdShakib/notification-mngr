

<template>

<div v-loading.body="loading">
    <el-table :data="notificationsList" empty-text="no notifications found" border stripe style="width: 100%" >
        <el-table-column  width="100">
            <template scope="scope">
                <router-link :to="{name:'notification-detail', params: {'id': scope.row.id}}">{{scope.row.id}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="mediumname" label="Notifification Medium" width="180">
        </el-table-column>
        <el-table-column prop="notificationname" label="Notification Type" width="280">
        </el-table-column>
        <el-table-column prop="createdAt" label="Created At">
        </el-table-column>
        <el-table-column prop="scheduleDate" label="Scheduled At">
        </el-table-column>
        <el-table-column prop="status" label="Status" width="150">
        </el-table-column>
        <el-table-column label="Open Status" width="150">
            <template scope="scope">
                {{scope.row.is_open ? 'opened' : 'not opened'}}
            </template>
        </el-table-column>
    </el-table>

</div>

</template>

<script>

import apiConfig from '../../config/apiConfig'

export default {
    name: 'notifications-list',
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

            }, (err)=>{
                this.loading = false;
                this.$notify.error({
                    title: 'Error',
                    message: err.message || 'something went wrong.'
                });
            });
        }
    }
}

</script>
