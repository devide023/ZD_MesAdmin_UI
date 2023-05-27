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
    <el-input
      v-model="form.engine_no"
      placeholder="机号"
      clearable
      style="width: 200px; margin-right: 5px"
    ></el-input>
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
export default {
  name: "ReportDtzs",
  mixins: [querybarmixin],
  data() {
    return {
      gwhs: [],
      form: {
        scx: "",
        engine_no: "",
        gwh: [],
      },
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>