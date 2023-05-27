<template>
  <div>
    <el-dialog
      title="批量替换列值"
      :visible.sync="showdialog"
      width="40%"
      top="10px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-divider content-position="left">①过滤数据源</el-divider>
      <el-table :data="query_list" style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          label="左括号"
          width="70"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.left" clearable>
              <el-option
                v-for="(item, index) in leftlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="colname"
          label="字段"
          width="150"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.colname"
              clearable
              filterable
              placeholder=""
              @change="collist_change_handel(scope.row)"
            >
              <el-option
                v-for="(item, index) in fields"
                :key="index"
                :label="item.label"
                :value="item.dbprop ? item.dbprop : item.prop"
              >
              </el-option> </el-select
          ></template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="oper"
          label="条件"
          width="80"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.oper" clearable placeholder="">
              <el-option
                v-for="(item, index) in operlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="value"
          label="条件值"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.coltype === 'list'">
              <el-select
                v-model="scope.row.value"
                clearable
                filterable
                :filter-method="(val) => filter_data_handle(val, scope.row)"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in scope.row.coloptions"
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
            </template>
            <template v-else-if="scope.row.coltype === 'bool'">
              <el-switch v-model="scope.row.value" active-value="Y" inactive-value="N"></el-switch>
            </template>
            <template v-else-if="scope.row.coltype === 'date'">
              <el-date-picker v-model="scope.row.value" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </template>
            <template v-else-if="scope.row.coltype === 'datetime'">
              <el-date-picker v-model="scope.row.value" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </template>
            <template v-else>
              <el-input
                v-model="scope.row.value"
                clearable
                placeholder=""
              ></el-input>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="逻辑值"
          width="70"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.logic"
              clearable
              @change="logic_handle(scope.row)"
            >
              <el-option
                v-for="(item, index) in logiclist"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="右括号"
          width="70"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.right" clearable>
              <el-option
                v-for="(item, index) in rightlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="50px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index !== 0"
              style="color: red"
              type="text"
              icon="el-icon-delete"
              @click="remove_row_handle(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="left">②替换选项</el-divider>
      <el-table :data="replace_list" style="width: 100%">
        <el-table-column
          header-align="center"
          align="center"
          label="字段"
          width="150"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.colname"
              clearable
              filterable
              placeholder=""
              @change="val_collist_change_handel(scope.row)"
            >
              <el-option
                v-for="(item, index) in fields"
                :key="index"
                :label="item.label"
                :value="item.dbprop ? item.dbprop : item.prop"
              >
              </el-option> </el-select
          ></template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="替换值">
          <template slot-scope="scope">
            <template v-if="scope.row.coltype === 'list'">
              <el-select
                v-model="scope.row.replacevalue"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, k) in scope.row.rowoptions"
                  :key="k"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else-if="scope.row.coltype === 'bool'">
              <el-switch v-model="scope.row.replacevalue" active-value="Y" inactive-value="N"></el-switch>
            </template>
            <template v-else-if="scope.row.coltype === 'date'">
              <el-date-picker v-model="scope.row.replacevalue" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
            </template>
            <template v-else-if="scope.row.coltype === 'datetime'">
              <el-date-picker v-model="scope.row.replacevalue" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </template>
            <template v-else>
              <el-input
                v-model="scope.row.replacevalue"
                clearable
                placeholder=""
              ></el-input
            ></template>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index === 0"
              style="color: red"
              type="text"
              icon="el-icon-plus"
              @click="add_row_replace"
            />
            <el-button
              v-else
              style="color: red"
              type="text"
              icon="el-icon-delete"
              @click="del_row_replace(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer">
        <el-button type="danger" @click="showdialog = false">取消</el-button>
        <el-button type="primary" @click="replace_handle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index";
export default {
  name: "ColvalReplace",
  props: {
    fields: {
      require: true,
      type: Array,
      default: function () {
        return [];
      },
    },
    colreplace_dialogVisible: {
      require: true,
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      query_list: [],
      replace_list: [],
      rowid: 0,
      empty_text: "查询条件为空",
      leftlist: [
        { label: "", value: "" },
        { label: "(", value: "(" },
        { label: "((", value: "((" },
        { label: "(((", value: "(((" },
        { label: "((((", value: "((((" },
      ],
      rightlist: [
        { label: "", value: "" },
        { label: ")", value: ")" },
        { label: "))", value: "))" },
        { label: ")))", value: ")))" },
        { label: "))))", value: "))))" },
      ],
      operlist: [
        { label: "相似", value: "like" },
        { label: "=", value: "=" },
        { label: "≠", value: "<>" },
        { label: ">", value: ">" },
        { label: "≥", value: ">=" },
        { label: "<", value: "<" },
        { label: "≤", value: "<=" },
      ],
      logiclist: [
        { label: "并且", value: "and" },
        { label: "或者", value: "or" },
      ],
      form: {
        left: "",
        coltype: "string",
        coloptions: [],
        colddloptions: [],
        colname: "",
        oper: "=",
        value: "",
        right: "",
        logic: "",
      },
      replace_form: {
        colname: "",
        coltype: "string",
        replacevalue: "",
        rowoptions: [],
      },
    };
  },
  computed: {
    showdialog: {
      get() {
        return this.colreplace_dialogVisible;
      },
      set(val) {
        this.$emit("update:colreplace_dialogVisible", val);
      },
    },
  },
  mounted() {
    this.InitQuery();
  },
  methods: {
    InitQuery() {
      let row = deepClone(this.form);
      this.query_list.push(row);
      let rrow = deepClone(this.replace_form);
      this.replace_list.push(rrow);
    },
    remove_row_handle(index) {
      this.query_list.splice(index, 1);
    },
    collist_change_handel(row) {
      row.coloptions = [];
      row.colddloptions = [];
      row.value = "";
      let fieldinfo = this.fields.filter((i) => {
        if (i.dbprop) {
          return i.dbprop === row.colname;
        } else {
          return i.prop === row.colname;
        }
      });

      if (fieldinfo.length > 0) {
        row.coltype = fieldinfo[0].coltype;
        row.coloptions = fieldinfo[0].options;
        row.colddloptions = fieldinfo[0].options;
      } else {
        row.coltype = "string";
        row.coloptions = [];
        row.colddloptions = [];
      }
    },
    val_collist_change_handel(row) {
      row.rowoptions = [];
      row.replacevalue = "";
      let fieldinfo = this.fields.filter((i) => {
        if (i.dbprop) {
          return i.dbprop === row.colname;
        } else {
          return i.prop === row.colname;
        }
      });
      if (fieldinfo.length > 0) {
        row.coltype = fieldinfo[0].coltype;
        if (fieldinfo[0].coltype === "list") {
          row.rowoptions = fieldinfo[0].options;
        }
      } else {
        row.coltype = "string";
        row.rowoptions = [];
      }
    },
    logic_handle(row) {
      let nextid = row.rowid + 1;
      let pos = this.query_list.findIndex((t) => t.rowid === nextid);
      if (pos === -1) {
        let row = deepClone(this.form);
        this.query_list.push(row);
      }
      this.query_list.forEach((i, index) => {
        i.rowid = index;
      });
    },
    filter_data_handle(val, row) {
      row.value = val;
      if (val) {
        row.coloptions = row.colddloptions.filter(
          (i) => i.value.indexOf(val) !== -1
        );
      } else {
        row.coloptions = row.colddloptions;
      }
    },
    add_row_replace() {
      var row = deepClone(this.replace_form);
      this.replace_list.push(row);
    },
    del_row_replace(index) {
      this.replace_list.splice(index, 1);
    },
    replace_handle() {
      this.$emit("column_replace", {
        queryexp: this.query_list,
        replaceexp: this.replace_list,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>