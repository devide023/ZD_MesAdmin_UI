<template>
  <div>
    <el-dropdown>
      <span class="el-dropdown-link">
        <i class="el-icon-setting" style="font-size: 16px" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in operlist"
          :key="index"
          @click.native="execfun(item.fun)"
          >{{ item.label }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "OperateColumnComponent",
  data() {
    return {};
  },
  props: {
    rowobj: {
      type: Object,
      require: true,
      default: function () {
        return {};
      },
    },
    operlist: {
      type: Array,
      require: true,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    execfun(fnname) {
      //this[fnname](this.datasource,this.rowobj);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>