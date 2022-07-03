<template>
  <div>
    <div class="search_bar">
      <el-select
        v-model="form.scx"
        clearable
        filterable
        placeholder="选择生产线"
        @change="scx_change_handle"
        style="width: 200px; margin-right: 5px"
      >
        <el-option
          v-for="(item, index) in scxxx_list"
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
      <el-select
        v-model="form.sbbh"
        clearable
        filterable
        placeholder="设备编号"
        style="width: 200px; margin-right: 5px"
        @change="sbbh_change_handle"
      >
        <el-option
          v-for="(item, index) in sbxx_list"
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
      <el-select
        v-model="form.dbh"
        clearable
        filterable
        multiple
        collapse-tags
        placeholder="选择刀柄号"
        style="width: 250px; margin-right: 5px"
      >
        <el-option
          v-for="(item, index) in dbxx_list"
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
      <el-select clearable v-model="form.rjzt" placeholder="状态">
        <el-option label="报警" value="1"></el-option>
        <el-option label="正常" value="0"></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="report_query_handle"
        style="margin-left:5px;"
        >查询</el-button
      >
    </div>
    <table-component
      :isselect="pageconfig.isselect"
      :isoperate="pageconfig.isoperate"
      ref="tablecomponent"
      :resultcount="resultcount"
      :datalist="list"
      :collist="colshowlist"
      :multipleSelection.sync="selectlist"
      :trbginfo="trbginfo"
      :pagesize.sync="queryform.pagesize"
      :pageindex.sync="queryform.pageindex"
      :pageindexHandle="pageindex_change_handle"
      :pagesizeHandle="pagesize_change_handle"
    >
      <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-setting" style="font-size: 16px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in pageconfig.operate_fnlist"
              :key="index"
            >
              <template v-if="item.btntype === 'upload'">
                <el-upload
                  v-if="scope.row.isedit"
                  :headers="headers"
                  :action="item.action"
                  :show-file-list="false"
                  accept=".pdf,application/pdf"
                  :data="scope.row"
                  :before-upload="before_upload_PDFHandle"
                  :on-success="item.callback"
                >
                  <el-button type="text">{{ item.label }}</el-button>
                </el-upload>
              </template>
              <template v-else-if="item.btntype === 'uploadvideo'">
                <el-upload
                  v-if="scope.row.isedit"
                  :headers="headers"
                  :action="item.action"
                  :show-file-list="false"
                  accept=".mp4,video/mp4,application/mp4"
                  :data="scope.row"
                  :before-upload="before_upload_Mp4Handle"
                  :on-success="item.callback"
                >
                  <el-button type="text">{{ item.label }}</el-button>
                </el-upload>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click.native="execfun(scope.row, item.fnname)"
                  >{{ item.label }}</el-button
                ></template
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import { basemixin } from "@/mixin/basemixin";
import { deepClone } from "@/utils/index";
import condition from "@/mixin/search_form";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
import TableComponent from "@/components/TableComponent/index.vue";
export default {
  name: "DjBbComponent",
  components: {
    TableComponent,
  },
  mixins: [basemixin, lbj_baseinfo_mixin],
  data() {
    return {
      form: {
        scx: "",
        sbbh: "",
        dbh: [],
        rjzt: "1",
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
    this.get_scxxx_list();
    this.report_query_handle();
  },
  methods: {
    scx_change_handle(val) {
      try {
        ApiFn.requestapi("get", "/lbj/baseinfo/cnc_list_by_scx", { scx: val }).then(
          (res) => {
            if (res.code === 1) {
              this.sbxx_list = res.list.map((i) => {
                return { label: i.sbmc, value: i.sbbh };
              });
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    sbbh_change_handle(val) {
      try {
        ApiFn.requestapi("get", "/lbj/djreport/dbxxbysbbh", {
          scx: this.form.scx,
          sbh: val,
        }).then((res) => {
          if (res.code === 1) {
            this.dbxx_list = res.list.map((i) => {
              return { label: i.dblx, value: i.dbh };
            });
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    report_query_handle() {
      this.queryform.search_condition = [];
      this.queryform.px_condition = [];
      if (this.form.scx) {
        let exp = deepClone(condition.form);
        exp.colname = "scx";
        exp.coltype = "string";
        exp.oper = "=";
        exp.value = this.form.scx;
        exp.values = [];
        this.queryform.search_condition.push(exp);
      }
      if (this.form.sbbh) {
        let exp1 = deepClone(condition.form);
        exp1.colname = "sbbh";
        exp1.coltype = "string";
        exp1.oper = "=";
        exp1.value = this.form.sbbh;
        exp1.values = [];
        this.queryform.search_condition.push(exp1);
      }
      if (this.form.dbh.length > 0) {
        let exp2 = deepClone(condition.form);
        exp2.colname = "dbh";
        exp2.coltype = "list";
        exp2.oper = "in";
        exp2.value = "";
        exp2.values = this.form.dbh;
        this.queryform.search_condition.push(exp2);
      }
      if (this.form.rjzt) {
        let exp3 = deepClone(condition.form);
        exp3.colname = "rjzt";
        exp3.coltype = "int";
        if (this.form.rjzt === "1") {
          exp3.oper = ">=";
          exp3.value = "95";
        } else if (this.form.rjzt === "0") {
          exp3.oper = "<";
          exp3.value = "95";
        } else {
          exp3.oper = "";
          exp3.value = "";
        }
        exp3.values = [];
        this.queryform.search_condition.push(exp3);
      }
      for (
        let index = 0;
        index < this.queryform.search_condition.length - 1;
        index++
      ) {
        this.queryform.search_condition[index].logic = "and";
      }
      ApiFn.requestapi(
        this.pageconfig.queryapi.method,
        this.pageconfig.queryapi.url,
        this.queryform
      ).then((res) => {
        if (res.code === 1) {
          this.list = res.list;
          this.resultcount = res.resultcount;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>