<template>
  <div>
    <el-autocomplete
      v-model="tablename"
      placeholder="过滤当前数据库表名"
      :fetch-suggestions="fetchSuggestions"
      @select="tablename_handleSelect"
      :trigger-on-focus="false"
      style="width: 200px; margin-right: 10px"
      popper-class="my-autocomplete"
    >
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
        <span class="addr">{{ item.label }}</span>
      </template>
    </el-autocomplete>
    <el-button icon="el-icon-plus" type="primary" @click="add_field_info_handle"
      >增加</el-button
    >
    <el-table :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-width="150px" label-position="right">
            <template v-if="props.row.coltype === 'string'">
              <el-form-item label="是否开启输入建议">
                <el-switch v-model="props.row.suggest"></el-switch>
              </el-form-item>
              <template v-if="props.row.suggest">
                <el-form-item label="输入建议执行函数名">
                  <el-input
                    v-model="props.row.suggest_fn_name"
                    placeholder="输入建议函数名称"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
                <el-form-item label="选择项执行函数名">
                  <el-input
                    v-model="props.row.select_fn_name"
                    placeholder="选择项函数名称"
                    style="width: 300px"
                  ></el-input>
                </el-form-item>
              </template>
            </template>
            <template v-else-if="props.row.coltype === 'list'">
              <el-form-item label="初始化选项地址">
                <el-input
                  v-model="props.row.url"
                  clearable
                  placeholder="取值地址"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-form-item label="取数方式">
                <el-select
                  v-model="props.row.method"
                  clearable
                  placeholder=""
                  style="width: 300px"
                >
                  <el-option label="GET" value="get"></el-option>
                  <el-option label="POST" value="post"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下拉选项">
                <i
                  class="el-icon-circle-plus"
                  style="font-size: 25px; cursor: pointer; color: #1890ff"
                  @click="add_options_item_handle(props.row)"
                ></i>
                <el-row
                  v-for="(optionsitem, idx) in props.row.options"
                  :key="idx"
                >
                  <el-col :span="24">
                    <span
                      >显示值：<el-input
                        v-model="props.row.options[idx].label"
                        style="width: 150px"
                        placeholder=""
                      ></el-input>
                      值：<el-input
                        v-model="props.row.options[idx].value"
                        placeholder=""
                        style="width: 150px"
                      ></el-input>
                      <i
                        class="el-icon-remove"
                        style="font-size: 25px; cursor: pointer; color: #1890ff"
                        @click="remove_options_item_handle(props.row, idx)"
                      ></i>
                    </span>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="关联行数据源">
                <el-input
                  v-model="props.row.relation"
                  clearable
                  placeholder="行数据字段名称"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否隐藏选项值">
                <el-switch v-model="props.row.hideoptionval"></el-switch>
              </el-form-item>
            </template>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="字段类型" prop="coltype" width="100">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.coltype"
            placeholder=""
            @change="(val) => coltype_change_handle(scope.row, val)"
          >
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
      <el-table-column label="字段标题" prop="label">
        <template slot-scope="scope">
          <el-input v-model="scope.row.label" placeholder=""></el-input>
        </template>
      </el-table-column>
      <el-table-column label="字段名称" prop="prop">
        <template slot-scope="scope">
          <el-input v-model="scope.row.prop" placeholder=""></el-input>
        </template>
      </el-table-column>
      <el-table-column label="数据库字段" prop="dbprop">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.dbprop"
            placeholder="字段名称和数据库不一致时需填该字段"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="width"
        label="列宽"
        width="80"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.width"
            placeholder="不填自动分配宽度"
          ></el-input>
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
        header-align="center"
        align="center"
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="remove_pagefield_item(scope.$index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { deepClone } from "@/utils/index";
export default {
  name: "FieldInfoComponent",
  props: {
    menuid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tablename: "",
      list: [],
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
      ],
      form: {
        coltype: "",
        label: "",
        prop: "",
        dbprop: "",
        headeralign: "center",
        align: "center",
        sortable: true,
        overflowtooltip: true,
        options: [],
        hideoptionval: true,
        suggest: false,
        suggest_fn_name: "",
        select_fn_name: "",
        relation: "",
        method: "get",
        url: "",
      },
    };
  },
  methods: {
    add_field_info_handle() {
      let item = deepClone(this.form);
      this.list.push(item);
    },
    remove_pagefield_item(index) {
      this.list.splice(index, 1);
    },
    //过滤数据库表名
    fetchSuggestions(key, cb) {
      ApiFn.requestapi("get", "/dbinfo/tables", { key: key }).then((res) => {
        if (res.code === 1) {
          cb(
            res.list.map((i) => {
              return {
                label: i.COMMENTS,
                value: i.TABLE_NAME,
              };
            })
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //表名选择事件
    tablename_handleSelect(item) {
      if (item.value) {
        ApiFn.requestapi("get", "/dbinfo/tablecolinfo", {
          table: item.value,
        }).then((res) => {
          if (res.code === 1) {
            this.list = res.list.map((i) => {
              if (i.coltype === "string") {
                i.suggest = false;
                i.suggest_fn_name = "";
                i.select_fn_name = "";
              }
              if (i.coltype === "list") {
                i.relation = "";
                i.method = "get";
                i.url = "";
                i.options = [];
                i.hideoptionval = true;
              }
              return i;
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    coltype_change_handle(row, val) {
      if (val === "list") {
        this.$set(row, "relation", "");
        this.$set(row, "method", "get");
        this.$set(row, "url", "");
        this.$set(row, "hideoptionval", true);
        this.$set(row, "options", []);
      } else if (val === "string") {
        this.$set(row, "suggest", false);
        this.$set(row, "suggest_fn_name", "");
        this.$set(row, "select_fn_name", "");
      }
    },
    add_options_item_handle(row) {
      row.options.push({ label: "", value: "" });
    },
    remove_options_item_handle(row, idx) {
      row.options.splice(idx, 1);
    },
    get_list_data(){
      return this.list;
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>