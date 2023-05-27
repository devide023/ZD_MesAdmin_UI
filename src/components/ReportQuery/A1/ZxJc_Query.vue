<template>
  <div>
    <el-select
      v-model="form.scx"
      filterable
      collapse-tags
      clearable
      placeholder="请选择生产线"
      style="width: 150px; margin-right: 5px"
    >
      <el-option
        v-for="(item, idx) in scxlist"
        :key="idx"
        :label="item.label"
        :value="item.value"
      >
        <span style="float: left">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{
          item.value
        }}</span>
      </el-option>
    </el-select>
    <el-select
      v-model="form.jclx"
      filterable
      clearable
      placeholder="请选择检测类型"
      style="width: 200px; margin-right: 5px"
    >
      <el-option
        v-for="(item, idx) in jclxlist"
        :key="idx"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-input
      v-model="form.orderno"
      clearable
      placeholder="订单号"
      style="width: 150px; margin-right: 5px"
    ></el-input>
    <el-input
      v-model="form.jjh"
      clearable
      placeholder="计划号"
      style="width: 150px; margin-right: 5px"
    ></el-input>
    <!-- 检测查询 -->
    <el-button type="primary" icon="el-icon-search" @click="btn_search_handle"
      >查询</el-button
    >
    <el-button type="success" icon="el-icon-check" @click="btn_export_handle"
      >导出Excel</el-button
    >
  </div>
</template>

<script>
import { querybarmixin } from "@/mixin/A1/report_query_mixin";
export default {
  name: "ZxjcComponent",
  mixins: [querybarmixin],
  data() {
    return {
      form: {
        scx: "",
        jclx: "",
        orderno:'',
        jjh:''
      },
    };
  },
  mounted() {
    this.getjclxlist();
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>