

<template>

<div>
    <spinner :show="loading"></spinner>
    <modal :show="preview" :large="true" @cancel="preview=false;">
        <div slot="title">Preview</div>
        <renderTemplate :item="previewData"></renderTemplate>
    </modal>
    <div class="col-sm-12" v-if="!loading">
        <div class="col-lg-5">
            <div class="panel panel-primary ">
                <div class="panel-body">
                    <div class="form-group">
                        <label class="text-capitalize small">notification type</label>
                        <input v-model="notificationName" class="form-control input-sm" readonly/>
                    </div>
                    <div class="form-group">
                        <label class="text-capitalize small">notification medium</label>
                        <input v-model="mediumName" class="form-control input-sm" readonly/>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-default btn-sm" @click="preview=true">Preview</button>
                    </div>
                </div>
            </div>
            <div class="panel panel-primary">
                <div class="panel-title text-center">
                    <h4 class="text-capitalize">template variables</h4>
                </div>
                <div class="panel-body">
                    <div class="notification-details">
                        <div class="form-group" v-for="(value, key) in extractData">
                            <label class="small">{{key}}</label>
                            <input v-model="extractData[key]" class="form-control input-sm" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class=" col-lg-5 col-lg-offset-2">
            <div class="panel panel-primary ">
                <div class="panel-body">
                    <div class="form-group">
                        <label class="text-capitalize small">data type</label>
                        <select class="form-control" v-model="dataType">
                            <option :value="1">user ids</option>
                            <option :value="2">user emails</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="small">enter commma separated values</label>
                        <textarea cols="15" rows="5" class="form-control input-sm" v-model="userData"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="small">schedule at</label>
                        <input type="time" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <button  :disabled="isDisabled" class="btn btn-primary btn-sm">schedule</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

</template>

<script>

import apiConfig from '../../config/apiConfig'
import renderTemplate from './render-template.vue'

export default {
    name: 'schedule-notification',
    components: {
        renderTemplate
    },
    data() {
        return {
            id: '',
            mediumName: '',
            notificationType: '',
            preview: false,
            isDisabled: true,
            dataType: 2,
            userData: '',
            previewData: {},
            extractData: {

            },
            loading: true,
        }
    },
    mounted() {
        this.fetchData();
    },
    computed: {
        isDisabled(){
            let flag = this.dataType && this.userData;
            for(let key in this.extractData){
                if(this.extractData.hasOwnProperty(key)){
                    flag = flag && this.extractData[key];
                }
            }
            return !flag;
        }
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getTemplateDetails({
                id: this.$route.params.id
            }).url;
            this.$apiService.get(url).then((response) => {
                let data = response && response.data || {};
                this.previewData = data || {};

                this.loading = false;
                this.id = data.id;
                this.mediumName = data.mediumName;
                this.notificationName = data.notificationName;

                this.extractData = data.extractData || {};

            }, (error) => {
                this.loading = false;
                console.log('error-callback............');
            });

        }
    }
}

</script>
