<template>
  <div class="search_bar">
    <el-select
      v-model="form.scx"
      clearable
      collapse-tags
      filterable
      placeholder="生产线"
      style="width: 200px; margin-right: 5px"
      @change="scx_change_handle"
    >
      <el-option
        v-for="(item, idx) in scxlist"
        :key="idx"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-date-picker
      v-model="form.kssj"
      placeholder="开始日期"
      value-format="yyyy-MM-dd"
      clearable
      style="width: 140px; margin-right: 5px"
    ></el-date-picker>
    <el-date-picker
      v-model="form.jssj"
      placeholder="结束日期"
      value-format="yyyy-MM-dd"
      clearable
      style="width: 140px; margin-right: 5px"
    ></el-date-picker>
    <el-select
      v-model="form.gwh"
      clearable
      multiple
      collapse-tags
      filterable
      placeholder="选择岗位"
      style="width: 200px; margin-right: 5px"
    >
      <el-option
        v-for="(item, index) in gwhs"
        :key="index"
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
  </div>
</template>

<script>
import { querybarmixin } from "@/mixin/querybar_mixin";
import {parseTime} from '@/utils/index';
export default {
  name: "ReportGwzs",
  mixins: [querybarmixin],
  data() {
    return {
      gwhs: [],
      form: {
        kssj: "",
        jssj: "",
        scx: "",
        gwh: [],
      },
    };
  },
  mounted () {
    this.form.kssj = parseTime(new Date().setDate(new Date().getDate() - 7)),
    this.form.jssj = parseTime(new Date());
  },
};
</script>

<style lang="scss" scoped>
</style>