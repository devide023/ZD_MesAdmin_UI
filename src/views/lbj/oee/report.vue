<template>
  <div>
    <div class="search_bar">
      <el-select
        v-model="form.scx"
        placeholder="请选择生产线"
        filterable
        clearable
        style="margin-right: 10px"
        @change="get_scxzx_list"
      >
        <el-option
          v-for="(item, idx) in scxlist"
          :key="idx"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select
        v-model="form.scxzx"
        filterable
        clearable
        placeholder="请选择生产线子线"
        style="margin-right: 10px"
      >
        <el-option
          v-for="(item, idx) in scxzxlist"
          :key="idx"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="query_oee_report_handle"
        >查询</el-button
      >
    </div>
    <iframe
      ref="oee_report"
      :src="oee_report_url"
      :width="width"
      :height="height"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
    ></iframe>
  </div>
</template>

<script>
import FnApi from "@/api/baseapi";
export default {
  name: "LbjOeeReport",
  data() {
    return {
      form: {
        scx: "",
        scxzx: "",
      },
      width: "1688",
      height: "800",
      oee_base_report_url:
        "http://172.16.201.166/decision/view/form?viewlet=lbj%252Flbjjjmes%252FJJMES_OEE.frm",
      oee_report_url: "",
      scxlist: [],
      scxzxlist: [],
    };
  },
  beforeMount() {
    window.addEventListener("resize", this.init);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.init);
  },
  mounted() {
    this.init();
    this.get_scx_list();
  },
  methods: {
    init() {
      this.width = document.getElementsByClassName("search_bar")[0].offsetWidth;
      let bodyheight = document.body.offsetHeight;
      this.height = bodyheight - 127;
    },
    get_scx_list() {
      FnApi.requestapi("get", "/lbj/baseinfo/scx?gcdm=9902", {}).then((res) => {
        if (res.code === 1) {
          this.scxlist = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    get_scxzx_list() {
      this.form.scxzx = "";
      FnApi.requestapi("get", "/lbj/baseinfo/getscxzx", {
        scx: this.form.scx,
      }).then((res) => {
        if (res.code === 1) {
          this.scxzxlist = res.list.map((i) => {
            return { label: i.scxzxmc, value: i.scxzx };
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    query_oee_report_handle() {
      this.oee_report_url = "";
      this.oee_report_url =
        this.oee_base_report_url +
        "&scx=" +
        this.form.scx +
        "&scxzx=" +
        this.form.scxzx;
      this.$refs.oee_report.contentWindow.location.reload(true);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>