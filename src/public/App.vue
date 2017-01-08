<template>

<div id="app" class="vue-app-content">
    <!-- <header> -->

    <myHeader></myHeader>

    <!-- </header> -->
    <div class="main-content">
        <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
        </transition>
    </div>


</div>

</template>

<script>

import myHeader from './components/header.vue'

export default {
    name: 'app',
    components: {
        myHeader
    },
    data() {
        return {}
    }
}

</script>
