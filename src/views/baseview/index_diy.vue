<template>
  <div>
    <div class="search_bar">
      <component
        :is="comname"
        ref="query_bar_component"
        @query="query_handle"
        @export_to_excel="export_excel_handle"
      />
    </div>
    <component
      v-for="(com, idx) in componentlist"
      :ref="'component'+idx"
      :fields="colshowlist"
      :childfields="childfields"
      :datalist="list"
      :operatelist="operatelist"
      :key="idx"
      :vm="instance"
      :is="com"
    />
    <el-pagination
      :total="resultcount"
      :current-page="queryform.pageindex"
      :page-size="queryform.pagesize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next"
      background
      style="text-align: right"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
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
      tableheight: 800,
      comname: "",
      combodyname: "",
      list: [],
      componentlist: [],
      colshowlist: [],
      childfields: [],
      operatelist: [],
      instance: {},
      pageconfig: {},
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
    this.instance = this;
    ApiFn.pageconfig().then((res) => {
      if (res.code === 1) {
        this.pageconfig = Function("return " + res.pageconfig)();
        this.comname = this.pageconfig.querybarname;
        this.componentlist = this.pageconfig.componentlist;
        this.colshowlist = this.pageconfig.fields;
        this.childfields = this.pageconfig.childfields;
        this.operatelist = this.pageconfig.operate_fnlist;
        if (this.pageconfig.pagefuns) {
          Object.keys(this.pageconfig.pagefuns).forEach((key) => {
            this[key] = this.pageconfig.pagefuns[key];
          });
        }
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
    handleCurrentChange(index) {
      this.queryform.pageindex = index;
      this.getlist(this.queryform);
    },
    handleSizeChange(value) {
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