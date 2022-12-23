<template>
  <div>
    <div class="search_bar">
      <el-date-picker
        v-model="form.rq"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        clearable
        style="width: 250px; margin-right: 5px"
      ></el-date-picker>
      <el-select
        v-model="form.bc"
        clearable
        multiple
        collapse-tags
        placeholder="班次选择"
        style="width: 150px; margin-right: 5px"
      >
        <el-option
          v-for="(item, idx) in bcoptions"
          :key="idx"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="form.cpmc"
        clearable
        multiple
        allow-create
        collapse-tags
        placeholder="选择产品"
        style="width: 150px; margin-right: 5px"
      >
        <el-option
          v-for="(item, idx) in cpmcoptions"
          :key="idx"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="query_handle"
        >查询</el-button
      >
    </div>
    <el-table
      :data="list"
      border
      ref="maintable"
      :height="tableheight"
      header-cell-class-name="tb_header_bg"
    >
      <el-table-column
        prop="rq"
        label="日期"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.rq | parseTime("{y}-{m}-{d}") }}
        </template>
      </el-table-column>
      <el-table-column
        prop="bc"
        label="班次"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="cpmc"
        label="产品"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="trjgs"
        label="投入数量"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="gfsl"
        label="工废数量"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="lfsl"
        label="料废数量"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="hgsl"
        label="合格数量"
        align="center"
        header-align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
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
import ApiFn from "@/api/baseapi";
export default {
  name: "GtJjbComponent",
  data() {
    return {
      form: {
        rq: [],
        cpmc: [],
        bc: [],
      },
      tableheight: 0,
      resultcount: 0,
      queryform: {
        pageindex: 1,
        pagesize: 20,
      },
      bcoptions: [
        {
          label: "白班",
          value: "白班",
        },
        {
          label: "中班",
          value: "中班",
        },
        {
          label: "夜班",
          value: "夜班",
        },
      ],
      cpmcoptions: [],
      list: [],
    };
  },
  mounted() {
    this.get_cplist_data();
    this.$nextTick(function () {
      this.sizechangeHandle();
    });
  },
  beforeMount() {
    window.addEventListener("resize", this.sizechangeHandle);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sizechangeHandle);
  },
  methods: {
    get_cplist_data() {
      ApiFn.requestapi("get", "/cdgc/gtjjb/get_cplist", {}).then((res) => {
        if (res.code === 1) {
          this.cpmcoptions = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getlist() {
      let postdata = this.form;
      postdata.pageindex = this.queryform.pageindex;
      postdata.pagesize = this.queryform.pagesize;
      ApiFn.requestapi("post", "/cdgc/report/gtjjb", postdata).then((res) => {
        if (res.code === 1) {
          this.resultcount = res.resultcount;
          this.list = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    sizechangeHandle() {
      let bodyheight = document.body.offsetHeight;
      this.tableheight = bodyheight - 155;
    },
    query_handle() {
      this.queryform.pageindex = 1;
      this.getlist();
    },
    handleSizeChange(val) {
      this.queryform.pagesize = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.queryform.pageindex = val;
      this.getlist();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>