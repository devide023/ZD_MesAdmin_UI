<template>
  <div>
    <el-table
        :data="mxlist"
        style="width: 100%">
        <el-table-column
            header-align="center"
            align="center"
            prop="scx"
            label="生产线" >
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            prop="jcbh"
            label="技通编号" >
            <template slot-scope="scope">
                <template v-if="scope.row.jstc">
                    {{scope.row.jstc.jcbh}}
                </template>
            </template>
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            prop="jcmc"
            label="技通名称" >
            <template slot-scope="scope">
                <template v-if="scope.row.jstc">
                    {{scope.row.jstc.jcmc}}
                </template>
            </template>
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            prop="gwh"
            label="岗位号" >
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            prop="lrr1"
            label="分配人" >
        </el-table-column>
        <el-table-column
            header-align="center"
            align="center"
            prop="lrsj1"
            label="分配时间" >
            <template slot-scope="scope">
                {{scope.row.lrsj1|parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "JtfpmxComponent",
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
        mxlist: []
    }
  },
  mounted () {
    this.getlist();
  },
  methods: {
    getlist() {
        ApiFn.requestapi("get", "/ducar/jtgl/fpmx", {
        jtid: this.row.jtid,
      }).then((res) => {
        if (res.code === 1) {
          this.mxlist = res.list;
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
</style>