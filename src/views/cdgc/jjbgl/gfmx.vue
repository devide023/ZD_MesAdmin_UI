<template>
  <div>
    <el-table
      :data="list"
      border
      stripe
      header-cell-class-name="tb_header_bg"
      style="width: 100%"
    >
      <el-table-column
        prop="vin"
        label="件号"
        align="center"
        header-align="center"
        show-overflow-tooltip
        width="200"
      >
        <template slot-scope="scope">
          <template v-if="!isread">
            <el-input
              v-model="scope.row.vin"
              clearable
              placeholder="请输入件号"
            ></el-input>
          </template>
          <template v-else>
            {{ scope.row.vin }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="yx"
        label="原因"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <template v-if="!isread">
            <el-input
              v-model="scope.row.yx"
              clearable
              placeholder="请输入原因"
            ></el-input>
          </template>
          <template v-else>
            {{ scope.row.yx }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作"
        width="80"
        v-if="!isread"
      >
        <template slot-scope="scope">
          <template v-if="scope.$index === 0">
            <i
              style="cursor: pointer; font-size: 25px"
              class="el-icon-circle-plus"
              @click="add_item_handle"
            ></i>
          </template>
          <template v-else>
            <i
              style="cursor: pointer; font-size: 25px"
              class="el-icon-remove"
              @click="del_item_handle(scope.$index)"
            ></i>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepClone } from "@/utils/index";
export default {
  name: "GFMX_Form_Component",
  props: {
    datalist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    isread: {
      type: Boolean,
      default: false,
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
      form: {
        vin: "",
        yx: "",
      },
    };
  },
  mounted() {
  },
  methods: {
    init() {
      if (this.datalist.length > 0) {
        this.list = deepClone(this.datalist);
      } else {
        var row = deepClone(this.form);
        this.list.push(row);
      }
    },
    get_gfdata() {
      return this.list;
    },
    empty_gfdata(){
        this.list = [];
    },
    add_item_handle() {
      var row = deepClone(this.form);
      this.list.push(row);
    },
    del_item_handle(idx) {
      this.list.splice(idx, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>