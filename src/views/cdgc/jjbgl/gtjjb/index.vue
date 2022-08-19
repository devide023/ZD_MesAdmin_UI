<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane label="当前班次">
                <gtjjbform :isread="false" @rq_change="rq_change_handel" @gtjjb_data = "deal_gtjjb_data_handle"></gtjjbform>
            </el-tab-pane>
            <el-tab-pane label="上一班次">
                <gtjjbform :isread="true"></gtjjbform>
            </el-tab-pane>
            <el-tab-pane label="上上班次">
                <gtjjbform :isread="true"></gtjjbform>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import GtjjbForm from './component/gtjjb.vue';
    export default {
        name:'GtjjbComponent',
        components: {
            'gtjjbform':GtjjbForm,
        },
        data() {
            return {
                list: []
            }
        },
        methods: {
            rq_change_handel(v){
                console.log(v);
            },
            deal_gtjjb_data_handle(data) {
                console.log(data);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>