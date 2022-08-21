<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="当前班次">
        <gtjjbform
          :isread="false"
          @rq_change="rq_change_handel"
          @gtjjb_data="deal_gtjjb_data_handle"
          @bc_change="rq_change_handel"
        ></gtjjbform>
      </el-tab-pane>
      <el-tab-pane label="上一班次">
        <gtjjbform
          ref="gtjjb_sybc_com"
          :isread="true"
          :calcrq="sybc_rq"
          :calcbc="sybc_bc"
        ></gtjjbform>
      </el-tab-pane>
      <el-tab-pane label="上上班次">
        <gtjjbform
          ref="gtjjb_ssbc_com"
          :isread="true"
          :calcrq="ssbc_rq"
          :calcbc="ssbc_bc"
        ></gtjjbform>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import GtjjbForm from "./component/gtjjb.vue";
import { parseTime } from "@/utils";
export default {
  name: "GtjjbComponent",
  components: {
    gtjjbform: GtjjbForm,
  },
  data() {
    return {
      sybc_rq: "", //上一班次日期
      ssbc_rq: "", //上上班次时期
      sybc_bc: "",
      ssbc_bc: "",
      list: [],
    };
  },
  methods: {
    rq_change_handel(v) {
      if (v.rq && v.bc) {
        ApiFn.requestapi("get", "/cdgc/gtjjb/get_rq_bc", v).then((res) => {
          if (res.code === 1) {
            console.log(res);
            this.sybc_rq = res.bcinfo.sybc_rq;
            this.sybc_bc = res.bcinfo.sybc;
            this.ssbc_rq = res.bcinfo.ssbc_rq;
            this.ssbc_bc = res.bcinfo.ssbc;
            this.$refs.gtjjb_sybc_com.load_bc_data(res.bcinfo.sybc_rq,res.bcinfo.sybc);
            this.$refs.gtjjb_ssbc_com.load_bc_data(res.bcinfo.ssbc_rq,res.bcinfo.ssbc);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    deal_gtjjb_data_handle(data) {
      let postdata = {
        id: 0,
        rq: data.rq,
        bc: data.bc,
        jbr: data.jbr,
        dbzz: data.dbzz,
        slry: data.slgw,
        mcry: data.mcgw,
        jyry: data.jygw,
        zlqk: data.zlqk,
        sbqk: data.sbqk,
        qtqk: data.qtqk,
        lrr: this.$store.getters.name,
        lrsj: parseTime(new Date()),
        mxlist: [],
      };
      data.scdata.forEach((i) => {
        postdata.mxlist.push({
          id: 0,
          billid: 0,
          cpmc: i.cpmc,
          sbcmpyl: i.up_mpys,
          dbmpsl: i.db_mpsl,
          hcsl: i.hcsl,
          trjgs: i.trjgs,
          gfsl: i.gfs,
          lfsl: i.lfs,
          hgsl: i.hgs,
          dbmpyl: i.dbmpys,
        });
      });
      ApiFn.requestapi("post", "/cdgc/gtjjb/save_gtjjb", postdata).then(
        (res) => {
          if (res.code === 1) {
            this.$message.success(res.msg);
          } else {
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