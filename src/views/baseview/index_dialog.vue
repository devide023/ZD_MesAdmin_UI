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
        <template v-if="pageconfig.operate_type === 'text'">
          <span v-for="(item, index) in pageconfig.operate_fnlist" :key="index">
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
          </span>
        </template>
        <template v-else>
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
                        @click.native="execpagefun(scope.row, item)"
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
                      @click.native="execpagefun(scope.row, item)"
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
    <el-dialog
      :title="dialog_title"
      :visible.sync="dialogVisible"
      :width="dialog_width"
      top="10px"
      :close-on-click-modal="false"
      @opened="dialog_opend_handle"
      @closed="dialog_closed_handle"
    >
      <div id="dialog_body"></div>
      <div slot="footer" v-if="!dialog_hidefooter">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialog_comfire_handle"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { GetComponentName } from "@/utils/index";
import { getToken } from "@/utils/auth";
export default {
  name: GetComponentName(),
  components: {
    TableComponent,
    SearchBar,
    BatOperate,
  },
  mixins: [basemixin, batoperatemixin, export_xls_mixin],
  data() {
    return {
      dialogVisible: false,
      dialog_title: "表单",
      dialog_fnitem: {},
      dialog_width: "",
      dialog_viewpath: "",
      dialog_props: {},
      dialog_vm: null,
      dialog_hidefooter: false,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  mounted() {},
  methods: {
    dialog_opend_handle() {
      this.create(this, this.dialog_viewpath, this.dialog_props);
    },
    dialog_closed_handle() {
      let chil = document.getElementById("dialog_body").childNodes;
      chil.forEach((i) => {
        document.getElementById("dialog_body").removeChild(i);
      });
    },
    create(vm, viewpath, props) {
      let Component = (resolve) =>
        require.ensure([], () =>
          resolve(require("@/views/" + viewpath + ".vue"))
        );
      vm.dialog_vm = new Vue({
        mounted() {},
        destroyed() {},
        render(h) {
          let node = h(Component, { props });
          return node;
        },
      }).$mount();
      document.getElementById("dialog_body").appendChild(this.dialog_vm.$el);
    },
    dialog_comfire_handle() {
      if (
        this.dialog_fnitem.callback &&
        typeof this.dialog_fnitem.callback === "string"
      ) {
        this[this.dialog_fnitem.callback](this.dialog_vm);
      } else if (
        this.dialog_fnitem.callback &&
        typeof this.dialog_fnitem.callback === "function"
      ) {
        this.dialog_fnitem.callback(this.dialog_vm);
      }
    },
    execfun(row, fnname) {
      this[fnname](row);
    },
    isshow_operatebtn(row, conditions) {
      let ret = [];
      conditions.forEach((i) => {
        if (i.oper === "=") {
          let isok = row[i.field] === i.val ? true : false;
          ret.push(isok);
        } else if (i.oper === "in") {
          if (Object.prototype.toString.call(i.val) === "[object Array]") {
            let isconst = i.field.indexOf("const") !== -1 ? true : false;
            if (isconst) {
              if (i.field === "const_userid") {
                let cuid = this.$store.getters.userinfo.id;
                let elepos = i.val.findIndex((e) => e === cuid);
                if (elepos !== -1) {
                  ret.push(true);
                } else {
                  ret.push(false);
                }
              }else{
                ret.push(false);
              }
            } else {
              let elepos = i.val.findIndex((e) => e === row[i.field]);

              if (elepos !== -1) {
                ret.push(true);
              } else {
                ret.push(false);
              }
            }
          } else {
            ret.push(false);
          }
        } else if (i.oper === "!=") {
          let isok = row[i.field] !== i.val ? true : false;
          ret.push(isok);
        } else if (i.oper === ">") {
          let isok = row[i.field] > i.val ? true : false;
          ret.push(isok);
        } else if (i.oper === ">=") {
          let isok = row[i.field] >= i.val ? true : false;
          ret.push(isok);
        } else if (i.oper === "<") {
          let isok = row[i.field] < i.val ? true : false;
          ret.push(isok);
        } else if (i.oper === "<=") {
          let isok = row[i.field] <= i.val ? true : false;
          ret.push(isok);
        }
      });
      return ret.filter((i) => i).length === ret.length ? true : false;
    },
    execpagefun(row, fnitem) {
      this[fnitem.fnname](row, fnitem);
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