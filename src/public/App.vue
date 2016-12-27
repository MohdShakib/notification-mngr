<style>

.vue-app-content {
    margin-top: 70px;
}

</style>

<template>

<div id="app" class="vue-app-content">
    <!-- <header> -->
    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="collapse navbar-collapse">

                <div class="col-lg-3">
                    <h3>Notification Manager</h3>
                </div>
                <div class="col-lg-6">
                    <ul class="nav navbar-nav">
                        <li>
                            <router-link to="/notifications-status">Notification Status</router-link>
                        </li>
                        <li>
                            <router-link to="/templates-list">Templates</router-link>
                        </li>
                        <li>
                            <router-link to="/campaigns">Campaigns</router-link>
                        </li>
                        <li>
                            <router-link to="/notifications-sent">Sent Notification</router-link>
                        </li>
                    </ul>
                </div>
                <div class="col-lg-1 navbar-right">
                    <button class="btn btn-primary">Login</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- <modal2 :show="showModal"></modal2> -->

    <!-- </header> -->
    <div class="container-fluid">
        <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
        </transition>
    </div>


</div>

</template>

<script>

import modal2 from './components/modal2.vue'

export default {
    name: 'app',
    components: {
        modal2
    },
    data() {
        return {
            showModal: true
        }
    }
}

</script>
