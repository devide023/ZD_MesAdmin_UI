<template>
  <div>
    <el-table
      :data="list"
      border
      header-cell-class-name="tb_header_bg"
      style="width: 100%"
    >
      <el-table-column
        prop="gwh"
        label="岗位编号"
        sortable
        header-align="center"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="lsjs"
        label="螺栓数"
        sortable
        header-align="center"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="jcsj"
        label="检测时间"
        sortable
        header-align="center"
        align="center"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.jcsj | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="jcry"
        label="检测人员"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="jcjg"
        label="检测结果"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="data1"
        label="扭力/压力"
        sortable
        show-overflow-tooltip
        header-align="center"
        align="center"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="data2"
        label="角度/深度"
        sortable
        header-align="center"
        align="center"
        show-overflow-tooltip
        width="100"
      ></el-table-column>
      <el-table-column
        prop="sbbh"
        label="设备编号"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="engineno"
        label="机号"
        sortable
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "A1ZpMxComponent",
  props: {
    rowobj: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      this.$request("post", "/a1/sjzs/dtzs/zpmx", this.rowobj).then((res) => {
        if (res.code === 1) {
          this.list = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>