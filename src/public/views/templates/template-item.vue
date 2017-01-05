<style>

pre {
    white-space: pre-wrap;
    max-height: 100px;
    overflow-y: hidden;
    word-break: break-word;
}

</style>

<template>

<tr>
    <td class="text-center">{{item.id}}</td>
    <td>{{item.mediumname}}</td>
    <td>{{item.notificationname}}</td>
    <td>
        <template v-if="item.type == 'object' ">
            <div class="">
                <code>{{item.prop1}}</code>
                <pre>{{item.template[item.prop1]}}</pre>
                <code>{{item.prop2}}</code>
                <pre>{{item.template[item.prop2]}}</pre>
            </div>
        </template>
        <template v-else>
            <pre>{{item.template}}</pre>
        </template>
    </td>
    <td class="text-center">
        <form class="form-group">
            <router-link  type="button" class="btn btn-primary" :to="{name:'update-template', params: {id: item.id}}" tag="button">
                <span class="glyphicon glyphicon-pencil"></span>
            </router-link>
            &nbsp;
            <button type="button" class="btn btn-primary">
                <span class="glyphicon glyphicon-eye-open"></span>
            </button>&nbsp;
            <button type="button" class="btn btn-primary">
                <span class="glyphicon glyphicon-trash"></span>
            </button>&nbsp;
            <button type="button" class="btn btn-primary">
                <span class="glyphicon glyphicon-send"></span>
            </button>
        </form>
    </td>
</tr>
</div>

</template>

<script>

export default {
    name: 'templates-item',
    props: ['item', 'index']
}

</script>
