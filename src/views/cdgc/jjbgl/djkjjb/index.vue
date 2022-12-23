<template>
  <div style="font-size: 12px">
    <div class="cdgc_title">电机壳交接班记录</div>
    <table class="cdgc_bill_head">
      <tr>
        <td style="width: 25%">
          日期：<el-date-picker
            v-model="form.rq"
            :picker-options="pickeroptions"
            placeholder="请选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
        <td style="width: 25%">
          班次：<el-select v-model="form.bc" clearable placeholder="请选择班次">
            <el-option label="白班" value="白班"></el-option>
            <el-option label="中班" value="中班"></el-option>
            <el-option label="夜班" value="夜班"></el-option>
          </el-select>
        </td>
        <td style="width: 25%">
          交接人：<el-input
            style="width: 150px"
            clearable
            v-model="form.jjr"
            placeholder="请输入交接人"
          ></el-input>
        </td>
        <td style="width: 25%">
          后序人员：<el-input
            style="width: 300px"
            clearable
            v-model="form.hxry"
            placeholder="请输入后序人员"
          ></el-input>
        </td>
      </tr>
    </table>
    <table class="cdgc_table">
      <thead>
        <tr>
          <th class="tdlabel">岗位名称</th>
          <th class="tdlabel">产品名称</th>
          <th class="tdlabel">库存数</th>
          <th class="tdlabel">加工数</th>
          <th class="tdlabel">工废数</th>
          <th class="tdlabel">料废数</th>
          <th class="tdlabel">合格数</th>
          <th class="tdlabel">库存结余</th>
          <th style="width: 50px; text-align: center" class="tdlabel">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in form.jjlist" :key="index">
          <td
            v-if="index === 0"
            :rowspan="form.jjlist.length"
            style="text-align: center"
            class="tdlabel"
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
            <!-- <el-input-number
              v-model="item.gfs"
              :min="0"
              :step="1"
            ></el-input-number> -->
            {{item.gfs}}
            <el-button type="text" @click="input_gfmx_handle(item)"
              >工废明细</el-button
            >
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
          <td
            class="tdlabel"
            style="text-align: center"
            :rowspan="form.hxlist.length + 1"
          >
            后序
          </td>
          <td class="tdlabel" style="text-align: center"><b>项目</b></td>
          <td class="tdlabel" style="text-align: center"><b>投入数</b></td>
          <td class="tdlabel" colspan="2" style="text-align: center">
            <b>待评审</b>
          </td>
          <td class="tdlabel" style="text-align: center"><b>工废品</b></td>
          <td class="tdlabel" style="text-align: center"><b>料废品</b></td>
          <td class="tdlabel" colspan="2" style="text-align: center">
            <b>合格品</b>
          </td>
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
          <td class="tdlabel" style="text-align: center"><b>质量情况：</b></td>
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
          <td class="tdlabel" style="text-align: center"><b>设备情况：</b></td>
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
          <td class="tdlabel" style="text-align: center"><b>其它情况：</b></td>
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
    <el-dialog
      title="工废明细"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
      @opened="gfmx_opened_handle"
      width="40%"
    >
      <div>
        <gfmxform
          ref="fgmx_form"
          :isread="isread"
          :isadmin="isadmin"
          :datalist="currentrow.gfmxlist"
        ></gfmxform>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="gfmx_ok_handle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { deepClone, newGuid, parseTime } from "@/utils/index";
import GFMX from "../gfmx.vue";
export default {
  name: "DjkjjbComponent",
  components: {
    gfmxform: GFMX,
  },
  data() {
    return {
      cplist: [],
      list: [],
      isread:false,
      isadmin:true,
      dialogVisible: false,
      currentrow: {},
      pickeroptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 2 * 24 * 60 * 60 * 1000 ||
            time.getTime() > Date.now()
          );
        },
      },
      form: {
        rq: parseTime(new Date()),
        bc: "",
        jjr: "",
        hxry: "",
        zlqk: "",
        sbqk: "",
        qtqk: "",
        jjlist: [],
        hxlist: [],
      },
      jjitem: {
        rid:'',
        cpmc: "",
        kcs: 0,
        jgs: 0,
        gfs: 0,
        lfs: 0,
        gfmxlist: [],
      },
      hxitem: {
        xm: "",
        trs: 0,
        dps: 0,
        gfp: 0,
        lfp: 0,
      },
    };
  },
  mounted() {
    this.get_cplist();
    let row = deepClone(this.jjitem);
    row.rid = newGuid();
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
      row.rid = newGuid();
      this.form.jjlist.push(row);
    },
    del_item_handle(index) {
      this.form.jjlist.splice(index, 1);
    },
    get_cplist() {
      ApiFn.requestapi("get", "/cdgc/djkjjb/get_cplist", {}).then((res) => {
        if (res.code === 1) {
          this.cplist = res.list;
        }
      });
    },
    //工废明细录入
    input_gfmx_handle(row) {
      this.currentrow = row;
      this.dialogVisible = true;
    },
    gfmx_opened_handle() {
      this.$refs.fgmx_form.init();
    },
    gfmx_ok_handle() {
      let gfdata = this.$refs.fgmx_form.get_gfdata();
      let newgfdata = deepClone(gfdata);
      if (this.currentrow.rid) {
        let pos = this.form.jjlist.findIndex((t) => t.rid === this.currentrow.rid);
        if (pos !== -1) {
          this.form.jjlist[pos].gfmxlist = newgfdata;
          this.form.jjlist[pos].gfs = newgfdata.length;
        }
      }
      this.dialogVisible = false;
      this.$refs.fgmx_form.empty_gfdata();
    },
    save_handle() {
      try {
        let postdata = {
          id: 0,
          rq: this.form.rq,
          bc: this.form.bc,
          jbr: this.form.jjr,
          hxry: this.form.hxry,
          zlqk: this.form.zlqk,
          sbqk: this.form.sbqk,
          qtqk: this.form.qtqk,
          lrr: this.$store.getters.name,
          lrsj: parseTime(new Date()),
          djkjjbdetail: [],
          djkjjbdetailhx: [],
        };
        for (let index = 0; index < this.form.jjlist.length; index++) {
          const ele = this.form.jjlist[index];
          postdata.djkjjbdetail.push({
            id: 0,
            billid: 0,
            cpmc: ele.cpmc,
            kcsl: ele.kcs,
            jgsl: ele.jgs,
            gfsl: ele.gfs,
            lfsl: ele.lfs,
            hgsl: ele.jgs - ele.gfs - ele.lfs,
            kcsysl: ele.kcs - ele.jgs,
            gfmxlist:ele.gfmxlist
          });
        }
        for (let index = 0; index < this.form.hxlist.length; index++) {
          const ele = this.form.hxlist[index];
          postdata.djkjjbdetailhx.push({
            id: 0,
            billid: 0,
            xmmc: ele.xm,
            trjgsl: ele.trs,
            dpssl: ele.dps,
            gfsl: ele.gfp,
            lfsl: ele.lfp,
            hgsl: ele.trs - ele.dps - ele.gfp - ele.lfp,
          });
        }
        ApiFn.requestapi("post", "/cdgc/djkjjb/save_jjb", postdata).then(
          (res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
              window.location.reload();
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

<style lang="scss" scoped>
::v-deep .cdgc_title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  margin: 20px auto;
}
::v-deep .cdgc_bill_head {
  width: 99%;
  margin: 0px auto;
  margin-bottom: 10px;
}
::v-deep .cdgc_table {
  border-collapse: collapse;
  width: 99%;
  margin: 0px auto;
}
::v-deep .cdgc_table thead th,
::v-deep .cdgc_table tbody td {
  height: 30px;
  line-height: 30px;
  border: 1px solid rgb(199, 199, 199);
}
::v-deep .cdgc_table thead th {
  height: 40px;
  line-height: 40px;
}
::v-deep .cdgc_btn_bar {
  width: 100%;
  bottom: 0px;
  padding-right: 10px;
  margin: 10px 0px;
  text-align: right;
}
::v-deep .tdlabel {
  background-color: rgb(231, 231, 231);
  font-weight: bold;
}
</style>