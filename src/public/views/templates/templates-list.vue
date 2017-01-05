

<template>

<div>
    <spinner :show="loading"></spinner>
    <table class="table table-bordered table-striped" v-if="!loading">
        <thead>
            <tr>
                <th class="col-lg-1 text-center">#Id</th>
                <th class="col-lg-2">Notification Medium
                    <select class="form-control input-sm" @change="changeMedium" v-model="mediumId">
                        <option value="">All</option>
                        <option v-for="item in notificationMediums" :value="item.id">{{item.name}}</option>
                    </select>
                </th>
                <th class="col-lg-3">
                    Notification Type
                    <!-- <input type="text" class="form-control input-sm" placeholder="Notification Type" list="notification-types"></input>
                    <datalist id="notification-types">
                        <option value="Internet Explorer">Internet Explorer</option>
                        <option value="Firefox">Firefox</option>
                        <option value="Chrome">Chrome</option>
                        <option value="Opera">Opera</option>
                        <option value="Safari">Safari</option>
                    </datalist> -->
                    <select class="form-control input-sm" v-model="notificationTypeId">
                        <option value="">All</option>
                        <option v-for="item in notificationTypes" :value="item.id">{{item.name}}</option>
                    </select>
                </th>
                <th class="col-lg-4">Template</th>
                <th class="col-lg-2"></th>
            </tr>
        </thead>
        <tbody>
            <tableRowMessage v-if="!filteredTemplates.length" cols="5">
                <div v-if="notificationTypeId && mediumId">
                    <router-link :to="{name: 'add-template', params: {notificationTypeId: 1, mediumId: 1}}" class="btn btn-primary" tag="button">
                        add new template
                    </router-link>
                </div>
                <div v-else>
                    No Template Found
                <div>
            </tableRowMessage>
            <templatesItem v-for="(item,index) in filteredTemplates" :item="item" :key="item.id" ></templatesItem>
        </tbody>
    </table>
</div>

</template>

<script>

import templatesItem from './template-item.vue'
import modal from '../../components/modal.vue'

export default {
    name: 'templates-list',
    components: { templatesItem, modal },
    data() {
        return {
            templatesList: [],
            notificationMediums: [],
            notificationTypes: [],
            mediumId: '',
            notificationTypeId: '',
            loading: true
        }
    },
    mounted(){
        this.fetchData();
    },
    created(){
        this.mediumId = this.$route.params.mediumId || '';
    },
    computed : {
        filteredTemplates: function(){
            if(!this.notificationTypeId){
                return this.templatesList;
            }
            return this.templatesList.filter((item) => {
                return item.notificationTypeId == this.notificationTypeId;
            });
        }
    },
    methods: {
        changeMedium: function(){
            let params = {};
                params = this.mediumId ? {mediumId: this.mediumId} : params;
            this.$router.push({name:'templates-list', params: params });
            this.fetchData();
        },
        fetchData: function(){
            this.loading = true;
            let templateListingApi = 'http://localhost:9009/template-listings',
                mediumId = this.mediumId;
                templateListingApi += `${mediumId ? '/'+mediumId : ''}`;

            this.$apiService.get(templateListingApi).then((response)=>{
                this.loading = false;
                let data  = response && response.data || {};
                this.templatesList = data.allTemplates || [];
                this.notificationMediums = data.notificationMediums || [];
                this.notificationTypes = data.notificationTypes || [];
            }, (error)=>{
                this.loading = false;
            });
        }
    }
}

</script>
