<template>
    <div>
        <el-form ref="form" :model="formdata" label-width="80px" label-position="right">
           <el-form-item v-for="(item,index) in formfields" :key="index" :label="item.label">
            <el-input v-model="item.value"></el-input>
           </el-form-item> 
        </el-form>
    </div>
</template>

<script>
    export default {
        name:'Bz4mbhdComponent',
        data() {
            return {
                formdata:{
                    label:'',
                    value:''
                }
            }
        },
        props: {
            formfields: {
                type: Array,
                default: []
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>