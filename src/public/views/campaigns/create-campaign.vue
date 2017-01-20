<style>

.campaign-height {
    min-height: 400px;
}

</style>

<template>

<el-row>

    <el-dialog title="Preview" top="5%" v-model="preview" size="medium">
        <renderTemplate :item="previewData"></renderTemplate>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="preview = false">Ok</el-button>
      </span>
    </el-dialog>

    <el-col :span="18" :offset="3">
        <el-card class="box-card campaign-height">
            <el-form :model="ruleForm" label-position="top" :rules="rules" ref="ruleForm" class="demo-form-stacked">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="Campaign" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="campagin name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-form-item label="Description" prop="desc">
                            <el-input v-model="ruleForm.description" placeholder="campagin description"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="Segment" prop="segment">
                            <el-select v-model="ruleForm.segment" :remote="true" :loading="loadingSegments" filterable placeholder="select segment">
                                <el-option v-for="item in segmentsList" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Start Date" prop="startDate">
                            <el-date-picker v-model="ruleForm.startDate" :picker-options="pickerOptions" format="yyyy-MM-dd" type="date" placeholder="Start Date"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Email Time" prop="sendAt">
                            <el-time-select v-model="ruleForm.sendAt" :editable="false" :picker-options="{ start: '06:00', step: '00:15', end: '24:00', minTime: '05:45' }" placeholder="Sending Time">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2">
                        <el-form-item label="Status">
                            <el-checkbox v-model="ruleForm.enabled">Enabled</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="Notification Medium">
                            <el-select v-model="ruleForm.mediumId" placeholder="Notification Medium" disabled>
                                <el-option v-for="item in notificationMediums" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="Notification Type">
                            <el-select v-model="ruleForm.notificationTypeId" filterable placeholder="Notification Type">
                                <el-option v-for="item in notificationTypes" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1">
                        <el-form-item label="Add">
                            <el-button size="small" type="primary" icon="plus" @click="addTemplate" :disabled="addTemplateDisabled"></el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item v-for="(value, key) in templates">
                    <el-row>
                        <el-col :span="8">
                            <div class="visibility0">type</div>
                            <code>{{value.mediumName}} [ {{value.notificationName}} ]</code>
                        </el-col>
                        <el-col :span="8">
                            <div>Frequency</div>
                            <el-input-number v-model="value.frequency" :min="1" :max="10"></el-input-number>
                        </el-col>
                        <el-col :span="6">
                            <div>Gap Interval (in days)</div>
                            <el-input-number v-model="value.interval" :min="1" :max="10"></el-input-number>
                        </el-col>
                        <el-col :span="2">
                            <div class="visibility0">actions</div>
                            <el-button size="mini" type="primary" @click="previewTemplate(key)" icon="view"></el-button>
                            <el-button size="mini" type="primary" @click="removeTemplate(key)" icon="close"></el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

            </el-form>
        </el-card>
    </el-col>
</el-row>

</template>

<script>

import {
    getNotificationTypes, getNotificationMediums
}
from '../../services/notificationService'
import renderTemplate from '../templates/render-template.vue'
import apiConfig from '../../config/apiConfig'

export default {
    data() {
            return {
                ruleForm: {
                    name: '',
                    description: '',
                    segment: '',
                    startDate: '',
                    sendAt: '',
                    enabled: false,
                    notificationTypeId: '',
                    mediumId: 1
                },
                loadingSegments: false,
                segmentsList: [],
                notificationTypes: [],
                notificationMediums: [],
                addTemplateDisabled: true,
                preview: false,
                previewData: {},
                templates: {},
                pickerOptions: {
                    disabledDate(value) {
                        var now = new Date();
                        now.setHours(0, 0, 0, 0);
                        if (value < now) {
                            return true;
                        }
                    }
                },
                rules: {
                    name: [{
                        required: true,
                        message: 'Please input campaign name',
                        trigger: 'blur'
                    }, {
                        min: 4,
                        message: 'Length should be greater than 3',
                        trigger: 'blur'
                    }],
                    segment: [{
                        required: true,
                        message: 'Please select segment'
                    }],
                    startDate: [{
                        type: 'date',
                        required: true,
                        message: 'Please pick a date',
                        trigger: 'change'
                    }],
                    sendAt: [{
                        required: true,
                        message: 'Please pick a time'
                    }],
                    desc: [{
                        required: true,
                        message: 'Please input campaign description',
                        trigger: 'blur'
                    }]

                    // resource: [{
                    //     required: true,
                    //     message: 'Please select activity resource',
                    //     trigger: 'change'
                    // }],

                }
            };
        },
        components: {
            renderTemplate
        },
        mounted() {
            getNotificationTypes().then((notificationTypes) => {
                this.notificationTypes = notificationTypes.data || [];
            });

            getNotificationMediums().then((notificationMediums) => {
                this.notificationMediums = notificationMediums.data || [];
            });

            this.loadingSegments = true;
            let url = apiConfig.apiHandlers.getSegementsList().url;
            this.$apiService.get(url).then((response) => {
                this.loadingSegments = false;
                let segments = response && response.data && response.data.segments;
                this.segmentsList = segments;
            }, (err) => {
                this.loadingSegments = false;
                this.$message.error({
                    message: err && err.message || 'could not fetch segment, something went wrong.'
                });
            });
        },
        computed: {
            addTemplateDisabled() {
                return !(this.ruleForm.notificationTypeId);
            }
        },
        methods: {
            addTemplate() {
                    let mediumId = this.ruleForm.mediumId,
                        notificationTypeId = this.ruleForm.notificationTypeId;
                    if (mediumId && notificationTypeId) {
                        this.addTemplateDisabled = true;
                        let url = apiConfig.apiHandlers.getTemplateDetails({
                            query: {
                                mediumId,
                                notificationTypeId
                            }
                        }).url;
                        let key = `${mediumId}-${notificationTypeId}`;

                        !this.templates[key] && this.$apiService.get(url).then((response) => {
                            let data = response && response.data;
                            if (!data) {
                                this.$message.warning({
                                    message: 'no template exists for this combination.'
                                });
                                return;
                            }

                            this.ruleForm.notificationTypeId = '';

                            let value = {
                                data: data,
                                mediumName: data.mediumName,
                                notificationName: data.notificationName,
                                frequency: 1,
                                interval: 1
                            };
                            this.$set(this.templates, key, value);
                        });
                    }
                },
                removeTemplate(key) {
                    this.templates[key] && this.$delete(this.templates, key);
                },
                previewTemplate(key) {
                    let tmpData = this.templates[key] && this.templates[key].data;
                    for (let key in tmpData) {
                        if (tmpData.hasOwnProperty(key))
                            this.$set(this.previewData, key, tmpData[key]);
                    }
                    this.preview = true;
                },
                // submitForm(formName) {
                //     this.$refs[formName].validate((valid) => {
                //         if (valid) {
                //             alert('submit!');
                //         } else {
                //             console.log('error submit!!');
                //             return false;
                //         }
                //     });
                // },
                // resetForm(formName) {
                //     this.$refs[formName].resetFields();
                // }
        }
}

</script>
