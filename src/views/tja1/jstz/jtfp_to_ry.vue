<template>
  <div style="padding-bottom: 20px">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      label-position="right"
      :rules="rules"
    >
      <el-form-item label="技通编号">
        {{ form.jcbh }}
      </el-form-item>
      <el-form-item label="技通名称">
        {{ form.jcmc }}
      </el-form-item>
      <el-form-item label="生产线">
        <el-select v-model="form.scx" placeholder="请选择生产线" prop="scx">
          <el-option
            v-for="(item, idx) in scxlist"
            :key="idx"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          icon="el-icon-circle-check"
          @click="save_jt_to_scx"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
export default {
  name: "JtToXzComponent",
  data() {
    return {
      scxlist: [],
      form: {
        scx: "1",
        jcbh: "",
        jcmc: "",
      },
      rules: {
        scx: [
          {
            required: true,
            message: "生产线不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  props: {
    row: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    this.get_scx_list();
    this.form.jcbh = this.row.jcbh;
    this.form.jcmc = this.row.jcmc;
  },
  methods: {
    get_scx_list() {
      ApiFn.requestapi("get", "/a1/baseinfo/scx", {}).then((res) => {
        if (res.code === 1) {
          this.scxlist = res.list;
        }
      });
    },
    save_jt_to_scx() {
      this.$refs.form.validate((v) => {
        if (v) {
          ApiFn.requestapi("post", "/a1/jtfp/jstztoscx", this.form).then(
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
    },
  },
};
</script>

<style lang="scss" scoped>
</style>