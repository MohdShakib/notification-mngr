

<template>

<div v-loading.body="loading">

    <el-dialog title="Preview" top="5%" v-model="preview" size="medium">
        <renderTemplate :item="previewData"></renderTemplate>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preview = false">Ok</el-button>
      </span>
    </el-dialog>

    <el-row :gutter="20" >
        <el-col :span="10">
            <el-card class="box-card">
                <el-row>
                    Notification Medium
                    <el-input size="small" v-model="mediumName" :disabled="true"></el-input>
                </el-row>
                <el-row>
                    Notification Type
                    <el-input size="small" v-model="notificationName" :disabled="true"></el-input>
                </el-row>
                <el-row>
                    <el-button size="small" @click="preview=true">Preview</el-button>
                </el-row>
            </el-card>

            <el-card class="box-card">
                <el-row v-for="(value, key) in extractData">
                    <span v-text="key"></span>
                    <el-input v-model="extractData[key]"></el-input>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="12" :offset="2">
            <el-card class="box-card">
                <el-row>
                    <el-col :span="12">
                    <el-select v-model="userDataType">
                        <el-option label="user ids" value="ids"></el-option>
                        <el-option label="user emails" value="emails"></el-option>
                    </el-select>
                </el-col>
                    <el-col :span="12">
                        <el-date-picker :editable="false" v-model="schedule_time" type="datetime" placeholder="Select date and time">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row>
                    <span>enter commma separated values</span>
                    <el-input type="textarea" :cols="15" :rows="5" v-model="usersData" @change="formatUsersData"></el-input>
                </el-row>
                <el-row>
                    <el-button :disabled="isDisabled" type="primary" @click="scheduleNotification">schedule</el-button>
                </el-row>
            </el-card>
        </el-col>
    </el-row>
</div>

</template>

<script>

import apiConfig from '../../config/apiConfig'
import renderTemplate from './render-template.vue'
import utilService from '../../services/utilService'

function _prepareUsersArray(userDataType, usersData){
    let users = [], rejectedUsers = [], key, value;
    key = (userDataType == 'ids') ? 'id' : 'email';

    usersData = usersData.split(',');

    for(var i=0; i<usersData.length; i++){
        value = usersData[i];
        if(key == 'email'){
            if(utilService.isEmailValid(value)){
                value = value;
            }else {
                value = '';
            }
        }else {
            value = Number(value);
            value = isNaN(value) ? '': value;
        }

        if(value){
            users.push({
                [key] : value
            })
        }else {
            rejectedUsers.push(usersData[i]);
        }

    }
    return {
        users,
        rejectedUsers
    };
}

export default {
    name: 'schedule-notification',
    components: {
        renderTemplate
    },
    data() {
        return {
            id: '',
            mediumName: '',
            notificationName: '',
            schedule_time: '',
            usersData: '',
            userDataType: 'ids',
            preview: false,
            isDisabled: true,
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
        isDisabled() {
            let flag = this.userDataType && this.usersData && this.schedule_time;
            if(flag){
                for (let key in this.extractData) {
                    if (this.extractData.hasOwnProperty(key)) {
                        flag = flag && this.extractData[key];
                    }
                }
            }
            return !flag;
        }
    },
    methods: {
        formatUsersData: function(){
            let usersData = this.usersData;
            if(usersData){
                usersData = usersData.replace(/ /g,'');
                this.usersData  = usersData;
            }
        },
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
        },
        scheduleNotification(){
            this.loading = true;
            this.isDisabled = true;
            let mediumName = this.mediumName,
                notificationTypeName = this.notificationName,
                parsedUsers = _prepareUsersArray(this.userDataType, this.usersData),
                postData = {
                    mediumName,
                    notificationTypeName,
                    users: parsedUsers.users,
                    scheduling: {
                        holdingPeriodType: 'EXACT_TIME',
                        periodValue: (new Date(this.schedule_time)).getTime()
                    }
                }

                for(let key in this.extractData){
                    if(this.extractData.hasOwnProperty(key)){
                        postData.templateData = postData.templateData || {};
                        postData.templateData[key] = this.extractData[key];
                    }
                }

            let url = apiConfig.apiHandlers.scheduleNotification().url;
            this.$apiService.post(url, postData).then((response) => {
                this.loading = false;
                let message = response && response.message;
                this.usersData = '';
                this.schedule_time = '';
                this.$message.success({
                    message: message
                });
            }, (error) => {
                this.loading = false;
                this.isDisabled = false;
                this.$message.error({
                    message: error && error.message
                });
            });
        }
    }
}

</script>
