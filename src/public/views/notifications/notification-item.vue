<template>

<tr>
    <td class="text-center">
        <router-link :to="{name:'notification-detail', params: {id: item.id}}" tag="a">{{item.id}}</router-link>
    </td>
    <td>{{item.mediumname}}</td>
    <td>{{item.notificationname}}</td>
    <td>{{item.createdAt}}</td>
    <td>{{item.scheduleDate}}</td>
    <td>{{item.status}}</td>
    <td>{{item.is_open ? 'opened' : 'not opened'}}</td>
</tr>
</div>

</template>

<script>

export default {
    name: 'notifications-item',
    props: ['item', 'index']
}

</script>
