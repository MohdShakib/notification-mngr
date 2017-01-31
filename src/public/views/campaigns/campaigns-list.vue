<template>
    <div v-loading.body="loading">
        <el-table :data="campaignsList" border stripe style="width: 100%">
            <div slot="empty">
                <template>
                    No Campaign Found |
                    <el-button @click="$router.push('/campaigns/create')" type="text">Create Campaign</el-button>
                </template>
            </div>
            <el-table-column type="index" width="100">
            </el-table-column>
            <el-table-column prop="name" label="campaign name">
            </el-table-column>
            <el-table-column prop="description" label="decription">
            </el-table-column>
            <el-table-column prop="segment_id" label="segment Id">
                <template scope="scope">
                    {{ segmentName(scope.row.segment_id) }}
                </template>
            </el-table-column>
            <el-table-column prop="start_date" label="start date">
            </el-table-column>
            <el-table-column prop="schedule_time" label="schedule time" :width="150">
            </el-table-column>
            <el-table-column prop="status" label="status" :width="100">
                <template scope="scope">
                    {{scope.row.status ? 'Active' : 'Inactive'}}
                </template>
            </el-table-column>
            <el-table-column>
                <template scope="scope">
                    <div class="text-center">
                        <el-button size="small" type="primary" @click="$router.push({ name: 'campaign-detail', params: { id: scope.row.id } })" icon="view"></el-button>
                        <el-button size="small" @click="$router.push({name: 'update-campaign', params: {id: scope.row.id}})" type="primary" icon="edit"></el-button>
                        <el-button size="small" type="primary" :disabled="true" icon="delete"></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div style="float:right; margin-top:10px; margin-right:10px;">
            <el-button  size="large" @click="$router.push({ name: 'create-campaign'})" type="text">Add Campaign</el-button>
        </div>
    </div>
</template>

<script>

import apiConfig from '../../config/apiConfig'
import { getSegementsList } from '../../services/defaultService'
import { getSegmentsMapping } from '../../services/segmentsService'
export default {
    name: 'campaigns-list',
    data(){
        return {
            campaignsList: [],
            segmentsMapping: {}
        }
    },
    mounted(){
        this.fetchData();
        getSegementsList().then((segmentsList)=>{
            let segments = segmentsList || [];
            let segmentsMapping = getSegmentsMapping(segments);
            for(var key in segmentsMapping){
                this.$set(this.segmentsMapping, key, segmentsMapping[key])
            }
        });
    },
    computed: {
    },
    methods: {
        segmentName(segmentId){
            return this.segmentsMapping[segmentId];
        },
        fetchData(){
            let url = apiConfig.apiHandlers.getCampaignsList().url;
            this.$apiService.get(url).then((response)=>{
                this.campaignsList = response && response.data;
            }, (error)=>{
                this.campaignsList = [];
                this.$message.error({
                    message: error && error.message
                });
            });
        }
    }
}
</script>
