<template>
  <div>
    <div class="search_bar">
      <el-select
        v-model="form.scx"
        placeholder="请选择生产线"
        clearable
        filterable
        style="width: 200px; margin-right: 5px"
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
      <el-date-picker
        v-model="form.ksjsrq"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px; margin-right: 5px"
      >
      </el-date-picker>
      <el-autocomplete
        v-model="form.jcry"
        placeholder="输入员工姓名检索"
        style="width: 150px; margin-right: 5px"
      ></el-autocomplete>
      <el-button type="primary" icon="el-icon-search" @click="query_ryjx_handle"
        >查询</el-button
      >
      <table-component
        :isselect="pageconfig.isselect"
        :isoperate="pageconfig.isoperate"
        ref="tablecomponent"
        :resultcount="resultcount"
        :datalist="list"
        :collist="colshowlist"
        :multipleSelection.sync="selectlist"
        :pagesize.sync="queryform.pagesize"
        :pageindex.sync="queryform.pageindex"
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
    </div>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import RyJXFn from "@/api/ryjx";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
export default {
  name: "RyjxComponent",
  components: {
    TableComponent,
  },
  mixins: [basemixin],
  data() {
    return {
      list: [],
      scxlist: [],
      form: {
        scx: "",
        jcry: "",
        ksjsrq: [],
        starttime: "",
        endtime: "",
      },
    };
  },
  mounted() {
    this.get_scxlist();
  },
  methods: {
    get_scxlist() {
      ApiFn.requestapi("get", "/lbj/baseinfo/scx?gcdm=9902").then((res) => {
        if (res.code === 1) {
          this.scxlist = res.list;
        }
      });
    },
    query_ryjx_handle() {
      try {
        if (this.form.ksjsrq.length === 2) {
          this.form.starttime = this.form.ksjsrq[0];
          this.form.endtime = this.form.ksjsrq[1];
        }
        RyJXFn.ryjx(this.form).then((res) => {
          if (res.rtn === 1) {
            this.list = res.data.map(i=>{
              i.HGL = (parseFloat(i.HGS/i.JGS)*100).toFixed(2);
              return i;
            });
          } else if (res.rtn === 0) {
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

<style lang="scss" scoped>
</style>