<template>
  <div>
    <!-- 数据补录 -->
    <div class="search_bar">
      <el-input
        v-model="vin"
        ref="cpjh"
        clearable
        placeholder="请输入件号关键字查询"
        style="width: 200px; margin-right: 10px"
      ></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search_handle"
        >查询</el-button
      >
      <el-button type="warning" icon="el-icon-edit" @click="save_blsj_handle"
        >补录数据</el-button
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
        <template v-if="pageconfig.operate_type === 'text'">
          <span v-for="(item, index) in pageconfig.operate_fnlist" :key="index">
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
      </template>
    </table-component>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { GetComponentName, GetEnvInfo } from "@/utils/index";
import { getToken } from "@/utils/auth";
import { deepClone, parseTime } from "@/utils/index";
import condition from "@/mixin/search_form";
export default {
  name: GetComponentName(),
  components: {
    TableComponent,
  },
  mixins: [basemixin, lbj_baseinfo_mixin, batoperatemixin, export_xls_mixin],
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      vin: "",
      envinfo: GetEnvInfo(),
    };
  },
  methods: {
    getlist() {
      this.queryform.search_condition = [];
      this.queryform.px_condition = [];
      let exp = deepClone(condition.form);
      exp.colname = "engine_no";
      exp.coltype = "string";
      exp.oper = "=";
      exp.value = this.vin;
      exp.values = [];
      this.queryform.search_condition.push(exp);

      ApiFn.requestapi("post", "/lbj/cpgl/gdxxlist", this.queryform).then(
        (res) => {
          if (res.code === 1) {
            this.list = res.list;
            this.resultcount = res.resultcount;
          } else {
            this.$message.error(res.msg);
          }
        }
      );
    },
    search_handle() {
      this.getlist();
    },
    save_blsj_handle() {
      if (this.selectlist.length > 0) {
        this.selectlist.forEach((i) => {
          ApiFn.request_thirdapi(
            "post",
            this.envinfo.VUE_APP_THIRD_URL +
              "/api/Product/SaveQualifiedProduct",
            {
              GCDM: i.gcdm,
              SCX: i.scx,
              GWH: i.gwh,
              ORDER_NO: i.order_no,
              ENGINE_NO: i.engine_no,
              ZTBM: i.status_no,
              JCSJ: parseTime(new Date()),
              JCRY: this.$store.getters.name,
              JCZ: "合格",
              JGZ: "",
              SBBH: "",
              IS_SAVE_GDXX: i.isgdxx,
              GWXH: i.gwxh,
              CLFL: "人工",
            }
          ).then((res) => {
            if (res.rtn === 1) {
              this.$message.success(res.msg);
              this.getlist();
            } else {
              this.$message.error(res.msg);
            }
          });
        });
      } else {
        this.$message.warning("请选择补录数据机号");
      }
    },
    execfun(row, fnname) {
      this[fnname](row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>