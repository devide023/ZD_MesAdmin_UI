<template>
  <div>
    <el-table
      :data="datalist"
      border
      ref="maintable"
      :height="tableheight"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      :row-key="RowKey"
      header-cell-class-name="tb_header_bg"
      :tree-props="this.treeprops"
    >
      <el-table-column v-if="isselect" type="selection"></el-table-column>
      <el-table-column
        v-for="(col, idx) in collist"
        :key="idx"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :type="col.type"
        :header-align="col.headeralign"
        :align="col.align"
        :column-key="idx.toString()"
        :fixed="col.fixed"
        :sortable="col.sortable"
        :show-overflow-tooltip="col.overflowtooltip"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.isedit">
            <template v-if="col.coltype === 'string' && iscoledit(col.prop)">
              <el-input v-model="scope.row[col.prop]" clearable></el-input>
            </template>
            <template v-else-if="col.coltype === 'list' && iscoledit(col.prop)">
              <el-select
                v-model="scope.row[col.prop]"
                clearable
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, i) in col.listoptions"
                  :key="i"
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
            <template v-else-if="col.coltype === 'bool' && iscoledit(col.prop)">
              <el-switch
                v-model="scope.row[col.prop]"
                :active-value="col.activevalue"
                :inactive-value="col.inactivevalue"
              >
              </el-switch>
            </template>
            <template v-else-if="col.coltype === 'int' && iscoledit(col.prop)">
              <el-input-number
                v-model="scope.row[col.prop]"
                step="1"
              ></el-input-number>
            </template>
            <template v-else-if="col.coltype === 'date' && iscoledit(col.prop)">
              <el-date-picker
                v-model="scope.row[col.prop]"
                type="date"
                value-format="yyyy-MM-dd"
              />
            </template>
            <template
              v-else-if="col.coltype === 'datetime' && iscoledit(col.prop)"
            >
              <el-date-picker
                v-model="scope.row[col.prop]"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
          <template v-else>
            <template v-if="col.coltype === 'datetime'">
              {{ scope.row[col.prop] | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}
            </template>
            <template v-else-if="col.coltype === 'date'">
              {{ scope.row[col.prop] | parseTime("{y}-{m}-{d}") }}
            </template>
            <template v-else-if="col.options && col.istag">
              <el-tag :type="scope.row[col.prop] | showname(col.tagtypes)">{{
                scope.row[col.prop] | showname(col.options)
              }}</el-tag>
            </template>
            <template v-else-if="col.options">
              {{ scope.row[col.prop] | showname(col.options) }}
            </template>
            <template v-else-if="col.isicon">
              <template
                v-if="(scope.row[col.prop] || '').indexOf('el-icon') !== -1"
              >
                <i :class="scope.row[col.prop]"></i>
              </template>
              <template v-else>
                <svg-icon :icon-class="scope.row[col.prop] || ''"
              /></template>
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-if="isoperate"
        header-align="center"
        align="center"
        width="50"
        fixed="right"
        label="操作"
      >
        <template v-slot="scope">
          <slot name="operate" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="resultcount"
      :current-page="pageindex"
      :page-size="pagesize"
      :page-sizes="[20, 50, 100, 200]"
      layout="total, sizes, prev, pager, next"
      background
      style="text-align: right"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>

<script>
import router from "@/router/index";
import { newGuid } from "@/utils/index";
export default {
  data() {
    return {
      tableheight: 800,
    };
  },
  props: {
    datalist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    collist: {
      type: Array,
      default: function () {
        return [];
      },
    },
    multipleSelection: {
      type: Array,
      default: function () {
        return [];
      },
    },
    isselect: {
      type: Boolean,
      default: true,
    },
    isoperate: {
      type: Boolean,
      default: true,
    },
    treeprops: {
      type: Object,
    },
    pageindex: {
      type: Number,
      default: 1,
    },
    pagesize: {
      type: Number,
      default: 20,
    },
    resultcount: {
      type: Number,
      default: 0,
    },
  },
  filters: {
    showname: function (value, options) {
      try {
        if (options) {
          let fitem = options.filter((i) => i.value === value);
          if (fitem) {
            return fitem[0].label;
          } else {
            return "";
          }
        }
      } catch (error) {
        return "";
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
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
    handleSelectionChange(val) {
      this.$emit("update:multipleSelection", val);
    },
    handleCurrentChange(index) {
      this.$emit("update:pageindex", index);
      this.getlist();
    },
    handleSizeChange(value) {
      this.$emit("update:pagesize", value);
      this.getlist();
    },
    sizechangeHandle() {
      let bodyheight = document.body.offsetHeight;
      this.tableheight = bodyheight - 155;
    },
    tableRowClassName({ row, idx }) {
      return "";
    },
    iscoledit(colname) {
      let pos = router.currentRoute.meta.editfields.findIndex((i) => {
        return i === colname;
      });
      return pos !== -1;
    },
    clearSelection() {
      this.$refs.maintable.clearSelection();
    },
    RowKey(row) {
      if (!row.rowkey) {
        row.rowkey = newGuid();
      }
      if (Object.keys(this.treeprops).length > 0) {
        return row.id;
      } else {
        return row.rowkey;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>