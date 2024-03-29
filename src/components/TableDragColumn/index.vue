<template>
  <div class="w-table" :class="{ 'w-table_moving': dragState.dragging }">
    <el-table
      :data="data"
      :border="option.border"
      :height="option.height"
      :max-height="option.maxHeight"
      :style="{ width: parseInt(option.width) + 'px' }"
      :cell-class-name="cellClassName"
      :header-cell-class-name="headerCellClassName"
    >
      <slot name="fixed"></slot>
      <el-table-column
        v-for="(col, index) in tableHeader"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :type="col.type"
        :header-align="col.headerAlign"
        :column-key="index.toString()"
      >
        <template #header="{ column }">
          <div
            class="thead-cell"
            @mousedown="handleMouseDown($event, column)"
            @mousemove="handleMouseMove($event, column)"
          >
            <span>{{ column.label }}</span>
            <span class="virtual"></span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: this.header,
      dragState: {
        start: -9, // 起始元素的 index
        end: -9, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined, // 拖动方向
      },
    };
  },
  props: {
    data: {
      default: function () {
        return [];
      },
      type: Array,
    },
    header: {
      default: function () {
        return [];
      },
      type: Array,
    },
    option: {
      default: function () {
        return {};
      },
      type: Object,
    },
  },
  methods: {
    headerCellClassName({ column, columnIndex }) {
      let active =
        columnIndex - 1 === this.dragState.end
          ? `darg_active_${this.dragState.direction}`
          : "";
      let start = columnIndex - 1 === this.dragState.start ? `darg_start` : "";
      //console.log(active,start)
      return `${active} ${start}`;
    },
    cellClassName({ column, columnIndex }) {
      return columnIndex - 1 === this.dragState.start ? `darg_start` : "";
    },
    // 按下鼠标开始拖动
    handleMouseDown(e, column) {
      this.dragState.dragging = true;
      this.dragState.start = parseInt(column.columnKey);
      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName("w-table")[0];
      let virtual = document.getElementsByClassName("virtual");
      for (let item of virtual) {
        item.style.height = table.clientHeight - 1 + "px";
        item.style.width = item.parentElement.parentElement.clientWidth + "px";
      }
      document.addEventListener("mouseup", this.handleMouseUp);
    },

    // 鼠标放开结束拖动
    handleMouseUp() {
      this.dragColumn(this.dragState);
      // 初始化拖动状态
      this.dragState = {
        start: -9,
        end: -9,
        dragging: false,
        direction: undefined,
      };
      document.removeEventListener("mouseup", this.handleMouseUp);
    },

    // 拖动中
    handleMouseMove(e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey); // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction =
            index - this.dragState.start < 0 ? "left" : "right"; // 判断拖动方向
          this.dragState.end = parseInt(column.columnKey);
        } else {
          this.dragState.direction = undefined;
        }
      } else {
        return false;
      }
    },

    // 拖动易位
    dragColumn({ start, end, direction }) {
      let tempData = [];
      let left = direction === "left";
      let min = left ? end : start - 1;
      let max = left ? start + 1 : end;
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start]);
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[left ? i - 1 : i + 1]);
        } else {
          tempData.push(this.tableHeader[i]);
        }
      }
      this.tableHeader = tempData;
    },
  },
  watch: {
    header(val, oldVal) {
      this.tableHeader = val;
    },
  },
};
</script>

<style lang="scss">
.w-table {
  .el-table .darg_start {
    background-color: #0fa7e4;
  }
  .el-table th {
    padding: 0;
    .virtual {
      position: fixed;
      display: block;
      width: 0;
      height: 0;
      margin-left: -10px;
      background: none;
      border: none;
    }
    &.darg_active_left {
      .virtual {
        border-left: 2px dotted rgb(255, 0, 0);
        z-index: 99;
      }
    }
    &.darg_active_right {
      .virtual {
        border-right: 2px dotted rgb(255, 0, 0);
        z-index: 99;
      }
    }
  }
  .thead-cell {
    padding: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: left;
    cursor: pointer;
    overflow: initial;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }
  &.w-table_moving {
    .el-table th .thead-cell {
      cursor: move !important;
    }
    .el-table__fixed {
      cursor: not-allowed;
    }
  }
}
