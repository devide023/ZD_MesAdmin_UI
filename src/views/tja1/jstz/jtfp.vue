<template>
  <div style="padding-bottom: 20px">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="岗位编号" prop="gwh">
        <el-select
          v-model="form.gwh"
          clearable
          multiple
          filterable
          placeholder="请选择岗位"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) in gwhlist"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机型编码" prop="jxno">
        <el-select
          v-model="form.jxno"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
          placeholder="名称或编码过滤机型编码"
          style="width: 100%"
          @change="select_jxno_handle"
        >
          <el-option
            v-for="(item, idx) in jxnolist"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态编码" prop="statusno">
        <el-select
          v-model="form.statusno"
          clearable
          multiple
          filterable
          placeholder="请选择状态编码"
          style="width: 100%"
        >
          <el-option
            v-for="(item, idx) in statusnolist"
            :key="idx"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.bz"></el-input>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" icon="el-icon-circle-check" @click="save_jtfp_handle"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "A1JtfpComponent",
  props: {
    row: {
      type: Object,
      default: function () {
        return {};
      },
    }
  },
  data() {
    return {
      gwhlist: [],
      jxnolist: [],
      statusnolist: [],
      form: {
        jtid: "",
        gwh: [],
        jxno: "",
        statusno: [],
        bz: "",
      },
      rules: {
        gwh: [
          {
            required: true,
            message: "岗位编码不能为空",
            trigger: "change",
          },
        ],
        jxno: [
          {
            required: true,
            message: "机型编码不能为空",
            trigger: "change",
          },
        ],
        statusno: [
          {
            required: true,
            message: "状态编码不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.form.jtid = this.row.jcbh;
    this.get_gwlist();
  },
  methods: {
    get_gwlist() {
      ApiFn.requestapi("get", "/a1/baseinfo/gwzd", {}).then((res) => {
        if (res.code === 1) {
          this.gwhlist = res.list;
        }
      });
    },
    remoteMethod(query) {
      if (query) {
        ApiFn.requestapi("get", "/a1/baseinfo/jxno_by_code", {
          key: query,
        }).then((res) => {
          if (res.code === 1) {
            this.jxnolist = res.list;
          }
        });
      }
    },
    select_jxno_handle(item) {
      ApiFn.requestapi("get", "/a1/baseinfo/ztbm_by_jxno", {
        jxno: item,
      }).then((res) => {
        if (res.code === 1) {
          this.statusnolist = res.list;
        }
      });
    },
    save_jtfp_handle() {
      try {
        this.$refs.form.validate((v) => {
          if (v) {
            ApiFn.requestapi("post", "/a1/jtfp/distribute", this.form).then(
              (res) => {
                if (res.code === 1) {
                  this.$message.success(res.msg);
                  this.$basepage.dialogVisible = false;
                  this.$basepage.getlist(this.$basepage.queryform);
                } else {
                  this.$message.error(res.msg);
                }
              }
            );
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>