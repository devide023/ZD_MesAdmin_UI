<template>
  <div>
    <el-date-picker
      v-model="form.kssj"
      value-format="yyyy-MM-dd"
      placeholder="请选择开始日期"
      style="width: 140px; margin-right: 5px"
    ></el-date-picker>
    <el-date-picker
      v-model="form.jssj"
      value-format="yyyy-MM-dd"
      placeholder="请选择结束日期"
      style="width: 140px; margin-right: 5px"
    ></el-date-picker>
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
import { parseTime } from "@/utils/index";
export default {
  name: "ReportGsjComponent",
  mixins: [querybarmixin],
  data() {
    return {
      form: {
        kssj: "",
        jssj: "",
        scx: "",
        gwh: "",
      },
    };
  },
  mounted() {
    this.form.kssj = parseTime(new Date());
    this.form.jssj = parseTime(new Date());
  },
};
</script>

<style lang="scss" scoped>
</style>