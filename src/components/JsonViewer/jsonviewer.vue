<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="showdialog"
      top="10px"
      width="40%"
    >
      <div>
        <json-viewer
          :value="jsonData"
          :expand-depth="5"
          copyable
          boxed
          sort
          :expanded="true"
        ></json-viewer>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";
export default {
  name: "JsonViewerDialogComponent",
  components: {
    JsonViewer,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    jsonviewerVisible: {
      type: Boolean,
      default: false,
    },
    jsonData:{
        type:Object,
        require:true
    }
  },
  computed: {
    showdialog: {
      get() {
        return this.jsonviewerVisible;
      },
      set(val) {
        this.$emit("update:jsonviewerVisible", val);
      },
    },
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
</style>