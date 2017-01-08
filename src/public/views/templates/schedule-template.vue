

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
                    <el-select v-model="dataType">
                        <el-option label="user ids" :value="1"></el-option>
                        <el-option label="user emails" :value="2"></el-option>
                    </el-select>
                </el-col>
                    <el-col :span="12">
                        <el-date-picker v-model="schedule_time" type="datetime" placeholder="Select date and time">
                        </el-date-picker>
                    </el-col>
                </el-row>
                <el-row>
                    <span>enter commma separated values</span>
                    <el-input type="textarea" :cols="15" :rows="5" v-model="userData"></el-input>
                </el-row>
                <el-row>
                    <el-button :disabled="isDisabled" type="primary">schedule</el-button>
                </el-row>
            </el-card>
        </el-col>
    </el-row>

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
        isDisabled() {
            let flag = this.dataType && this.userData;
            for (let key in this.extractData) {
                if (this.extractData.hasOwnProperty(key)) {
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
