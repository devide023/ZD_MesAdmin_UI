<template>
  <div>
    <div class="search_bar">
      <component :is="comname" ref="query_bar_component" @query="query_handle" @export_to_excel="export_excel_handle"></component>
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
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { export_xls_mixin } from "@/mixin/export_xls_mixin";
import { GetComponentName } from "@/utils/index";
let all_file = {};
let fs = require.context("@/components/", true, /\.vue$/);
fs.keys().forEach((key) => {
  all_file[key] = fs(key);
});
const componentsAll = {};
for (const key in all_file) {
  const element = all_file[key].default;
  componentsAll[element.name] = element;
}
export default {
  name: GetComponentName(),
  components: componentsAll,
  mixins: [export_xls_mixin],
  data() {
    return {
      comname: "",
      list: [],
      selectlist: [],
      colshowlist: [],
      btnlist: [],
      batbtnlist: [],
      pagepermis: {},
      pageconfig: {},
      editstatus: false,
      dialogvisible: false,
      resultcount: 0,
      queryform: {
        search_condition: [],
        px_condition: [],
        pageindex: 1,
        pagesize: 20,
      },
      trbginfo: [{}],
    };
  },
  mounted() {
    ApiFn.pageconfig().then((res) => {
      if (res.code === 1) {
        this.pageconfig = Function("return " + res.pageconfig)();
        this.comname = this.pageconfig.querybarname;
        this.colshowlist = this.pageconfig.fields;
      } else {
        this.$message.error(res.msg);
      }
    });
  },
  methods: {
    getlist(data) {
      ApiFn.requestapi(
        this.pageconfig.queryapi.method,
        this.pageconfig.queryapi.url,
        data
      ).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.msg);
          this.resultcount = res.resultcount;
          this.list = res.list;
          this.pageconfig.queryapi.callback(this, res);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    invokfn(f) {
      this[f]();
    },
    execpagefun(row, fnitem) {
      this[fnitem.fnname](row, fnitem);
    },
    pageindex_change_handle(index) {
      this.queryform.pageindex = index;
      this.getlist(this.queryform);
    },
    pagesize_change_handle(value) {
      this.queryform.pagesize = value;
      this.getlist(this.queryform);
    },
    query_handle(data) {
      this.queryform.search_condition = [];
      this.queryform.search_condition = data;
      for (
        let index = 0;
        index < this.queryform.search_condition.length - 1;
        index++
      ) {
        this.queryform.search_condition[index].logic = "and";
      }
      this.queryform.pageindex = 1;
      this.getlist(this.queryform);
    },
    grade_query_handle(data) {
      this.queryform.search_condition = [];
      this.queryform.px_condition = [];
      data.list.forEach((i) => {
        let exp = deepClone(condition.form);
        exp.colname = i.colname;
        exp.coltype = i.coltype;
        exp.oper = i.oper;
        exp.logic = i.logic;
        exp.value = i.value;
        exp.values = i.values;
        this.queryform.search_condition.push(exp);
      });
      if (data.pxlist) {
        this.queryform.px_condition = data.pxlist;
      }
      this.queryform.pageindex = 1;
      this.getlist(this.queryform);
    },
    export_excel_handle(data) {
      let _this = this;
      ApiFn.requestapi(
        this.pageconfig.queryapi.method,
        this.pageconfig.queryapi.url,
        {
          pageindex: 1,
          pagesize: 65535,
          search_condition: data,
        }
      ).then(function (res) {
        if (res.code === 1) {
          let expdatalist = res.list;
          _this.export_handle(_this.pageconfig.fields, expdatalist);
        } else if (res.code === 0) {
          _this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>