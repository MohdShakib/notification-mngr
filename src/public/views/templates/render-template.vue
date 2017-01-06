<template>
    <div :if="item">
        <template v-if="item.type == 'object' ">
            <code>{{item.prop1}}</code>
            <div class="margin-b20" v-html="item.template[item.prop1]"></div>
            <code>{{item.prop2}}</code>
            <div v-html="item.template[item.prop2]"></div>
        </template>
        <template v-else>
            <div v-html="item.template"></div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'render-template',
    props: ['item']
}
</script>
