<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-dropdown trigger="click" style="margin-left: 10px">
      <el-button>批量操作</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <el-upload
            :action="action"
            :headers="headers"
            :multiple="false"
            :show-file-list="false"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :before-upload="before_upload_xls_handle"
            :on-success="add_upload_success"
          >
            <el-button type="text">新增导入</el-button>
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-upload
            :action="action"
            :headers="headers"
            :multiple="false"
            :show-file-list="false"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :before-upload="before_upload_xls_handle"
            :on-success="replace_upload_success"
          >
            <el-button type="text">替换导入</el-button>
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-upload
            :action="action"
            :headers="headers"
            :multiple="false"
            :show-file-list="false"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :before-upload="before_upload_xls_handle"
            :on-success="zh_upload_success"
          >
            <el-button type="text">综合导入</el-button>
          </el-upload>
        </el-dropdown-item>
        <el-dropdown-item>
          <el-button type="text" @click.prevent.native="export_excel_handle"
            >导出Excel</el-button
          >
        </el-dropdown-item>
        <!-- <el-dropdown-item>
          <el-button type="text" @click.native.prevent="visiable = true"
            >复制数据</el-button
          >
        </el-dropdown-item> -->
        <slot name="other"></slot>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  name: "BatOperateComponent",
  components: {},
  props: {
    add_import_success_handle: {
      type: Function,
      require: true,
    },
    replace_import_success_handle: {
      type: Function,
      require: true,
    },
    zh_import_success_handle: {
      type: Function,
      require: true,
    },
    export_excel_handle: {
      type: Function,
      require: true,
    },
  },
  data() {
    return {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      action: window.winconfig.production.VUE_APP_BASE_API + "/upload/xls",
    };
  },
  methods: {
    before_upload_xls_handle(file) {
      const isxls = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].indexOf(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (isxls < 0) {
        this.$message.error("上传文件只能是 xls|xlsx 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      let isok = isxls >= 0 && isLt5M;
      if (isok) {
        this.$loading({
          lock: true,
          text: "正在上传文件",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
      return isok;
    },
    add_upload_success(res, file, fileList) {
      try {
        this.$loading().close();
        if (res.code === 1) {
          this.$loading({
            lock: true,
            text: "正在读取文件",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.add_import_success_handle(res, file, fileList);
        } else if (res.code === 0) {
          this.$message.error(res.msg);
          this.$loading().close();
        }
      } catch (error) {
        this.$message.error(error);
        this.$loading().close();
      }
    },
    replace_upload_success(res, file, fileList) {
      try {
        this.$loading().close();
        if (res.code === 1) {
          this.$loading({
            lock: true,
            text: "正在读取文件",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.replace_import_success_handle(res, file, fileList);
        } else if (res.code === 0) {
          this.$message.error(res.msg);
          this.$loading().close();
        }
      } catch (error) {
        this.$message.error(error);
        this.$loading().close();
      }
    },
    zh_upload_success(res, file, fileList) {
      try {
        this.$loading().close();
        if (res.code === 1) {
          this.$loading({
            lock: true,
            text: "正在读取文件",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.zh_import_success_handle(res, file, fileList);
        } else if (res.code === 0) {
          this.$message.error(res.msg);
          this.$loading().close();
        }
      } catch (error) {
        this.$message.error(error);
        this.$loading().close();
      }
    },
  },
};
</script>