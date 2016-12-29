

<template>

<div>
    <spinner :show="loading"></spinner>
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th class="col-lg-1 text-center">#</th>
                <th class="col-lg-2">Notification Medium
                    <!-- <select class="form-control input-sm">
                        <option value="0" selected>All</option>
                        <option v-for="item in notificationMediums" :value="item.id">{{item.name}}</option>
                    </select> -->
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
                </th>
                <th class="col-lg-4">Template</th>
                <th class="col-lg-2"></th>
            </tr>
        </thead>
        <tbody>
            <templatesItem v-for="(item,index) in templatesList" :item="item" :index="index"></templatesItem>
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
            loading: true
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData: function(){
            //this.$http.get('https://www.makaan.com/petra/app/v1/listing/2627399?sourceDomain=Makaan').then((response)=>{
            this.loading = true;
            this.$http.get('http://localhost:3479/templates').then((response)=>{
                console.log(response);
                this.loading = false;
                let data  = response && response.body || {};
                this.templatesList = data.content || [];
                this.notificationMediums = data.medium || [];
                this.notificationTypes = data.notification || [];
            }, (error)=>{
                this.loading = false;
                console.log('error-callback............');
            });
        }
    }
}

</script>
