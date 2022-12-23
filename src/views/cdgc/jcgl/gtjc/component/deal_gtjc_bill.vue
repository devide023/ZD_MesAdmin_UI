<template>
  <div>
    <!-- 处理缸体检测 -->
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      label-position="right"
    >
      <el-form-item label="日期：">
        {{ form.rq | parseTime("{y}-{m}-{d}") }} {{ form.bc }}
      </el-form-item>
      <el-form-item label="VIN：">
        {{ form.vin }}
      </el-form-item>
      <el-form-item label="机台号：">
        {{ form.jth }}
      </el-form-item>
      <el-form-item label="产品类型：">
        {{ form.cplx }}
      </el-form-item>
      <el-form-item label="图号：">
        {{ form.th }}
      </el-form-item>
      <el-form-item label="模次：">
        {{ form.mh }}
      </el-form-item>
      <el-form-item label="检验类别：">
        {{ form.jylb }}
      </el-form-item>
      <el-form-item label="检验员：">
        {{ form.jyry }}
      </el-form-item>
      <el-form-item label="判定结果">
        {{ form.pdjg }}
      </el-form-item>
      <el-form-item label="处理结论">
        <el-input type="textarea" v-model="form.cljl"></el-input>
      </el-form-item>
      <el-form-item>
        <div style="margin: 20px">
          <el-button
            type="primary"
            icon="el-icon-check"
            @click="save_deal_handle"
            >确定</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import store from '@/store/index';
import ApiFn from "@/api/baseapi";
import { deepClone } from "@/utils/index";
export default {
  name: "Deal_Gtjc_Bill",
  props: {
    rowobj: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      form: {},
    };
  },
  mounted() {
    this.form = deepClone(this.rowobj);
  },
  methods: {
    save_deal_handle() {
      this.form.clr = store.getters.userinfo.name;
      ApiFn.requestapi("post", "/cdgc/gtjc/checkdata/deal_gtjc", this.form).then(
        (res) => {
          if (res.code === 1) {
            this.$basepage.dialogVisible = false;
            this.$basepage.getlist(this.$basepage.queryform);
          }else{
            this.$message.error(res.msg);
          }
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>