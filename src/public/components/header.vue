<template>

<div class="headerWrapper">
    <header class="header" style="background-color: rgb(32, 160, 255);">
        <div class="header-container">
            <h1>
                notification manager
            </h1>
            <span v-if="title" class="page-title">| {{title}}</span>
            <el-menu class="nav" mode="horizontal">
                <el-menu-item index="1">
                    <router-link class="header-link" to="/notifications-status">Notifications</router-link>
                </el-menu-item>
                <el-menu-item index="2">
                    <router-link class="header-link" to="/templates-list">Templates</router-link>
                </el-menu-item>
                <el-menu-item index="3">
                    <router-link class="header-link" to="/campaigns">Campaigns</router-link>
                </el-menu-item>
            </el-menu>
        </div>
    </header>
</div>

</template>

<script>

export default {
    name: 'my-header',
    data(){
        return {
            title: ''
        }
    },
    mounted(){
        this.title = this.$route.meta.title;
    },
    watch: {
        $route: function(value){
            this.title = value.meta.title;
        }
    }
}

</script>
