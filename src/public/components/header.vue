<style>
.login-btn{
    float:right;
}
</style>

<template>

<div class="headerWrapper">
    <header class="header" style="background-color: rgb(32, 160, 255);">
        <div class="header-container">
            <h1>
                notification manager
            </h1>
            <span v-if="title" class="page-title">| {{title}}</span>
            <div class="login-btn">
                <!-- <span class="">{{email}}</span> -->
                <el-button size="small" @click="toggleLogin(isLoggedIn)">
                    {{isLoggedIn ? 'logout' : 'login'}}
                </el-button>
            </div>

            <el-menu class="nav" mode="horizontal">
                <el-menu-item index="1">
                    <router-link class="header-link" to="/notifications">Notifications</router-link>
                </el-menu-item>
                <el-menu-item index="2">
                    <router-link class="header-link" to="/templates">Templates</router-link>
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

import { gPlus, isUserLoggedIn, userLogout } from '../services/loginService'

export default {
    name: 'my-header',
    data(){
        return {
            title: '',
            email: '',
            isLoggedIn: false
        }
    },
    mounted(){
        this.title = this.$route.meta.title;
        gPlus.load();

        isUserLoggedIn().then((response)=>{
            let data = response && response.data || {};
            this.email = data.email;
            this.isLoggedIn = true;
        }, (err)=>{
            console.log('not loggedIn ',err);
            this.isLoggedIn = false;
        });
    },
    watch: {
        $route: function(value){
            this.title = value.meta.title;
        }
    },
    methods: {
        toggleLogin(isLoggedIn){
            if(!isLoggedIn){
                return gPlus.login();
            }

            userLogout().then((res) => {
                this.isLoggedIn = false;
            }, (err)=>{
                this.$message.error({
                    message: 'error while logging out.'
                });
            });
        }
    }
}

</script>
