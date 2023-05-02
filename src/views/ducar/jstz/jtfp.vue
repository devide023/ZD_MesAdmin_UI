<template>
  <div  style="padding-bottom: 15px">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="right"
     :rules="rules"
    >
      <el-form-item label="生产线">
        {{ get_scxname(row.scx) }}
      </el-form-item>
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
        </el-select> </el-form-item
      ><el-form-item label="产品编码">
        <el-input
          v-model="form.jxno"
          clearable
          placeholder="请输入产品编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态编码">
        <el-input
          v-model="form.statusno"
          clearable
          placeholder="请输入状态编码"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.bz"></el-input>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          @click="save_jtfp_handle"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "DucarjtfpComponent",
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
      gwhlist: [],
      form: {
        scx: "",
        jtid: "",
        gwh: [],
        jxno: "",
        statusno: "",
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
      },
    };
  },
  mounted() {
    this.form.jtid = this.row.jtid;
    this.form.scx = this.row.scx;
    this.get_gwlist();
  },
  methods: {
    get_gwlist() {
      ApiFn.requestapi("get", "/ducar/baseinfo/gwzdbyscx", {
        scx: this.row.scx,
      }).then((res) => {
        if (res.code === 1) {
          this.gwhlist = res.list;
        }
      });
    },
    get_scxname(val) {
      let flist = this.$basepage.pageconfig.fields;
      var pos = flist.findIndex(
        (i) => i.coltype === "list" && i.prop === "scx"
      );
      if (pos !== -1) {
        var idx = flist[pos]["options"].findIndex((t) => t.value === val);
        if (idx !== -1) {
          return flist[pos]["options"][idx]["label"];
        } else {
          return val;
        }
      } else {
        return val;
      }
    },
    save_jtfp_handle() {
      try {
        this.$refs.form.validate((v) => {
          if (v) {
            ApiFn.requestapi("post", "/ducar/jtgl/jtfp", this.form).then(
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