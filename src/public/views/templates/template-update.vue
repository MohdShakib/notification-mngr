

<template>

<!-- <div>
    template data will come here
</div> -->

<div class="col-lg-8 col-lg-offset-2">
    <spinner :show="loading"></spinner>
    <div class="col-lg-12" ng-if="!loading">
        <div class="form-group">
            <div v-if="prop1"><code>{{prop1}}</code></div>
            <input type="Subject" class="form-control" id="subject" v-model="subject" placeholder="Subject">
        </div>
        <div class="form-group">
            <div v-if="prop2"><code>{{prop2}}</code></div>
            <textarea rows="15" cols="150" class="form-control" v-model="template" placeholder="body"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Update</button>
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
            loading: true
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            this.$http.get(`http://localhost:9009/template-detail/${this.$route.params.id}`).then((response) => {
                console.log(response);
                this.loading = false;
                let data = response && response.body && response.body.data || {};

                if (data.type == "object") {
                    this.prop1 = data.prop1;
                    this.prop2 = data.prop2;
                    this.subject = data.template[data.prop1];
                    this.template = data.template[data.prop2];
                } else {
                    this.template = data.template;
                }
            }, (error) => {
                this.loading = false;
                console.log('error-callback............');
            });
        }
    }
}

</script>
