

<template>

<div v-loading.body="loading">

    <el-dialog title="Preview" top="5%" v-model="preview" @close="hidePreview" size="medium">
        <renderTemplate :item="selectedItem"></renderTemplate>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preview = false">Ok</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Permanent Delete ?" @close="confirmDelete.show = false" v-model="confirmDelete.show" size="tiny">
        <span>Are you sure you want to delete this template?</span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteConfirmation">Confirm</el-button>
        <el-button type="danger" @click="confirmDelete.show = false">Cancel</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Create Notification Type" v-model="createNewType">
        <el-form >
            <el-form-item label="Notification Type" label-width="120px">
                <el-input v-model="newNotificationTypeName" @change="formatNewNotifcationType"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="createNotificationType" :disabled="disableCreateNewNotificationType">Create</el-button>
            <el-button type="danger" @click="createNewType = false">Cancel</el-button>
        </span>
    </el-dialog>

    <template>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                Notification Medium
                <div>
                    <el-select v-model="mediumId" @change="changeMedium" filterable clearable placeholder="Notification Medium">
                        <el-option v-for="item in notificationMediums" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item offset="2">
                Notification Type
                <div>
                    <el-select v-model="notificationTypeId" @change="changeType" filterable clearable placeholder="Notification Type">
                        <el-option :value="'add_new_template_type'">
                            <span style="color:blue;">add new</span>
                        </el-option>
                        <el-option v-for="item in notificationTypes" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </div>
            </el-form-item>
        </el-form>
        <el-table :data="filteredTemplates" border stripe style="width: 100%">
            <div slot="empty">
                No Templates Found
                <template v-if="notificationTypeId && mediumId">
                    | <el-button @click="redirectTo('create-template',{notificationTypeId: notificationTypeId, mediumId: mediumId})" type="text">Create template</el-button>
                </template>
            </div>
            <el-table-column type="index" width="100">
            </el-table-column>
            <el-table-column prop="mediumname" label="Notifification Medium" width="180">
            </el-table-column>
            <el-table-column prop="notificationname" label="Notification Type" width="200">
            </el-table-column>
            <el-table-column label="Template">
                <template scope="scope">
                    <template v-if="scope.row.type == 'object' ">
                        <div class="">
                            <code>{{scope.row.prop1}}</code>
                            <pre>{{scope.row.template[scope.row.prop1]}}</pre>
                            <code>{{scope.row.prop2}}</codeg>
                            <pre>{{scope.row.template[scope.row.prop2]}}</pre>
                        </div>
                    </template>
                    <template v-else>
                        <pre>{{scope.row.template}}</pre>
                    </template>
                </template>
            </el-table-column>
            <el-table-column width="180">
                <template scope="scope">
                    <div>
                        <el-button type="primary" @click="redirectTo('update-template', {id:scope.row.id})" icon="edit"></el-button>
                        <el-button type="primary" @click="deleteTemplate(scope.row.id, scope.$index)" icon="delete"></el-button>
                    </div>
                    <br/>
                    <div>
                        <el-button type="primary" @click="showPreview(scope.$index)" icon="view"></el-button>
                        <el-button type="primary" @click="redirectTo('schedule-template', {id:scope.row.id})" icon="message"></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </template>
</div>

</template>

<script>

import renderTemplate from './render-template.vue'
import {
    getNotificationTypes, getNotificationMediums
}
from '../../services/defaultService'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'templates-list',
    components: {
        renderTemplate
    },
    data() {
        return {
            templatesList: [],
            notificationMediums: [],
            notificationTypes: [],
            mediumId: '',
            notificationTypeId: '',
            loading: true,
            previewContent: '',
            preview: false,
            newNotificationTypeName: '',
            createNewType: false,
            confirmDelete: {
                show: false,
                id: null,
                index: null
            },
            selectedItem: {}
        }
    },
    mounted() {
        this.fetchData();
        getNotificationTypes().then((notificationTypes) => {
            this.notificationTypes = notificationTypes.data || [];
        });

        getNotificationMediums().then((notificationMediums) => {
            this.notificationMediums = notificationMediums.data || [];
        });
    },
    created() {
        let params = this.$route.params;
        this.mediumId = params.mediumId ? parseInt(params.mediumId) : '';
    },
    computed: {
        filteredTemplates: function() {
            if (!this.notificationTypeId) {
                return this.templatesList;
            }
            return this.templatesList.filter((item) => {
                return item.notificationTypeId == this.notificationTypeId;
            });
        },
        disableCreateNewNotificationType: function(){
                return !((this.newNotificationTypeName && this.newNotificationTypeName.length > 2)?true:false);
        }
    },
    methods: {
        redirectTo: function(name, params) {
            this.$router.push({
                name: name,
                params: params || {}
            });
        },
        showPreview: function(index) {
            this.selectedItem = this.templatesList[index] || {};
            this.preview = true;
        },
        hidePreview: function() {
            this.preview = false;
            this.selectedItem = {};
        },
        changeMedium: function() {
            let params = {};
            params = this.mediumId ? {
                mediumId: this.mediumId
            } : params;
            this.$router.push({
                name: 'templates-list',
                params: params
            });
            this.fetchData();
        },
        changeType: function() {
            if (this.notificationTypeId === 'add_new_template_type') {
                this.notificationTypeId = '';
                this.newNotificationTypeName = '';
                this.createNewType = true;
            }
        },
        formatNewNotifcationType: function(){
            if(this.newNotificationTypeName){
                let newNotificationTypeName = this.newNotificationTypeName.trim().toLowerCase();
                newNotificationTypeName = newNotificationTypeName.replace(/\s+/g,'_');
                this.newNotificationTypeName = newNotificationTypeName;
            }
        },
        createNotificationType: function(){
            let newNotificationTypeName = this.newNotificationTypeName;

            for(var i=0; i<this.notificationTypes.length; i++){
                if(this.notificationTypes[i].name == newNotificationTypeName){
                    return this.$notify.error({
                        message: 'this notification type already exists.'
                    });
                }
            }

            this.loading = true;
            let url = apiConfig.apiHandlers.createNotificationType({
                notificationTypeName: this.newNotificationTypeName
            }).url;
            this.$apiService.post(url).then((res) => {
                this.loading = false;
                this.createNewType = false;
                this.newNotificationTypeName = '';
                let message = res && res.message;
                this.$message.success({
                    message: message
                });
            }, (error) => {
                this.loading = false;
                this.$message.error({
                    message: error.message
                });
            });
        },
        deleteTemplate(templateId, index) {
            this.confirmDelete.show = true;
            this.confirmDelete.id = templateId;
            this.confirmDelete.index = index;
        },
        deleteConfirmation() {
            this.confirmDelete.show = false;
            let url = apiConfig.apiHandlers.deleteTemplate({
                id: this.confirmDelete.id
            }).url;
            this.$apiService.delete(url).then((res) => {
                let message = res && res.message;
                this.$message.success({
                    message: message
                });
                this.templatesList.splice(this.confirmDelete.index, 1);
            }, (error) => {
                this.$message.error({
                    message: error.message
                });
            });
        },
        fetchData: function() {
            this.loading = true;
            let url = apiConfig.apiHandlers.getTemplateListings({
                mediumId: this.mediumId
            }).url;
            this.$apiService.get(url).then((response) => {
                this.loading = false;
                this.templatesList = response && response.data || [];
            }, (error) => {
                this.loading = false;
                this.$message.error({
                    message: error.message
                });
            });
        }
    }
}

</script>
