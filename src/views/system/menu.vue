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
      :isoperate="pageconfig.isoperate || false"
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
            <el-dropdown-item
              v-if="scope.row.menutype === '02'"
              @click.native="page_config(scope.row)"
              ><span class="el-icon-circle-plus-outline"
                >配置</span
              ></el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </table-component>
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
            style="width: 20%"
            placeholder="按钮名称"
          />
          <el-input
            style="width: 20%"
            v-model="item.btntxt"
            placeholder="按钮文本"
          ></el-input>
          <el-input
            v-model="item.fnname"
            style="width: 20%"
            placeholder="调用方法名"
          />
          <el-select
            v-model="item.btntype"
            style="width: 20%"
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
            style="width: 15%"
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
    <!-- 页面配置 -->
    <el-dialog title="页面配置" :visible.sync="dialog_config_Visible">
      <el-tabs v-model="activatetab" type="border-card" @tab-click="tab_click_handle">
        <el-tab-pane label="字段信息" name="fields">
          <el-button type="primary" @click="add_pagefield_item">增加</el-button>
          <el-table :data="pageconfig_form.fields" style="width: 100%">
            <el-table-column prop="coltype" label="字段类型" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.coltype" placeholder="">
                  <el-option
                    v-for="(item, idx) in coltypelist"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="label" label="字段标题" width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.label" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="prop" label="字段名称" width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.prop" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="dbprop" label="数据库字段" width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.dbprop" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="width"
              label="列宽"
              width="60"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.width" placeholder=""></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="overflowtooltip"
              label="溢出"
              header-align="center"
              width="60"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.overflowtooltip"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="headeralign" label="列头对齐" width="80">
              <template slot-scope="scope">
                <el-select v-model="scope.row.headeralign" placeholder="">
                  <el-option
                    v-for="(item, idx) in aligntype"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="align" label="内容对齐" width="80">
              <template slot-scope="scope">
                <el-select v-model="scope.row.align" placeholder="">
                  <el-option
                    v-for="(item, idx) in aligntype"
                    :key="idx"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="数据源"
              prop="url"
              header-align="center"
              width="150"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.url"
                  placeholder="初始化选项地址"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="取数方式"
              prop="method"
              width="80"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-select v-model="scope.row.method" placeholder="">
                  <el-option label="GET" value="get"></el-option>
                  <el-option label="POST" value="post"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="回调函数"
              prop="callback"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.callback"
                  rows="2"
                  placeholder="输入回调函数"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="50" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="remove_pagefield_item(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="基本配置" name="pagecnf">
          <el-form
            :model="pageconfig_form.baseconfig"
            label-width="150px"
            label-position="right"
          >
            <el-form-item label="开启高级查询">
              <el-switch
                v-model="pageconfig_form.baseconfig.isgradequery"
                :inactive-value="false"
                :active-value="true"
              ></el-switch>
            </el-form-item>
            <el-form-item label="开启批量操作">
              <el-switch
                v-model="pageconfig_form.baseconfig.isbatoperate"
                :inactive-value="false"
                :active-value="true"
              ></el-switch>
            </el-form-item>
            <el-form-item label="开启选择列">
              <el-switch
                v-model="pageconfig_form.baseconfig.isselect"
                :inactive-value="false"
                :active-value="true"
              ></el-switch>
            </el-form-item>
            <el-form-item label="操作后是否刷新">
              <el-switch
                v-model="pageconfig_form.baseconfig.isfresh"
                :inactive-value="false"
                :active-value="true"
              ></el-switch>
            </el-form-item>
            <el-form-item label="开启操作列">
              <el-switch
                v-model="pageconfig_form.baseconfig.isoperate"
                :inactive-value="false"
                :active-value="true"
                @change="operate_change_handle"
              ></el-switch>
            </el-form-item>
            <template v-if="pageconfig_form.baseconfig.isoperate">
              <el-form-item label="操作列菜单">
                <el-button type="primary" @click="add_operate_item">增加</el-button>
                <el-table
                  :data="pageconfig_form.operate_fnlist">
                  <el-table-column
                    prop="label"
                    header-align="center"
                    label="按钮名称">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.label" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="btntype"
                    label="按钮类型" >
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.btntype" placeholder="">
                        <el-option label="上传" value="upload"></el-option>
                        <el-option label="文本" value="text"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="fnname"
                    label="执行函数名" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.fnname" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="action"
                    label="上传url" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.action" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column
                    header-align="center"
                    align="center"
                    prop="callback"
                    label="回调函数" >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.callback" placeholder=""></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" header-align="center" width="50" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" @click="remove_operate_item(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </template>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="页面函数" name="pagefn">
          <el-button type="primary" @click="add_pagefn_item">增加</el-button>
          <el-table :data="pageconfig_form.pagefn" style="width: 100%">
            <el-table-column
              prop="fnname"
              label="函数名称"
              width="100"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.fnname"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="fnbody"
              label="函数体"
              header-align="center"
              align="left"
            >
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  v-model="scope.row.fnbody"
                  :rows="5"
                  placeholder=""
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              width="50"
              fixed="right"
              label="操作"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" @click="remove_pagefn_item(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="表单定义" name="pageform">
          <el-button type="primary" @click="add_pageform_define_item"
            >增加</el-button
          >
          <el-table :data="pageconfig_form.pageform" style="width: 100%">
            <el-table-column prop="fieldname" label="项目名称" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model.trim="scope.row.fieldname"
                  placeholder="项目名称"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="fieldvalue" label="默认值" width="150">
              <template slot-scope="scope">
                <el-input
                  v-model.trim="scope.row.fieldvalue"
                  placeholder="默认值"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="remove_pageform_define_item(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="数据接口" name="api">
          <el-button type="primary" @click="add_pageapi_item"
            >新增接口</el-button
          >
          <el-collapse
            v-for="(item, idx) in pageconfig_form.pageapis"
            :key="idx"
          >
            <el-collapse-item :name="idx">
              <template slot="title">
                <div>{{ item.name }}</div>
                <div style="margin-left: 20px">
                  <el-button type="danger" @click="remove_api_item(idx)"
                    >移除接口</el-button
                  >
                </div>
              </template>
              <el-form :model="item" label-width="80" label-position="right">
                <el-form-item label="接口名称">
                  <el-input v-model="item.name" style="width: 90%"></el-input>
                </el-form-item>
                <el-form-item label="接口地址">
                  <el-input v-model="item.url" style="width: 90%"></el-input>
                </el-form-item>
                <el-form-item label="请求方式">
                  <el-select v-model="item.method" placeholder="">
                    <el-option label="POST" value="post"></el-option>
                    <el-option label="GET" value="get"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="回调函数">
                  <el-input
                    v-model="item.callback"
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    style="width: 90%"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer">
        <el-button type="danger" @click="dialog_config_Visible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="save_page_config">保存</el-button>
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
      dialog_config_Visible: false,
      checkAll: false,
      allfields: [],
      AllColOptions: [],
      activatetab: "fields",
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
        addusername: this.$store.getters.name,
        addtime: parseTime(new Date()),
      },
      fn_form: {
        pid: 0,
        code: "",
        adduser: this.$store.getters.userinfo.id,
        addusername: this.$store.getters.name,
        addtime: parseTime(new Date()),
        fnlist: [],
        collist: [],
      },
      aligntype: [
        { label: "居中", value: "center" },
        { label: "左对齐", value: "left" },
        { label: "右对齐", value: "right" },
      ],
      coltypelist: [
        { label: "下拉列", value: "list" },
        { label: "文本", value: "string" },
        { label: "数字", value: "int" },
        { label: "日期", value: "date" },
        { label: "日期时间", value: "datetime" },
        { label: "开关", value: "bool" },
        { label: "输入建议", value: "suggest" },
      ],
      pageconfig_form: {
        menu:{},
        fields: [],
        pageform: [],
        pagefn: [],
        pageapis: [],
        operate_fnlist:[],
        baseconfig: {
          isgradequery: true,
          isbatoperate: true,
          isoperate: false,
          isfresh: true,
          isselect: true,
        },
      },
      operate_item:{
        label:'',
        btntype:'',
        fnname:'',
        action:'',
        callback:'',
      },
      pagefield_item: {
        coltype: "string",
        label: "",
        prop: "",
        dbprop: "",
        width: "",
        overflowtooltip: false,
        headeralign: "center",
        align: "center",
        callback: "",
        url: "",
        method: "get",
      },
      pagefn_item: {
        fnname: "",
        fnbody: "",
      },
      pageapi_item: {
        name: "",
        url: "",
        method: "",
        callback: "",
      },
      pageform_item: {
        fieldname: "",
        fieldvalue: "",
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
    tab_click_handle(tab,event){
      if(tab.name === 'pageform')
      {
        this.pageconfig_form.pageform=[];
        this.pageconfig_form.pageform = this.pageconfig_form.fields.map(i=>{
          return {fieldname:i.prop,fieldvalue:''};
        });
      }
    },
    operate_change_handle(v){
      if(v){
        
      }else{
        this.pageconfig_form.operate_fnlist = [];
      }
    },
    add_operate_item(){
      let item = deepClone(this.operate_item);
      this.pageconfig_form.operate_fnlist.push(item);
    },
    remove_operate_item(index){
      this.pageconfig_form.operate_fnlist.splice(index,1);
    },
    add_funitem() {
      let fnitem = deepClone({
        pid: this.fn_form.pid,
        code: this.fn_form.code,
        name: "",
        fnname: "",
        btntype: "primary",
        btntxt: "",
        menutype: "03",
        icon: "",
        seq: 10,
        status: 1,
        adduser: this.fn_form.adduser,
        addtime: this.fn_form.addtime,
        addusername: this.fn_form.addusername,
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
      this.fn_form.code = row.code;
      this.fn_form.fnlist = defaultfuns.map((i) => {
        return {
          pid: row.id,
          code: row.code,
          name: i.name,
          fnname: i.fnname,
          btntype: i.btntype,
          btntxt: i.btntxt,
          menutype: "03",
          icon: i.icon,
          status: 1,
          adduser: this.fn_form.adduser,
          addtime: this.fn_form.addtime,
          addusername: this.fn_form.addusername,
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
          let fitem = this.allfields.filter((t) => t.prop === i);
          postdatas.push({
            pid: this.fn_form.pid,
            code: this.fn_form.code,
            name: i,
            fnname: "",
            btntype: "",
            btntxt: fitem ? fitem[0].label : "",
            menutype: "04",
            icon: "",
            seq: 10,
            status: 1,
            adduser: this.fn_form.adduser,
            addtime: this.fn_form.addtime,
            addusername: this.fn_form.addusername,
          });
        });
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
    add_pagefield_item() {
      let item = deepClone(this.pagefield_item);
      this.pageconfig_form.fields.push(item);
    },
    remove_pagefield_item(index) {
      this.pageconfig_form.fields.splice(index, 1);
    },
    add_pagefn_item() {
      let item = deepClone(this.pageform_item);
      this.pageconfig_form.pagefn.push(item);
    },
    remove_pagefn_item(idx) {
      this.pageconfig_form.pagefn.splice(idx, 1);
    },
    add_pageform_define_item() {
      let item = deepClone(this.pagefn_item);
      this.pageconfig_form.pageform.push(item);
    },
    remove_pageform_define_item(index) {
      this.pageconfig_form.pageform.splice(index, 1);
    },
    add_pageapi_item() {
      let item = deepClone(this.pageapi_item);
      this.pageconfig_form.pageapis.push(item);
    },
    remove_api_item(idx) {
      this.pageconfig_form.pageapis.splice(idx, 1);
    },
    page_config(row) {
      this.pageconfig_form.menu = row;
      let item_add = deepClone(this.pageapi_item);
      item_add.name = "addapi";
      item_add.method = "post";
      item_add.callback = "function(vm,res){}";
      this.pageconfig_form.pageapis.push(item_add);
      let item_edit = deepClone(this.pageapi_item);
      item_edit.name = "editapi";
      item_edit.method = "post";
      item_edit.callback = "function(vm,res){}";
      this.pageconfig_form.pageapis.push(item_edit);
      let item_del = deepClone(this.pageapi_item);
      item_del.name = "delapi";
      item_del.method = "post";
      item_del.callback = "function(vm,res){}";
      this.pageconfig_form.pageapis.push(item_del);
      let item_query = deepClone(this.pageapi_item);
      item_query.name = "queryapi";
      item_query.method = "post";
      item_query.callback = "function(vm,res){}";
      this.pageconfig_form.pageapis.push(item_query);
      this.dialog_config_Visible = true;
    },
    save_page_config() {
      try {
        ApiFn.requestapi(
          "post",
          "/common/saveconfig",
          this.pageconfig_form
        ).then((res) => {
          if (res.code === 1) {
            this.$message.success(res.msg);
            this.pageconfig_form.menu={};
            this.pageconfig_form.fields=[];
            this.pageconfig_form.pageform=[];
            this.pageconfig_form.pagefn=[];
            this.pageconfig_form.pageapis=[];
            this.pageconfig_form.operate_fnlist = [];
            this.dialog_config_Visible = false;
          } else if (res.code === 0) {
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