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
    <td class="col-lg-1 text-center">{{index + 1}}</td>
    <td class="col-lg-1">{{item.mediumname}}</td>
    <td class="col-lg-1">{{item.notificationname}}</td>
    <td class="col-lg-5">
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
    <td class="col-lg-4 text-center">
        <form class="form-group">
            <button type="button" class="btn btn-primary" >
                <span class="glyphicon glyphicon-pencil"></span>
            </button>&nbsp;
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

import modal from '../../components/modal.vue'

export default {
    name: 'templates-item',
    components: { modal },
    props: ['item', 'index']
}

</script>
