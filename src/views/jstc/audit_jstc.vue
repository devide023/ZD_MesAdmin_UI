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
        <template>
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in pageconfig.operate_fnlist"
                :key="index"
              >
                <template v-if="item.condition">
                  <template v-if="isshow_operatebtn(scope.row, item.condition)">
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
                  </template>
                </template>
                <template v-else>
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
                </template>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </template>
    </table-component>

    <!-- 分配窗口 -->
    <el-dialog
      :title="dialog_title"
      :visible.sync="dialogvisible"
      :close-on-click-modal="false"
      top="10px"
      width="40%"
    >
      <el-form
        :model="jtfpform"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="工厂">
          <el-select
            clearable
            filterable
            v-model="jtfpform.gcdm"
            @change="Gc_Change_Handle"
            style="width: 100%"
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
        <el-form-item label="接收人员">
          <el-select
            v-model="jtfpform.rylist"
            filterable
            multiple
            clearable
            placeholder="选择接收人员"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in user_list"
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
        <el-form-item label="备注">
          <el-input type="textarea" v-model="jtfpform.bz"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogvisible = false">取消</el-button>
        <el-button type="primary" @click="save_jtfp">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配明细 -->
    <el-dialog title="分配明细" :visible.sync="detail_dialog" width="40%">
        
      <div slot="footer">
        <el-button type="danger" @click="detail_dialog = false"
          >取 消</el-button
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
import { GetComponentName } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
export default {
  name: GetComponentName(),
  components: {
    TableComponent,
    SearchBar,
    BatOperate,
  },
  mixins: [basemixin, batoperatemixin, export_xls_mixin, lbj_baseinfo_mixin],
  data() {
    return {
      dialog_title: "",
      dialogvisible: false,
      detail_dialog: false,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      scxlist: [],
      user_list: [],
      jtfpform: {
        jstc: {},
        gcdm: "",
        scx: "",
        rylist: [],
        bz: "",
      },
      rules: {
        scx: [
          {
            required: true,
            message: "请选择生成线",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
    this.get_gcxx_list();
    this.get_user_list();
  },
  methods: {
    execfun(row, fnname) {
      this[fnname](row);
    },
    get_user_list() {
      try {
        ApiFn.requestapi("get", "/lbj/baseinfo/userlist", {}).then((res) => {
          if (res.code === 1) {
            this.user_list = res.list;
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    Gc_Change_Handle(val) {
      try {
        ApiFn.requestapi("get", "/lbj/baseinfo/scx?gcdm=" + val, {}).then(
          (res) => {
            if (res.code === 1) {
              this.scxlist = res.list;
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
    save_jtfp() {
      try {
        ApiFn.requestapi("post", "/lbj/jtfp/fp", this.jtfpform).then((res) => {
          if (res.code === 1) {
            this.jtfpform.jstc = {};
            this.rylist = [];
            this.jtfpform.gcdm = "";
            this.jtfpform.scx = "";
            this.jtfpform.bz = "";
            this.dialogvisible = false;
            this.getlist(this.queryform);
          } else if (res.code === 0) {
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
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: block;
  margin: auto;
}
</style>