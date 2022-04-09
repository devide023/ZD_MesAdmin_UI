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
        <template v-if="pageconfig.isbatoperate">
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
      :pagesize.sync="queryform.pagesize"
      :pageindex.sync="queryform.pageindex"
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
      width="60%"
    >
      <el-form
        ref="wbzq_form"
        :model="wbzq_form"
        label-width="120px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="下次维保时间" prop="next_date">
          <el-date-picker
            v-model="wbzq_form.next_date"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="下次维保时间"
          ></el-date-picker>
        </el-form-item>
        <el-table :data="wbzqlist" header-cell-class-name="tb_header_bg" border>
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
          </el-table-column>
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
            prop="gwh"
            width="80"
            label="岗位"
          >
            <template slot-scope="scope">
              {{ scope.row.gwh | show_option_label("gwh") }}
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbsh"
            label="顺序"
            width="60"
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
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="wbjhsj"
            label="计划时间"
            width="130"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.wbjhsj | parseTime("{y}-{m}-{d}") }}
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
import TableComponent from "@/components/TableComponent/index.vue";
import SearchBar from "@/components/QueryBar/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { newGuid } from "@/utils";
var _this;
export default {
  name: "WbZqComponent",
  components: {
    TableComponent,
    SearchBar,
    BatOperate,
  },
  mixins: [basemixin, batoperatemixin],
  data() {
    return {
      dialogVisible: false,
      wbzqlist: [],
      wbzq_form: {
        next_date: "",
        sbwbls: [],
      },
      rules: {
        next_date: [
          {
            required: true,
            message: "下次维保时间不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    _this = this;
    Vue.prototype.$basepage = this;
  },
  filters: {
    show_option_label(val, col) {
      var fitem = _this.pageconfig.fields.filter((i) => {
        return i.prop === col;
      });
      if (fitem) {
        let optionitem = fitem[0].options.filter((i) => i.value === val);
        if (optionitem) {
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
      console.log(fnname);
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
    save_wbzq() {
      this.$refs.wbzq_form.validate((v) => {
        if (v) {
          try {
            this.wbzq_form.sbwbls = this.wbzqlist.filter((i) => i.sfwb === "Y");
            this.$request("post", "lbj/wbzq/add", this.wbzq_form).then(
              (res) => {
                if (res.code === 1) {
                  this.wbzq_form.next_date = "";
                  this.wbzq_form.sbwbls = [];
                  this.dialogVisible = false;
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