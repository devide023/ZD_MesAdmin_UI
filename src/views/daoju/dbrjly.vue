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
      :pageindexHandle = "pageindex_change_handle"
      :pagesizeHandle = "pagesize_change_handle"
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
    <!-- 刀柄刃具领用窗口 -->
    <el-dialog
      v-drag-dialog
      title="刀柄刃具领用"
      :visible.sync="dialogVisible"
      width="50%"
      @opened="dialog_open_handle"
    >
      <el-tabs
        type="border-card"
        v-model="activetab"
        @tab-click="tab_change_handle"
      >
        <el-tab-pane label="初次领取" name="first_use">
          <el-form
            ref="first_use_form"
            :model="lyform"
            :rules="rules"
            label-width="80px"
            label-position="right"
          >
            <el-form-item label="工厂" prop="gcdm">
              <el-select
                v-model="lyform.gcdm"
                filterable
                clearable
                style="width: 300px"
              >
                <el-option
                  v-for="(item, index) in gcxx_list"
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
            <el-form-item label="生产线" prop="scx">
              <el-select
                v-model="lyform.scx"
                filterable
                clearable
                :multiple="false"
                style="width: 300px"
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
            <el-form-item label="设备编号" prop="sbbh">
              <el-select
                v-model="lyform.sbbh"
                filterable
                clearable
                style="width: 300px"
                placeholder=""
              >
                <el-option
                  v-for="(item, idx) in free_cnc_list"
                  :key="idx"
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
            <el-form-item label="刀柄编号" prop="dbh">
              <el-select
                v-model="lyform.dbh"
                clearable
                filterable
                style="width: 300px"
                @change="dbh_change_handle"
              >
                <el-option
                  v-for="(item, index) in free_dbxx_list"
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
            <el-form-item label="领用人" prop="lyr">
              <el-input
                v-model.trim="lyform.lyr"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-table
              :data="dbrjgx_list"
              ref="dbrjzx_table"
              border
              stripe
              style="width: 100%"
              header-cell-class-name="tb_header_bg"
              @selection-change="choose_dygx_handle"
            >
              <el-table-column
                type="selection"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                header-align="center"
                align="center"
                prop="cpzt"
                label="产品"
                width="150"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="rjlx"
                header-align="center"
                label="刃具类型"
              >
              </el-table-column>
              <el-table-column
                prop="rjmc"
                header-align="center"
                align="center"
                width="150"
                label="刃具名称"
              >
              </el-table-column>
              <el-table-column
                prop="rjbzsm"
                header-align="center"
                align="center"
                width="100"
                label="标准寿命"
              >
              </el-table-column>
            </el-table>
          </el-form>
          <div class="tab_btn">
            <el-button type="danger" @click="dialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="save_dbrjly_handle"
              >确定</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="换刀领取" name="exchange_user">
          <el-form
            ref="exchange_use_form"
            :model="hdform"
            :rules="rules"
            label-width="100px"
            label-position="right"
          >
            <el-form-item label="工厂" prop="gcdm">
              <el-select
                v-model="hdform.gcdm"
                filterable
                clearable
                style="width: 300px"
              >
                <el-option
                  v-for="(item, index) in gcxx_list"
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
            <el-form-item label="生产线" prop="scx">
              <el-select
                v-model="hdform.scx"
                filterable
                clearable
                :multiple="false"
                style="width: 300px"
                @change="scx_change_handle"
                placeholder="原生产线"
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
              <i class="el-icon-right" style="margin: 0px 10px"></i>
              <el-select
                v-model="hdform.newscx"
                filterable
                clearable
                style="width: 300px"
                placeholder="新生产线"
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
            <el-form-item label="设备编号" prop="sbbh">
              <el-select
                v-model="hdform.sbbh"
                filterable
                clearable
                style="width: 300px"
                placeholder="原设备编号"
                @change="sbbh_change_handle"
              >
                <el-option
                  v-for="(item, idx) in scx_cnc_list"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.value
                  }}</span>
                </el-option>
              </el-select>
              <i class="el-icon-right" style="margin: 0px 10px"></i>
              <el-select
                v-model="hdform.newsbbh"
                filterable
                clearable
                style="width: 300px"
                placeholder="新设备编号"
              >
                <el-option
                  v-for="(item, idx) in free_cnc_list"
                  :key="idx"
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
            <el-form-item label="刀柄编号" prop="dbh">
              <el-select
                v-model="hdform.dbh"
                clearable
                filterable
                style="width: 300px"
                @change="exchange_dbh_change_handle"
                placeholder="原刀柄编号"
              >
                <el-option
                  v-for="(item, index) in dbxx_change_list"
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
              <i class="el-icon-right" style="margin: 0px 10px"></i>
              <el-select
                v-model="hdform.newdbh"
                clearable
                filterable
                style="width: 300px"
                placeholder="新刀柄号"
                @change="newdbh_change_handle"
              >
                <el-option
                  v-for="(item, index) in free_dbxx_list"
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
            <el-form-item label="领用人" prop="lyr">
              <el-input
                v-model.trim="hdform.lyr"
                style="width: 300px"
              ></el-input>
            </el-form-item>
            <el-form-item label="原领用刃具">
              <el-table
                ref="old_dbrjzx_table"
                :data="dbrjzx_oldlist"
                header-cell-class-name="tb_header_bg"
                border
                stripe
                style="width: 100%"
                @selection-change="choose_olddbrjzx_handle"
              >
                <el-table-column
                  header-align="center"
                  align="center"
                  type="selection"
                ></el-table-column>
                <el-table-column
                  prop="rjlx"
                  label="刃具类型"
                  header-align="center"
                  align="center"
                  sortable
                  width="100"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="rjbzsm"
                  label="标准寿命"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="rjazsm"
                  label="安装寿命"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="rjdqsm"
                  label="当前寿命"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="rjlyr"
                  label="领用人"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="rjlysj"
                  label="领用时间"
                  width="100"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    {{
                      scope.row.rjlysj | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
                    }}
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="新领用刃具">
              <el-table
                :data="dbrjgx_list_hd"
                ref="new_dbrjzx_table"
                border
                stripe
                style="width: 100%"
                header-cell-class-name="tb_header_bg"
                @selection-change="choose_hddygx_handle"
              >
                <el-table-column
                  type="selection"
                  header-align="center"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  prop="cpzt"
                  label="产品"
                  width="150"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="rjlx"
                  header-align="center"
                  label="刃具类型"
                >
                </el-table-column>
                <el-table-column
                  prop="rjmc"
                  header-align="center"
                  align="center"
                  width="150"
                  label="刃具名称"
                >
                </el-table-column>
                <el-table-column
                  prop="rjbzsm"
                  header-align="center"
                  align="center"
                  width="100"
                  label="标准寿命"
                >
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div class="tab_btn">
            <el-button type="danger" @click="dialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="save_exchange_dbrjly_handle"
              >确定</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { parseTime } from "@/utils/index";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
export default {
  name: "DbrjlyComponent",
  components: {
    SearchBar,
    TableComponent,
  },
  mixins: [basemixin, lbj_baseinfo_mixin],
  data() {
    return {
      dbrjgx_list: [],
      dbrjgx_list_hd: [],
      dbrjzx_oldlist: [],
      dygx_choose_items: [],
      dbxx_change_list: [],
      scx_cnc_list: [],
      hddygx_choose_items: [],
      dialogVisible: false,
      activetab: "first_use",
      lyform: {
        gcdm: "9902",
        scx: "",
        sbbh: "",
        lyr: "",
        dbh: "",
        dbrjzx: [],
      },
      hdform: {
        gcdm: "9902",
        scx: "",
        sbbh: "",
        dbh: "",
        lyr: "",
        newscx: "",
        newsbbh: "",
        newdbh: "",
        olddbrjzx: [],
        dbrjzx: [],
      },
      rules: {
        gcdm: [
          {
            required: true,
            message: "工厂不能为空",
            trigger: "change",
          },
        ],
        scx: [
          {
            required: true,
            message: "生产线不能为空",
            trigger: "change",
          },
        ],
        newscx: [
          {
            required: true,
            message: "新生产线不能为空",
            trigger: "change",
          },
        ],
        dbh: [
          {
            required: true,
            message: "刀柄号不能为空",
            trigger: "change",
          },
        ],
        newdbh: [
          {
            required: true,
            message: "新刀柄号不能为空",
            trigger: "change",
          },
        ],
        sbbh: [
          {
            required: true,
            message: "设备编号不能为空",
            trigger: "change",
          },
        ],
        newsbbh: [
          {
            required: true,
            message: "新设备编号不能为空",
            trigger: "change",
          },
        ],
        lyr: [
          {
            required: true,
            message: "领用人不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
    this.get_gcxx_list();
    this.get_scxxx_list();
    this.get_dbxx_list();
  },
  methods: {
    tab_change_handle() {},
    scx_change_handle(val) {
      try {
        ApiFn.requestapi("get", "lbj/dbrjly/sbbh_by_scx", { scx: val }).then(
          (res) => {
            if (res.code === 1) {
              this.scx_cnc_list = res.list;
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    sbbh_change_handle(val) {
      try {
        ApiFn.requestapi("get", "lbj/dbrjly/db_by_sbbh", { sbbh: val }).then(
          (res) => {
            if (res.code === 1) {
              this.dbxx_change_list = res.list;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    dbh_change_handle(dbh) {
      //初次领刀
      ApiFn.requestapi("get", "/lbj/dbrjly/dbrjgx_list", { dbh: dbh }).then(
        (res) => {
          if (res.code === 1) {
            this.dbrjgx_list = res.list;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        }
      );
    },
    newdbh_change_handle(dbh) {
      ApiFn.requestapi("get", "/lbj/dbrjly/dbrjgx_list", { dbh: dbh }).then(
        (res) => {
          if (res.code === 1) {
            this.dbrjgx_list_hd = res.list;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        }
      );
    },
    exchange_dbh_change_handle(dbh) {
      try {
        ApiFn.requestapi("get", "/lbj/dbrjly/dbrjzx_list", { dbh: dbh }).then(
          (res) => {
            if (res.code === 1) {
              this.dbrjzx_oldlist = res.list;
              this.$refs.old_dbrjzx_table.toggleAllSelection();
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    dialog_open_handle() {
      this.lyform.scx = "";
      this.lyform.dbh = "";
      this.lyform.dbrjzx = [];
      this.dbrjgx_list = [];
      this.dygx_choose_items = [];
      this.get_freedb_list();
      this.get_free_cnc_list();
    },
    choose_olddbrjzx_handle(val) {
      this.hdform.olddbrjzx = val;
    },
    choose_dygx_handle(val) {
      this.dygx_choose_items = val;
    },
    choose_hddygx_handle(val) {
      this.hddygx_choose_items = val;
    },
    save_dbrjly_handle() {
      try {
        this.$refs.first_use_form.validate((v) => {
          if (v) {
            if (this.dygx_choose_items.length === 0) {
              this.$message.error("请选择领用的刃具");
              return false;
            } else {
              this.lyform.dbrjzx = [];
              this.dygx_choose_items.forEach((i) => {
                this.lyform.dbrjzx.push({
                  gcdm: this.lyform.gcdm,
                  scx: this.lyform.scx,
                  sbbh: this.lyform.sbbh,
                  dbh: this.lyform.dbh,
                  rjid: i.rjid,
                  rjlx: i.rjlx,
                  rjbzsm: i.rjbzsm,
                  rjazsm: i.rjbzsm,
                  rjdqsm: i.rjbzsm,
                  dblysj: parseTime(new Date()),
                  rjlysj: parseTime(new Date()),
                  dblyr: this.lyform.lyr,
                  rjlyr: this.lyform.lyr,
                });
              });
              ApiFn.requestapi("post", "lbj/dbrjly/scly", this.lyform).then(
                (res) => {
                  if (res.code === 1) {
                    this.dialogVisible = false;
                    this.lyform.sbbh = "";
                    this.lyform.lry = "";
                    this.lyform.gcdm = "9200";
                    this.lyform.scx = "";
                    this.lyform.dbh = "";
                    this.lyform.dbrjzx = [];
                    this.dbrjgx_list = [];
                    this.dygx_choose_items = [];
                    this.getlist(this.queryform);
                  } else if (res.code === 0) {
                    this.$message.error(res.msg);
                  }
                }
              );
            }
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    save_exchange_dbrjly_handle() {
      try {
        this.$refs.exchange_use_form.validate((v) => {
          if (v) {
            if (this.hdform.newscx === "") {
              this.$message.error("请选择新生产线");
              return false;
            } else if (this.hdform.newsbbh === "") {
              this.$message.error("请选择新设备编号");
              return false;
            } else if (this.hdform.newdbh === "") {
              this.$message.error("请选择新刀柄号");
              return false;
            } else if (this.hdform.olddbrjzx.length === 0) {
              this.$message.error("请选择已经领的刃具");
              return false;
            } else {
              this.hdform.dbrjzx = [];
              this.hddygx_choose_items.forEach((i) => {
                this.hdform.dbrjzx.push({
                  gcdm: this.hdform.gcdm,
                  scx: this.hdform.newscx,
                  sbbh: this.hdform.newsbbh,
                  dbh: this.hdform.newdbh,
                  rjid: i.rjid,
                  rjlx: i.rjlx,
                  rjbzsm: i.rjbzsm,
                  rjazsm: i.rjbzsm,
                  rjdqsm: i.rjbzsm,
                  dblysj: parseTime(new Date()),
                  rjlysj: parseTime(new Date()),
                  dblyr: this.hdform.lyr,
                  rjlyr: this.hdform.lyr,
                });
              });
              ApiFn.requestapi("post", "lbj/dbrjly/add", this.hdform).then(
                (res) => {
                  if (res.code === 1) {
                    this.dialogVisible = false;
                    this.hdform.sbbh = "";
                    this.hdform.newsbbh = "";
                    this.hdform.lry = "";
                    this.hdform.gcdm = "9200";
                    this.hdform.scx = "";
                    this.hdform.newscx = "";
                    this.hdform.dbh = "";
                    this.hdform.newdbh = "";
                    this.hdform.dbrjzx = [];
                    this.dbrjgx_list_hd = [];
                    this.hddygx_choose_items = [];
                    this.getlist(this.queryform);
                  } else if (res.code === 0) {
                    this.$message.error(res.msg);
                  }
                }
              );
            }
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss">
.tab_btn {
  text-align: right;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>