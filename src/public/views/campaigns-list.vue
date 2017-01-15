

<template>

<el-row>
    <el-card class="box-card">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
            <el-col :span="12">
                <el-form-item label="Campaign" prop="name">
                    <el-col :span="18">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="Segment" prop="segment">
                    <el-select v-model="ruleForm.segment" placeholder="select segment">
                        <el-option label="Segment 1" value="1"></el-option>
                        <el-option label="Segment 2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Templates" prop="templates">
                    <el-select v-model="ruleForm.templates" multiple filterable placeholder="select templates">
                        <el-option label="Template 1" value="Template 1"></el-option>
                        <el-option label="Template 2" value="Template 2"></el-option>
                        <el-option label="Template 3" value="Template 3"></el-option>
                        <el-option label="Template 4" value="Template 4"></el-option>
                        <el-option label="Custom Template" value="Custom Template"></el-option>
                        <el-option label="Primary Sales" value="Primary Sales"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-switch v-model="ruleForm.enabled" on-text="Enabled" off-text="Disabled" on-color="#13ce66" off-color="#ff4949" :width="100">
                    </el-switch>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item v-for="(value, index) in ruleForm.templates" :key="index+1">
                    <code> {{value}} </code>
                    <div>
                        <el-col :span="12">
                            Frequency
                            <div>
                                <el-input-number v-model="ruleForm.templatesInfo[index].frequency" :min="1" :max="10"></el-input-number>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            Interval (in days)
                            <div>
                                <el-input-number v-model="ruleForm.templatesInfo[index].interval" :min="1" :max="10"></el-input-number>
                            </div>
                        </el-col>
                    </div>
                </el-form-item>
            </el-col>

        </el-form>
    </el-card>
</el-row>

</template>

<script>

export default {
    data() {
            return {
                ruleForm: {
                    name: '',
                    segment: '',
                    enabled: false,
                    templates: [],
                    templatesInfo: [{
                        key: 1,
                        frequency: '',
                        interval: ''
                    }, {
                        key: 2,
                        frequency: '',
                        interval: ''
                    }],

                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: 'Please input Activity name',
                        trigger: 'blur'
                    }, {
                        min: 3,
                        max: 5,
                        message: 'Length should be 3 to 5',
                        trigger: 'blur'
                    }],
                    region: [{
                        required: true,
                        message: 'Please select Activity zone',
                        trigger: 'change'
                    }],
                    date1: [{
                        type: 'date',
                        required: true,
                        message: 'Please pick a date',
                        trigger: 'change'
                    }],
                    date2: [{
                        type: 'date',
                        required: true,
                        message: 'Please pick a time',
                        trigger: 'change'
                    }],
                    type: [{
                        type: 'array',
                        required: true,
                        message: 'Please select at least one activity type',
                        trigger: 'change'
                    }],
                    resource: [{
                        required: true,
                        message: 'Please select activity resource',
                        trigger: 'change'
                    }],
                    desc: [{
                        required: true,
                        message: 'Please input activity form',
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                },
                resetForm(formName) {
                    this.$refs[formName].resetFields();
                }
        }
}

</script>
