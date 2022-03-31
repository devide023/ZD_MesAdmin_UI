<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
      <template #other>
        <el-button type="success" icon="el-icon-plus" @click="open_role_dialog"
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
      :isoperate="true"
      :isselect="true"
      :multipleSelection.sync="selectlist"
      :pagesize.sync="queryform.pagesize"
      :pageindex.sync="queryform.pageindex"
      :resultcount="resultcount"
    >
      <template #operate="scope">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-setting" style="font-size: 16px" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="edit_role_dialog(scope.row)"
              ><span class="el-icon-edit">编辑</span></el-dropdown-item
            >
            <el-dropdown-item @click.native="relate_users(scope.row)"
              ><span class="el-icon-user">关联用户</span></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
    <!-- 新增角色窗口 -->
    <el-dialog
      v-drag-dialog
      title="新增角色"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        :model="form.mes_role_entity"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.mes_role_entity.code"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.mes_role_entity.name"></el-input>
        </el-form-item>
        <el-form-item label="功能权限">
          <el-tabs type="border-card">
            <el-tab-pane label="菜单权限">
              <el-tree
                ref="permistree"
                :data="permistree"
                :props="treeconfig"
                show-checkbox
                accordion
                node-key="id"
              />
            </el-tab-pane>
            <el-tab-pane label="可编辑字段">
              <el-tree
                ref="editcolstree"
                :data="fieldstree"
                :props="treeconfig"
                show-checkbox
                accordion
                node-key="id"
              />
            </el-tab-pane>
            <el-tab-pane label="隐藏字段">
              <el-tree
                ref="hidecolstree"
                :data="fieldstree"
                :props="treeconfig"
                show-checkbox
                accordion
                node-key="id"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit_form_data">确定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色窗口 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editdialogVisible"
      @opened="editdialog_opened_handle"
      width="40%"
    >
      <el-form
        :model="form.mes_role_entity"
        label-width="80px"
        label-position="right"
        :rules="rules"
      >
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.mes_role_entity.code"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.mes_role_entity.name"></el-input>
        </el-form-item>
        <el-form-item label="功能权限">
          <el-tabs type="border-card">
            <el-tab-pane label="菜单权限">
              <el-tree
                ref="permistree_m"
                :data="permistree"
                :props="treeconfig"
                show-checkbox
                accordion
                check-strictly
                node-key="id"
              />
            </el-tab-pane>
            <el-tab-pane label="可编辑字段">
              <el-tree
                ref="editcolstree_m"
                :data="fieldstree"
                :props="treeconfig"
                show-checkbox
                accordion
                node-key="id"
              />
            </el-tab-pane>
            <el-tab-pane label="隐藏字段">
              <el-tree
                ref="hidecolstree_m"
                :data="fieldstree"
                :props="treeconfig"
                show-checkbox
                accordion
                node-key="id"
              />
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="editdialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="submit_editform_data">确定</el-button>
      </div>
    </el-dialog>
    <!-- 关联用户窗口 -->
    <el-dialog
      v-drag-dialog
      title="关联用户"
      :visible.sync="userdialogVisible"
      width="40%"
    >
      <el-row>
        <el-col :span="24">
          <el-autocomplete
            v-model="keyword"
            value-key="name"
            value="id"
            :debounce="500"
            :fetch-suggestions="SearchUser"
            placeholder="请输入姓名检索"
            @select="handleSelectUser"
            style="width: 100%"
          ></el-autocomplete>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-tag
            v-for="(tag, idx) in userform.users"
            :key="idx"
            closable
            type="success"
            size="medium"
            @close="remove_tag(idx)"
            style="margin-left: 10px"
          >
            {{ tag.name }}[{{ tag.code }}]
          </el-tag></el-col
        >
      </el-row>
      <div slot="footer">
        <el-button type="danger" @click="userdialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save_role_user">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import TableComponent from "@/components/TableComponent/index.vue";
import SearchBar from "@/components/QueryBar/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { parseTime } from "@/utils";
export default {
  name: "RoleComponent",
  components: { SearchBar, TableComponent },
  mixins: [basemixin],
  data() {
    return {
      dialogVisible: false,
      editdialogVisible: false,
      userdialogVisible: false,
      permistree: [],
      fieldstree: [],
      rolemenulist: [],
      roleeditcollist: [],
      rolehidecollist: [],
      keyword: "",
      form: {
        mes_role_entity: {
          id: 0,
          code: "",
          name: "",
          status: 1,
          adduser: this.$store.getters.userinfo.id,
          addusername: this.$store.getters.name,
          addtime: parseTime(new Date()),
        },
        permission: [],
        editfields: [],
        hidefields: [],
      },
      userform: {
        roleid: 0,
        users: [],
      },
      treeconfig: {
        children: "children",
        label: "name",
      },
      rules: {
        code: [
          {
            required: true,
            message: "角色编码不能为空且唯一",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    remove_tag(pos) {
      this.userform.users.splice(pos, 1);
    },
    open_role_dialog() {
      try {
        if (this.pageconfig.treeapi) {
          ApiFn.requestapi(
            this.pageconfig.treeapi.method,
            this.pageconfig.treeapi.url,
            {}
          ).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.permistree = res.list;
              this.fieldstree = res.fields;
              this.dialogVisible = true;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    edit_role_dialog(row) {
      try {
        if (this.pageconfig.infoapi) {
          ApiFn.requestapi(
            this.pageconfig.infoapi.method,
            this.pageconfig.infoapi.url,
            { id: row.id }
          ).then((res) => {
            if (res.code === 1) {
              this.permistree = res.menutree;
              this.fieldstree = res.coltree;
              this.form.mes_role_entity = row;
              this.rolemenulist = res.menus;
              this.roleeditcollist = res.editcols;
              this.rolehidecollist = res.hidecols;
              this.editdialogVisible = true;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    editdialog_opened_handle() {
      let nodes1 = this.rolemenulist.filter(
        (i) => i.menutype === "01" || i.menutype === "02" || i.menutype === "03"
      );
      this.$refs.permistree_m.setCheckedNodes(nodes1);
      this.$refs.editcolstree_m.setCheckedNodes(this.roleeditcollist);
      this.$refs.hidecolstree_m.setCheckedNodes(this.rolehidecollist);
    },
    SearchUser(query, cb) {
      if (query !== "") {
        if (this.pageconfig.searchuserapi) {
          ApiFn.requestapi(
            this.pageconfig.searchuserapi.method,
            this.pageconfig.searchuserapi.url,
            { key: query }
          ).then((res) => {
            if (res.code === 1) {
              cb(
                res.list.map((i) => {
                  return { name: i.name, id: i.id, code: i.code };
                })
              );
            } else if (res.code === 0) {
              this.$message.error(res.msg);
              cb([]);
            }
          });
        }
      } else {
        cb([]);
      }
    },
    relate_users(row) {
      try {
        if (this.pageconfig.userapi) {
          ApiFn.requestapi(
            this.pageconfig.userapi.method,
            this.pageconfig.userapi.url,
            { id: row.id }
          ).then((res) => {
            if (res.code === 1) {
              this.userform.roleid = row.id;
              this.userform.users = res.list.map((i) => {
                return { id: i.id, code: i.code, name: i.name };
              });
              this.userdialogVisible = true;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    submit_form_data() {
      try {
        this.form.permission = this.$refs.permistree.getCheckedNodes(
          false,
          true
        );
        this.form.editfields = this.$refs.editcolstree.getCheckedNodes(
          false,
          true
        );
        this.form.hidefields = this.$refs.hidecolstree.getCheckedNodes(
          false,
          true
        );
        if (this.pageconfig.addapi) {
          ApiFn.requestapi(
            this.pageconfig.addapi.method,
            this.pageconfig.addapi.url,
            this.form
          ).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.form.mes_role_entity.id = 0;
              this.form.mes_role_entity.code = "";
              this.form.mes_role_entity.name = "";
              this.form.permission = [];
              this.form.editfields = [];
              this.form.hidefields = [];
              this.dialogVisible = false;
              this.getlist(this.queryform);
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    submit_editform_data() {
      try {
        this.form.permission = this.$refs.permistree_m.getCheckedNodes(
          false,
          true
        );
        this.form.editfields = this.$refs.editcolstree_m.getCheckedNodes(
          false,
          true
        );
        this.form.hidefields = this.$refs.hidecolstree_m.getCheckedNodes(
          false,
          true
        );
        if (this.pageconfig.editapi) {
          ApiFn.requestapi(
            this.pageconfig.editapi.method,
            this.pageconfig.editapi.url,
            this.form
          ).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.form.mes_role_entity.id = 0;
              this.form.mes_role_entity.code = "";
              this.form.mes_role_entity.name = "";
              this.form.permission = [];
              this.form.editfields = [];
              this.form.hidefields = [];
              this.editdialogVisible = false;
              this.getlist(this.queryform);
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleSelectUser(val) {
      var pos = this.userform.users.findIndex((i) => i.id === val.id);
      if (pos === -1) {
        this.userform.users.push(val);
      }
    },
    save_role_user() {
      try {
        if (this.pageconfig.roleuserapi) {
          ApiFn.requestapi(
            this.pageconfig.roleuserapi.method,
            this.pageconfig.roleuserapi.url,
            {
              roleid: this.userform.roleid,
              userid: this.userform.users.map((i) => {
                return i.id;
              }),
            }
          ).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              this.userform.roleid = 0;
              this.userform.users = [];
              this.userdialogVisible = false;
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>