

<template>

<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <div class="collapse navbar-collapse">

            <div class="col-lg-3">
                <h3>Notification Manager</h3>
            </div>
            <div class="col-lg-8">
                <ul class="nav navbar-nav pull-right">
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
        </div>
    </div>
</nav>

</template>

<script>
    export default {
        name: 'my-header'
    }
</script>
