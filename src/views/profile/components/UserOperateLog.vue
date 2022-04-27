<template>
  <div>
    <el-table
      :data="list"
      header-cell-class-name="tb_header_bg"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="czrq"
        label="操作日期"
        width="150"
        header-align="center"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.czrq | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lx"
        header-align="center"
        align="center"
        label="操作类型"
        width="150"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.lx | lxname }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="menuname"
        width="100"
        label="模块"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="olddata"
        header-align="center"
        label="原数据"
        width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="newdata"
        header-align="center"
        label="操作数据"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-pagination
      :total="resultcount"
      :current-page="queryform.pageindex"
      :page-size="queryform.pagesize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next"
      background
      style="text-align: right"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
var _this;
import ApiFn from "@/api/baseapi";
export default {
  name: "LogComponent",
  data() {
    return {
      list: [],
      resultcount: 0,
      lxlist: [
        {
          label: "新增",
          value: "add",
        },
        {
          label: "删除",
          value: "del",
        },
        {
          label: "修改",
          value: "update",
        },
      ],
      queryform: {
        pageindex: 1,
        pagesize: 20,
      },
    };
  },
  mounted() {
    this.getlist();
    _this = this;
  },
  filters: {
    lxname: function (value) {
      let pos = _this.lxlist.findIndex((i) => i.value === value);
      if (pos !== -1) {
        return _this.lxlist[pos].label;
      } else {
        return value;
      }
    },
  },
  methods: {
    getlist() {
      ApiFn.requestapi("post", "/log/list", this.queryform).then((res) => {
        if (res.code === 1) {
          this.resultcount = res.resultcount;
          this.list = res.list;
        } else if (res.code === 0) {
          this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(index) {
      this.queryform.pageindex = index;
      this.getlist();
    },
    handleSizeChange(val) {
      this.queryform.pagesize = val;
      this.getlist();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>