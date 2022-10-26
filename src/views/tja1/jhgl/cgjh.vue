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
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { batoperatemixin } from "@/mixin/batoperate_mixin";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { getToken } from "@/utils/auth";
import condition from "@/mixin/search_form";
import { deepClone } from "@/utils/index";
export default {
  name: "CgJhComponent",
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
  activated() {
    var orderno = this.$route.query.order_no;
    if (orderno) {
      this.queryform.search_condition = [];
      let exp = deepClone(condition.form);
      exp.colname = "order_no";
      exp.coltype = "string";
      exp.oper = "=";
      exp.value = orderno;
      this.queryform.search_condition.push(exp);
      this.queryform.pageindex = 1;
      this.getlist(this.queryform);
    }
  },
  methods: {
    execfun(row, fnname) {
      this[fnname](row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>