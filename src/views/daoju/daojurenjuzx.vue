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
          >
            <template #other>
              <el-dropdown-item
                v-for="(btn, index) in pageconfig.bat_btnlist"
                :key="index"
              >
                <el-button type="text" @click="invokfn(btn.fnname)">{{
                  btn.btntxt
                }}</el-button>
              </el-dropdown-item>
            </template>
          </bat-operate>
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
    <!-- 刀柄刃具领用 -->
    <el-dialog
      title="刀柄刃具领用"
      v-drag-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @opened="dbrjly_dialog_open_handle"
      width="40%"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="生产线" prop="scx">
          <el-select
            v-model="form.scx"
            filterable
            clearable
            :multiple="false"
            @change="scx_change_handel"
            style="width: 100%"
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
        <el-form-item label="设备" prop="sbbh">
          <el-select
            v-model="form.sbbh"
            placeholder="选择设备"
            @change="sbbh_change_handle"
            style="width: 100%"
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
        </el-form-item>
        <!-- <el-form-item label="刀柄领用" prop="dbh">
          <el-select
            v-model="form.dbh"
            multiple
            filterable
            collapse-tags
            clearable
            placeholder="关键字过滤"
            style="width: 100%"
            @change="db_change_handle"
          >
            <el-option
              v-for="(item, index) in dbxx_list"
              :key="index"
              :label="item.dblx"
              :value="item.dbh"
            >
              <span style="float: left">{{ item.dblx }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.dbh
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刃具领用">
          <el-cascader
            :options="rjlxoptions"
            :props="rjlxprops"
            :show-all-levels="false"
            v-model="form.rjlx"
            clearable
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item> -->
        <el-form-item label="刀柄刃具领用">
          <el-tree
            ref="dbrj_ly_tree"
            show-checkbox
            :data="dbrj_tree_data"
            :props="tree_props"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="领用人" prop="lyr">
          <el-input v-model.trim="form.lyr" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button type="danger" @click="save_dbrjly_handle">确定</el-button>
      </div>
    </el-dialog>
    <!-- 刃具更换安装 -->
    <el-dialog
      title="刀柄刃具更换"
      :visible.sync="installVisible"
      top="10px"
      :close-on-click-modal="false"
      width="60%"
    >
      <el-form
        ref="iform"
        :model="iform"
        label-width="80px"
        label-position="right"
        :inline="true"
        :rules="rules"
      >
        <el-form-item label="生产线" prop="scx">
          <el-select
            v-model="iform.scx"
            placeholder="选择生产线"
            clearable
            filterable
            @change="form_scx_change_handle"
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
            v-model="iform.sbbh"
            clearable
            filterable
            placeholder="选择设备编号"
            @change="change_handle_sbbh"
          >
            <el-option
              v-for="(item, index) in sbinfo_list"
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
        <el-form-item label="刀柄编号">
          <el-autocomplete
            popper-class="my-autocomplete"
            v-model="iform.dbh"
            prefix-icon="el-icon-search"
            placeholder="请输入在线刀柄编号或扫描刀柄二维码"
            :fetch-suggestions="fetchSuggestions"
            @select="handleSelect"
            style="width: 150px"
          >
            <template slot-scope="{ item }">
              <div class="name">刀柄编号:{{ item.value }}</div>
              <span class="addr"
                >生产线：{{ item.scx }},设备编号:{{ item.label }}</span
              >
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search_dbrjzx_handle"
          >查询</el-button
        >
      </el-form>
      <el-table
        :data="choose_rjlx_list"
        border
        header-cell-class-name="tb_header_bg"
        @selection-change="rjlxSelectionChange"
      >
        <el-table-column header-align="center" align="center" type="selection">
        </el-table-column>
        <el-table-column
          prop="scx"
          header-align="center"
          align="center"
          label="生产线"
          width="80"
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="scxmc"
          label="生产线名称"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="sbbh"
          header-align="center"
          align="center"
          label="设备编号"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="basesbxx.sbmc"
          label="设备名称"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          prop="dbh"
          label="刀柄号"
          width="100"
          sortable
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          prop="basedbxx.dblx"
          label="刀柄类型"
          width="120"
          sortable
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          prop="rjlx"
          label="刃具类型"
          width="120"
          sortable
        >
          <!-- <template slot-scope="scope">
              <el-select
                v-model="scope.row.rjids"
                clearable
                filterable
                multiple
                collapse-tags
                style="width: 100%"
                @change="(val) => ddl_rjlx_change_handle(val, scope.row)"
                placeholder="选择刃具类型"
              >
                <el-option
                  v-for="(item, index) in scope.row.dbrjdygx"
                  :key="index"
                  :label="item.djlx"
                  :value="item.rjid"
                >
                  <span style="float: left">{{ item.djlx }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    item.dblx
                  }}</span>
                </el-option>
              </el-select>
            </template> -->
        </el-table-column>
        <el-table-column
          prop="rjwz"
          header-align="center"
          align="left"
          sortable
          width="150"
          label="加工位置"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="right"
          prop="rjbzsm"
          label="标准寿命"
          width="110"
          sortable
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          align="right"
          prop="rjdqsm"
          label="当前寿命"
          width="110"
          sortable
        >
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="installVisible = false"
          >取消</el-button
        >
        <!-- <el-button type="success" @click="install_rjzx_handle">装载</el-button> -->
        <el-button type="warning" @click="xiezai_rjzx_handle">卸载</el-button>
        <el-button type="danger" @click="change_rjzx_dialog"
          >刀柄刃具领用</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="刀柄刃具领用"
      :visible.sync="dbrjghVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="30%"
    >
      <el-form
        ref="form_dbrjgh"
        :model="dbrjgh_form"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="领用人" prop="lyr">
          <el-input v-model="dbrjgh_form.lyr"></el-input>
        </el-form-item>
        <el-form-item label="刀柄刃具关系">
          <el-tree
            ref="dbrj_tree"
            :data="dbrj_tree_data"
            :props="tree_props"
            show-checkbox
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dbrjghVisible = false">取消</el-button>
        <el-button type="primary" @click="dbrjgh_save_handle">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="刃磨明细"
      :visible.sync="dialog_rmmx_Visible"
      @opened="rmmx_open_handle"
    >
      <div>
        <el-table
          border
          stripe
          header-cell-class-name="tb_header_bg"
          :data="rmmxlist"
          style="width: 100%"
        >
          <el-table-column
            prop="scx"
            align="center"
            header-align="center"
            label="生产线"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dbh"
            align="center"
            header-align="center"
            label="刀柄号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dblx"
            align="center"
            header-align="center"
            label="刀柄类型"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="sbbh"
            align="center"
            header-align="center"
            label="资产编号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="rjlx"
            align="center"
            header-align="center"
            label="刃具类型"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dqsm"
            align="center"
            header-align="center"
            label="刃磨时寿命"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="rmr"
            align="center"
            header-align="center"
            label="刃磨人"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="rmsj"
            align="center"
            header-align="center"
            label="刃磨时间"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.rmsj | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="dialog_rmmx_Visible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
export default {
  name: "DaoJuLyComponent",
  components: {
    SearchBar,
    BatOperate,
    TableComponent,
  },
  mixins: [basemixin, lbj_baseinfo_mixin, batoperatemixin, export_xls_mixin],
  data() {
    return {
      title: "",
      cur_scx: "",
      cur_sbbh: "",
      dialogVisible: false,
      installVisible: false,
      dbrjghVisible: false, //刀具刃具更换
      dialog_rmmx_Visible: false,
      dbrj_tree_data: [],
      tree_props: {
        label: "label",
        children: "children",
      },
      choose_rjlx_list: [],
      rjlxselection: [],
      rjlxoptions: [],
      dbrjgxlist: [],
      sbinfo_list: [],
      rmmxlist: [],
      rmmx_rjid: 0,
      rjlxprops: { multiple: true, expandTrigger: "hover" },
      form: {
        gcdm: "9902",
        scx: "",
        sbbh: "",
        dbrjids: [],
        lyr: "",
      },
      iform: {
        scx: "",
        sbbh: "",
        dbh: "",
        lyr: "",
      },
      dbrjgh_form: {
        scx: "",
        sbbh: "",
        lyr: "",
      },
      rules: {
        scx: [
          {
            required: true,
            message: "生产线不能为空",
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
        sbbh: [
          {
            required: true,
            message: "设备编号不能为空",
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
    //this.get_dbxx_list();
  },
  methods: {
    execfun(row, fnname) {
      this[fnname](row);
    },
    form_scx_change_handle(scx) {
      this.iform.sbbh = "";
      ApiFn.requestapi("get", "/lbj/baseinfo/cnc_list_by_scx", {
        scx: scx,
      }).then((res) => {
        if (res.code === 1) {
          this.sbinfo_list = res.list.map((i) => {
            return { label: i.sbmc, value: i.sbbh };
          });
        }
      });
    },
    search_dbrjzx_handle() {
      this.$refs.iform.validate((v) => {
        if (v) {
          ApiFn.requestapi(
            "post",
            "/lbj/dbrjly/search_dbrjzx",
            this.iform
          ).then((res) => {
            if (res.code === 1) {
              this.choose_rjlx_list = res.list;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    scx_change_handel(scx) {
      this.form.sbbh = "";
      ApiFn.requestapi("get", "/lbj/baseinfo/cnc_list_by_scx", {
        scx: scx,
      }).then((res) => {
        if (res.code === 1) {
          this.sbxx_list = res.list.map((i) => {
            return { label: i.sbmc, value: i.sbbh };
          });
        }
      });
    },
    sbbh_change_handle(sbbh) {
      try {
        this.get_unusedbxx_list();
      } catch (error) {
        this.$message.error(error);
      }
    },
    change_handle_sbbh() {
      this.search_dbrjzx_handle();
    },
    db_change_handle() {
      ApiFn.requestapi("post", "/lbj/dbrjly/dbrjgx", this.form.dbh).then(
        (res) => {
          if (res.code === 1) {
            this.rjlxoptions = res.list;
          }
        }
      );
    },
    get_dbxx_list() {
      ApiFn.requestapi("get", "/lbj/baseinfo/dbxx").then((res) => {
        if (res.code === 1) {
          this.dbxx_list = res.list;
        } else if (res.code === 0) {
          this.$message.error(res.msg);
        }
      });
    },
    //2022-06-03修改
    save_dbrjly_handle() {
      try {
        this.$refs.form.validate((v) => {
          if (v) {
            let nodes = this.$refs.dbrj_ly_tree.getCheckedNodes(true, false);
            if (nodes.length === 0) {
              this.$message.warning("请选择刀柄刃具");
              return;
            }
            this.form.dbrjids = nodes.map((i) => i.id);
            ApiFn.requestapi("post", "/lbj/dbrjly/scly", this.form).then(
              (res) => {
                if (res.code === 1) {
                  this.$message.success(res.msg);
                  this.dialogVisible = false;
                  this.form.scx = "";
                  this.form.sbbh = "";
                  this.form.dbrjids = [];
                  this.getlist(this.queryform);
                } else if (res.code === 0) {
                  this.$message.error(res.msg);
                }
              }
            );
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    fetchSuggestions(key, cb) {
      if (key) {
        ApiFn.requestapi("get", "/lbj/dbrjly/zxbydbh", {
          dbh: key,
          scx: this.iform.scx,
          sbbh: this.iform.sbbh,
        }).then((res) => {
          if (res.code === 1) {
            let retlist = res.list.map((i) => {
              return { label: i.sbbh, value: i.dbh, scx: i.scx };
            });
            cb(retlist);
          }
        });
      }
    },
    handleSelect(val) {
      try {
        //console.log(val);
        let scx = val.scx;
        let sbbh = val.label;
        this.form_scx_change_handle(scx);
        this.iform.scx = scx;
        this.iform.sbbh = sbbh;
        // ApiFn.requestapi("get", "/lbj/dbrjly/rjgh", { dbh: val.value }).then(
        //   (res) => {
        //     if (res.code === 1) {
        //       this.cur_scx = res.scx;
        //       this.cur_sbbh = res.sbbh;
        //       this.choose_rjlx_list = res.list;
        //     }
        //   }
        // );
      } catch (error) {
        this.$message.error(error);
      }
    },
    rjlxSelectionChange(val) {
      this.rjlxselection = val;
    },
    ddl_rjlx_change_handle(val, row) {
      //console.log(val);
      //console.log(row);
    },
    change_rjzx_handle() {
      try {
        var changelist = this.rjlxselection.filter((i) => i.rjid > 0);
        if (changelist.length > 0) {
          ApiFn.requestapi("post", "/lbj/dbrjly/zxrjbg", changelist).then(
            (res) => {
              if (res.code === 1) {
                this.$message.success(res.msg);
              } else if (res.code === 0) {
                this.$message.error(res.msg);
              }
            }
          );
        } else {
          this.$message.warning("请选择要更换的刃具类型");
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    install_rjzx_handle() {
      try {
        var installlist = this.rjlxselection.filter((i) => i.rjid === 0);
        if (installlist.length > 0) {
          ApiFn.requestapi("post", "/lbj/dbrjly/zxrjaz", installlist).then(
            (res) => {
              if (res.code === 1) {
                this.$message.success(res.msg);
              } else if (res.code === 0) {
                this.$message.error(res.msg);
              }
            }
          );
        } else {
          this.$message.warning("请选择要安装的刃具刀柄");
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    //卸载在线刀柄刃具2022-06-03
    xiezai_rjzx_handle() {
      try {
        this.$confirm("你确定要卸载刀柄刃具?", "警告", {
          type: "warning",
          cancelButtonClass: "el-button--primary",
          confirmButtonClass: "el-button--danger",
        }).then(() => {
          if (this.rjlxselection.length > 0) {
            let ids = this.rjlxselection.map((i) => i.id);
            ApiFn.requestapi("post", "/lbj/dbrjly/uninstall", ids).then(
              (res) => {
                if (res.code === 1) {
                  this.$message.success(res.msg);
                  this.rjlxselection.forEach((i) => {
                    let p = this.choose_rjlx_list.findIndex(
                      (j) => j.id === i.id
                    );
                    this.choose_rjlx_list.splice(p, 1);
                  });
                } else if (res.code === 0) {
                  this.$message.error(res.msg);
                }
              }
            );
          } else {
            this.$message.warning("请选择要卸载的刃具");
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    //领刀窗口2022-06-03
    dbrjly_dialog_open_handle() {
      ApiFn.requestapi("get", "/lbj/baseinfo/unuse_dbrj_tree").then((res) => {
        if (res.code === 1) {
          this.dbrj_tree_data = res.list.map((i) => {
            return {
              label: `${i.dblx} [${i.dbh}]`,
              dbh: i.dbh,
              dblx: i.dblx,
              children: i.children.map((j) => {
                return { id: j.id, rjid: j.rjid, label: j.djlx };
              }),
            };
          });
          this.dialogVisible = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //换刀窗口2022-06-03
    change_rjzx_dialog() {
      this.$refs.iform.validate((v) => {
        if (v) {
          try {
            if (this.iform.scx && this.iform.sbbh) {
              ApiFn.requestapi("get", "/lbj/baseinfo/unuse_dbrj_tree").then(
                (res) => {
                  if (res.code === 1) {
                    this.dbrj_tree_data = res.list.map((i) => {
                      return {
                        label: `${i.dblx} [${i.dbh}]`,
                        dbh: i.dbh,
                        dblx: i.dblx,
                        children: i.children.map((j) => {
                          return { id: j.id, rjid: j.rjid, label: j.djlx };
                        }),
                      };
                    });
                    this.dbrjghVisible = true;
                  } else {
                    this.$message.error(res.msg);
                  }
                }
              );
            } else {
              this.$message.warning("请选择生产线,设备编号");
            }
          } catch (error) {
            this.$message.error(error);
          }
        }
      });
    },
    //刀柄刃具更换保存
    dbrjgh_save_handle() {
      this.$refs.form_dbrjgh.validate((v) => {
        if (v) {
          let nodes = this.$refs.dbrj_tree.getCheckedNodes(true, false);
          if (nodes.length > 0) {
            let data = {
              gcdm: "9902",
              scx: this.iform.scx,
              sbbh: this.iform.sbbh,
              dbrjgxid: nodes.map((i) => i.id),
              lyr: this.dbrjgh_form.lyr,
            };
            ApiFn.requestapi("post", "/lbj/dbrjly/save_dbrjzx", data).then(
              (res) => {
                if (res.code === 1) {
                  this.search_dbrjzx_handle();
                  this.dbrjghVisible = false;
                  this.dbrj_tree_data = [];
                } else if (res.code === 0) {
                  this.$message.error(res.msg);
                }
              }
            );
          } else {
            this.$message.warning("请选择刀柄刃具");
          }
        }
      });
    },
    rmmx_open_handle() {
      try {
        ApiFn.requestapi("get", "/lbj/dbrjly/viewrmmx", {
          id: this.rmmx_rjid,
        }).then((res) => {
          if (res.code === 1) {
            this.rmmxlist = res.list;
          } else {
            this.$message.error(res.msg);
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
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>