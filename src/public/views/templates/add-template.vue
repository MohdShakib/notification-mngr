

<template>

<div>
    <spinner :show="loading"></spinner>
    <div class="col-lg-12" v-if="!loading">
        <div class="col-lg-8 col-lg-offset-2">
            <div class="form-inline">
                <div class="form-group">
                    <label>Notification Medium: </label>
                    <div>
                        <select class="form-control input-md" @change="changeMedium" v-model="mediumId">
                            <option value="">All</option>
                            <option v-for="item in notificationMediums" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="pull-right form-group">
                    <label>Notification Name: </label>
                    <div>
                    <select class="form-control input-md" v-model="notificationTypeId">
                        <option value="">All</option>
                        <option v-for="item in notificationTypes" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
                </div>
            </div>
            <br/>
            <div>
                <div class="form-group" v-if="prop1">
                    <div><code>{{prop1}}</code></div>
                    <input type="Subject" class="form-control" id="subject" v-model="subject" placeholder="Subject">
                </div>
                <div class="form-group">
                    <div v-if="prop2"><code>{{prop2}}</code></div>
                    <textarea rows="15" cols="150" class="form-control" v-model="template" placeholder="body"></textarea>
                </div>
                <button type="submit" @click="updateTemplate" class="btn btn-primary btn-md">Add</button>
            </div>
        </div>
    </div>

</template>

<script>

import NotificationStore from '../../store/notificationStore'
import {
    getNotificationTypes, getNotificationMediums
} from '../../services/notificationService'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'add-template',
    data() {
        return {

            notificationTypes: [],
            notificationMediums: [],
            notificationTypeId: '',
            mediumId: '',

            prop1: '',
            prop2: '',
            subject: '',
            template: '',
            mediumName: '',
            notificationName: '',
            type: '',
            isTemplateObject: false,
            loading: true
        }
    },
    mounted() {

        this.mediumId = this.$route.params.mediumId;
        this.notificcationTypeId = this.$route.params.notificationTypeId;

        this.fetchData();

        getNotificationTypes().then((notificationTypes) => {
            this.notificationTypes = notificationTypes.data || [];
        });

        getNotificationMediums().then((notificationMediums) => {
            this.notificationMediums = notificationMediums.data || [];
        });
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getTemplateDetails({
                query: {
                    notificcationTypeId: this.notificcationTypeId,
                    mediumId: this.mediumId
                }
            }).url;
            this.$apiService.get(url).then((response) => {
                let data = response && response.data || {};
                if (data.type == "object") {
                    this.prop1 = data.prop1;
                    this.prop2 = data.prop2;
                    this.subject = data.template[data.prop1];
                    this.template = data.template[data.prop2];
                    this.isTemplateObject = true;
                } else {
                    this.template = data.template;
                }
                this.type = data.type;
                this.mediumName = data.mediumName;
                this.notificationName = data.notificationName;

                this.prevData = {
                    extractData: data.extractData,
                    template: data.template,
                    mediumId: data.mediumId,
                    notificationTypeId: data.notificationTypeId
                }

                this.loading = false;
            }, (error) => {
                NotificationStore.addNotification({
                    text: 'some errors occurred, please check after sometime.',
                    type: "danger",
                    timeout: false
                });
            });
        },
        updateTemplate: function() {

            // if(!(this.subject && this.template)){
            //     NotificationStore.addNotification({
            //         text: 'shown field(s) are mandatory.',
            //         type: "danger",
            //         timeout: true
            //     });
            //     return;
            // }
            //
            // var postData = {};
            // if (this.prop1 && this.isTemplateObject) {
            //     postData.prop1 = this.prop1;
            //     postData.prop2 = this.prop2;
            //     postData['template'] = {};
            //     postData['template'][this.prop1] = this.subject;
            //     postData['template'][this.prop2] = this.template;
            // } else {
            //     postData.template = this.template;
            // }
            // postData.type = this.type;
            // postData.prevData = this.prevData || {};
            //
            // this.$apiService.post(`/template/update/${this.$route.params.id}`, postData).then((res) => {
            //     let message = res && res.message;
            //     NotificationStore.addNotification({
            //         text: message,
            //         type: "success",
            //         timeout: false
            //     });
            // }, (err) => {
            //     NotificationStore.addNotification({
            //         text: err.message,
            //         type: "danger",
            //         timeout: true
            //     });
            // });

        }
    }
}

</script>
