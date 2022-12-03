<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-dropdown trigger="click" style="margin-left: 10px">
      <el-button>批量操作</el-button>
      <el-dropdown-menu slot="dropdown">
        <template v-if="IsBatAdd">
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
        </template>
        <template v-if="IsBatReplace">
          <el-dropdown-item>
            <el-upload
              ref="ref_upload_replace"
              :action="action"
              :headers="headers"
              :multiple="false"
              :show-file-list="false"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :before-upload="before_upload_xls_handle"
              :on-success="replace_upload_success"
              style="display: none"
            >
              <!-- <el-button type="text">替换导入</el-button> -->
            </el-upload>
            <el-button type="text" @click="replace_tip_handle"
              >替换导入</el-button
            >
          </el-dropdown-item>
        </template>
        <template v-if="IsBatZh">
          <el-dropdown-item>
            <el-upload
              ref="ref_upload_zh"
              :action="action"
              :headers="headers"
              :multiple="false"
              :show-file-list="false"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :before-upload="before_upload_xls_handle"
              :on-success="zh_upload_success"
              style="display: none"
            >
              <!-- <el-button type="text">综合导入</el-button> -->
            </el-upload>
            <el-button type="text" @click="zh_tip_handle">综合导入</el-button>
          </el-dropdown-item>
        </template>
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
import { GetEnvInfo } from "@/utils/index";
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
      urlinfo: GetEnvInfo(),
      page_bat_permis: [],
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      action: GetEnvInfo().VUE_APP_BASE_API + "/upload/xls",
    };
  },
  mounted() {
    let batpermis = this.$store.getters.batpagepermis;
    let fullpath = this.$router.currentRoute.fullPath;
    let pos = fullpath.indexOf("?");
    if (pos !== -1) {
      fullpath = fullpath.substr(0, pos);
    }
    if (batpermis) {
      let pos = batpermis.findIndex((i) => i.path === fullpath);
      if (pos !== -1) {
        this.page_bat_permis = batpermis[pos].permis;
      }
    }
  },
  computed: {
    IsBatAdd() {
      return this.page_bat_permis.findIndex((i) => i.name === "bat_add") !== -1;
    },
    IsBatReplace() {
      return (
        this.page_bat_permis.findIndex((i) => i.name === "bat_replace") !== -1
      );
    },
    IsBatZh() {
      return this.page_bat_permis.findIndex((i) => i.name === "bat_zh") !== -1;
    },
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
    replace_tip_handle() {
      this.$confirm("替换导入将删除原数据再新增,确定要替换导入?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "el-button--primary",
        confirmButtonClass: "el-button--danger",
        type: "warning",
      })
        .then(() => {
          this.$refs["ref_upload_replace"].$refs["upload-inner"].handleClick();
        })
        .catch((error) => error);
    },
    zh_tip_handle() {
      this.$confirm(
        "存在记录将更新原数据,否则将新增。确定要综合导入?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "el-button--primary",
          confirmButtonClass: "el-button--danger",
          type: "info",
        }
      )
        .then(() => {
          this.$refs["ref_upload_zh"].$refs["upload-inner"].handleClick();
        })
        .catch((error) => error);
    },
  },
};
</script>