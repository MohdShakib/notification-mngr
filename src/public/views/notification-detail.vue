

<template>

<div>
    loading chill.......

    {{yo}}

    <div v-html="content">
    </div>
</div>

</template>

<script>

export default {
    name: 'notification-detail',
    data() {
        return {
            content: '',
            yo: ''
        }
    },
    mounted(){
        this.fetchData();
    },
    methods: {
        fetchData: function(){
            this.$http.get(`http://localhost:9009/notification-detail/${this.$route.params.id}`).then((response)=>{
                console.log(response);
                let data  = response && response.body && response.body.data && response.body.data || {};
                this.content = data.template && data.template.body;
            }, (error)=>{
                console.log('error-callback............');
            });
        }
    }
}

</script>
