

<template>

<div>
    <spinner :show="loading"></spinner>
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th class="col-lg-1 text-center">#Id</th>
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
            <templatesItem v-for="(item,index) in templatesList" :item="item" :key="item.id" ></templatesItem>
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
            this.loading = true;
            this.$apiService.get('http://localhost:9009/template-listings').then((response)=>{
                console.log(response);
                this.loading = false;
                let data  = response && response.data || {};
                this.templatesList = data.allTemplates || [];
                this.notificationMediums = data.notificationMediums || [];
                this.notificationTypes = data.notificationTypes || [];
            }, (error)=>{
                this.loading = false;
                console.log('error-callback............');
            });
        }
    }
}

</script>
