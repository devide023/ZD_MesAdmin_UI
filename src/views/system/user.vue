<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="pageconfig.isgradequery"
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
      :collist="colshowlist"
      :datalist="list"
      :isoperate="pageconfig.isoperate"
      :isselect="true"
      :multipleSelection.sync="selectlist"
      :trbginfo="trbginfo"
      :pagesize.sync="queryform.pagesize"
      :pageindex.sync="queryform.pageindex"
      :pageindexHandle = "pageindex_change_handle"
      :pagesizeHandle = "pagesize_change_handle"
      :resultcount="resultcount"
    >
      <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-setting" style="font-size: 16px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="reset_userpwd(scope.row)"
              ><span class="el-icon-key">重置密码</span></el-dropdown-item
            >
            <el-dropdown-item @click.native="reset_token(scope.row)"
              ><span class="el-icon-refresh">重置Token</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
  </div>
</template>

<script>
import Vue from "vue";
import ApiFn from "@/api/baseapi";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { deepClone, parseTime } from "@/utils/index";
export default {
  name: "UserComponent",
  components: {
    SearchBar,
    TableComponent,
  },
  mixins: [basemixin],
  data() {
    return {
      dialogVisible: false,
      form: {
        id: 0,
        roleids: [],
      },
    };
  },
  mounted() {
    Vue.prototype.$basepage = this;
  },
  methods: {
    add_handle: function () {
      var row = deepClone(this.pageconfig.form);
      row.status = 1;
      row.adduser = this.$store.getters.userinfo.id;
      row.addusername = this.$store.getters.name;
      row.addtime = parseTime(new Date());
      row.role= [];
      this.list.unshift(row);
    },
    dialog_show_handle(row) {
      this.form.id = row.id;
      this.dialogVisible = true;
    },
    reset_token(row) {
      try {
        ApiFn.requestapi("post", "/user/resettoken", row).then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg);
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    reset_userpwd(row) {
      this.$prompt("新密码", "重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        ApiFn.requestapi("post", "/user/resetpwd", {
          id: row.id,
          pass: value,
        }).then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg);
          } else if (res.ccode === 0) {
            this.$message.error(res.msg);
          }
        });
      });
    },
    save_userrole_handle() {},
  },
};
</script>

<style lang="scss" scoped>
</style>