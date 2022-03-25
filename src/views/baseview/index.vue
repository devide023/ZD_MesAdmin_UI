<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
      <template #other>
        <!-- <el-button type="success" icon="el-icon-plus" @click="invokfn('add_handle')"
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
        > -->
        <el-button
          v-for="(item, index) in btnlist"
          :key="index"
          :type="item.type"
          :icon="item.icon"
          :ref="item.ref"
          @click="invokfn(item.fnname)"
          >{{ item.label }}</el-button
        >
      </template>
    </search-bar>
    <table-component
      :isoperate="true"
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
import OperateColComponent from "./operatecolumn/index.vue";
import { basemixin } from "@/mixin/basemixin";
export default {
  name: "BaseComponent",
  components: {
    TableComponent,
    SearchBar,
    OperateColComponent,
  },
  mixins: [basemixin],
  data() {
    return {
      operlist: [
        {
          label: "修改密码",
          fun: "ChangePwd",
        },
        {
          label: "编辑",
          fun: "editrow",
        },
      ],
      btnlist: [
        {
          icon: "el-icon-plus",
          type: "success",
          label: "新增",
          fnname: "add_handle",
        },
        {
          icon: "el-icon-edit",
          type: "info",
          label: "编辑",
          ref: "btnedit",
          fnname: "edit_handle",
        },
        // {
        //   icon: "el-icon-delete",
        //   type: "warning",
        //   label: "删除",
        //   fnname: "del_handle",
        // },
        {
          icon: "el-icon-check",
          type: "danger",
          label: "保存",
          fnname: "save_handle",
        },
      ],
    };
  },
  mounted() {
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