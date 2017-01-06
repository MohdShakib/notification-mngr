<style>

.vue-app-content {
    margin-top: 70px;
}

.glyphicon-right-spinner {
    -webkit-animation: glyphicon-spin-r 3s infinite linear;
    animation: glyphicon-spin-r 3s infinite linear;
}

.margin-b20{
    margin-bottom: 20px;
}
</style>

<template>

<div id="app" class="vue-app-content">
    <!-- <header> -->

    <notifications></notifications>

    <myHeader></myHeader>

    <!-- </header> -->
    <div class="container-fluid">
        <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
        </transition>
    </div>


</div>

</template>

<script>

import myHeader from './components/header.vue'
import notifications from './components/notifications.vue'

export default {
    name: 'app',
    components: {
        myHeader,
        notifications
    },
    data() {
        return {
        }
    }
}

</script>
