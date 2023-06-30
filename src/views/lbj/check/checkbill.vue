<template>
  <div class="bill_main">
    <div class="title">产品在线检验检测记录表</div>
    <div class="bill_head">
      <table>
        <tr>
          <td class="td_label">检验日期：</td>
          <td>
            <template v-if="isedit">
              <el-date-picker
                v-model="form.rq"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="日期"
                clearable
                style="width: 100%"
              ></el-date-picker>
            </template>
            <template v-else>
              <span class="formval">{{
                form.rq | parseTime("{y}-{m}-{d}")
              }}</span>
            </template>
          </td>
          <td class="td_label">班次：</td>
          <td>
            <template v-if="isedit">
              <el-select
                v-model="form.bc"
                clearable
                placeholder="请选择班次"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, idx) in bclist"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <span class="formval">{{ form.bc }}</span>
            </template>
          </td>
          <td class="td_label">生产线：</td>
          <td>
            <template v-if="isedit">
              <el-select
                v-model="form.scx"
                clearable
                filterable
                placeholder="请选择生产线"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, idx) in scxxx_list"
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
            </template>
            <template v-else>
              <span class="formval">{{ form.scx | scxname }}</span>
            </template>
          </td>
          <td class="td_label">部门名称：</td>
          <td>
            <template v-if="isedit">
              <el-select
                v-model="form.bmmc"
                clearable
                filterable
                placeholder="请选择部门"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, idx) in bmlist"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else>
              <span class="formval">{{ form.bmmc }}</span>
            </template>
          </td>
        </tr>
        <tr>
          <td class="td_label">产品型号：</td>
          <td>
            <template v-if="isedit">
              <el-autocomplete
                v-model="form.cpxh"
                placeholder="关键字过滤产品型号"
                :fetch-suggestions="fetchSuggestions"
                :trigger-on-focus="false"
                @select="cpxh_change_handle"
                clearable
                style="width: 100%"
              >
              </el-autocomplete>
            </template>
            <template v-else>
              <span class="formval">{{ form.cpxh }}</span>
            </template>
          </td>
          <td class="td_label">产品名称：</td>
          <td>
            <template v-if="isedit">
              <el-input
                v-model="form.cpmc"
                clearable
                placeholder="请输入产品名称"
                style="width: 100%"
              ></el-input>
            </template>
            <template v-else>
              <span class="formval">{{ form.cpmc }}</span>
            </template>
          </td>
          <td class="td_label">工序名称：</td>
          <td>
            <template v-if="isedit">
              <el-input
                v-model="form.gxmc"
                clearable
                placeholder="请输入工序名称"
                style="width: 100%"
              ></el-input>
            </template>
            <template v-else>
              <span class="formval">{{ form.gxmc }}</span>
            </template>
          </td>
          <td class="td_label">客户名称：</td>
          <td>
            <template v-if="isedit">
              <el-input
                v-model="form.khmc"
                clearable
                placeholder="请输入客户名称"
                style="width: 100%"
              ></el-input>
            </template>
            <template v-else>
              <span class="formval">{{ form.khmc }}</span>
            </template>
          </td>
        </tr>
        <tr>
          <td class="td_label">产品件号:</td>
          <td>
            <template v-if="isedit">
              <el-input v-model="form.vin" placeholder="产品件号"></el-input>
            </template>
            <template v-else>
              <span class="formval">{{ form.vin }}</span>
            </template>
          </td>
          <td class="td_label">首末件标识:</td>
          <td>
            <template v-if="isedit">
              <el-select
                v-model="form.smjbs"
                clearable
                placeholder="请选择首末件标识"
                style="width: 100%"
              >
                <el-option label="首件" value="S"> </el-option>
                <el-option label="末件" value="M"> </el-option>
              </el-select>
            </template>
            <template v-else>
              <span class="formval">{{ form.smjbs | smjname }}</span>
            </template>
          </td>
          <td class="td_label">夹具号:</td>
          <td colspan="3">
            <template v-if="isedit">
              <el-input v-model="form.jjh" placeholder="夹具号"></el-input>
            </template>
            <template v-else>
              <span class="formval" style="width: 100%">{{ form.jjh }}</span>
            </template>
          </td>
        </tr>
      </table>
    </div>
    <div class="bill_body">
      <table>
        <thead>
          <th>序号</th>
          <th>产品方位</th>
          <th>图号</th>
          <th>检验项</th>
          <th>检验频次</th>
          <th>检验量具</th>
          <th>检验值</th>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in list" :key="idx">
            <td class="_label" style="width: 50px">{{ idx + 1 }}</td>
            <td
              class="_label"
              style="width: 60px"
              :rowspan="item.cpfwrowspan"
              v-if="item.cpfwshow"
            >
              <span
                style="color: blue; cursor: pointer"
                @click="show_checkimg(item)"
                >{{ item.cpfw }}</span
              >
            </td>
            <td class="_label" style="width: 50px">{{ item.th }}</td>
            <td class="_label" style="width: 350px; text-align: left">
              {{ item.jcxm }}
            </td>
            <td
              class="_label"
              style="width: 80px"
              :rowspan="item.jcpcrowspan"
              v-if="item.jcpcshow"
            >
              {{ item.jcpc }}
            </td>
            <td
              class="_label"
              style="width: 150px"
              :rowspan="item.jcgjrowspan"
              v-if="item.jcgjshow"
            >
              {{ item.jcgj }}
            </td>
            <td :class="item.checkclass">
              <template v-if="isedit">
                <el-input
                  :ref="'checkinputval' + idx"
                  v-if="item.srlx === 'text'"
                  v-model="item.checkval"
                  placeholder="请输入检测值"
                  @keydown.native="
                    move_to_downcel('checkinputval', idx, $event)
                  "
                  @change="checkval_change_handle(item)"
                ></el-input>
                <el-radio-group
                  v-else-if="item.srlx === 'radio'"
                  v-model="item.checkval"
                  @change="checkval_change_handle(item)"
                >
                  <el-radio label="合格"></el-radio>
                  <el-radio label="不合格"></el-radio>
                </el-radio-group>
                <span v-else-if="item.srlx === 'none'"> / </span>
              </template>
              <template v-else>
                {{ item.checkval }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="bill_footer" v-if="isedit">
      <el-button
        v-if="isedit"
        icon="el-icon-check"
        type="danger"
        @click="save_checkbill_data"
        >保存</el-button
      >
    </div>

    <el-image ref="checkimage" v-show="false" :preview-src-list="checkimages">
    </el-image>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { parseTime } from "@/utils/index";
import { lbj_baseinfo_mixin } from "@/mixin/lbj_baseinfo_mixin";
var _this;
export default {
  name: "CheckBillComponent",
  mixins: [lbj_baseinfo_mixin],
  data() {
    return {
      isedit: true,
      billid: 0,
      checkimages: [],
      bmlist: [
        { label: "机加一部", value: "机加一部" },
        { label: "机加二部", value: "机加二部" },
      ],
      bclist: [
        { label: "早班", value: "早班" },
        { label: "中班", value: "中班" },
        { label: "晚班", value: "晚班" },
      ],
      list: [],
      form: {
        id: 0,
        bc: "",
        rq: "",
        bmmc: "",
        scx: "",
        cpxh: "",
        cpmc: "",
        gxmc: "",
        khmc: "",
        vin: "",
        smjbs: "",
        jjh: "",
      },
    };
  },
  mounted() {
    _this = this;
    var q = this.$route.query;
    var keys = Object.keys(q);
    if (keys.length > 0) {
      if (q.edit) {
        if (q.edit === "1") {
          this.isedit = true;
        } else {
          this.isedit = false;
        }
      }
      if (q.billid) {
        this.billid = q.billid;
        this.getbillbyid();
      }
    } else {
      this.form.rq = parseTime(new Date());
    }
    this.get_scxxx_list();
  },
  filters: {
    scxname: function (value) {
      var pos = _this.scxxx_list.findIndex((i) => i.value === value);
      if (pos !== -1) {
        return _this.scxxx_list[pos].label;
      } else {
        return value;
      }
    },
    smjname: function (value) {
      if (value === "S") {
        return "首件";
      } else if (value === "M") {
        return "末件";
      } else {
        return value;
      }
    },
  },
  methods: {
    getbillbyid() {
      ApiFn.requestapi(
        "get",
        "/lbj/checkbill/get_bill_by_id?billid=" + this.billid
      ).then((res) => {
        if (res.code === 1) {
          this.form = res.bill;
          if (res.bill.BillDetails) {
            let tdbjys = "";
            this.list = res.bill.BillDetails.map((i) => {
              if (i.CheckItem.srlx === "radio") {
                if (i.checkval === "合格") {
                  tdbjys = "tdok";
                } else {
                  tdbjys = "tderror";
                }
              } else if (i.CheckItem.srlx === "text") {
                let inputval = i.checkval;
                if (
                  parseFloat(inputval) >= parseFloat(i.CheckItem.jcxx) &&
                  parseFloat(inputval) <= parseFloat(i.CheckItem.jcsx)
                ) {
                  tdbjys = "txtok";
                } else if (inputval === "") {
                  tdbjys = "notxt";
                } else {
                  tdbjys = "txterror";
                }
              }
              return {
                id: i.CheckItem.id,
                cpfw: i.CheckItem.cpfw,
                jcxm: i.CheckItem.jcxm,
                th: i.CheckItem.th,
                jcpc: i.CheckItem.jcpc,
                jcgj: i.CheckItem.jcgj,
                checkval: i.checkval,
                srlx: i.CheckItem.srlx,
                jcsx: i.CheckItem.jcsx,
                jcxx: i.CheckItem.jcxx,
                cpfwrowspan: 1,
                cpfwshow: true,
                jcpcrowspan: 1,
                jcpcshow: true,
                jcgjrowspan: 1,
                jcgjshow: true,
                checkclass: tdbjys,
              };
            });
            this.set_rowspan("cpfw");
            this.set_rowspan("jcpc");
            this.set_rowspan("jcgj");
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    fetchSuggestions(queryString, cb) {
      ApiFn.requestapi(
        "get",
        "/lbj/checkbill/get_cpxh_by_key?key=" + queryString
      ).then((res) => {
        if (res.code === 1) {
          cb(res.list);
        }
      });
    },
    cpxh_change_handle(item) {
      ApiFn.requestapi(
        "get",
        "/lbj/basecheck/checkitems?cpxh=" + item.value
      ).then((res) => {
        if (res.code === 1) {
          this.list = res.list.map((i) => {
            i.checkval = "";
            i.cpfwrowspan = 1;
            i.cpfwshow = true;
            i.jcpcrowspan = 1;
            i.jcpcshow = true;
            i.jcgjrowspan = 1;
            i.jcgjshow = true;
            i.checkclass = "";
            return i;
          });
          this.set_rowspan("cpfw");
          this.set_rowspan("jcpc");
          this.set_rowspan("jcgj");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    set_rowspan(col) {
      for (let i = 0; i < this.list.length; i++) {
        const elementi = this.list[i];
        for (let j = i + 1; j < this.list.length; j++) {
          const elementj = this.list[j];
          if (col) {
            if (elementi[col] === elementj[col]) {
              this.list[i][col + "rowspan"]++;
              this.list[j][col + "show"] = false;
            } else {
              break;
            }
          }
        }
      }
    },
    checkval_change_handle(item) {
      if (item.srlx === "radio") {
        if (item.checkval === "合格") {
          item.checkclass = "tdok";
        } else {
          item.checkclass = "tderror";
        }
      } else if (item.srlx === "text") {
        let inputval = item.checkval;
        if (isNaN(inputval)) {
          this.$message.error("输入的类型不合法");
          item.checkclass = "txterror";
        } else {
          if (
            parseFloat(inputval) >= parseFloat(item.jcxx) &&
            parseFloat(inputval) <= parseFloat(item.jcsx)
          ) {
            item.checkclass = "txtok";
          } else if (inputval === "") {
            item.checkclass = "notxt";
          } else {
            item.checkclass = "txterror";
          }
        }
      }
    },
    save_checkbill_data() {
      if (!this.form.cpxh) {
        this.$message.warning("请输入产品型号");
        return;
      } else if (!this.form.vin) {
        this.$message.warning("请输入产品件号");
        return;
      } else if (!this.form.rq) {
        this.$message.warning("请输入日期");
        return;
      } else if (!this.form.bc) {
        this.$message.warning("请选择班次");
        return;
      } else if (!this.form.bmmc) {
        this.$message.warning("请选择生产部门");
        return;
      } else if (!this.form.scx) {
        this.$message.warning("请选择生产线");
        return;
      }
      let postdata = {
        id: this.form.id,
        scx: this.form.scx,
        bmmc: this.form.bmmc,
        rq: this.form.rq,
        bc: this.form.bc,
        cpxh: this.form.cpxh,
        cpmc: this.form.cpmc,
        gxmc: this.form.gxmc,
        khmc: this.form.khmc,
        vin: this.form.vin,
        smjbs: this.form.smjbs,
        jjh: this.form.jjh,
        BillDetails: [],
      };
      this.list.forEach((i) => {
        postdata.BillDetails.push({
          checkid: i.id,
          checkval: i.checkval,
        });
      });
      if (postdata.id === 0) {
        ApiFn.requestapi("post", "/lbj/checkbill/save", postdata).then(
          (res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          }
        );
      } else {
        ApiFn.requestapi("post", "/lbj/checkbill/modify", postdata).then(
          (res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          }
        );
      }
    },
    move_to_downcel(name, idx, e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      if (keyCode === 13) {
        let ref = this.$refs[name + idx];
        if (ref) {
          ref[0].$el.blur();
          for (let ii = idx + 1; ii < this.list.length; ii++) {
            let nextref = this.$refs[name + ii];
            if (nextref) {
              nextref[0].focus();
              break;
            }
          }
        }
      }
    },
    show_checkimg(row) {
      ApiFn.requestapi("post", "/lbj/checkimg/images", {
        cpxh: this.form.cpxh,
        cpfw: row.cpfw,
      }).then((res) => {
        if (res.code === 1) {
          this.checkimages = res.list;
          this.$refs["checkimage"].showViewer = true;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bill_main {
  font-size: 12px;
}
::v-deep .title {
  font-size: 28px;
  text-align: center;
  line-height: 28px;
  margin: 15px auto;
}
::v-deep ._label {
  font-weight: bold;
  text-align: center;
  background-color: #e2e2e2;
  padding: 5px 10px;
}
::v-deep .td_label {
  width: 100px;
  font-weight: bold;
  text-align: justify;
  background-color: #e2e2e2;
  padding: 0px 10px;
}
.bill_head table {
  border: 0px;
  border-collapse: collapse;
  width: 100%;
}
.bill_body table {
  border: 0px;
  border-collapse: collapse;
  width: 100%;
}
.bill_body table thead {
  height: 30px;
  line-height: 30px;
  padding: 5px;
  font-weight: bold;
  text-align: center;
  background-color: #e2e2e2;
}
.bill_body table td,
.bill_body table th {
  border: 1px solid rgb(199, 199, 199);
}
.bill_footer {
  height: 50px;
  line-height: 50px;
  text-align: right;
  padding-right: 10px;
}
::v-deep .tderror {
  background-color: rgb(253, 129, 129);
}
::v-deep .txterror .el-input__inner {
  background-color: rgb(253, 129, 129);
  font-weight: bold;
  color: red;
}
::v-deep .tdok {
  background-color: rgb(127, 250, 123);
}
::v-deep .txtok .el-input__inner {
  background-color: rgb(127, 250, 123);
}
::v-deep .notxt .el-input__inner {
  background-color: none;
}
::v-deep .formval {
  height: 30px;
  line-height: 30px;
  padding-left: 5px;
  width: 300px;
  display: block;
  border: #cacaca 1px solid;
}
</style>