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
    <!-- 关联菜单 -->
    <el-dialog
      title="关联菜单"
      :visible.sync="role_menu_dialogVisible"
      :close-on-click-modal="false"
      @opened="menu_opened_handle"
      width="30%"
    >
      <div>
        <el-tree
          ref="app_menu_tree"
          :data="app_menu_tree"
          :props="treeconfig"
          show-checkbox
          accordion
          check-strictly
          node-key="id"
        />
      </div>
      <div slot="footer">
        <el-button type="danger" @click="role_menu_dialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save_role_menu">确定</el-button>
      </div>
    </el-dialog>
    <!-- 关联用户 -->
    <el-dialog
      title="关联用户"
      :visible.sync="role_user_dialogVisible"
      :close-on-click-modal="false"
      width="40%"
    >
      <div>
        <el-row>
          <el-col :span="24">
            <el-autocomplete
              v-model="keyword"
              value-key="label"
              value="tel"
              :debounce="500"
              :fetch-suggestions="SearchAppUser"
              placeholder="请输入姓名检索"
              @select="handleSelectUser"
              style="width: 100%"
            ></el-autocomplete>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="24">
            <el-tag
              v-for="(tag, idx) in user_tel"
              :key="idx"
              closable
              type="success"
              size="medium"
              @close="remove_tag(idx)"
              style="margin-left: 10px"
            >
              {{ tag.name }}({{ tag.code }})[{{ tag.tel }}]
            </el-tag></el-col
          >
        </el-row>
      </div>
      <div slot="footer">
        <el-button type="danger" @click="role_user_dialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save_role_user">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { basemixin } from "@/mixin/basemixin";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
export default {
  name: "AppRoleComponent",
  components: {
    SearchBar,
    TableComponent,
  },
  mixins: [basemixin],
  data() {
    return {
      role_menu_dialogVisible: false,
      role_user_dialogVisible: false,
      user_tel: [],
      menuids: [],
      app_menu_tree: [],
      roleid: 0,
      keyword: "",
      treeconfig: {
        children: "children",
        label: "name",
      },
    };
  },
  mounted() {
    this.get_app_menutree();
  },
  methods: {
    execfun(row, fnname) {
      this[fnname](row);
    },
    get_app_menutree() {
      ApiFn.requestapi("get", "/lbj/approle/app_menutree", {}).then((res) => {
        if (res.code === 1) {
          this.app_menu_tree = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleSelectUser() {},
    SearchAppUser(query, cb) {
      if (query !== "") {
        ApiFn.requestapi("get", "/lbj/approle/search_user", {
          key: query,
        }).then((res) => {
          if (res.code === 1) {
            cb(
              res.list.map((i) => {
                return {
                  label: i.name + "(" + i.code + ")" + "[" + i.tel + "]",
                  code: i.code,
                  name: i.name,
                  tel: i.tel,
                };
              })
            );
          } else if (res.code === 0) {
            this.$message.error(res.msg);
            cb([]);
          }
        });
      } else {
        cb([]);
      }
    },
    handleSelectUser(val) {
      var pos = this.user_tel.findIndex((i) => i.code === val.code);
      if (pos === -1) {
        this.user_tel.push(val);
      }
    },
    remove_tag(pos) {
      this.user_tel.splice(pos, 1);
    },
    save_role_user() {
      let tels = this.user_tel.map((i) => {
        return {tel:i.tel,code:i.code};
      });
      ApiFn.requestapi("post", "/lbj/approle/save_role_user", {
        roleid: this.roleid,
        users: tels,
      }).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.msg);
          this.role_user_dialogVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    save_role_menu() {
      let cknodes = this.$refs.app_menu_tree.getCheckedNodes(false, true);
      if (cknodes.length > 0) {
        this.menuids = cknodes.map(i=>i.id);
        ApiFn.requestapi("post", "/lbj/approle/save_role_menu", {
          roleid: this.roleid,
          menuids: this.menuids,
        }).then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg);
            this.role_menu_dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("请选择菜单项");
      }
    },
    menu_opened_handle() {
      let nodes1 = this.app_menu_tree.filter(
        (i) => this.menuids.findIndex((e) => e === i.id) !== -1
      );
      this.$refs.app_menu_tree.setCheckedNodes(nodes1);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>