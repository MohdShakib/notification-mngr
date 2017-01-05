

<template>

<div>
    <spinner :show="loading"></spinner>
    <div class="col-lg-12" v-if="!loading">
        <div class="col-lg-8 col-lg-offset-2">
            <div class="form-inline">
                <div class="form-group">
                    <label>Notification Medium: </label>
                    <div>
                        <select class="form-control input-md" @change="checkTemplateExistence" v-model="mediumId">
                            <option v-for="item in notificationMediums" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="pull-right form-group">
                    <label>Notification Name: </label>
                    <div>
                    <select class="form-control input-md" @change="checkTemplateExistence" v-model="notificationTypeId">
                        <option v-for="item in notificationTypes" :value="item.id">{{item.name}}</option>
                    </select>
                </div>
                </div>
            </div>
            <br/>
            <div v-if="canCreate">
                <div class="form-group" v-if="isEmail">
                    <div><code>subject</code></div>
                    <input type="Subject" class="form-control" id="subject" v-model="subject" placeholder="Subject">
                </div>
                <div class="form-group">
                    <div v-if="isEmail"><code>body</code></div>
                    <textarea rows="15" cols="150" class="form-control" v-model="template" placeholder="body"></textarea>
                </div>
                <button  type="submit" @click="crateTemplate" :disabled="isDisabled" class="btn btn-primary btn-md">Add</button>
            </div>
            <div class="text-center" v-else>
                Template already exist <br> OR <br> Something went wrong.
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

        this.mediumId = this.$route.params.mediumId;
        this.notificationTypeId = this.$route.params.notificationTypeId;

        this.checkTemplateExistence();

        getNotificationTypes().then((notificationTypes) => {
            this.notificationTypes = notificationTypes && notificationTypes.data || [];
        });

        getNotificationMediums().then((notificationMediums) => {
            this.notificationMediums = notificationMediums.data || [];
        });
    },
    computed:{
        isEmail(){
            return (this.mediumId == 1);
        },
        isDisabled(){
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
                if(!data){
                    this.canCreate = true;
                }else {
                    this.canCreate = false;
                }
                this.loading = false;
            }, (error) => {
                this.loading = false;
                NotificationStore.addNotification({
                    text: 'some errors occurred, please check after sometime.',
                    type: "danger",
                    timeout: false
                });
            });
        },
        crateTemplate: function() {

            if(!this.template || (this.isEmail && !this.subject)){
                NotificationStore.addNotification({
                    text: 'shown field(s) are mandatory.',
                    type: "danger",
                    timeout: true
                });
                return;
            }

            let postData = {
                content: this.template,
                mediumId: this.mediumId,
                notificationTypeId: this.notificationTypeId,
            }

            if(this.isEmail){
                postData.subject = this.subject;
            }


            let url = apiConfig.apiHandlers.createTemplate().url;
            this.$apiService.post(url, postData).then((res) => {
                let message = res && res.message;
                NotificationStore.addNotification({
                    text: message,
                    type: "success",
                    timeout: false
                });
            }, (err) => {
                NotificationStore.addNotification({
                    text: err.message,
                    type: "danger",
                    timeout: true
                });
            });

        }
    }
}

</script>
