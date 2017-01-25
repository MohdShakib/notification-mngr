<style>

.filter-label {
    margin-top: -5px;
    color: grey;
}

</style>

<template>

<!-- <el-card class="box-card"> -->
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
            <el-select size="small" v-model="mediumId" @change="handleFilterChange('mediumId', mediumId)" filterable clearable placeholder="Notification Medium">
                <el-option v-for="item in notificationMediums" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="filter-label">
                Notification Medium
            </div>
        </el-form-item>
        <el-form-item offset="2">
            <el-select size="small" v-model="notificationTypeId" @change="handleFilterChange('notificationTypeId', notificationTypeId)" filterable clearable placeholder="Notification Type">
                <el-option v-for="item in notificationTypes" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="filter-label">
                Notification Type
            </div>
        </el-form-item>
        <el-form-item offset="2">
            <el-date-picker size="small" v-model="fromDate" @change="handleFilterChange('fromDate', fromDate, false, true)" format="yyyy-MM-dd" type="date" placeholder="From Date"></el-date-picker>
            <div class="filter-label">
                From Date
            </div>
        </el-form-item>
        <el-form-item offset="2">
            <el-date-picker size="small" v-model="toDate" @change="handleFilterChange('toDate', toDate, false, true)" format="yyyy-MM-dd" type="date" placeholder="To Date"></el-date-picker>
            <div class="filter-label">
                To Date
            </div>
        </el-form-item>
        <el-form-item offset="2">
            <el-select size="small" v-model="notificationStatusId" @change="handleFilterChange('status', notificationStatusId)" filterable clearable placeholder="Notification Status">
                <el-option v-for="item in notificationsStatus" :label="item.name" :value="item.key"></el-option>
            </el-select>
            <div class="filter-label">
                Notification Status
            </div>
        </el-form-item>
        <el-form-item offset="2">
            <el-checkbox size="small" v-model="openedStatus" @change="handleFilterChange('openStatus', openedStatus, 'opened')">Opened</el-checkbox>
        </el-form-item>
        <!-- <el-form-item offset="1">
        <span style="visibility:hidden;">Reset</span>
        <div>
        <el-button size="mini" @click="resetAllFilters()" type="danger">Reset</button>
        </div>
    </el-form-item> -->
    </el-form>
<!-- </el-card> -->
</template>

<script>

import {
    getNotificationTypes, getNotificationMediums, getNotificationsStatus
}
from '../../services/defaultService'

export default {
    name: 'notification-filters',
    data() {
        return {
            toDate: '',
            fromDate: '',
            mediumId: '',
            openedStatus: false,
            notificationTypeId: '',
            notificationStatusId: '',
            notificationTypes: [],
            notificationsStatus: [],
            notificationMediums: []
        }
    },
    mounted() {
        getNotificationTypes().then((notificationTypes) => {
            this.notificationTypes = notificationTypes.data || [];
        });

        getNotificationMediums().then((notificationMediums) => {
            this.notificationMediums = notificationMediums.data || [];
        });

        getNotificationsStatus().then((notificationsStatus) => {
            this.notificationsStatus = notificationsStatus.data || [];
        });
    },
    created() {
        let query = this.$route.query;
        this.toDate = query.toDate || '';
        this.fromDate = query.fromDate || '';
        this.mediumId = query.mediumId ? parseInt(query.mediumId) : '';
        this.openedStatus = (query.openStatus == 'opened') ? true : false;
        this.notificationTypeId = query.notificationTypeId ? parseInt(query.notificationTypeId) : '';
        this.notificationStatusId = query.status || '';
    },
    methods: {
        handleFilterChange(name, value, originalValue, isDate) {
                if (isDate && value) {
                    value = this.$options.filters.date(value, '%Y-%m-%d');

                }
                value = (value && originalValue) ? originalValue : (value || '');

                this.$emit('filterChange', name, value)
            },
            resetAllFilters() {

                // this.toDate = '';
                // this.fromDate = '';
                // this.mediumId = '';
                // this.openedStatus = false;
                // this.notificationTypeId = '';
                // this.notificationStatusId = '';
                //
                // this.$emit('filterChange', 'reset');
            }
    }
}

</script>
