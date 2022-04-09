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
    <div class="components-container">
      <split-pane
        split="horizontal"
        :default-percent="30"
        @resize="sizechangeHandle"
      >
        <template slot="paneL">
          <div class="top-container">
            <el-alert title="未分配技术通知" type="success" :closable="false">
            </el-alert>
            <el-table
              :data="wfpjtlist"
              border
              stripe
              header-cell-class-name="tb_header_bg"
              :height="topheight"
            >
              <el-table-column
                prop="jtid"
                label="技通编号"
                header-align="center"
                width="130"
                show-overflow-tooltip
              >
              </el-table-column>

              <el-table-column
                prop="jcmc"
                label="技通名称"
                header-align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                label="文件名称"
                prop="wjlj"
                header-align="center"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                label="有效期开始"
                prop="yxqx1"
                width="100"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.yxqx1 | parseTime("{y}-{m}-{d}") }}
                </template>
              </el-table-column>
              <el-table-column
                label="有效期结束"
                prop="yxqx2"
                width="100"
                header-align="center"
                align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.yxqx2 | parseTime("{y}-{m}-{d}") }}
                </template>
              </el-table-column>
              <el-table-column
                prop="fpflg"
                label="分配状态"
                align="center"
                width="70"
              >
                <template slot-scope="scope">
                  {{ scope.row.fpflg }}
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    circle
                    @click="pdf_download_handel(scope.row.wjlj)"
                    >下载</el-button
                  >
                  <el-button type="text" @click="Choose_GwJx(scope.row)"
                    >分配</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="paneR">
          <div class="bottom-container">
            <el-alert title="已分配技术通知" type="warning" :closable="false">
            </el-alert>
            <table-component
              :isselect="pageconfig.isselect"
              :isoperate="pageconfig.isoperate"
              ref="tablecomponent"
              :resultcount="resultcount"
              :datalist="list"
              :collist="colshowlist"
              :tbheight="bottomheight"
              :multipleSelection.sync="selectlist"
              :pagesize.sync="queryform.pagesize"
              :pageindex.sync="queryform.pageindex"
            >
              <template #operate="scope">
                <span
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
                </span>
              </template>
            </table-component>
          </div>
        </template>
      </split-pane>
    </div>
    <!-- 分配窗口 -->
    <el-dialog
      :title="dialog_title"
      :visible.sync="dialogvisible"
      width="40%"
      @opened="dialog_opend_handle"
    >
      <el-form :model="jtfpform" label-position="right" label-width="80px">
        <el-form-item label="工厂">
          <el-select
            clearable
            filterable
            v-model="jtfpform.gcdm"
            @change="Gc_Change_Handle"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in gcxxlist"
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
        <el-form-item label="生产线">
          <el-select
            clearable
            filterable
            v-model="jtfpform.scx"
            style="width: 100%"
            placeholder=""
          >
            <el-option
              v-for="(item, index) in scxlist"
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
        <el-form-item label="岗位">
          <el-select
            clearable
            filterable
            multiple
            v-model="jtfpform.fpgw"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in gwlist"
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
        <el-form-item label="产品状态">
          <el-autocomplete
            v-model="jtfpform.statusno"
            placeholder=""
            style="width: 100%"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="jtfpform.bz"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogvisible = false">取消</el-button>
        <el-button type="primary" @click="save_jtfp">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import splitPane from "vue-splitpane";
import SearchBar from "@/components/QueryBar/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import TableComponent from "@/components/TableComponent/index.vue";
export default {
  name: "JtfpComponent",
  components: {
    SearchBar,
    TableComponent,
    splitPane,
  },
  mixins: [basemixin, batoperatemixin],
  data() {
    return {
      dialog_title: "",
      dialogvisible: false,
      recordcount: 0,
      wfpjtlist: [],
      tableheight: 800,
      topheight: 100,
      bottomheight: 0,
      gcxxlist: [],
      scxlist: [],
      gwlist: [],
      jtfpform: {
        jstc: {},
        gcdm: "",
        scx: "",
        fpgw: [],
        jxlist: "",
        statusno: "",
        bz: "",
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
    this.get_wfp_list();
    this.getlist();
    this.$nextTick(() => {
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
    sizechangeHandle() {
      let bodyheight = document.body.offsetHeight;
      let navbarheight =
        document.getElementsByClassName("navbar")[0].offsetHeight;
      let tagviewheight = document.getElementById(
        "tags-view-container"
      ).offsetHeight;
      let querybarheight =
        document.getElementsByClassName("search_bar")[0].offsetHeight;
      this.tableheight =
        bodyheight - navbarheight - tagviewheight - querybarheight - 30;
        document.getElementsByClassName("components-container")[0].style.height = this.tableheight + 'px';
      if (document.getElementsByClassName("top-container").length>0) {
        this.topheight =
          document.getElementsByClassName("top-container")[0].offsetHeight - 40;
        this.bottomheight = this.tableheight - this.topheight-95;
        this.$nextTick(function(){
            this.$refs.tablecomponent.sizechangeHandle();
        });
      }
    },
    dialog_opend_handle() {
      this.gcxxlist = this.pageconfig.fields[0].options;
      this.scxlist = this.pageconfig.fields[1].options;
      this.gwlist = this.pageconfig.fields[2].options;
    },
    Gc_Change_Handle(val) {
      console.log(val);
      try {
        ApiFn.requestapi("get", "/lbj/baseinfo/scx?gcdm=" + val, {}).then(
          (res) => {
            if (res.code === 1) {
              this.scxlist = res.list;
            }
          }
        );
      } catch (error) {}
    },
    get_wfp_list() {
      try {
        ApiFn.requestapi("get", "/lbj/jtfp/wfplist", {}).then((res) => {
          if (res.code === 1) {
            this.wfpjtlist = res.list;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    Choose_GwJx(row) {
      this.jtfpform.jstc = row;
      this.dialogvisible = true;
      this.dialog_title = `${row.jtid}分配`;
    },
    save_jtfp() {
      try {
        ApiFn.requestapi("post", "/lbj/jtfp/fp", this.jtfpform).then((res) => {
          if (res.code === 1) {
            this.jtfpform.jstc = {};
            this.jtfpform.fpgw = [];
            this.jtfpform.gcdm = "";
            this.jtfpform.scx = "";
            this.jtfpform.statusno = "";
            this.jtfpform.bz = "";
            this.dialogvisible = false;
            this.get_wfp_list();
            this.getlist(this.queryform);
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    execfun(row, fnname) {
      console.log(fnname);
      this[fnname](row);
    },
  },
};
</script>

<style lang="scss">
.components-container {
  margin: 10px 0px 0px 0px;
  position: relative;
  height: 100vh;
}
.left-container {
  height: 100%;
}

.right-container {
  height: 200px;
}
.top-container {
  width: 100%;
  height: 100%;
}

.bottom-container {
  width: 100%;
  height: 100%;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .jcbh {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .jcmc {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .jcmc {
      color: #ddd;
    }
  }
}
</style>