

<template>

<div>
    <spinner :show="loading"></spinner>
    <div class="col-sm-12" v-if="!loading">
        <div class="col-lg-4">
            <div class="panel panel-primary">
                <div class="panel-title">
                    <h4 class="text-capitalize text-center">notification details</h4>
                </div>
                <div class="panel-body">
                    <div class="notification-details">
                        <ul class="list-group">
                            <key-value class="list-group-item" label="notification id" :value="id"></key-value>
                            <key-value class="list-group-item" label="notification medium" :value="mediumName"></key-value>
                            <key-value class="list-group-item" label="notification type" :value="typeName"></key-value>
                            <key-value class="list-group-item" label="notification status" :value="status"></key-value>
                            <key-value class="list-group-item" label="open status" :value="openStatus"></key-value>
                            <key-value class="list-group-item" label="created at" :value="created_at"></key-value>
                            <key-value class="list-group-item" label="schedule at" :value="schedule_at"></key-value>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-8">
            <div class="panel panel-primary">
                <div class="panel-body" v-if="prop1">
                    <code v-if="prop1">{{prop1}}</code>
                    <div v-html="template[prop1]"></div>
                    <br/>
                    <code v-if="prop2">{{prop2}}</code>
                    <div v-html="template[prop2]">
                    </div>
                </div>
                <div class="panel-body" v-html="template" v-else>
                </div>
            </div>
        </div>
    </div>
</div>

</template>

<script>

export default {
    name: 'notification-detail',
    data() {
        return {
            id: '',
            status: '',
            mediumName: '',
            typeName: '',
            created_at: '',
            schedule_date: '',
            openStatus: '',
            template: '',
            prop1: '',
            prop2: '',
            loading: true
        }
    },
    components: {
        'key-value': {
            name: 'key-value',
            props: ['label', 'value'],
            template: `
                <p v-if="value">
                    <strong class="text-capitalize">{{label}}</strong> : <span>{{value}}</sapn>
                </p>
            `
        }
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            this.loading = true;
            this.$http.get(`http://localhost:9009/notification-detail/${this.$route.params.id}`).then((response) => {
                let data = response && response.body && response.body.data && response.body.data || {};

                this.loading = false;
                if (data.type === 'object') {
                    this.prop1 = data.prop1;
                    this.prop2 = data.prop2;
                }
                this.id = data.id;
                this.template = data.template;
                this.status = data.status;
                this.openStatus = data.isOpen ? 'opened' : 'not opened';
                this.typeName = data.typeName;
                this.mediumName = data.mediumName;
                this.created_at = data.created_at;
                this.schedule_at = data.schedule_at;

            }, (error) => {
                this.loading = false;
                console.log('error-callback............');
            });

        }
    }
}

</script>
