<template>
  <div>
    <div class="search_bar">
      <el-select
        v-model="field"
        clearable
        filterable
        placeholder="请选择字段"
        style="width: 150px; margin-right: 5px"
        @change="field_change_handle"
      >
        <el-option
          v-for="(item, index) in colshowlist"
          :key="index"
          :label="item.label"
          :value="item.dbprop?item.dbprop:prop"
        >
        </el-option>
      </el-select>
      <el-input
        v-if="fieldtype === 'string'"
        v-model.trim="value"
        placeholder="请输入查询值"
        clearable
        style="width: 150px; margin-right: 5px"
      ></el-input>
      <el-select
        v-if="fieldtype === 'list'"
        v-model="values"
        placeholder=""
        clearable
        multiple
        filterable
        collapse-tags
        style="width: 200px; margin-right: 5px"
      >
        <el-option
          v-for="(item, index) in options"
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
        v-if="fieldtype === 'date'"
        v-model="values"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 230px; margin-right: 5px"
      >
      </el-date-picker>
      <el-date-picker
        v-if="fieldtype === 'datetime'"
        v-model="values"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 340px; margin-right: 5px"
      >
      </el-date-picker>
      <el-switch
        v-if="fieldtype === 'bool'"
        v-model="value"
        active-value="Y"
        inactive-value="N"
        style="margin-right: 5px"
      >
      </el-switch>
      <el-input-number
        v-if="fieldtype === 'int'"
        v-model="value"
        style="margin-right: 5px"
      ></el-input-number>
      <el-button type="primary" icon="el-icon-search" @click="btn_search_handle"
        >查询</el-button
      >
      <slot name="other"></slot>
      <el-button type="text" v-if="isgrade" @click="visiable = true"
        >高级查询</el-button
      >
    </div>

    <com-query :collist="colshowlist" :isshow.sync="visiable" @query="gradequeryHandle"></com-query>

  </div>
</template>

<script>
import { parseTime } from "@/utils";
import ComQuery from '@/components/QueryBar/ComQuery.vue';
export default {
  components: { ComQuery },
  name: "SearchBar",
  data() {
    return {
      field: "",
      value: "",
      czf: "like",
      values: [],
      options: [],
      fieldtype: "string",
      visiable: false,
    };
  },
  props: {
    collist: {
      type: Array,
      default: function () {
        return [];
      },
      require: true,
    },
    isgrade: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    colshowlist() {
      let showlist = this.collist.filter((i) => {
        return !i.type
      });
      return showlist;
    },
  },
  methods: {
    field_change_handle(val) {
      let finditem = this.collist.filter((item) => {
        return item.prop === val;
      });
      if (finditem.length > 0) {
        let fieldtype = finditem[0].coltype;
        this.fieldtype = fieldtype;
        switch (fieldtype) {
          case "string":
            this.value = "";
            this.czf = "like";
            this.values = [];
            this.options = [];
            break;
          case "date":
          case "datetime":
            this.value = "";
            this.czf = "between";
            this.values[0] = parseTime(new Date());
            this.values[1] = parseTime(new Date());
            this.options = [];
            break;
          case "list":
            this.value = "";
            this.czf = "in";
            this.values = [];
            this.options = finditem[0].options;
            break;
          case "bool":
            this.value = "N";
            this.czf = "=";
            this.values = [];
            this.options = [];
            break;
          default:
            this.value = "";
            this.czf = "like";
            this.values = [];
            this.options = [];
            break;
        }
      } else {
        this.fieldtype = "string";
      }
    },
    btn_search_handle() {
      let retdata = {};
      switch (this.fieldtype) {
        case "string":
        case "bool":
          retdata = {
            field: this.field,
            operate: this.czf,
            fieldtype: this.fieldtype,
            value: this.value,
          };
          break;
        case "date":
        case "datetime":
        case "list":
          retdata = {
            field: this.field,
            operate: this.czf,
            fieldtype: this.fieldtype,
            values: this.values,
          };
          break;
        default:
          break;
      }
      this.$emit("query", retdata);
    },
    gradequeryHandle(data){
        console.log(data);
        this.$emit("gradequery",data);
    }
  },
};
</script>

<style lang="scss">
</style>