

<template>

<div v-loading.body="loading">
    <el-row >
        <el-col :span="18" :offset="3">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="12">
                        <el-select @change="checkTemplateExistence" v-model="mediumId">
                            <el-option v-for="item in notificationMediums" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <el-select @change="checkTemplateExistence" v-model="notificationTypeId">
                            <el-option v-for="item in notificationTypes" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <template v-if="canCreate">
                        <el-row v-if="isEmail">
                            <code>subject</code>
                            <el-input v-model="subject" placeholder="subject"></el-input>
                        </el-row>
                        <el-row>
                            <div v-if="isEmail"><code>body</code></div>
                            <el-input type="textarea" :rows="12" :cols="150" v-model="template" placeholder="content"></el-input>
                        </el-row>
                        <el-row>
                            <el-button @click="crateTemplate" :disabled="isDisabled" type="primary">Add</el-button>
                        </el-row>
                    </template>
                    <template v-else>
                        <div class="text-center">
                            Template already exist
                            OR
                            Something went wrong.
                        </div>
                    </template>
                </el-row>
            </el-card>
        </el-col>
    </el-row>

</template>

<script>

import {
    getNotificationTypes, getNotificationMediums
}
from '../../services/notificationService'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'add-template',
    data() {
        return {
            canCreate: false,
            isDisabled: true,
            isEmail: false,
            notificationTypes: [],
            notificationMediums: [],
            notificationTypeId: '',
            mediumId: '',
            subject: '',
            template: '',
            loading: true
        }
    },
    mounted() {

        this.mediumId = parseInt(this.$route.params.mediumId);
        this.notificationTypeId = parseInt(this.$route.params.notificationTypeId);

        this.checkTemplateExistence();

        getNotificationTypes().then((notificationTypes) => {
            this.notificationTypes = notificationTypes && notificationTypes.data || [];
        });

        getNotificationMediums().then((notificationMediums) => {
            this.notificationMediums = notificationMediums.data || [];
        });
    },
    computed: {
        isEmail() {
                return (this.mediumId == 1);
            },
            isDisabled() {
                return !(this.template && this.notificationTypeId && this.mediumId && (!this.isEmail || this.subject));
            }
    },
    methods: {
        checkTemplateExistence: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getTemplateDetails({
                query: {
                    notificationTypeId: this.notificationTypeId,
                    mediumId: this.mediumId
                }
            }).url;
            this.$apiService.get(url).then((response) => {
                let data = response && response.data;
                if (!data) {
                    this.canCreate = true;
                } else {
                    this.canCreate = false;
                }
                this.loading = false;
            }, (error) => {
                this.loading = false;
                this.$notify.error({
                    title: 'Error',
                    message: 'some errors occurred, please check after sometime.'
                });
            });
        },
        crateTemplate: function() {

            if (!this.template || (this.isEmail && !this.subject)) {
                this.$notify.warning({
                    title: 'Warning',
                    message: 'shown field(s) are mandatory.'
                });
                return;
            }

            let postData = {
                content: this.template,
                mediumId: this.mediumId,
                notificationTypeId: this.notificationTypeId,
            }

            if (this.isEmail) {
                postData.subject = this.subject;
            }


            let url = apiConfig.apiHandlers.createTemplate().url;
            this.$apiService.post(url, postData).then((res) => {
                let message = res && res.message;
                this.$notify.success({
                    title: 'Success',
                    message: message
                });
            }, (err) => {
                this.$notify.error({
                    title: 'Error',
                    message: err.message
                });
            });

        }
    }
}

</script>
