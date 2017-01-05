<template>
    <tr style="height:100px;" >
        <td :colspan="cols"  class="text-center">
            <slot>
                No data found
            </slot>
        </td>
    </tr>
</template>

<script>
    export default {
        name: 'table-row-message',
        props: ['cols']
    }
</script>
