<template>
  <div>
    <search-bar
      :collist="colshowlist"
      :isgrade="isgradequery"
      @query="query_handle"
      @gradequery="grade_query_handle"
    >
      <template #other>
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="dialogVisible = true"
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
      :isoperate="true"
      ref="tablecomponent"
      :resultcount="resultcount"
      :datalist="list"
      :treeprops="{ children: 'children', hasChildren: 'hasChildren' }"
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
              v-if="scope.row.menutype === '01'"
              @click.native="add_sub_item(scope.row)"
              ><span class="el-icon-circle-plus-outline"
                >子菜单</span
              ></el-dropdown-item
            >
            <el-dropdown-item
              v-if="scope.row.menutype === '02'"
              @click.native="add_page_fns(scope.row)"
              ><span class="el-icon-circle-plus-outline"
                >功能</span
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
    <!-- <el-table
      :data="list"
      stripe
      border
      :indent="10"
      row-key="id"
      header-cell-class-name="tb_header_bg"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
      ref="tablecomponent"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column
        v-for="(col, idx) in pageconfig.fields"
        :key="idx"
        :label="col.label"
        :prop="col.prop"
        :header-align="col.headeralign"
        :align="col.align"
        :width="col.width"
      ></el-table-column> -->
    <!-- <el-table-column
        header-align="center"
        align="left"
        label="编码"
        prop="code"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        header-align="center"
        align="center"
        label="状态"
        width="80"
      >
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.status | tagtype">{{
            scope.row.status | statusname
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="名称"
        prop="name"
        width="120"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="类型"
        width="70"
      >
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.menutype | typecolor">{{
            scope.row.menutype | typename
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="left"
        label="路由路径"
        show-overflow-tooltip
        prop="routepath"
      />
      <el-table-column
        header-align="center"
        align="left"
        label="视图路径"
        show-overflow-tooltip
        prop="viewpath"
      />
      <el-table-column
        prop="configpath"
        label="配置文件"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="componentname"
        label="组件名称"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="图标"
        width="50"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="seq"
        label="权重"
        width="50"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="创建者"
        prop="addusername"
        width="120"
      />
      <el-table-column
        header-align="center"
        align="center"
        label="创建日期"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          {{ scope.row.addtime | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
        </template>
      </el-table-column> -->
    <!-- <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="50px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting" style="font-size: 16px" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="scope.row.menutype === '01'"
                @click.native="add_sub_item(scope.row)"
                ><span class="el-icon-circle-plus-outline"
                  >子菜单</span
                ></el-dropdown-item
              >
              <el-dropdown-item
                v-if="scope.row.menutype === '02'"
                @click.native="add_page_fns(scope.row)"
                ><span class="el-icon-circle-plus-outline"
                  >功能</span
                ></el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table> -->

    <!--添加菜单表单-->
    <el-dialog
      v-drag-dialog
      title="新增根节点菜单"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="menu_form"
        :model="menu_form"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="menu_form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="menu_form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="路由路径" prop="routepath">
          <el-input v-model="menu_form.routepath" placeholder="" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menutype">
          <el-select
            v-model="menu_form.menutype"
            placeholder=""
            style="width: 100%"
          >
            <el-option label="菜单" value="01" />
          </el-select>
        </el-form-item>
        <el-form-item label="视图路径" prop="viewpath">
          <el-input v-model="menu_form.viewpath" placeholder="" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="menu_form.icon"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in elementIcons"
              :key="index"
              :value="item"
              :label="item"
            >
              <span style="float: left">{{ item }}</span>
              <span style="float: right"><svg-icon :icon-class="item" /></span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number
            v-model="menu_form.seq"
            :step="10"
            placeholder=""
            @change="handlechange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit_menuform">确定</el-button>
      </div>
    </el-dialog>
    <!--添加页面-->
    <el-dialog
      v-drag-dialog
      title="增加页面"
      :visible.sync="pagedialogVisible"
      width="40%"
    >
      <el-form
        ref="menu_form"
        :model="menu_form"
        :rules="pagerules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="编码" prop="code">
          <el-input v-model="menu_form.code" placeholder="" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="menu_form.name" placeholder="" />
        </el-form-item>
        <el-form-item label="组件名称" prop="componentname">
          <el-input v-model="menu_form.componentname" placeholder="" />
        </el-form-item>
        <el-form-item label="路由路径" prop="routepath">
          <el-input v-model="menu_form.routepath" placeholder="" />
        </el-form-item>
        <el-form-item label="视图路径" prop="viewpath">
          <el-input v-model="menu_form.viewpath" placeholder="" />
        </el-form-item>
        <el-form-item label="配置文件" prop="configpath">
          <el-input
            v-model="menu_form.configpath"
            placeholder="服务端js配置文件名称"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menutype">
          <el-select
            v-model="menu_form.menutype"
            placeholder=""
            style="width: 100%"
          >
            <el-option label="页面" value="02" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="menu_form.icon"
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in elementIcons"
              :key="index"
              :value="item"
              :label="item"
            >
              <span style="float: left">{{ item }}</span>
              <span style="float: right"><svg-icon :icon-class="item" /></span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权重">
          <el-input-number
            v-model="menu_form.seq"
            :step="10"
            placeholder="数值小者排在前面"
            @change="handlechange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="pagedialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="submit_menuform">确定</el-button>
      </div>
    </el-dialog>
    <!--页面功能-->
    <el-dialog
      title="页面功能定义"
      v-drag-dialog
      :visible.sync="fndialogVisible"
    >
      <el-form label-width="50px" :model="fn_form" label-position="right">
        <el-form-item
          v-for="(item, idx) in fn_form.fnlist"
          :key="idx"
          :label="'功能' + (idx + 1)"
        >
          <el-input
            v-model="item.name"
            style="width: 25%"
            placeholder="按钮名称"
          />
          <el-input
            v-model="item.fnname"
            style="width: 25%"
            placeholder="调用方法名"
          />
          <el-select
            v-model="item.btntype"
            style="width: 25%"
            placeholder="选择按钮类型"
          >
            <el-option
              v-for="(o, i) in btntypelist"
              :key="i"
              :label="o.label"
              :value="o.value"
              ><span style="float: left">{{ o.label }}</span
              ><span style="float: right">{{ o.value }}</span></el-option
            >
          </el-select>
          <el-select
            v-model="item.icon"
            style="width: 20%"
            placeholder="选择按钮图标"
          >
            <el-option
              v-for="(sitem, index) in elementIcons"
              :key="index"
              :value="sitem"
              :label="sitem"
            >
              <span style="float: left">{{ sitem }}</span>
              <span style="float: right"><svg-icon :icon-class="sitem" /></span>
            </el-option>
          </el-select>
          <i
            style="
              color: red;
              margin-left: 15px;
              margin-top: 5px;
              cursor: pointer;
            "
            class="el-icon-delete-solid"
            @click="remove_fnitem(idx)"
          ></i>
        </el-form-item>
        <el-form-item label="字段">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="fn_form.collist"
            @change="handleCheckedFnsChange"
          >
            <el-checkbox
              v-for="(item, index) in AllColOptions"
              :label="item"
              :key="index"
              >{{ item | fieldname }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="danger" @click="fndialogVisible = false"
          >取消</el-button
        >
        <el-button type="success" @click="add_funitem">增加功能</el-button>
        <el-button type="primary" @click="submit_fnsform">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var _this;
import ApiFn from "@/api/baseapi";
import MenuFn from "@/api/menu";
import elementIcons from "@/views/icons/element-icons";
import SearchBar from "@/components/QueryBar/index.vue";
import TableComponent from "@/components/TableComponent/index.vue";
import { basemixin } from "@/mixin/basemixin";
import { menutypelist } from "./menutypelist";
import { defaultfuns } from "./defaultfuns";
import { parseTime, deepClone } from "@/utils";
export default {
  name: "MenuComponent",
  components: {
    SearchBar,
    TableComponent,
  },
  data() {
    return {
      dialogVisible: false,
      pagedialogVisible: false,
      fndialogVisible: false,
      isIndeterminate: true,
      checkAll: false,
      allfields: [],
      AllColOptions: [],
      btntypelist: [
        { label: "主要", value: "primary" },
        { label: "成功", value: "success" },
        { label: "信息", value: "info" },
        { label: "警告", value: "warning" },
        { label: "危险", value: "danger" },
      ],
      elementIcons,
      menutypelist,
      menu_form: {
        pid: 0,
        code: "",
        name: "",
        icon: "",
        routepath: "/",
        viewpath: "index",
        configpath: "",
        menutype: "01",
        seq: 10,
        status: 1,
        componentname: "",
        adduser: this.$store.getters.userinfo.id,
        addtime: parseTime(new Date()),
      },
      fn_form: {
        pid: 0,
        adduser: this.$store.getters.userinfo.id,
        addtime: parseTime(new Date()),
        fnlist: [],
        collist: [],
      },
      rules: {
        code: [
          {
            required: true,
            message: "菜单编码不能为空且唯一",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        routepath: [
          { required: true, message: "路由不能为空且唯一", trigger: "blur" },
        ],
        viewpath: [{ required: true, message: "视图路径", trigger: "blur" }],
        menutype: [
          {
            required: true,
            message: "菜单类型不能为空",
            trigger: "change",
          },
        ],
      },
      pagerules: {
        code: [
          {
            required: true,
            message: "菜单编码不能为空且唯一",
            trigger: "blur",
          },
        ],
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        configpath: [
          { required: true, message: "配置文件名称不能为空", trigger: "blur" },
        ],
        componentname: [
          {
            required: true,
            message: "组件名称不能为空且唯一",
            trigger: "blur",
          },
        ],
        routepath: [
          { required: true, message: "路由不能为空且唯一", trigger: "blur" },
        ],
        viewpath: [{ required: true, message: "视图路径", trigger: "blur" }],
        menutype: [
          {
            required: true,
            message: "菜单类型不能为空",
            trigger: "change",
          },
        ],
        funs: [
          {
            type: "array",
            required: true,
            message: "页面功能不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  mixins: [basemixin],
  filters: {
    is_disable(val) {
      if (val === "01" || val === "02") {
        return false;
      } else {
        return true;
      }
    },
    fieldname(val) {
      var finded = _this.allfields.filter((i) => {
        return i.prop === val;
      });
      if (finded) {
        return finded[0].label;
      } else {
        return "";
      }
    },
    typename(typecode) {
      try {
        if (typecode) {
          let item = menutypelist.filter((i) => i.code === typecode);
          if (item) {
            return item[0].name;
          } else {
            return "";
          }
        } else {
          return "";
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    typecolor(typecode) {
      let color = "primary";
      switch (typecode) {
        case "01":
          color = "primary";
          break;
        case "02":
          color = "warning";
          break;
        case "03":
          color = "info";
          break;
        case "04":
          color = "danger";
          break;
        default:
          break;
      }
      return color;
    },
  },
  mounted() {
    _this = this;
  },
  methods: {
    handleCheckAllChange(val) {
      this.fn_form.collist = val ? this.AllColOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedFnsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.AllColOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.AllColOptions.length;
    },
    add_funitem() {
      let fnitem = deepClone({
        pid: this.fn_form.pid,
        name: "",
        fnname: "",
        btntype: "primary",
        menutype: "03",
        icon: "",
        seq: 10,
        status: 1,
        adduser: this.fn_form.adduser,
        addtime: this.fn_form.addtime,
      });
      this.fn_form.fnlist.push(fnitem);
    },
    remove_fnitem(index) {
      this.fn_form.fnlist.splice(index, 1);
    },
    add_sub_item(row) {
      this.menu_form.pid = row.id;
      this.menu_form.code = row.code + "01";
      this.menu_form.routepath = row.routepath + "/";
      this.menu_form.viewpath = "";
      this.menu_form.menutype = "02";
      this.pagedialogVisible = true;
    },
    add_page_fns(row) {
      this.fn_form.pid = row.id;
      this.fn_form.fnlist = defaultfuns.map((i) => {
        return {
          pid: row.id,
          name: i.name,
          fnname: i.fnname,
          btntype: i.btntype,
          menutype: "03",
          icon: i.icon,
          status: 1,
          adduser: this.fn_form.adduser,
          addtime: this.fn_form.addtime,
        };
      });
      try {
        MenuFn.pagefields({ pageid: row.id }).then((res) => {
          if (res.code === 1) {
            this.allfields = res.fields;
            this.AllColOptions = res.fields.map((i) => i.prop);
            this.fn_form.collist = this.AllColOptions;
            this.isIndeterminate = true;
            this.fndialogVisible = true;
          } else if (res.code === 0) {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    submit_menuform() {
      this.$refs.menu_form.validate((v) => {
        if (v) {
          try {
            if (this.pageconfig.addapi) {
              ApiFn.requestapi(
                this.pageconfig.addapi.method,
                this.pageconfig.addapi.url,
                [this.menu_form]
              ).then((res) => {
                this.$message.success(res.msg);
                if (res.code === 1) {
                  this.$message.success(res.msg);
                  this.dialogVisible = false;
                  this.pagedialogVisible = false;
                  this.getlist(this.queryform);
                  for (let key in this.menu_form) {
                    this.menu_form[key] = "";
                  }
                } else {
                  this.$message.error(res.msg);
                }
              });
            }
          } catch (error) {
            this.$message.error(error);
          }
        } else {
          return false;
        }
      });
    },
    submit_fnsform() {
      let postdatas = [];
      if (this.fn_form.fnlist.length > 0) {
        this.fn_form.fnlist.forEach((i) => {
          postdatas.push(i);
        });
      }
      if (this.fn_form.collist.length > 0) {
        this.fn_form.collist.forEach((i) => {
          postdatas.push({
            pid: this.fn_form.pid,
            name: i,
            fnname: "",
            btntype: "",
            menutype: "04",
            icon: "",
            seq: 10,
            status: 1,
            adduser: this.fn_form.adduser,
            addtime: this.fn_form.addtime,
          });
        });
        console.log(postdatas);
        try {
          if (this.pageconfig.addapi) {
            ApiFn.requestapi(
              this.pageconfig.addapi.method,
              this.pageconfig.addapi.url,
              postdatas
            ).then((res) => {
              this.$message.success(res.msg);
              if (res.code === 1) {
                this.$message.success(res.msg);
                this.fndialogVisible = false;
                this.getlist(this.queryform);
                this.fn_form.pid = 0;
                this.fn_form.fnlist = [];
                this.fn_form.collist = [];
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
    handlechange(val) {
      this.menu_form.seq = val;
    },
    handleSelectionChange(val) {
      this.selectlist = val;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>