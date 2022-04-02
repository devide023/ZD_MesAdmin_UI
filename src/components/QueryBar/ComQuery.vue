<template>
  <div>
    <el-dialog
      v-drag-dialog
      title="组合查询"
      :visible.sync="showdialog"
      append-to-body
    >
      <el-table :data="list" :empty-text="empty_text" style="width: 100%">
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
          label="字段名"
          width="100"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.colname"
              placeholder=""
              @change="collist_change_handel(scope.row)"
            >
              <el-option
                v-for="(item, index) in collist"
                :key="index"
                :label="item.label"
                :value="item.dbprop?item.dbprop:item.prop"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="条件"
          width="100"
        >
          <template slot-scope="scope">
            <el-select v-model="scope.row.oper" placeholder="">
              <el-option
                v-for="(item, index) in operlist"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="条件值">
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.coltype === 'string'"
              v-model="scope.row.value"
              clearable
            />
            <el-select
              v-if="scope.row.coltype === 'list'"
              v-model="scope.row.values"
              clearable
              multiple
              collapse-tags
              filterable
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
            <el-date-picker
              v-if="scope.row.coltype === 'date'"
              v-model="scope.row.value"
              value-format="yyyy-MM-dd"
              type="date"
              style="width: 100%"
            />
            <el-date-picker
              v-if="scope.row.coltype === 'datetime'"
              v-model="scope.row.value"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 100%"
            />
            <el-switch
              v-if="scope.row.coltype === 'bool'"
              v-model="scope.row.value"
              active-value="Y"
              inactive-value="N"
            />
            <el-input-number
              v-if="scope.row.coltype === 'int'"
              v-model="scope.row.value"
              :min="-65535"
              :max="65536"
            ></el-input-number>
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
              type="text"
              icon="el-icon-delete"
              @click="remove_row_handle(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        title="如需字段排序请新增排序"
        type="info"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row>
        <el-col :span="24">
          <ul class="pxtj">
            <li v-for="(pxitem, index) in pxlist" :key="index">
              <el-select
                v-model="pxitem.fieldname"
                placeholder="选择排序字段"
                style="margin-right: 10px"
              >
                <el-option
                  v-for="(item, index) in collist"
                  :key="index"
                  :label="item.label"
                  :value="item.prop"
                >
                </el-option>
              </el-select>
              <el-radio-group v-model="pxitem.pxfs" style="margin-right: 10px">
                <el-radio-button label="asc">升序</el-radio-button>
                <el-radio-button label="desc">降序</el-radio-button>
              </el-radio-group>
              <el-button
                icon="el-icon-minus"
                circle
                @click="remove_px_handle(pxitem)"
              ></el-button>
            </li>
            <li>
              <el-button
                icon="el-icon-plus"
                circle
                @click="add_px_handle"
              ></el-button>
            </li>
          </ul>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="warning" @click="save_exp_handle">保存条件</el-button>
        <el-button type="success" @click="add_query_handle">加条件</el-button>
        <el-button type="primary" @click="query_handle">查询</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setSearchExp, getSearchExp } from "@/utils/auth";
import { parseTime } from "@/utils";
export default {
  props: {
    isshow: {
      type: Boolean,
      default: false,
    },
    collist: {
      require: true,
      type: Array,
    },
  },
  data() {
    return {
      list: [],
      rowindex: 0,
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
        { label: "包含", value: "in" },
        { label: "不包含", value: "not in" },
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
      pxlist: [],
    };
  },
  computed: {
    showdialog: {
      get() {
        return this.isshow;
      },
      set(val) {
        this.$emit("update:isshow", val);
      },
    },
  },
  mounted() {
    this.initexp();
  },
  methods: {
    query_handle() {
      try {
        this.$emit("query", { list: this.list, pxlist: this.pxlist });
        this.$emit("update:isshow", false);
      } catch (error) {
        this.$message.error(error);
      }
    },
    initexp() {
      var json = getSearchExp();
      let savedata = JSON.parse(json);
      if (savedata) {
        let path = this.$route.path;
        let code = this.$store.getters.userinfo.code;
        let cachelist = savedata.filter(
          (t) => t.code === code && t.path === path
        );
        if (cachelist.length > 0) {
          this.list = cachelist[0].explist;
          this.pxlist = cachelist[0].pxlist;
          this.list.forEach((i, index) => {
            i.rowno = index;
          });
          this.pxlist.forEach((i, index) => {
            i.guid = index;
          });
        } else {
          this.add_query_handle();
        }
      } else {
        this.add_query_handle();
      }
    },
    add_query_handle() {
      this.list.push({
        coltype: "string",
        coloptions: [],
        rowno: this.rowindex,
        left: "",
        right: "",
        colname: "",
        oper: "like",
        value: "",
        values: [],
        logic: "",
      });
      this.list.forEach((i, index) => {
        i.rowno = index;
      });
    },
    remove_row_handle(row) {
      let pos = this.list.findIndex((i) => i.rowno === row.rowno);
      this.list.splice(pos, 1);
    },
    collist_change_handel(row) {
      row.values = [];
      row.coloptions = [];
      row.value = "";
      let fieldinfo = this.collist.filter((i) => {
        return i.prop === row.colname;
      });
      if (fieldinfo.length > 0) {
        row.coltype = fieldinfo[0].coltype;
        row.coloptions = fieldinfo[0].options;
      } else {
        row.coltype = "string";
        row.coloptions = [];
      }
      if (row.coltype === "date" || row.coltype === "datetime") {
        row.oper = "=";
        row.value = parseTime(new Date());
      } else if (row.coltype === "list") {
        row.oper = "in";
      } else {
        row.oper = "like";
      }
    },
    logic_handle(row) {
      let nextid = row.rowno + 1;
      let pos = this.list.findIndex((t) => t.rowno === nextid);
      if (pos === -1) {
        this.add_query_handle();
      }
    },
    save_exp_handle() {
      try {
        let path = this.$route.path;
        let code = this.$store.getters.userinfo.code;
        let json = getSearchExp();
        let savedata = JSON.parse(json);
        //console.log(savedata);
        if (savedata) {
          let pos = savedata.findIndex(
            (t) => t.path === path && t.code === code
          );
          if (pos !== -1) {
            savedata.splice(pos, 1);
          }
          savedata.push({
            explist: this.list,
            pxlist: this.pxlist,
            code: code,
            path: path,
          });
          let jsonstr = JSON.stringify(savedata);
          setSearchExp(jsonstr);
        } else {
          let jsonstr = JSON.stringify([
            {
              explist: this.list,
              pxlist: this.pxlist,
              code: code,
              path: path,
            },
          ]);
          setSearchExp(jsonstr);
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    add_px_handle() {
      this.pxlist.push({
        guid: 0,
        fieldname: "",
        pxfs: "asc",
      });
      this.pxlist.forEach((i, index) => {
        i.guid = index;
      });
    },
    remove_px_handle(item) {
      let pxid = this.pxlist.findIndex((i) => i.guid === item.guid);
      if (pxid !== -1) {
        this.pxlist.splice(pxid, 1);
      }
    },
  },
};
</script>

<style lang="scss">
.pxtj {
  list-style: none;
  padding: 0px;
  margin: 0px;
}
.pxtj li {
  float: left;
  margin-top: 5px;
  margin-right: 10px;
}
</style>