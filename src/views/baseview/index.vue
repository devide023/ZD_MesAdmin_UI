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
            :fields="colshowlist"
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
  </div>
</template>

<script>
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
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  mounted() {
  },
  methods: {
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
              } else {
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