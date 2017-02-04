

<template>

<div v-loading.body="loading">
    <el-row :gutter="20" >
        <el-col :span="8">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    Notification Details
                </div>
                <div>
                    <key-value label="user id" :value="user_id"></key-value>
                    <key-value label="notification id" :value="id"></key-value>
                    <key-value label="notification medium" :value="mediumName"></key-value>
                    <key-value label="notification type" :value="typeName"></key-value>
                    <key-value label="notification status" :value="status"></key-value>
                    <key-value label="open status" :value="openStatus"></key-value>
                    <key-value v-if="created_at" label="created at" :value="created_at  | date('%Y-%M-%d %I:%M %p')" ></key-value>
                    <key-value v-if="schedule_at" label="schedule at" :value="schedule_at  | date('%Y-%M-%d %I:%M %p')"></key-value>
                </div>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-card class="box-card">
                <template v-if="prop1">
                    <div slot="header" class="clearfix" v-if="prop1">
                        <code>{{prop1}}</code>
                        <div v-html="template[prop1]"></div>
                    </div>
                    <code v-if="prop2">{{prop2}}</code>
                    <div v-html="template[prop2]">
                    </div>
                </template>
                <template v-else>
                    <code v-if="mediumName">{{mediumName}}</code>
                    <div v-html="template"></div>
                </template>
            </el-card>
        </el-col>
    </el-row>
</div>

</template>

<script>

import apiConfig from '../../config/apiConfig'

export default {
    name: 'notification-detail',
    data() {
        return {
            id: '',
            status: '',
            mediumName: '',
            typeName: '',
            created_at: '',
            schedule_date: '',
            openStatus: '',
            user_id: '',
            template: '',
            prop1: '',
            prop2: '',
            loading: true
        }
    },
    components: {
        'key-value': {
            name: 'key-value',
            props: ['label', 'value'],
            template: `
                <p v-if="value">
                    <strong class="text-capitalize">{{label}}</strong> : <span>{{value}}</sapn>
                </p>
            `
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getNotificationDetail({
                id: this.$route.params.id
            }).url;
            this.$apiService.get(url).then((response) => {
                let data = response && response.data || {};

                this.loading = false;
                if (data.type === 'object') {
                    this.prop1 = data.prop1;
                    this.prop2 = data.prop2;
                }
                this.id = data.id;
                this.template = data.template;
                this.status = data.status;
                this.openStatus = data.isOpen ? 'opened' : 'not opened';
                this.typeName = data.typeName;
                this.mediumName = data.mediumName;
                this.created_at = data.created_at;
                this.schedule_at = data.schedule_at;
                this.user_id = data.user_id;

            }, (error) => {
                this.loading = false;
                console.log('error-callback............');
            });

        }
    }
}

</script>
