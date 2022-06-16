<template>
  <div class="app-container">
    <el-form-item label="请选择用户" prop="member" style="width: 100%">
      <el-input
        style="width: 400%"
        placeholder="选择用户"
        v-model="formInline.member"
        :suffix-icon="showTree ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        @click.native="deptogglePanel($event)"
        size="medium"
        readonly="readonly"
      ></el-input>
      <div v-if="showTree" class="treeDiv" ref="tableList">
        <el-table
          @row-click="handleRegionNodeClick"
          ref="moviesTable"
          :data="memberList"
          border
          :cell-style="getCellStyle"
          :header-cell-style="getHeaderCellStyle"
        >
          <el-table-column
            v-for="(item, index) in Columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-form-item>
    <wTable :data="tableData" :header="tableHeader" :option="tableOption">
    </wTable>
  </div>
</template>

<script>
export default {
  name: "InlineEditTable",
  data() {
    return {
      formInline: {
        member: "",
      },
      memberList: [], // 用户list
      showTree: false,
      selectTableId: "", //  table选中行id
      Columns: [
        {
          prop: "memberName",
          label: "用户名",
        },
        {
          prop: "tel",
          label: "手机号码",
        },
        {
          prop: "code",
          label: "编码",
        },
      ],

      tableOption: {
        border: true,
        maxHeight: 500,
      },
      tableHeader: [
        {
          prop: "name",
          label: "姓名",
          sortable: true,
          sortMethod: this.handleNameSort,
        },
        {
          prop: "province",
          label: "省份",
          minWidth: "120",
        },
        {
          prop: "city",
          label: "市区",
          minWidth: "120",
        },
        {
          prop: "address",
          label: "地区",
          minWidth: "150",
        },
        {
          prop: "zip",
          label: "邮编",
          minWidth: "120",
        },
      ],

      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
    };
  },
   mounted() {
    this.getMemberList();
  },
  components: {
    wTable: () => import("@/components/MyTable/index.vue"),
    DdlTable: () => import("@/components/DropDownTable/index.vue"),
  },
  methods: {
    handleNameSort() {
      console.log("handleNameSort");
    },
    // 用户
    getMemberList() {
      this.$get("/xxx/xxx", { page: 1, rows: 10000 }).then((res) => {
        this.memberList = res.rows;
      });
    },
    // 表格css
    getCellStyle() {
      return "text-align:center; ";
    },
    getHeaderCellStyle() {
      return "background: rgba(9, 37, 56,0.1);text-align:center; background: linear-gradient(to bottom,#ffffff 0,#eeeeee 100%);padding: 4px 5px;";
    },
    // 点击input 阻止冒泡 控制table显示隐藏
    deptogglePanel(event) {
      event || (event = window.event);
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true);
      this.showTree ? this.tableHide() : this.tableShow();
    },
    tableShow() {
      this.showTree = true;
      document.addEventListener("click", this.tableHideList, false);
    },
    tableHide() {
      this.showTree = false;
      document.addEventListener("click", this.tableHideList, false);
    },
    tableHideList(e) {
      if (this.$refs.tableList && !this.$refs.tableList.contains(e.target)) {
        this.tableHide();
      }
    },
    // 点击table节点
    handleRegionNodeClick(data) {
      this.selectTableId = data.id;
      this.formInline.member = data.memberName; // 用户名字
      this.showTree = false;
    },
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
