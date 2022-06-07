<template>
  <div>
    <el-tabs
      type="border-card"
      v-model="activeName"
      @tab-click="tab_click_handle"
    >
      <el-tab-pane label="CNC采集数据" name="tab1">
        <search-bar
          :collist="cnc_cols"
          :isgrade="true"
          @query="cnc_query_handle"
          @gradequery="cnc_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="cnc_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in cnc_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="cnc_resultcount"
          :current-page="cnc_queryform.pageindex"
          :page-size="cnc_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="cnc_handleCurrentChange"
          @size-change="cnc_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="检漏仪采集数据" name="tab2">
        <search-bar
          :collist="gj_cols"
          :isgrade="true"
          @query="gj_query_handle"
          @gradequery="gj_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="gj_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in gj_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="gj_resultcount"
          :current-page="gj_queryform.pageindex"
          :page-size="gj_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="gj_handleCurrentChange"
          @size-change="gj_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="清洗采集数据" name="tab3">
        <search-bar
          :collist="qx_cols"
          :isgrade="true"
          @query="qx_query_handle"
          @gradequery="qx_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="qx_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in qx_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="qx_resultcount"
          :current-page="qx_queryform.pageindex"
          :page-size="qx_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="qx_handleCurrentChange"
          @size-change="qx_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="烘干采集数据" name="tab4">
        <search-bar
          :collist="hg_cols"
          :isgrade="true"
          @query="hg_query_handle"
          @gradequery="hg_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="hg_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in hg_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="hg_resultcount"
          :current-page="hg_queryform.pageindex"
          :page-size="hg_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="hg_handleCurrentChange"
          @size-change="hg_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="SPC采集数据" name="tab5">
        <search-bar
          :collist="spc_cols"
          :isgrade="true"
          @query="spc_query_handle"
          @gradequery="spc_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="spc_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in spc_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="spc_resultcount"
          :current-page="spc_queryform.pageindex"
          :page-size="spc_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="spc_handleCurrentChange"
          @size-change="spc_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="SPC环境采集数据" name="tab6">
        <search-bar
          :collist="spchj_cols"
          :isgrade="true"
          @query="spchj_query_handle"
          @gradequery="spchj_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="spchj_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in spchj_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="spchj_resultcount"
          :current-page="spchj_queryform.pageindex"
          :page-size="spchj_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="spchj_handleCurrentChange"
          @size-change="spchj_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="油冷机采集数据" name="tab7">
        <search-bar
          :collist="ylj_cols"
          :isgrade="true"
          @query="ylj_query_handle"
          @gradequery="ylj_grade_query_handle"
        >
        </search-bar>
        <el-table
          :data="ylj_datalist"
          border
          header-cell-class-name="tb_header_bg"
          style="width: 100%"
        >
          <el-table-column
            v-for="(item, idx) in ylj_cols"
            :key="idx"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :align="item.align"
            :header-align="item.headeralign"
            :show-overflow-tooltip="item.overflowtooltip"
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :total="ylj_resultcount"
          :current-page="ylj_queryform.pageindex"
          :page-size="ylj_queryform.pagesize"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next"
          background
          style="text-align: right"
          @current-change="ylj_handleCurrentChange"
          @size-change="ylj_handleSizeChange"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import SearchBar from "@/components/QueryBar/index.vue";
import { cnc_fields } from "./cnc_fields";
import { gj_fields } from "./gj_fields";
import { qx_fields } from "./qx_fields";
import { hg_fields } from "./hg_fields";
import { pcs_fields } from "./pcs_fields";
import {spc_hj_fields} from './spc_hj_fields';
import {ylj_fields} from './ylj_fields';
import { deepClone } from "@/utils/index";
import condition from "@/mixin/search_form";
export default {
  name: "SbsjcjComponent",
  components: {
    SearchBar,
  },
  data() {
    return {
      activeName: "tab1",
      cnc_cols: cnc_fields,
      gj_cols: gj_fields,
      qx_cols: qx_fields,
      hg_cols: hg_fields,
      spc_cols: pcs_fields,
      ylj_cols:ylj_fields,
      spchj_cols:spc_hj_fields,
      cnc_datalist: [],
      gj_datalist: [],
      qx_datalist: [],
      hg_datalist: [],
      spc_datalist: [],
      spchj_datalist:[],
      ylj_datalist:[],
      cnc_queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      gj_queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      qx_queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      hg_queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      spc_queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      spchj_queryform:{
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      ylj_queryform:{
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      cnc_resultcount: 0,
      gj_resultcount: 0,
      qx_resultcount: 0,
      hg_resultcount: 0,
      spc_resultcount: 0,
      spchj_resultcount:0,
      ylj_resultcount:0,
    };
  },
  methods: {
    tab_click_handle() {},
    cnc_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.cnc_queryform.search_condition = [];
        this.cnc_queryform.px_condition = [];
        this.cnc_queryform.search_condition.push(exp);
      } else {
        this.cnc_queryform.search_condition = [];
        this.cnc_queryform.px_condition = [];
      }
      this.get_cnc_list(this.cnc_queryform);
    },
    cnc_grade_query_handle(data) {
      this.cnc_queryform.search_condition = [];
      this.cnc_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.cnc_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.cnc_queryform.px_condition = data.pxlist;
      }
      this.get_cnc_list(this.cnc_queryform);
    },
    get_cnc_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/cnc", data).then((res) => {
          if (res.code === 1) {
            this.cnc_datalist = res.list;
            this.cnc_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_gj_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/gj", data).then((res) => {
          if (res.code === 1) {
            this.gj_datalist = res.list;
            this.gj_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_qx_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/qx", data).then((res) => {
          if (res.code === 1) {
            this.qx_datalist = res.list;
            this.qx_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_hg_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/hg", data).then((res) => {
          if (res.code === 1) {
            this.hg_datalist = res.list;
            this.hg_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_spc_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/spc", data).then((res) => {
          if (res.code === 1) {
            this.spc_datalist = res.list;
            this.spc_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_spchj_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/spchj", data).then((res) => {
          if (res.code === 1) {
            this.spchj_datalist = res.list;
            this.spchj_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    get_ylj_list(data) {
      try {
        ApiFn.requestapi("post", "lbj/sjcj/ylj", data).then((res) => {
          if (res.code === 1) {
            this.ylj_datalist = res.list;
            this.ylj_resultcount = res.resultcount;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    cnc_handleCurrentChange(index) {
      this.cnc_queryform.pageindex = index;
      this.get_cnc_list(this.cnc_queryform);
    },
    cnc_handleSizeChange(val) {
      this.cnc_queryform.pagesize = val;
      this.get_cnc_list(this.cnc_queryform);
    },
    gj_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.gj_queryform.search_condition = [];
        this.gj_queryform.px_condition = [];
        this.gj_queryform.search_condition.push(exp);
      } else {
        this.gj_queryform.search_condition = [];
        this.gj_queryform.px_condition = [];
      }
      this.get_gj_list(this.gj_queryform);
    },
    gj_grade_query_handle(data) {
      this.gj_queryform.search_condition = [];
      this.gj_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.gj_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.gj_queryform.px_condition = data.pxlist;
      }
      this.get_gj_list(this.gj_queryform);
    },
    gj_handleCurrentChange(index) {
      this.gj_queryform.pageindex = index;
      this.get_gj_list(this.gj_queryform);
    },
    gj_handleSizeChange(val) {
      this.gj_queryform.pagesize = val;
      this.get_gj_list(this.gj_queryform);
    },
    qx_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.qx_queryform.search_condition = [];
        this.qx_queryform.px_condition = [];
        this.qx_queryform.search_condition.push(exp);
      } else {
        this.qx_queryform.search_condition = [];
        this.qx_queryform.px_condition = [];
      }
      this.get_qx_list(this.qx_queryform);
    },
    qx_grade_query_handle(data) {
      this.qx_queryform.search_condition = [];
      this.qx_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.qx_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.qx_queryform.px_condition = data.pxlist;
      }
      this.get_qx_list(this.qx_queryform);
    },
    qx_handleCurrentChange(index) {
      this.qx_queryform.pageindex = index;
      this.get_qx_list(this.qx_queryform);
    },
    qx_handleSizeChange(val) {
      this.qx_queryform.pagesize = val;
      this.get_qx_list(this.qx_queryform);
    },
    hg_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.hg_queryform.search_condition = [];
        this.hg_queryform.px_condition = [];
        this.hg_queryform.search_condition.push(exp);
      } else {
        this.hg_queryform.search_condition = [];
        this.hg_queryform.px_condition = [];
      }
      this.get_hg_list(this.hg_queryform);
    },
    hg_grade_query_handle(data) {
      this.hg_queryform.search_condition = [];
      this.hg_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.hg_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.hg_queryform.px_condition = data.pxlist;
      }
      this.get_hg_list(this.hg_queryform);
    },
    hg_handleCurrentChange(index) {
      this.hg_queryform.pageindex = index;
      this.get_hg_list(this.hg_queryform);
    },
    hg_handleSizeChange(val) {
      this.hg_queryform.pagesize = val;
      this.get_hg_list(this.hg_queryform);
    },
    spc_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.spc_queryform.search_condition = [];
        this.spc_queryform.px_condition = [];
        this.spc_queryform.search_condition.push(exp);
      } else {
        this.spc_queryform.search_condition = [];
        this.spc_queryform.px_condition = [];
      }
      this.get_spc_list(this.spc_queryform);
    },
    spc_grade_query_handle(data) {
      this.spc_queryform.search_condition = [];
      this.spc_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.spc_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.spc_queryform.px_condition = data.pxlist;
      }
      this.get_spc_list(this.spc_queryform);
    },
    spc_handleCurrentChange(index) {
      this.spc_queryform.pageindex = index;
      this.get_spc_list(this.spc_queryform);
    },
    spc_handleSizeChange(val) {
      this.spc_queryform.pagesize = val;
      this.get_spc_list(this.spc_queryform);
    },
    //
    spchj_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.spchj_queryform.search_condition = [];
        this.spchj_queryform.px_condition = [];
        this.spchj_queryform.search_condition.push(exp);
      } else {
        this.spchj_queryform.search_condition = [];
        this.spchj_queryform.px_condition = [];
      }
      this.get_spchj_list(this.spchj_queryform);
    },
    spchj_grade_query_handle(data) {
      this.spchj_queryform.search_condition = [];
      this.spchj_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.spchj_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.spchj_queryform.px_condition = data.pxlist;
      }
      this.get_spc_list(this.spchj_queryform);
    },
    spchj_handleCurrentChange(index) {
      this.spc_queryform.pageindex = index;
      this.get_spc_list(this.spchj_queryform);
    },
    spchj_handleSizeChange(val) {
      this.spchj_queryform.pagesize = val;
      this.get_spchj_list(this.spchj_queryform);
    },
    //油冷机
    ylj_query_handle(data) {
      if (data.field) {
        let exp = deepClone(condition.form);
        exp.colname = data.field;
        exp.coltype = data.fieldtype;
        exp.oper = data.operate;
        exp.value = data.value;
        exp.values = data.values;
        this.ylj_queryform.search_condition = [];
        this.ylj_queryform.px_condition = [];
        this.ylj_queryform.search_condition.push(exp);
      } else {
        this.ylj_queryform.search_condition = [];
        this.ylj_queryform.px_condition = [];
      }
      this.get_ylj_list(this.ylj_queryform);
    },
    ylj_grade_query_handle(data) {
      this.ylj_queryform.search_condition = [];
      this.ylj_queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.ylj_queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.ylj_queryform.px_condition = data.pxlist;
      }
      this.get_ylj_list(this.ylj_queryform);
    },
    ylj_handleCurrentChange(index) {
      this.ylj_queryform.pageindex = index;
      this.get_ylj_list(this.ylj_queryform);
    },
    ylj_handleSizeChange(val) {
      this.ylj_queryform.pagesize = val;
      this.get_ylj_list(this.ylj_queryform);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>