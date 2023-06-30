<template>
  <div>
    <el-table
      :data="datalist"
      border
      ref="maintable"
      header-cell-class-name="tb_header_bg"
      style="width: 100%"
      :height="tableheight"
    >
      <el-table-column v-if="childfields.length > 0" type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.children"
            border
            header-cell-class-name="tb_header_bg"
            style="width: 100%"
          >
            <el-table-column
              v-for="(childfield, fieldidx) in childfields"
              :key="fieldidx"
              :prop="childfield.prop"
              :label="childfield.label"
              :align="childfield.align"
              :header-align="childfield.headeralign"
              :width="childfield.width"
            >
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(field, idx) in fields"
        :key="idx"
        :prop="field.prop"
        :label="field.label"
        :align="field.align"
        :header-align="field.headeralign"
        :width="field.width"
        :sortable="field.sortable"
        :show-overflow-tooltip="field.overflowtooltip"
      >
      <template slot-scope="scope">
        <template v-if="field.coltype==='datetime'">
          {{scope.row[field.prop] | parseTime("{y}-{m}-{d} {h}:{i}:{s}")}}
        </template>
        <template v-else-if="field.coltype==='date'">
          {{scope.row[field.prop] | parseTime("{y}-{m}-{d}")}}
        </template>
        <template v-else>
          {{scope.row[field.prop]}}
        </template>
      </template>
      </el-table-column>
      <el-table-column
        v-if="operatelist.length > 0"
        header-align="center"
        align="center"
        width="50"
        label="操作"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(btn, idx) in operatelist"
            :key="idx"
            type="text"
            @click.native="execfun(scope.row, btn.fnname)"
            >{{ btn.label }}</el-button
          ></template
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "DataDetailComponent",
  props: {
    fields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    childfields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    datalist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    operatelist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    vm:{
      typeof:Object,
      default:function(){
        return {};
      }
    }
  },
  data() {
    return {
      tableheight: 800,
    };
  },
  activated () {
    this.$refs.maintable.doLayout();
  },
  mounted() {
    this.$nextTick(function () {
      this.sizechangeHandle();
    });
  },
  beforeMount() {
    window.addEventListener("resize", this.sizechangeHandle);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.sizechangeHandle);
  },
  methods: {
    sizechangeHandle() {
      let bodyheight = document.body.offsetHeight;
      this.tableheight = bodyheight - 155;
    },
    execfun(row, fnname) {
      this.vm[fnname](row);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>