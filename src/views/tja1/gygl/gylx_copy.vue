<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-input
        v-model="form.jxno"
        placeholder="机型编号"
        style="width: 200px; margin-right: 5px"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="btn_gylx_query_handle"
        >查询</el-button
      >
      <el-button type="success" icon="el-icon-plus" @click="btn_gylx_add_handle"
        >增加</el-button
      >
      <el-button
        type="warning"
        icon="el-icon-close"
        @click="btn_gylx_del_handle"
        >删除</el-button
      >
      <el-button
        type="danger"
        icon="el-icon-check"
        @click="btn_gylx_copy_handle"
        >保存</el-button
      >
    </el-form>
    <el-table
      :data="list"
      header-cell-class-name="tb_header_bg"
      border
      @selection-change="datacopy_handleSelectionChange"
      style="width: 100%; margin-top: 5px"
    >
      <el-table-column header-align="center" align="center" type="selection">
      </el-table-column>
      <el-table-column
        prop="jxno"
        label="机型"
        align="center"
        header-align="center"
        sortable
        width="150"
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.jxno"
            clearable
            placeholder="机型编号"
            @change="jxno_change_handle"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusno"
        label="状态"
        align="center"
        header-align="center"
        sortable
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.statusno"
            clearable
            placeholder="任一行输入状态编号将填充整列"
            @change="ztbm_change_handle"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="gwh"
        label="岗位编码"
        align="center"
        header-align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.gwh"
            clearable
            placeholder="岗位编码"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="zpsx"
        label="装配顺序"
        align="center"
        header-align="center"
        width="130"
        sortable
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.zpsx"
            :min="0"
            :step="10"
            style="width: 100px"
            placeholder="装配顺序"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="mj"
        label="是否免检"
        align="center"
        header-align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.mj">
            <el-option
              v-for="(item, idx) in [
                { label: '每件', value: 'N' },
                { label: '首件', value: 'S' },
                { label: '免检', value: 'Y' },
              ]"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="fsbz"
        label="互锁标志"
        align="center"
        header-align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.fsbz"
            active-value="Y"
            inactive-value="N"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="sfzp"
        label="是否装配"
        align="center"
        header-align="center"
        width="100"
        sortable
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.sfzp"
            active-value="Y"
            inactive-value="N"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { deepClone, newGuid } from "@/utils/index";
import condition from "@/mixin/search_form";
import ApiFn from "@/api/baseapi";
export default {
  name: "A1gylxcopyComponent",
  data() {
    return {
      list: [],
      datacopySelection: [],
      form: {
        jxno: "",
        ztbm: "",
        statusno: "",
      },
    };
  },
  methods: {
    btn_gylx_query_handle() {
      try {
        let search = {
          search_condition: [],
          px_condition: [],
          pageindex: 1,
          pagesize: 65535,
        };
        let exp = deepClone(condition.form);
        exp.colname = "jx_no";
        exp.coltype = "string";
        exp.oper = "=";
        exp.value = this.form.jxno;
        exp.values = [];
        search.search_condition.push(exp);
        ApiFn.requestapi("post", "/a1/gylx/list", search).then((res) => {
          if (res.code === 1) {
            this.list = res.list.map((i) => {
              i.rowkey = newGuid();
              return i;
            });
          } else {
            this.$message.error(res.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    btn_gylx_copy_handle() {
      try {
        if (this.list.length > 0) {
          ApiFn.requestapi("post", "/a1/gylx/copy", this.list).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.warning("无数据需要保存");
        }
      } catch (error) {
        this.$message.error("无数据需要保存");
      }
    },
    btn_gylx_add_handle() {
      this.list.unshift({
        rowkey: newGuid(),
        jxno: "",
        statusno: "",
        gwh: "",
        zpsx: "",
        mj: "Y",
        fsbz: "Y",
        sfzp: "Y",
      });
    },
    btn_gylx_del_handle() {
      if (this.datacopySelection.length > 0) {
        this.datacopySelection.forEach((i) => {
          let pos = this.list.findIndex((j) => j.rowkey === i.rowkey);
          if (pos !== -1) {
            this.list.splice(pos, 1);
          }
        });
      } else {
        this.$message.warning("请选择删除项");
      }
    },
    datacopy_handleSelectionChange(val) {
      this.datacopySelection = val;
    },
    jxno_change_handle(val){
        this.list.forEach((i) => {
        i.jxno = val;
      });
    },
    ztbm_change_handle(val) {
      this.list.forEach((i) => {
        i.statusno = val;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>