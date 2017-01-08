<template>
    <div :if="item">
        <el-card class="box-card">
            <template v-if="item.type == 'object' ">
                <div slot="header" class="clearfix">
                    <code>{{item.prop1}}</code>
                    <div class="margin-b20" v-html="item.template[item.prop1]"></div>
                </div>
                <code>{{item.prop2}}</code>
                <div v-html="item.template[item.prop2]"></div>
            </template>
            <template v-else>
                <div v-html="item.template"></div>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'render-template',
    props: ['item']
}
</script>
