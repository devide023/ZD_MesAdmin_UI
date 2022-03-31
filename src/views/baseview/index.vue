<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="pageconfig.isgradequery || true"
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
      </template>
    </search-bar>
    <table-component
      :isoperate="pageconfig.isoperate || false"
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
              v-for="(item, index) in operlist"
              :key="index"
              @click.native="execfun(scope.row, item.fun)"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
  </div>
</template>

<script>
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
import {GetComponentName} from '@/utils/index';
export default {
  name: GetComponentName(),
  components: {
    TableComponent,
    SearchBar,
  },
  mixins: [basemixin],
  data() {
    return {
      operlist: [],
    };
  },
  mounted() {},
  methods: {
    execfun(row, fnname) {
      console.log(fnname);
      this[fnname](row);
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