

<template>

<div>
    <spinner :show="loading"></spinner>
    <div class="col-lg-12" ng-if="!loading">
        <div class="col-lg-4">
            <div class="panel panel-primary">
                <div class="panel-body">
                    <div class="form-group">
                        <div>
                            <label>Notification Medium: </label> {{mediumName}}</div>
                    </div>
                    <div class="form-group">
                        <div>
                            <label>Notification Name: </label> {{notificationName}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="form-group" v-if="prop1">
                <div ><code>{{prop1}}</code></div>
                <input type="Subject" class="form-control" id="subject" v-model="subject" placeholder="Subject">
            </div>
            <div class="form-group">
                <div v-if="prop2"><code>{{prop2}}</code></div>
                <textarea rows="15" cols="150" class="form-control" v-model="template" placeholder="body"></textarea>
            </div>
            <button type="submit" @click="updateTemplate" class="btn btn-primary">Update</button>
        </div>
    </div>
</div>

</template>

<script>

export default {
    name: 'template-update',
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
            prevData: {},
            loading: true
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            this.$apiService.get(`http://localhost:9009/template-detail/${this.$route.params.id}`).then((response) => {
                console.log(response);
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

                this.prevData.extractData = data.extractData;
                this.prevData.template = data.template;

                this.loading = false;
            }, (error) => {
                this.loading = false;
                console.log('error-callback............');
            });
        },
        updateTemplate: function() {
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
            postData.prevData = this.prevData;
            console.log('peviousData..........', postData);

            this.$apiService.post(`http://localhost:9009/template/update/${this.$route.params.id}`, postData).then(() => {
                console.log('updated........');
            });

        }
    }
}

</script>
