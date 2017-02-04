

<template>

<div v-loading.body="loading">
    <notificationFilters @filterChange="filterChanged"></notificationFilters>
    <el-table :data="notificationsList" empty-text="no notifications found" border stripe style="width: 100%">
        <el-table-column width="100">
            <template scope="scope">
                <router-link :to="{name:'notification-detail', params: {'id': scope.row.id}}">{{scope.row.id}}</router-link>
            </template>
        </el-table-column>
        <el-table-column prop="mediumname" label="Notifification Medium" width="180">
        </el-table-column>
        <el-table-column prop="notificationname" label="Notification Type" width="280">
        </el-table-column>
        <el-table-column label="Created At">
            <template scope="scope">
                {{ scope.row.createdAt | date('%Y-%m-%d %I:%M %p') }}
            </template>
        </el-table-column>
        <el-table-column prop="scheduleDate" label="Scheduled At">
            <template scope="scope">
                {{ scope.row.scheduleDate | date('%Y-%m-%d %I:%M %p') }}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="150">
        </el-table-column>
        <el-table-column label="Open Status" width="150">
            <template scope="scope">
                {{scope.row.is_open ? 'opened' : 'not opened'}}
            </template>
        </el-table-column>
    </el-table>
    <div class="block text-center" v-show="totalCount">
        <el-pagination :current-page="currentPage" @current-change="handlePaginationChange" :page-size="perPageCount" layout="prev, pager, next" :total="totalCount">
        </el-pagination>
    </div>
</div>

</template>

<script>

import notificationFilters from './notification-filters.vue'
import apiConfig from '../../config/apiConfig'
import axios from 'axios'

let CancelToken, source, apiPromise;

export default {
    name: 'notifications-list',
    components: { notificationFilters },
    data() {
        return {
            notificationsList: [],
            perPageCount: 50,
            currentPage: 1,
            totalCount: 0,
            loading: true
        }
    },
    mounted() {
        this.fetchData();
    },
    created(){
        let query = this.$route.query;
        this.currentPage = query.page ? parseInt(query.page) : 1;
    },
    watch: {
        $route: function(current, prev) {
            this.fetchData();
        }
    },
    methods: {
        handlePaginationChange(pageNo) {
            pageNo = pageNo > 1 ? pageNo : undefined;
            this.updateQueryParam('page', pageNo, true);
        },
        filterChanged(name, value){
            this.updateQueryParam(name, value);
        },
        updateQueryParam: function(name, value, isPagination) {
            let query = {};
            if(name !== 'reset'){
                query = Object.assign({}, this.$route.query, {
                    [name]: value
                });
            }

            if(!isPagination){
                this.currentPage = 1;
                query.page = undefined;
            }

            this.updateQuery(query);
        },
        fetchData() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getNotificationListings({
                query: this.$route.query
            }).url;

            if (!CancelToken) {
                CancelToken = CancelToken || axios.CancelToken;
                source = CancelToken.source();
            }

            if (apiPromise) {
                source.cancel();
                return;
            }


            apiPromise = true;
            this.$apiService.get(url, {
                cancelToken: source.token
            }).then((response) => {
                this.loading = false;
                apiPromise = false;
                let data = response && response.data || {};
                this.totalCount = data.totalCount || 0;
                this.notificationsList = data.content || [];
            }, (err) => {
                this.loading = false;
                apiPromise = false;
                this.$message.error({
                    showClose: true,
                    message: err.message || 'something went wrong.'
                });
            });
        },
        updateQuery(query) {
            query = query || {};
            this.$router.push({
                name: 'notifications-list',
                query: query
            });
        }
    }
}

</script>
