<template>
  <div>
    <!-- 看护岗位信息 -->
    <el-table :data="list" border stripe style="width: 100%">
      <el-table-column
        prop="scx"
        label="生产线"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gwh"
        label="看护岗位编号"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      
      <el-table-column
        prop="gwmc"
        label="看护岗位名称"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gwlx"
        label="岗位类型"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gwfl"
        label="岗位分类"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="gzty"
        label="故障停用"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="iszdhg"
        label="自动合格"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="jbfdj"
        label="解绑产品"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ishcjy"
        label="是否换产校验"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="bz"
        label="备注"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "DucarKhgwComponent",
  props: {
    row: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.get_khgw_list();
  },
  methods: {
    get_khgw_list() {
      ApiFn.requestapi("post", "/ducar/gwzd/get_khgw", {
        scx: this.row.scx,
        gwh: this.row.gwh,
      }).then((res) => {
        if (res.code === 1) {
          this.list = res.list;
        }else{
            this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>