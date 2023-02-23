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
        header-align="center"
        align="center"
        prop="jth"
        label="机台号"
        show-overflow-tooltip
        width="150"
      >
        <template slot-scope="scope">
          <template v-if="!isread">
            <!-- <el-input
              v-model="scope.row.jth"
              clearable
              placeholder="请输入机台号"
            ></el-input> -->
            <el-select v-model="scope.row.jth" clearable filterable placeholder="请选择机台号">
              <el-option
                v-for="(item, idx) in jthoptions"
                :key="idx"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
          <template v-else>
            {{ scope.row.vin }}
          </template>
        </template>
      </el-table-column>
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
              ref="gfmx_vin_txt"
              @keyup.enter.native="vin_keyup_handle"
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
import ApiFn from "@/api/baseapi";
import { deepClone } from "@/utils/index";
export default {
  name: "GfmxFormComponent",
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
        jth: "",
        vin: "",
        yx: "",
      },
      jthoptions: [],
    };
  },
  mounted() {
    this.get_jth();
  },
  methods: {
    get_jth() {
      ApiFn.requestapi("post", "/cdgc/sbgl/list", {
        pageindex: 1,
        pagesize: 65535,
      }).then((res) => {
        if (res.code === 1) {
          this.jthoptions = res.list.map((i) => {
            return { label: i.sbbh, value: i.sbzbh };
          });
        }
      });
    },
    init() {
      if (this.datalist.length > 0) {
        this.list = deepClone(this.datalist);
      } else {
        var row = deepClone(this.form);
        this.list.push(row);
      }
    },
    vin_keyup_handle() {
      this.add_item_handle();
      this.$nextTick(() => {
        this.$refs.gfmx_vin_txt;
      });
    },
    get_gfdata() {
      return this.list;
    },
    empty_gfdata() {
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