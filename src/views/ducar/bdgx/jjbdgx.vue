<template>
  <div>
    <el-form
      ref="form_jjbdgx"
      :model="form"
      label-width="80px"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="机号" prop="vin">
        <el-input v-model="form.vin"></el-input>
      </el-form-item>
      <el-form-item label="夹具号" prop="jjh">
        <el-input v-model="form.jjh"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="24" style="text-align: right">
          <el-button
            type="primary"
            icon="el-icon-check"
            @click="vin_jj_bind_handle"
            >绑定</el-button
          >
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "DucarBdgxComponent",
  data() {
    return {
      form: {
        jjh: "",
        vin: "",
      },
      rules: {
        jjh: [
          {
            required: true,
            message: "夹具号不能为空",
            trigger: "change",
          },
        ],
        vin: [
          {
            required: true,
            message: "机号不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    vin_jj_bind_handle() {
      this.$refs.form_jjbdgx.validate((v) => {
        if (v) {
          ApiFn.requestapi("post", "/ducar/jjgx/bind", this.form).then(
            (res) => {
              if (res.code === 1) {
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
            }
          );
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>