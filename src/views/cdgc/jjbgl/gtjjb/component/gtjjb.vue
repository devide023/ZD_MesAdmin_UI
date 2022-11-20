<template>
  <div class="gtjjb_form">
    <!-- 缸体交接班组件 -->
    <div class="gtjjb_form_title">缸体机加交接班记录</div>
    <table class="gtjjb_form_head">
      <tr>
        <td style="width: 33.3%">
          日期：<template v-if="isread">{{
            dqrq | parseTime("{y}-{m}-{d}")
          }}</template>
          <template v-else>
            <el-date-picker
              v-if="isadmin"
              v-model="dqrq"
              value-format="yyyy-MM-dd"
              :editable="false"
              placeholder="选择日期"
              @change="rq_change_handle"
            ></el-date-picker>
            <el-date-picker
              v-else
              v-model="dqrq"
              :picker-options="pickeroptions"
              :editable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="rq_change_handle"
            ></el-date-picker>
          </template>
        </td>
        <td style="width: 33.3%">
          班次：<span v-if="isread">{{ bc }}</span>
          <el-select
            v-else
            v-model="bc"
            @change="bc_change_handle"
            placeholder="请选择班次"
          >
            <el-option label="白班" value="白班"></el-option>
            <el-option label="中班" value="中班"></el-option>
            <el-option label="晚班" value="晚班"></el-option>
          </el-select>
        </td>
        <td style="width: 33.3%">
          交班人：<span v-if="isread">{{ jbr }}</span>
          <el-input
            v-else
            v-model="jbr"
            style="width: 200px"
            clearable
            placeholder="请输入交班人"
          ></el-input>
        </td>
      </tr>
    </table>
    <table class="gtjjb_form_body">
      <thead>
        <tr>
          <th class="tdlabel">产品名称</th>
          <th class="tdlabel">上个班次毛坯余数</th>
          <th class="tdlabel">当班毛坯数量</th>
          <th class="tdlabel">换产数量</th>
          <th class="tdlabel">投入加工数</th>
          <th class="tdlabel">工废数</th>
          <th class="tdlabel">料废数</th>
          <th class="tdlabel">合格数</th>
          <th class="tdlabel">当班毛坯余数</th>
          <th
            class="tdlabel"
            v-if="!isread"
            style="width: 50px; text-align: center"
          >
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sclist" :key="index">
          <td>
            <span v-if="isread">
              {{ item.cpmc }}
            </span>
            <el-select
              v-else
              v-model="item.cpmc"
              clearable
              filterable
              placeholder="选择产品名称"
              style="width: 100%"
            >
              <el-option
                v-for="(el, idx) in cplist"
                :key="'el' + idx"
                :label="el.label"
                :value="el.value"
              >
              </el-option>
            </el-select>
          </td>
          <td style="text-align: center">
            <span v-if="isread">
              {{ item.up_mpys }}
            </span>
            <el-input-number
              v-else
              v-model="item.up_mpys"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <span v-if="isread">
              {{ item.db_mpsl }}
            </span>
            <el-input-number
              v-else
              v-model="item.db_mpsl"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            <span v-if="isread">
              {{ item.hcsl }}
            </span>
            <el-input-number
              v-else
              v-model="item.hcsl"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            {{ item.up_mpys + item.db_mpsl + item.hcsl - item.dbmpys }}
          </td>
          <td style="text-align: center">
            <template v-if="isread">
              {{ item.gfs }}
              <el-button type="text" @click="input_gfmx_handle(item)"
                >工废明细</el-button
              >
            </template>
            <template v-else>
              {{ item.gfs }}
              <el-button type="text" @click="input_gfmx_handle(item)"
                >工废明细</el-button
              >
            </template>

            <!-- <el-input-number
              v-else
              v-model="item.gfs"
              :min="0"
              :step="1"
            ></el-input-number> -->
          </td>
          <td style="text-align: center">
            <span v-if="isread">
              {{ item.lfs }}
            </span>
            <el-input-number
              v-else
              v-model="item.lfs"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td style="text-align: center">
            {{
              item.up_mpys +
              item.db_mpsl +
              item.hcsl -
              item.dbmpys -
              item.gfs -
              item.lfs
            }}
          </td>
          <td style="text-align: center">
            <span v-if="isread">
              {{ item.dbmpys }}
            </span>
            <el-input-number
              v-else
              v-model="item.dbmpys"
              :min="0"
              :step="1"
            ></el-input-number>
          </td>
          <td v-if="!isread" style="width: 50px; text-align: center">
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
          <td class="tdlabel" style="text-align: center"><b>当班组长：</b></td>
          <td>
            <span v-if="isread">{{ dbzz }}</span>
            <el-input
              v-else
              v-model="dbzz"
              placeholder=""
              style="width: 100%"
            ></el-input>
          </td>
          <td class="tdlabel" style="text-align: center"><b>上料岗位：</b></td>
          <td>
            <span v-if="isread">{{ slgw }}</span>
            <el-input
              v-else
              v-model="slgw"
              placeholder=""
              style="width: 100%"
            ></el-input>
          </td>
          <td class="tdlabel" style="text-align: center"><b>毛刺岗位：</b></td>
          <td>
            <span v-if="isread">{{ mcgw }}</span>
            <el-input
              v-else
              v-model="mcgw"
              placeholder=""
              style="width: 100%"
            ></el-input>
          </td>
          <td class="tdlabel" style="text-align: center"><b>检验岗位：</b></td>
          <td :colspan="isread ? 2 : 3">
            <span v-if="isread">{{ jygw }}</span>
            <el-input
              v-else
              v-model="jygw"
              placeholder=""
              style="width: 100%"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td class="tdlabel" style="text-align: center"><b>质量情况：</b></td>
          <td :colspan="isread ? 9 : 10">
            <span v-if="isread">
              {{ zlqk }}
            </span>
            <el-input
              v-else
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="zlqk"
            >
            </el-input>
          </td>
        </tr>
        <tr>
          <td class="tdlabel" style="text-align: center"><b>设备情况：</b></td>
          <td :colspan="isread ? 9 : 10">
            <span v-if="isread">
              {{ sbqk }}
            </span>
            <el-input
              v-else
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="sbqk"
            >
            </el-input>
          </td>
        </tr>
        <tr>
          <td class="tdlabel" style="text-align: center"><b>其它情况：</b></td>
          <td :colspan="isread ? 9 : 10">
            <span v-if="isread">
              {{ qtqk }}
            </span>
            <el-input
              v-else
              type="textarea"
              :rows="2"
              placeholder=""
              v-model="qtqk"
            >
            </el-input>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!isread" class="gtjjb_form_footer">
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
import store from "@/store/index";
import ApiFn from "@/api/baseapi";
import { deepClone, newGuid, parseTime } from "@/utils/index";
import GFMX from "../../gfmx.vue";
import { number } from 'echarts/lib/export';
export default {
  name: "Gtjjb_Form_Component",
  components: {
    gfmxform: GFMX,
  },
  props: {
    id:{
      type:number,
      default:0
    },
    isread: {
      type: Boolean,
      default: false,
      required: true,
    },
    isadmin: {
      type: Boolean,
      default: false,
    },
    calcrq: {
      type: String,
    },
    calcbc: {
      type: String,
    },
  },
  data() {
    return {
      pickeroptions: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() - 2 * 24 * 60 * 60 * 1000 ||
            time.getTime() > Date.now()
          );
        },
      },
      dialogVisible: false,
      currentrow: {},
      sclist: [],
      cplist: [], //产品列表
      dqrq: parseTime(new Date()), //当前日期
      bc: "", //当前班次
      jbr: "", //交班人
      zlqk: "", //质量情况
      sbqk: "", //设备情况
      qtqk: "", //其它情况
      dbzz: "", //当班组长
      slgw: "", //上料岗位
      mcgw: "", //毛刺岗位
      jygw: "", //检验岗位
      scitem: {
        rid: "",
        cpmc: "",
        up_mpys: 0, //上个班次毛坯余数
        db_mpsl: 0, //当班毛坯数量
        hcsl: 0, //换产数量
        trjgs: 0, //投入加工数
        gfs: 0, //工废数
        lfs: 0, //料废数
        hgs: 0, //合格数
        dbmpys: 0, //当班毛坯余数
        gfmxlist: [], //工废明细
      },
    };
  },
  mounted() {
    if (this.calcrq && this.calcbc) {
      this.load_bc_data(parseTime(this.calcrq), this.calcbc);
    }
    if (!this.isread) {
      let row = deepClone(this.scitem);
      row.rid = newGuid();
      this.sclist.push(row);
    }
    this.get_cplist_data();
  },
  methods: {
    add_item_handle() {
      let row = deepClone(this.scitem);
      row.rid = newGuid();
      this.sclist.push(row);
    },
    del_item_handle(index) {
      this.sclist.splice(index, 1);
    },
    get_cplist_data() {
      ApiFn.requestapi("get", "/cdgc/gtjjb/get_cplist", {}).then((res) => {
        if (res.code === 1) {
          this.cplist = res.list;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    rq_change_handle(v) {
      this.$emit("rq_change", { rq: v, bc: this.bc });
    },
    bc_change_handle(v) {
      this.$emit("bc_change", { rq: this.dqrq, bc: v });
    },
    //工废明细录入
    input_gfmx_handle(row) {
      this.currentrow = row;
      console.log(this.currentrow);
      this.dialogVisible = true;
    },
    gfmx_opened_handle() {
      this.$refs.fgmx_form.init();
    },
    gfmx_ok_handle() {
      let gfdata = this.$refs.fgmx_form.get_gfdata();
      let newgfdata = deepClone(gfdata);
      if (this.currentrow.rid) {
        let pos = this.sclist.findIndex((t) => t.rid === this.currentrow.rid);
        if (pos !== -1) {
          this.sclist[pos].gfmxlist = newgfdata;
          this.sclist[pos].gfs = newgfdata.length;
        }
      }
      this.dialogVisible = false;
      this.$refs.fgmx_form.empty_gfdata();
    },
    //加载班次数据
    load_bc_data(rq, bc) {
      ApiFn.requestapi("get", "/cdgc/gtjjb/load_bc_data", {
        rq: rq,
        bc: bc,
      }).then((res) => {
        if (res.code === 1) {
          if (res.list.length > 0) {
            this.dqrq = res.list[0].rq;
            this.bc = res.list[0].bc;
            this.jbr = res.list[0].jbr;
            this.zlqk = res.list[0].zlqk;
            this.sbqk = res.list[0].sbqk;
            this.qtqk = res.list[0].qtqk;
            this.dbzz = res.list[0].dbzz;
            this.slgw = res.list[0].slry;
            this.mcgw = res.list[0].mcry;
            this.jygw = res.list[0].jyry;
            this.sclist = res.list[0].mxlist.map((i) => {
              let rd = {
                rid:newGuid(),
                cpmc: i.cpmc,
                up_mpys: i.sbcmpyl,
                db_mpsl: i.dbmpsl,
                hcsl: i.hcsl,
                trjgs: i.trjgs,
                gfs: i.gfsl,
                lfs: i.lfsl,
                hgs: i.hgsl,
                dbmpys: i.dbmpyl,
                gfmxlist:i.gfmxlist
              };
              return rd;
            });
          } else {
            this.dqrq = "";
            this.bc = "";
            this.jbr = "";
            this.zlqk = "";
            this.sbqk = "";
            this.qtqk = "";
            this.dbzz = "";
            this.slgw = "";
            this.mcgw = "";
            this.jygw = "";
            this.sclist = [];
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    save_handle() {
      let postdata = {
        id: 0,
        isadmin: this.isadmin,
        rq: this.dqrq,
        bc: this.bc,
        jbr: this.jbr,
        dbzz: this.dbzz,
        slry: this.slgw,
        mcry: this.mcgw,
        jyry: this.jygw,
        zlqk: this.zlqk,
        sbqk: this.sbqk,
        qtqk: this.qtqk,
        lrr: store.getters.name,
        lrsj: parseTime(new Date()),
        mxlist: [],
      };
      this.sclist.forEach((i) => {
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
          gfmxlist: i.gfmxlist,
        });
      });
      ApiFn.requestapi("post", "/cdgc/gtjjb/save_gtjjb", postdata).then(
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
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .gtjjb_form {
  font-size: 12px;
}
::v-deep .gtjjb_form_title {
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  margin: 10px auto;
  text-align: center;
}
::v-deep .gtjjb_form_head {
  font-size: 12px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin: 10px auto;
}
::v-deep .gtjjb_form_body {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
}
::v-deep .gtjjb_form_body th,
.gtjjb_form_body td {
  height: 30px;
  line-height: 30px;
  border: 1px solid rgb(199, 199, 199);
}
::v-deep .gtjjb_form_body th {
  height: 40px;
  line-height: 40px;
}
::v-deep .gtjjb_form_footer {
  height: 50px;
  line-height: 50px;
  margin: 10px auto;
  text-align: right;
}
::v-deep .tdlabel {
  background-color: rgb(231, 231, 231);
  font-weight: bold;
}
</style>