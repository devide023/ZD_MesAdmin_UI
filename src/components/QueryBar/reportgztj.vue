<template>
  <div class="search_bar">
    <!-- <el-select
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
    </el-select> -->
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
    <el-radio-group v-model="form.tjfs" style="margin-right: 5px">
      <el-radio label="1">按机型统计</el-radio>
      <el-radio label="2">按状态统计</el-radio>
    </el-radio-group>
    <el-button type="primary" icon="el-icon-search" @click="btn_search_handle"
      >查询</el-button
    >
  </div>
</template>

<script>
import {querybarmixin} from '@/mixin/querybar_mixin';
import {parseTime} from '@/utils/index';
export default {
  name: "ReportGztj",
  mixins: [querybarmixin],
  data() {
    return {
      form: {
        kssj: "",
        jssj: "",
        jx_no: "",
        status_no: "",
        tjfs: "1",
      },
    };
  },
  mounted() {
    this.form.kssj = parseTime(new Date().setDate(new Date().getDate() - 7)),
    this.form.jssj = parseTime(new Date());
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
</style>