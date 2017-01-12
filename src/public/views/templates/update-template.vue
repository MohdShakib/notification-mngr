

<template>

<div v-loading.body="loading">

    <el-dialog title="Preview" top="5%" v-model="preview" size="medium">
        <renderTemplate :item="previewData"></renderTemplate>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preview = false">Ok</el-button>
      </span>
    </el-dialog>


    <el-row :gutter="30" >
        <el-col :span="8">
            <el-card class="box-card">
                <el-row>
                    Notification Medium
                    <el-input size="small" v-model="mediumName" :disabled="true"></el-input>
                </el-row>
                <el-row>
                    Notification Type
                    <el-input size="small" v-model="notificationName" :disabled="true"></el-input>
                </el-row>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-card class="box-card">
                <el-form ref="form" :model="form">
                    <el-form-item v-if="prop1">
                        <code>{{prop1}}</code>
                        <el-input v-model="subject"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <code v-if="prop2">{{prop2}}</code>
                        <el-input type="textarea" :cols="150" :rows="12" v-model="template"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="showPreview" @close="preview=false;" type="primary">Preview</el-button>
                        <el-button @click="updateTemplate" :disabled="isDisabled" type="primary">Update</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>

</div>

</template>

<script>

import renderTemplate from './render-template.vue'
import apiConfig from '../../config/apiConfig'

export default {
    name: 'update-template',
    components: {
        renderTemplate
    },
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
        showPreview() {
                let tmpData = {};
                if (this.isTemplateObject) {
                    tmpData.prop1 = this.prop1;
                    tmpData.prop2 = this.prop2;
                    tmpData['type'] = 'object';
                    tmpData['template'] = {};
                    tmpData['template'][this.prop1] = this.subject;
                    tmpData['template'][this.prop2] = this.template;
                } else {
                    tmpData['template'] = this.template;
                }
                for (let key in tmpData) {
                    if (tmpData.hasOwnProperty(key))
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
                    this.$message.error({
                        message: 'some errors occurred, please check after sometime.'
                    });
                });
            },
            updateTemplate: function() {

                if (!this.template || (this.prop1 && !this.subject)) {
                    this.$message.warning({
                        message: 'shown field(s) are mandatory.'
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
                    this.$message.success({
                        message: message
                    });
                }, (err) => {
                    this.$message.error({
                        message: err.message
                    });
                });

            }
    }
}

</script>
