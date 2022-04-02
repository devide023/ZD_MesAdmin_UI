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
        <template v-if="pageconfig.isbatoperate">
          <bat-operate
            :add_import_success_handle="import_by_add"
            :replace_import_success_handle="import_by_replace"
            :zh_import_success_handle="import_by_zh"
            :export_excel_handle="export_excel"
          ></bat-operate>
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
</template>

<script>
import Vue from "vue";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import BatOperate from "@/components/BatOperate/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { GetComponentName } from "@/utils/index";
import { getToken } from "@/utils/auth";
export default {
  name: GetComponentName(),
  components: {
    TableComponent,
    SearchBar,
    BatOperate,
  },
  mixins: [basemixin],
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
  },
  methods: {
    execfun(row, fnname) {
      console.log(fnname);
      this[fnname](row);
    },
    before_upload_PDFHandle(file) {
      const ispdf = ["application/pdf"].indexOf(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (ispdf < 0) {
        this.$message.error("上传文件只能是pdf格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传文件不能超过5MB!");
      }
      let isok = ispdf >= 0 && isLt5M;
      return isok;
    },
    import_by_add(res, file) {
      try {
        if (this.pageconfig.batoperate.import_by_add) {
          this.pageconfig.batoperate.import_by_add(this, res, file);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    import_by_replace(res, file) {
      try {
        if (this.pageconfig.batoperate.import_by_replace) {
          this.pageconfig.batoperate.import_by_replace(this, res, file);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    import_by_zh(res, file) {
      try {
        if (this.pageconfig.batoperate.import_by_zh) {
          this.pageconfig.batoperate.import_by_zh(this, res, file);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    export_excel() {
      try {
        if (this.pageconfig.batoperate.export_excel) {
          this.pageconfig.batoperate.export_excel(this);
        }
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