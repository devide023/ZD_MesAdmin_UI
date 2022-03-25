<template>
    <div>
        <el-table
            :data="list"
            :row-key="rowKey"
            style="width: 100%">
            <el-table-column
                prop="a"
                label="a"
                width="100">
            </el-table-column>
            <el-table-column
                prop="b"
                label="b"
                width="200">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name:'RoleComponent',
        data() {
            return {
                list: [{a:1,b:2}]
            }
        },
        methods: {
            rowKey(row) {
                console.log(row)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>