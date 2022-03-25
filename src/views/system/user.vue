<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
      <template #other>
        <el-button type="success" icon="el-icon-plus" @click="add_handle"
          >新增</el-button
        >
        <el-button
          type="info"
          icon="el-icon-edit"
          ref="btnedit"
          @click="edit_handle"
          >{{ edittxt }}</el-button
        >
        <el-button type="warning" icon="el-icon-delete" @click="del_handle"
          >删除</el-button
        >
        <el-button type="danger" icon="el-icon-check" @click="save_handle"
          >保存</el-button
        >
      </template>
    </search-bar>
    <table-component
      ref="tablecomponent"
      :resultcount="resultcount"
      :datalist="list"
      :collist="colshowlist"
      :multipleSelection.sync="selectlist"
      :pagesize.sync="queryform.pagesize"
      :pageindex.sync="queryform.pageindex"
    >
      <!-- <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-setting" style="font-size: 16px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              >编辑</el-dropdown-item
            >
            <el-dropdown-item
              >提交</el-dropdown-item
            >
            <el-dropdown-item
              >取消</el-dropdown-item
            >
            <el-dropdown-item @click.native="change_pwd(scope.row)"
              >改密</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown> 
      </template>-->
    </table-component>
  </div>
</template>

<script>
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
export default {
  name: "UserComponent",
  components: {
    TableComponent,
    SearchBar,
  },
  mixins: [basemixin],
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>