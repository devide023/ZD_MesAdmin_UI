<template>
  <div>
    <div class="search_bar">
      <el-input
        v-model="searchform.ENGINE_NO"
        ref="cpjh"
        clearable
        placeholder="请输入待评审件号"
        style="width: 200px; margin-right: 10px"
        @keyup.enter.native="getlist"
      ></el-input>
      <el-select
        v-model="searchform.SCX"
        style="width: 200px; margin-right: 10px"
        clearable
        placeholder="请选择生产线"
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
      <el-select
        v-model="searchform.STATUS"
        placeholder="状态"
        style="width: 150px; margin-right: 10px"
      >
        <el-option
          v-for="(item, index) in statuslist"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search_handle"
        >查询</el-button
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
      :pagesize.sync="searchform.PageSize"
      :pageindex.sync="searchform.PageIndex"
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
import { GetComponentName,GetEnvInfo } from "@/utils/index";
import { getToken } from "@/utils/auth";
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
      statuslist: [
        { label: "待审", value: 1 },
        { label: "已完成", value: 2 },
      ],
      cpps_dialogVisible:false,
      cpps_obj:{},
      envinfo:GetEnvInfo(),
      searchform: {
        PageIndex: 1,
        PageSize: 20,
        GCDM: 9902,
        SCX: "J503",
        STATUS: 1,
        ENGINE_NO: "",
      },
    };
  },
  mounted() {
    this.getlist();
    this.get_scxxx_list();
    this.$nextTick(()=>{
        this.$refs.cpjh.focus();
    });
  },
  methods: {
    getlist() {
      ApiFn.request_thirdapi(
        "post",
        this.envinfo.VUE_APP_THIRD_URL+"/api/Product/GetPageListAuditRecord",
        this.searchform
      ).then((res) => {
        if (res.rtn === 1) {
          if (res.data) {
            this.list = res.data.ResultList;
            this.resultcount = res.data.TotalRecord;
          } else {
            this.list = [];
            this.resultcount = 0;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    submit_data(data) {
      ApiFn.request_thirdapi(
        "post",
        this.envinfo.VUE_APP_THIRD_URL+"/api/Product/SaveQualifiedProduct",
        data
      ).then((res) => {
        if (res.rtn === 1) {
          this.$message.success(res.msg);
          let ucode = this.$store.getters.userinfo.code;
          this.close_cpps({ ID: data.ID, USER_CODE: ucode });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    close_cpps(data) {
      ApiFn.request_thirdapi(
        "post",
        this.envinfo.VUE_APP_THIRD_URL+"/api/Product/ClosedLoopAuditRecord",
        data
      ).then((res) => {
        if (res.rtn === 1) {
          this.$message.success("操作成功");
          this.getlist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    search_handle() {
      this.searchform.PageIndex = 1;
      this.getlist();
    },
    pageindex_change_handle(index) {
      this.searchform.PageIndex = index;
      this.getlist();
    },
    pagesize_change_handle(value) {
      this.searchform.PageSize = value;
      this.getlist();
    },
    execfun(row, fnname) {
      this[fnname](row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>