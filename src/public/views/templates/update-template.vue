

<template>

<div>
    <spinner :show="loading"></spinner>
    <modal :show="preview" :large="true" @cancel="preview=false;">
        <div slot="title">Preview</div>
        <renderTemplate :item="previewData"></renderTemplate>
    </modal>
    <div class="col-lg-12" v-if="!loading">
        <div class="col-lg-4">
            <div class="panel panel-primary">
                <div class="panel-body">
                    <div class="form-group">
                        <label>Notification Medium</label>
                        <input v-model="mediumName" class="form-control" readonly/>
                    </div>
                    <div class="form-group">
                        <label>Notification Type</label>
                        <input v-model="notificationName" class="form-control" readonly/>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="form-group" v-if="prop1">
                <div><code>{{prop1}}</code></div>
                <input type="Subject" class="form-control" id="subject" v-model="subject" placeholder="Subject">
            </div>
            <div class="form-group">
                <div v-if="prop2"><code>{{prop2}}</code></div>
                <textarea rows="15" cols="150" class="form-control" v-model="template" placeholder="body"></textarea>
            </div>
            <div class="form-group">
                <button type="submit" @click="showPreview" @close="preview=false;" class="btn btn-primary">Preview</button>
                <button type="submit" @click="updateTemplate" :disabled="isDisabled" class="btn btn-primary">Update</button>
            </div>
        </div>
    </div>
</div>

</template>

<script>

import NotificationStore from '../../store/notificationStore'
import renderTemplate from './render-template.vue'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'update-template',
    components: { renderTemplate },
    data() {
        return {
            prop1: '',
            prop2: '',
            subject: '',
            template: '',
            mediumName: '',
            notificationName: '',
            type: '',
            isTemplateObject: false,
            isDisabled: true,
            preview: false,
            previewData: {},
            loading: true
        }
    },
    mounted() {
        this.fetchData();
    },
    computed: {
        isDisabled() {
            return !(this.template && (!this.isTemplateObject || this.subject));
        }
    },
    methods: {
        showPreview(){
            let tmpData = {};
            if(this.isTemplateObject){
                tmpData.prop1 = this.prop1;
                tmpData.prop2 = this.prop2;
                tmpData['type'] = 'object';
                tmpData['template'] = {};
                tmpData['template'][this.prop1] = this.subject;
                tmpData['template'][this.prop2] = this.template;
            }else {
                tmpData['template'] = this.template;
            }
            for(let key in tmpData){
                if(tmpData.hasOwnProperty(key))
                    this.$set(this.previewData, key, tmpData[key]);
            }
            this.preview = true;
        },
        fetchData: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getTemplateDetails({
                id: this.$route.params.id
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

            if (!this.template || (this.prop1 && !this.subject)) {
                NotificationStore.addNotification({
                    text: 'shown field(s) are mandatory.',
                    type: "danger",
                    timeout: true
                });
                return;
            }


            var postData = {};
            if (this.prop1 && this.isTemplateObject) {
                postData.prop1 = this.prop1;
                postData.prop2 = this.prop2;
                postData['template'] = {};
                postData['template'][this.prop1] = this.subject;
                postData['template'][this.prop2] = this.template;
            } else {
                postData.template = this.template;
            }
            postData.type = this.type;
            postData.prevData = this.prevData || {};

            let url = apiConfig.apiHandlers.updateTemplate({
                id: this.$route.params.id
            }).url;

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
