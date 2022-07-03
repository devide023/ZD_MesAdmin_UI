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
      width="80%"
    >
      <el-form
        ref="wbzq_form"
        :model="wbzq_form"
        label-width="120px"
        label-position="right"
        inline
        :rules="rules"
      >
        <el-form-item label="生产线">
          <el-select
            v-model="wbzq_form.scx"
            placeholder="生产线"
            clearable
            style="width: 150px"
            @change="scx_change_handel"
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
        </el-form-item>
        <el-form-item label="设备名称">
          <el-select
            v-model="wbzq_form.sbbh"
            placeholder="设备选择"
            multiple
            clearable
            collapse-tags
            style="width: 200px"
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
        </el-form-item>
        <el-form-item label="下次维保时间段" prop="next_date">
          <el-date-picker
            v-model="wbzq_form.next_date"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            placeholder="下次维保时间段"
          ></el-date-picker>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="sbwbxx_search_handle"
          >查询</el-button
        >
        <el-table :data="wbzqlist" header-cell-class-name="tb_header_bg" border>
          <el-table-column
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
          <!-- <el-table-column
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
          <el-table-column
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
          </el-table-column>
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
      wbzq_form: {
        next_date: [],
        sbwbls: [],
        sbbh:[],
      },
      scx_sbxx_list:[],
      rules: {
        next_date: [
          {
            required: true,
            message: "下次维保时间不能为空",
            trigger: "change",
          },
        ],
      },
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
        this.$request("get", "/lbj/wbzq/wbzq_list", {}).then((res) => {
          if (res.code === 1) {
            this.wbzqlist = res.list.map((i) => {
              i.rowkey = newGuid();
              i.sfwb = "Y";
              return i;
            });
            this.dialogVisible = true;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    scx_change_handel(scx) {
      try {
        ApiFn.requestapi("get", "/lbj/baseinfo/scx_sbxx", { scx: scx }).then(
          (res) => {
            if (res.code === 1) {
              this.scx_sbxx_list = res.list;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
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
          try {
            this.wbzq_form.sbwbls = this.wbzqlist.filter((i) => i.sfwb === "Y");
            this.$request("post", "/lbj/wbzq/add", this.wbzq_form).then(
              (res) => {
                if (res.code === 1) {
                  this.dialogVisible = false;
                  this.wbzq_form.next_date = "";
                  this.wbzq_form.sbwbls = [];
                  this.getlist(this.queryform);
                } else if (res.code === 0) {
                  this.$message.error(res.msg);
                }
              }
            );
          } catch (error) {
            this.$message.error(error);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>