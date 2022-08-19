<template>
  <div style="font-size: 12px">
    <div class="cdgc_title">电机壳交接班记录</div>
    <table class="cdgc_bill_head">
      <tr>
        <td style="width: 25%">
          日期：<el-date-picker
            v-model="form.rq"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
        <td style="width: 25%">
          班次：<el-select v-model="form.bc" placeholder="请选择班次">
            <el-option label="白班" value="白班"></el-option>
            <el-option label="晚班" value="晚班"></el-option>
          </el-select>
        </td>
        <td style="width: 25%">
          交接人：<el-input
            style="width: 150px"
            v-model="form.jjr"
            placeholder="请输入交接人"
          ></el-input>
        </td>
        <td style="width: 25%">
          后序人员：<el-input
            style="width: 300px"
            v-model="form.hxry"
            placeholder="请输入后序人员"
          ></el-input>
        </td>
      </tr>
    </table>
    <table class="cdgc_table">
      <thead>
        <tr>
          <th>岗位名称</th>
          <th>产品名称</th>
          <th>库存数</th>
          <th>加工数</th>
          <th>工废数</th>
          <th>料废数</th>
          <th>合格数</th>
          <th>库存结余</th>
          <th style="width: 50px; text-align: center">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in form.jjlist" :key="index">
          <td
            v-if="index === 0"
            :rowspan="form.jjlist.length"
            style="text-align: center"
          >
            机加
          </td>
          <td>
            <el-select
              v-model="item.cpmc"
              clearable
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in cplist"
                :key="'cp' + index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.kcs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.jgs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.gfs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.lfs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            {{ item.jgs - item.gfs - item.lfs }}
          </td>
          <td style="text-align: center">{{ item.kcs - item.jgs }}</td>
          <td style="width: 50px; text-align: center">
            <i
              style="cursor: pointer; font-size: 25px"
              v-if="index === 0"
              class="el-icon-circle-plus"
              @click="add_item_handle"
            ></i>
            <i
              style="cursor: pointer; font-size: 25px"
              v-else
              class="el-icon-remove"
              @click="del_item_handle(index)"
            ></i>
          </td>
        </tr>
        <tr>
          <td style="text-align: center" :rowspan="form.hxlist.length + 1">
            后序
          </td>
          <td style="text-align: center"><b>项目</b></td>
          <td style="text-align: center"><b>投入数</b></td>
          <td colspan="2" style="text-align: center"><b>待评审</b></td>
          <td style="text-align: center"><b>工废品</b></td>
          <td style="text-align: center"><b>料废品</b></td>
          <td colspan="2" style="text-align: center"><b>合格品</b></td>
        </tr>
        <tr v-for="(item, index) in form.hxlist" :key="'hx' + index">
          <td style="text-align: center">{{ item.xm }}</td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.trs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td colspan="2" style="text-align: center">
            <el-input-number
              v-model="item.dps"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.gfp"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <el-input-number
              v-model="item.lfp"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td colspan="2" style="text-align: center">
            {{ item.trs - item.dps - item.gfp - item.lfp }}
          </td>
        </tr>
        <tr>
          <td style="text-align: center"><b>质量情况：</b></td>
          <td colspan="8">
            <el-input
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="form.zlqk"
            >
            </el-input>
          </td>
        </tr>
        <tr>
          <td style="text-align: center"><b>设备情况：</b></td>
          <td colspan="8">
            <el-input
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="form.sbqk"
            >
            </el-input>
          </td>
        </tr>
        <tr>
          <td style="text-align: center"><b>其它情况：</b></td>
          <td colspan="8">
            <el-input
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="form.qtqk"
            >
            </el-input>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="cdgc_btn_bar">
      <el-button type="danger" icon="el-icon-check" @click="save_handle"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { deepClone, parseTime } from "@/utils/index";
export default {
  name: "DjkjjbComponent",
  data() {
    return {
      cplist: [],
      list: [],
      form: {
        rq: parseTime(new Date()),
        bc: "",
        jjr: "",
        hxry:'',
        zlqk: "",
        sbqk: "",
        qtqk: "",
        jjlist: [],
        hxlist: [],
      },
      jjitem: {
        cpmc: "",
        kcs: 0,
        jgs: 0,
        gfs: 0,
        lfs: 0,
        hgs: 0,
        kcjy: 0,
      },
      hxitem: {
        xm: "",
        trs: 0,
        dps: 0,
        gfp: 0,
        lfp: 0,
        hgp: 0,
      },
    };
  },
  mounted() {
    this.cplist.push(
      { label: "E115", value: "E115" },
      { label: "E111", value: "E111" }
    );
    let row = deepClone(this.jjitem);
    this.form.jjlist.push(row);
    let row1 = deepClone(this.hxitem);
    row1.xm = "全检";
    this.form.hxlist.push(row1);
    let row2 = deepClone(this.hxitem);
    row2.xm = "旋转清洗、内窥";
    this.form.hxlist.push(row2);
    let row3 = deepClone(this.hxitem);
    row3.xm = "压碗塞、震动清洗";
    this.form.hxlist.push(row3);
    let row4 = deepClone(this.hxitem);
    row4.xm = "捡漏、产品打包";
    this.form.hxlist.push(row4);
  },
  methods: {
    add_item_handle() {
      let row = deepClone(this.jjitem);
      this.form.jjlist.push(row);
    },
    del_item_handle(index) {
      this.form.jjlist.splice(index, 1);
    },
    save_handle() {
      try {
        let postdata = {
          rq: this.form.rq,
          bc: this.form.bc,
          jbr: this.form.jjr,
          hxry:this.form.hxry,
          zlqk: this.form.zlqk,
          sbqk: this.form.sbqk,
          qtqk: this.form.qtqk,
          lrr: this.$store.getters.name,
          lrsj: parseTime(new Date()),
          jjmx: [],
          hxmx:[],
        };
        for (let index = 0; index < this.form.jjlist.length; index++) {
          const ele = this.form.jjlist[index];
          postdata.jjmx.push({
            cpmc:ele.cpmc,
            kcsl:ele.kcs,
            jgsl:ele.jgs,
            gfsl:ele.gfs,
            lfsl:ele.lfs,
            hgsl:ele.hgs,
            kcsysl:ele.kcjy
          });
        }
        for (let index = 0; index < this.form.hxlist.length; index++) {
          const ele = this.form.hxlist[index];
          postdata.hxmx.push({
            xmmc:ele.xm,
            trjgsl:ele.trs,
            dpssl:ele.dps,
            gfsl:ele.gfp,
            lfsl:ele.lfp,
            hgsl:ele.hgp
          });
        }
        ApiFn.requestapi("post", "/cdgc/djkjjb/save_jjb", postdata).then(
          (res) => {
            if (res.code === 1) {
            } else {
              this.$message.error(res.msg);
            }
          }
        );
      } catch (error) {
        this.$message.error(error);
      }
    },
  },
};
</script>

<style lang="scss">
.cdgc_title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: 20px auto;
}
.cdgc_bill_head {
  width: 99%;
  margin: 0px auto;
  margin-bottom: 10px;
}
.cdgc_table {
  border-collapse: collapse;
  width: 99%;
  margin: 0px auto;
}
.cdgc_table thead th,
.cdgc_table tbody td {
  padding: 5px;
  height: 30px;
  line-height: 30px;
  border: 1px solid rgb(199, 199, 199);
}
.cdgc_btn_bar {
  width: 100%;
  bottom: 0px;
  padding-right: 10px;
  margin: 10px 0px;
  text-align: right;
}
</style>