<style>

.vue-app-content {
    margin-top: 70px;
}

</style>

<template>

<div id="app" class="vue-app-content">
    <!-- <header> -->

    <myHeader></myHeader>
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
import myHeader from './components/header.vue'

export default {
    name: 'app',
    components: {
        modal2,
        myHeader
    },
    data() {
        return {
            showModal: true
        }
    }
}

</script>
