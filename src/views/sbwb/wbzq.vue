<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="pageconfig.isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
      <template #other>
        <el-button
          v-for="(item, index) in btnlist"
          :key="index"
          :type="item.btntype"
          :icon="item.icon"
          @click="invokfn(item.fnname)"
          >{{ item.btntxt }}</el-button
        >
        <template v-if="pageconfig.isbatoperate && batbtnlist.length > 0">
          <bat-operate
            :add_import_success_handle="import_by_add"
            :replace_import_success_handle="import_by_replace"
            :zh_import_success_handle="import_by_zh"
            :export_excel_handle="export_excel"
          ></bat-operate>
        </template>
      </template>
    </search-bar>
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
    <!-- 维保周期录入 -->
    <el-dialog
      e-drag-dialog
      title="维保周期录入"
      :visible.sync="dialogVisible"
      top="10px"
      :close-on-click-modal="false"
      width="50%"
    >
      <el-form
        ref="wbzq_form"
        :model="wbzq_form"
        label-width="120px"
        label-position="right"
        inline
      >
        <el-form-item label="生产线">
          <el-select
            v-model="wbzq_form.scxs"
            placeholder="生产线"
            multiple
            clearable
            style="width: 150px"
            collapse-tags
            @change="scx_change_handel"
          >
            <el-option
              label="全部"
              value="全部"
              @click.native="all_item_handle()"
            ></el-option>
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
        </el-form-item>
        <!-- <el-form-item label="设备名称">
          <el-select
            v-model="wbzq_form.sbbh"
            placeholder="设备选择"
            multiple
            clearable
            collapse-tags
            style="width: 200px"
            @change="sbbh_change_handle"
          >
            <el-option
              v-for="(item, index) in scx_sbxx_list"
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
        </el-form-item> -->
        <el-form-item label="下次维保时间段">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="wbzq_form.next_date[0]"
            type="datetime"
            style="width: 182px"
            placeholder="选择维保开始时间"
          >
          </el-date-picker
          >至
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="wbzq_form.next_date[1]"
            type="datetime"
            style="width: 182px"
            placeholder="选择维保结束时间"
          >
          </el-date-picker>
          <!-- <el-date-picker
            v-model="wbzq_form.next_date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            placeholder="下次维保时间段"
          ></el-date-picker> -->
        </el-form-item>
        <!-- <el-button
          type="primary"
          icon="el-icon-search"
          @click="sbwbxx_search_handle"
          >查询</el-button
        > -->
        <el-table
          ref="wbTable"
          :data="wbzqlist"
          header-cell-class-name="tb_header_bg"
          border
          @selection-change="wb_select_handle"
        >
          <el-table-column
            header-align="center"
            align="center"
            type="selection"
            label="是否维保"
          >
          </el-table-column>
          <!-- <el-table-column
            header-align="center"
            align="center"
            label="是否维保"
            width="80"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.sfwb"
                active-value="Y"
                inactive-value="N"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="gcdm"
            width="60"
            label="工厂"
          >
            <template slot-scope="scope">
              {{ scope.row.gcdm | show_option_label("gcdm") }}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="scx"
            label="生产线"
            header-align="center"
            align="center"
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.scx | show_option_label("scx") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="sbbh"
            width="130"
            label="设备名称"
            sortable
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.sbbh | show_option_label("sbbh") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbsh"
            label="顺序"
            width="80"
            sortable
          ></el-table-column>
          <el-table-column
            header-align="center"
            align="left"
            prop="wbxx"
            label="维保内容"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            header-align="center"
            align="center"
            prop="wbzt"
            label="维保状态"
            width="100"
            sortable
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbjhsj"
            label="计划开始时间"
            width="130"
            sortable
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.wbjhsj | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbjhsjend"
            label="计划结束时间"
            width="130"
            sortable
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.wbjhsjend | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbwcsj"
            width="130"
            label="完成时间"
          >
            <template slot-scope="scope">
              {{ scope.row.wbwcsj | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbwcr"
            width="80"
            label="完成人"
          >
          </el-table-column> -->
        </el-table>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save_wbzq">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import TableComponent from "@/components/TableComponent/index.vue";
import SearchBar from "@/components/QueryBar/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
import { newGuid } from "@/utils";
var _this;
export default {
  name: "WbZqComponent",
  components: {
    TableComponent,
    SearchBar,
    BatOperate,
  },
  mixins: [basemixin, batoperatemixin, export_xls_mixin, lbj_baseinfo_mixin],
  data() {
    return {
      dialogVisible: false,
      wbzqlist: [],
      wbitems: [],
      wbzq_form: {
        kssj: "",
        jssj: "",
        next_date: [],
        sbwbls: [],
        sbbh: [],
      },
      scx_sbxx_list: [],
      isallitemselected: false,
    };
  },
  mounted() {
    _this = this;
    Vue.prototype.$basepage = this;
    this.get_scxxx_list();
    this.get_sbxx_list();
  },
  filters: {
    show_option_label(val, col) {
      var fitem = _this.pageconfig.fields.filter((i) => {
        return i.prop === col;
      });
      if (fitem) {
        let optionitem = fitem[0].options.filter((i) => i.value === val);
        if (optionitem && optionitem.length > 0) {
          return optionitem[0].label;
        } else {
          return val;
        }
      } else {
        return val;
      }
    },
  },
  methods: {
    execfun(row, fnname) {
      this[fnname](row);
    },
    add_handle() {
      try {
        this.$request("post", "/lbj/wbzq/wbzq_list", {}).then((res) => {
          if (res.code === 1) {
            this.wbzqlist = res.list;
            this.dialogVisible = true;
            this.$nextTick(() => {
              this.wbzqlist.forEach((i) => {
                this.$refs.wbTable.toggleRowSelection(i);
              });
            });
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    wb_select_handle(vals) {
      this.wbitems = vals;
    },
    scx_change_handel(scx) {
      try {
        if (scx.length !== this.scxxx_list.length + 1 && scx.includes("全部")) {
          let pos = this.wbzq_form.scxs.findIndex((t) => t === "全部");
          if (pos !== -1) {
            this.wbzq_form.scxs.splice(pos, 1);
            this.isallitemselected = false;
          }
        } else if (
          scx.length == this.scxxx_list.length &&
          !scx.includes("全部")
        ) {
          this.wbzq_form.scxs.push("全部");
          this.isallitemselected = true;
        }
        ApiFn.requestapi("post", "/lbj/wbzq/wbzq_list", { scxs: scx }).then(
          (res) => {
            if (res.code === 1) {
              this.wbzqlist = res.list;
              this.$nextTick(() => {
                this.wbzqlist.forEach((i) => {
                  this.$refs.wbTable.toggleRowSelection(i);
                });
              });
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    all_item_handle() {
      this.isallitemselected = !this.isallitemselected;
      if (this.isallitemselected) {
        this.wbzq_form.scxs = [];
        this.scxxx_list.forEach((i) => {
          this.wbzq_form.scxs.push(i.value);
        });
        this.wbzq_form.scxs.push("全部");
      } else {
        this.wbzq_form.scxs = [];
      }
      this.scx_change_handel(this.wbzq_form.scxs);
    },
    sbbh_change_handle() {
      this.sbwbxx_search_handle();
    },
    sbwbxx_search_handle() {
      ApiFn.requestapi("post", "/lbj/wbzq/query", {
        scx: this.wbzq_form.scx,
        sbbh: this.wbzq_form.sbbh,
      }).then((res) => {
        if (res.code === 1) {
          this.wbzqlist = res.list.map((i) => {
            i.rowkey = newGuid();
            i.sfwb = "Y";
            return i;
          });
        } else if (res.code === 0) {
          this.$message.error(res.msg);
        }
      });
    },
    save_wbzq() {
      this.$refs.wbzq_form.validate((v) => {
        if (v) {
          if (this.wbzq_form.next_date.length === 2) {
            let rq0 = this.wbzq_form.next_date[0];
            let rq1 = this.wbzq_form.next_date[1];
            if (rq0 && rq1) {
              try {
                this.wbzq_form.sbwbls = this.wbitems;
                this.$request("post", "/lbj/wbzq/add", this.wbzq_form).then(
                  (res) => {
                    if (res.code === 1) {
                      this.dialogVisible = false;
                      this.wbzq_form.next_date = [];
                      this.wbzq_form.sbwbls = [];
                      this.wbzq_form.kssj = "";
                      this.wbzq_form.jssj = "";
                      this.wbzq_form.sbbh = [];
                      this.wbzq_form.scxs = [];
                      this.getlist(this.queryform);
                    } else if (res.code === 0) {
                      this.$message.error(res.msg);
                    }
                  }
                );
              } catch (error) {
                this.$message.error(error);
              }
            } else {
              this.$message.error("起止时间需选择");
            }
          } else {
            this.$message.error("起止时间需选择");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>