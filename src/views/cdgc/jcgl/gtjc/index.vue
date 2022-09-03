<template>
  <div>
    <!-- 缸体检测 -->
    <div class="gtjc_title">{{ form.cplx }}缸体检测记录表</div>
    <table class="gtjc_body">
      <tr class="gtjc_fixed">
        <td colspan="2" class="td_label">日期</td>
        <td>
          <el-date-picker
            v-model="form.rq"
            placeholder="请选择日期"
            style="width: 130px"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </td>
        <td class="td_label" style="width: 100px">检验员</td>
        <td>
          <el-input
            v-model="form.jyy"
            clearable
            style="width: 120px"
            placeholder="请输入检验员"
          ></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">检验类别</td>
        <td>
          <el-select
            v-model="form.jylb1"
            clearable
            filterable
            placeholder="请选择检验类别"
          >
            <el-option
              v-for="(item, idx) in jylblist"
              :key="'jylb1' + idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">检验类别</td>
        <td>
          <el-select
            v-model="form.jylb2"
            clearable
            filterable
            placeholder="请选择检验类别"
          >
            <el-option
              v-for="(item, idx) in jylblist"
              :key="'jylb2' + idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">检验类别</td>
        <td>
          <el-select
            v-model="form.jylb3"
            clearable
            filterable
            placeholder="请选择检验类别"
          >
            <el-option
              v-for="(item, idx) in jylblist"
              :key="'jylb3' + idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">检验类别</td>
        <td>
          <el-select
            v-model="form.jylb4"
            clearable
            filterable
            placeholder="请选择检验类别"
          >
            <el-option
              v-for="(item, idx) in jylblist"
              :key="'jylb4' + idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td rowspan="3" colspan="2" class="td_label">图号</td>
        <td rowspan="3" colspan="3">
          <el-select
            v-model="form.th"
            placeholder="请选择图号"
            style="width: 100%"
            @change="tuhao_change_handle"
          >
            <el-option
              v-for="(item, idx) in cplxlist"
              :key="'cplx' + idx"
              :label="item.th"
              :value="item.cplx"
            >
              <span style="float: left">{{ item.th }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.cplx
              }}</span>
            </el-option>
          </el-select>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">机台号</td>
        <td>
          <el-input v-model="form.jth1" placeholder="机台1"></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">机台号</td>
        <td><el-input v-model="form.jth2" placeholder="机台2"></el-input></td>
        <td colspan="3" class="td_label" style="width: 100px">机台号</td>
        <td>
          <el-input v-model="form.jth3" placeholder="机台3"></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">机台号</td>
        <td>
          <el-input v-model="form.jth4" placeholder="机台4"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="td_label" style="width: 100px">二维码</td>
        <td>
          <el-input
            v-model="form.ewm1"
            @change="get_data_by_vin(1)"
            placeholder="二维码1"
          ></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">二维码</td>
        <td>
          <el-input
            v-model="form.ewm2"
            @change="get_data_by_vin(2)"
            placeholder="二维码2"
          ></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">二维码</td>
        <td>
          <el-input
            v-model="form.ewm3"
            @change="get_data_by_vin(3)"
            placeholder="二维码3"
          ></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">二维码</td>
        <td>
          <el-input
            v-model="form.ewm4"
            @change="get_data_by_vin(4)"
            placeholder="二维码4"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" class="td_label" style="width: 100px">
          模号{{ form.mh }}
        </td>
        <td>
          <el-input v-model="form.mh1" placeholder="模号1"></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">
          模号{{ form.mh }}
        </td>
        <td>
          <el-input v-model="form.mh2" placeholder="模号2"></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">
          模号{{ form.mh }}
        </td>
        <td>
          <el-input v-model="form.mh3" placeholder="模号3"></el-input>
        </td>
        <td colspan="3" class="td_label" style="width: 100px">
          模号{{ form.mh }}
        </td>
        <td>
          <el-input v-model="form.mh4" placeholder="模号4"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="td_label">检验项目</td>
        <td colspan="3" class="td_label">图样技术要求</td>
        <td colspan="4" class="td_label">实测数据</td>
        <td colspan="4" class="td_label">实测数据</td>
        <td colspan="4" class="td_label">实测数据</td>
        <td colspan="4" class="td_label">实测数据</td>
      </tr>
      <tr>
        <td rowspan="2" class="td_label" style="width: 50px">序号</td>
        <td rowspan="2" class="td_label" style="width: 70px">产品方位</td>
        <td rowspan="2" class="td_label" style="width: 50px">孔系名称</td>
        <td rowspan="2" class="td_label" style="width: 70px">孔径尺寸</td>
        <td rowspan="2" class="td_label" style="width: 70px">深度<br />面距</td>
        <!-- 实测数据 -->
        <td colspan="3" class="td_label">孔径尺寸</td>
        <td rowspan="2" class="td_label">深度<br />面距尺寸</td>
        <td colspan="3" class="td_label">孔径尺寸</td>
        <td rowspan="2" class="td_label">深度<br />面距尺寸</td>
        <td colspan="3" class="td_label">孔径尺寸</td>
        <td rowspan="2" class="td_label">深度<br />面距尺寸</td>
        <td colspan="3" class="td_label">孔径尺寸</td>
        <td rowspan="2" class="td_label">深度<br />面距尺寸</td>
      </tr>
      <tr>
        <td class="td_label" style="width: 60px">T进Z止</td>
        <td class="td_label" style="width: 60px">T不进</td>
        <td class="td_label" style="width: 50px">Z不止</td>
        <td class="td_label" style="width: 60px">T进Z止</td>
        <td class="td_label" style="width: 60px">T不进</td>
        <td class="td_label" style="width: 50px">Z不止</td>
        <td class="td_label" style="width: 60px">T进Z止</td>
        <td class="td_label" style="width: 60px">T不进</td>
        <td class="td_label" style="width: 50px">Z不止</td>
        <td class="td_label" style="width: 60px">T进Z止</td>
        <td class="td_label" style="width: 60px">T不进</td>
        <td class="td_label" style="width: 50px">Z不止</td>
      </tr>
      <tr v-for="(item, idx) in list" :key="'item' + idx">
        <td class="td_check_label">{{ idx + 1 }}</td>
        <td
          class="td_check_label"
          :rowspan="item.cpfwrowspan"
          v-if="item.cpfwisshow"
        >
          {{ item.cpfw }}
        </td>
        <template v-if="item.cpfw !== '其他' && item.cpfw !== '结果'">
          <td
            class="td_check_label"
            :rowspan="item.kxmcrowspan"
            v-if="item.kxmcisshow"
          >
            {{ item.kxmc }}
          </td>
          <td
            class="td_check_label"
            :rowspan="item.kjzszrowspan"
            v-if="item.kjzszisshow"
          >
            {{ item.kjzsz }}
          </td>
          <td
            class="td_check_label"
            :rowspan="item.sdzszrowspan"
            v-if="item.sdzszisshow"
          >
            {{ item.sdzsz }}
          </td>
          <td colspan="3" :class="item.class1">
            <el-radio-group
              v-if="item.kjtype === 'radio'"
              v-model="item.result1"
              @change="kj_change_handle(item, 1)"
            >
              <el-radio label="TZ">{{ "" }}</el-radio>
              <el-radio label="T">{{ "" }}</el-radio>
              <el-radio label="Z">{{ "" }}</el-radio>
            </el-radio-group>
            <el-input
              v-else-if="item.kjtype === 'text'"
              v-model="item.result1"
              placeholder="请输入孔径尺寸"
              clearable
              @change="kj_change_handle(item, 1)"
            ></el-input>
          </td>
          <td :class="item.sdclass1">
            <el-input
              v-if="item.sdtype === 'text'"
              v-model="item.size1"
              clearable
              placeholder="请输入深度/面距尺寸"
              @change="sdmj_change_handle(item, 1)"
            ></el-input>
            <span v-else-if="item.sdtype === 'none'">/</span>
          </td>
          <td colspan="3" :class="item.class2">
            <el-radio-group
              v-if="item.kjtype === 'radio'"
              v-model="item.result2"
              @change="kj_change_handle(item, 2)"
            >
              <el-radio label="TZ">{{ "" }}</el-radio>
              <el-radio label="T">{{ "" }}</el-radio>
              <el-radio label="Z">{{ "" }}</el-radio>
            </el-radio-group>
            <el-input
              v-else-if="item.kjtype === 'text'"
              v-model="item.result2"
              placeholder="请输入孔径尺寸"
              clearable
              @change="kj_change_handle(item, 2)"
            ></el-input>
          </td>
          <td :class="item.sdclass2">
            <el-input
              v-if="item.sdtype === 'text'"
              v-model="item.size2"
              placeholder="请输入深度/面距尺寸"
              clearable
              @change="sdmj_change_handle(item, 2)"
            ></el-input>
            <span v-else-if="item.sdtype === 'none'">/</span>
          </td>
          <td colspan="3" :class="item.class3">
            <el-radio-group
              v-if="item.kjtype === 'radio'"
              v-model="item.result3"
              @change="kj_change_handle(item, 3)"
            >
              <el-radio label="TZ">{{ "" }}</el-radio>
              <el-radio label="T">{{ "" }}</el-radio>
              <el-radio label="Z">{{ "" }}</el-radio>
            </el-radio-group>
            <el-input
              v-else-if="item.kjtype === 'text'"
              v-model="item.result3"
              placeholder="请输入孔径尺寸"
              clearable
              @change="kj_change_handle(item, 3)"
            ></el-input>
          </td>
          <td :class="item.sdclass3">
            <el-input
              v-if="item.sdtype === 'text'"
              v-model="item.size3"
              placeholder="请输入深度/面距尺寸"
              clearable
              @change="sdmj_change_handle(item, 3)"
            ></el-input>
            <span v-else-if="item.sdtype === 'none'">/</span>
          </td>
          <td colspan="3" :class="item.class4">
            <el-radio-group
              v-if="item.kjtype === 'radio'"
              v-model="item.result4"
              @change="kj_change_handle(item, 4)"
            >
              <el-radio label="TZ">{{ "" }}</el-radio>
              <el-radio label="T">{{ "" }}</el-radio>
              <el-radio label="Z">{{ "" }}</el-radio>
            </el-radio-group>
            <el-input
              v-else-if="item.kjtype === 'text'"
              v-model="item.result4"
              placeholder="请输入孔径尺寸"
              clearable
              @change="kj_change_handle(item, 4)"
            ></el-input>
          </td>
          <td :class="item.sdclass4">
            <el-input
              v-if="item.sdtype === 'text'"
              v-model="item.size4"
              placeholder="请输入深度/面距尺寸"
              clearable
              @change="sdmj_change_handle(item, 4)"
            ></el-input>
            <span v-else-if="item.sdtype === 'none'">/</span>
          </td>
        </template>
        <template v-else>
          <td class="td_check_label" colspan="3">{{ item.kxmc }}</td>
          <td colspan="4">
            <el-radio-group v-model="item.jg1">
              <el-radio label="合格">合格</el-radio>
              <el-radio label="不合格">不合格</el-radio>
            </el-radio-group>
          </td>
          <td colspan="4">
            <el-radio-group v-model="item.jg2">
              <el-radio label="合格">合格</el-radio>
              <el-radio label="不合格">不合格</el-radio>
            </el-radio-group>
          </td>
          <td colspan="4">
            <el-radio-group v-model="item.jg3">
              <el-radio label="合格">合格</el-radio>
              <el-radio label="不合格">不合格</el-radio>
            </el-radio-group>
          </td>
          <td colspan="4">
            <el-radio-group v-model="item.jg4">
              <el-radio label="合格">合格</el-radio>
              <el-radio label="不合格">不合格</el-radio>
            </el-radio-group>
          </td>
        </template>
      </tr>
    </table>
    <div class="operate_bar">
      <el-button
        v-if="this.list.length > 0"
        type="danger"
        icon="el-icon-check"
        style="margin-right: 10px"
        @click="save_gtjc_bill"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { deepClone, parseTime } from "@/utils/index";
export default {
  name: "GtjcComponent",
  data() {
    return {
      list: [],
      cplxlist: [],
      jylblist: [],
      billids: [0, 0, 0, 0],
      sblist: [],
      form: {
        cplx: "", //缸体类型
        th: "", //图号
        mh: "", //模号
        rq: parseTime(new Date()),
        jyy: "",
        jth1: "1",
        jth2: "2",
        jth3: "3",
        jth4: "4",
        ewm1: "",
        ewm2: "",
        ewm3: "",
        ewm4: "",
        mh1: "",
        mh2: "",
        mh3: "",
        mh4: "",
        jylb1: "",
        jylb2: "",
        jylb3: "",
        jylb4: "",
        datalist: [],
      },
      dataitem: {
        itemid: 0, //检测项目id
        kjtype: "radio", //孔径输入类型
        sdtype: "text", //深度输入类型
        cpfw: "", //产品方位
        kxmc: "", //孔系名称
        kjsize: "", //孔径尺寸
        sdjl: "", //深度距离
        sbbh: "", //设备编号
        size1: "", //尺寸
        size2: "", //尺寸
        size3: "", //尺寸
        size4: "", //尺寸
        result1: "", //结果
        result2: "", //结果
        result3: "", //结果
        result4: "", //结果
      },
    };
  },
  mounted() {
    this.get_cplx_list();
    this.get_sbxx();
    this.jylblist = [
      {
        label: "首件",
        value: "首件",
      },
      {
        label: "抽检",
        value: "抽检",
      },
      {
        label: "末件",
        value: "末件",
      },
    ];
  },
  methods: {
    get_sbxx() {
      ApiFn.requestapi("get", "/cdgc/jcxx/get_sbxx", {}).then((res) => {
        if (res.code === 1) {
          this.sblist = res.list;
        } else if (res.code === 0) {
          this.$message.error(res.msg);
        }
      });
    },
    get_cplx_list() {
      try {
        ApiFn.requestapi("get", "/cdgc/gtjc/jcsj/cplx")
          .then((res) => {
            if (res.code === 1) {
              this.cplxlist = res.list;
            } else {
              this.$message.error(res.msg);
            }
          })
          .finally();
      } catch (error) {}
    },
    tuhao_change_handle(val) {
      if (this.list.length > 0 && this.form.cplx !== val) {
        this.$confirm("数据将丢失是否继续？", "警告", {
          type: "warning",
          cancelButtonClass: "el-button--primary",
          confirmButtonClass: "el-button--danger",
        }).then(() => {
          if (val) {
            this.form.cplx = val;
            let pos = this.cplxlist.findIndex((i) => i.cplx === val);
            if (pos !== -1) {
              this.form.cplx = this.cplxlist[pos].cplx;
              this.form.th = this.cplxlist[pos].th;
              this.form.mh = this.cplxlist[pos].mh;
              this.get_jcdata_by_lx(val);
            }
          }
        });
      }
      if (this.list.length === 0) {
        this.form.cplx = val;
        let pos = this.cplxlist.findIndex((i) => i.cplx === val);
        if (pos !== -1) {
          this.form.cplx = this.cplxlist[pos].cplx;
          this.form.th = this.cplxlist[pos].th;
          this.form.mh = this.cplxlist[pos].mh;
          this.get_jcdata_by_lx(val);
        }
      }
    },
    set_rowspan(i, col1, col1v, col2, col2v) {
      for (let j = i + 1; j < this.list.length; j++) {
        const elkxmcj = this.list[j][col1];
        const elcpfwj = this.list[j][col2];
        if (col1v === elkxmcj && col2v === elcpfwj) {
          this.list[i][col1 + "rowspan"]++;
          this.list[j][col1 + "isshow"] = false;
        } else {
          break;
        }
      }
    },
    get_jcdata_by_lx(lx) {
      try {
        ApiFn.requestapi("get", "/cdgc/gtjc/checkdata/create_bill", {
          rq: this.form.rq,
          cplx: lx,
        }).then((r) => {
          if (r.code === 1) {
            this.form.ewm1 = "";
            this.form.ewm2 = "";
            this.form.ewm3 = "";
            this.form.ewm4 = "";
            this.form.mh1 = "";
            this.form.mh2 = "";
            this.form.mh3 = "";
            this.form.mh4 = "";
            this.billids = r.ids;
            ApiFn.requestapi("get", "/cdgc/gtjc/jcsj/get_jcdata_lx", {
              lx: lx,
            }).then((res) => {
              if (res.code === 1) {
                this.list = res.list.map((i) => {
                  i.cpfwrowspan = 1;
                  i.kxmcrowspan = 1;
                  i.kjzszrowspan = 1;
                  i.sdzszrowspan = 1;
                  i.cpfwisshow = true;
                  i.kxmcisshow = true;
                  i.kjzszisshow = true;
                  i.sdzszisshow = true;
                  i.result1 = "";
                  i.result2 = "";
                  i.result3 = "";
                  i.result4 = "";
                  //
                  i.size1 = "";
                  i.size2 = "";
                  i.size3 = "";
                  i.size4 = "";
                  //
                  i.jg1 = "";
                  i.jg2 = "";
                  i.jg3 = "";
                  i.jg4 = "";
                  //样式
                  i.class1 = "";
                  i.class2 = "";
                  i.class3 = "";
                  i.class4 = "";
                  i.sdclass1 = "";
                  i.sdclass2 = "";
                  i.sdclass3 = "";
                  i.sdclass4 = "";
                  return i;
                });
                for (let i = 0; i < this.list.length; i++) {
                  const elcpfwi = this.list[i].cpfw;
                  const elkxmci = this.list[i].kxmc;
                  const elkjzszi = this.list[i].kjzsz;
                  const elsdzszi = this.list[i].sdzsz;
                  for (let j = i + 1; j < this.list.length; j++) {
                    const elcpfwj = this.list[j].cpfw;
                    if (elcpfwi === elcpfwj) {
                      this.list[i].cpfwrowspan++;
                      this.list[j].cpfwisshow = false;
                    }
                  }
                  this.set_rowspan(i, "kxmc", elkxmci, "cpfw", elcpfwi);
                  this.set_rowspan(i, "kjzsz", elkjzszi, "cpfw", elcpfwi);
                  this.set_rowspan(i, "sdzsz", elsdzszi, "cpfw", elcpfwi);
                }
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            this.$message.error(r.msg);
          }
        });
      } catch (error) {
        this.$message.error(error);
      }
    },
    //孔径值检测
    kj_change_handle(row, index) {
      let keyname = "result" + index;
      let kname = "class" + index;
      if (row.kjtype === "radio") {
        if (row[keyname] === "T" || row[keyname] === "Z") {
          row[kname] = "tderror";
        } else if (row[keyname] === "TZ") {
          row[kname] = "tdok";
        } else {
          row[kname] = "";
        }
      } else if (row.kjtype === "text") {
        let inputval = row[keyname];
        if (isNaN(inputval)) {
          this.$message.error("输入的类型不合法");
        } else {
          if (
            parseFloat(inputval) >= parseFloat(row.kjccxx) &&
            parseFloat(inputval) <= parseFloat(row.kjccsx)
          ) {
            row[kname] = "txtok";
          } else if (inputval === "") {
            row[kname] = "notxt";
          } else {
            row[kname] = "txterror";
          }
        }
      }
    },
    //深度面距值检测
    sdmj_change_handle(row, index) {
      let keyname = "size" + index;
      let kname = "sdclass" + index;
      if (row.sdtype === "text") {
        let inputval = row[keyname];
        if (isNaN(inputval)) {
          this.$message.error("输入的类型不合法");
        } else {
          if (
            parseFloat(inputval) >= parseFloat(row.sdmjxx) &&
            parseFloat(inputval) <= parseFloat(row.sdmjsx)
          ) {
            row[kname] = "txtok";
          } else if (inputval === "") {
            row[kname] = "txtok";
          } else {
            row[kname] = "txterror";
          }
        }
      }
    },
    get_data_by_vin(index) {
      if (!this.form.th) {
        this.$message.error("请选择图号");
        return;
      }
      let k = "ewm" + index;
      let v = this.form[k];
      let rq = this.form.rq;
      ApiFn.requestapi("get", "/cdgc/gtjc/checkdata/get_check_data", {
        rq: rq,
        ewm: v,
        cplx: this.form.cplx,
      }).then((res) => {
        if (res.code === 1) {
          if (res.list.length > 0) {
            res.list.forEach((i) => {
              let pos = this.list.findIndex((t) => t.id === i.jcid);
              if (pos !== -1) {
                this.list[pos]["result" + index] = i.kjval;
                this.list[pos]["size" + index] = i.sdmjval;
                this.list[pos]["jg" + index] = i.jcjg;
                if (this.list[pos].kjtype === "radio") {
                  if (i.kjval === "TZ") {
                    this.list[pos]["class" + index] = "tdok";
                  } else if (i.kjval === "T" || i.kjval === "Z") {
                    this.list[pos]["class" + index] = "tderror";
                  } else {
                    this.list[pos]["class" + index] = "";
                  }
                } else if (this.list[pos].kjtype === "text") {
                  if (
                    this.list[pos].kjccxx <= i.kjval &&
                    i.kjval <= this.list[pos].kjccsx
                  ) {
                    this.list[pos]["class" + index] = "txtok";
                  } else if (i.kjval === "") {
                    this.list[pos]["class" + index] = "txtok";
                  } else {
                    this.list[pos]["class" + index] = "txterror";
                  }
                } else if (this.list[pos].sdtype === "text") {
                  if (
                    this.list[pos].sdmjxx <= i.sdmjval &&
                    i.sdmjval <= this.list[pos].sdmjsx
                  ) {
                    this.list[pos]["sdclass" + index] = "txtok";
                  } else if (i.sdmjval === "") {
                    this.list[pos]["sdclass" + index] = "txtok";
                  } else {
                    this.list[pos]["sdclass" + index] = "txterror";
                  }
                }
              } else {
                this.list[pos]["class" + index] = "";
              }
            });
          } else {
            this.list.forEach((i) => {
              i["result" + index] = "";
              i["size" + index] = "";
              i["jg" + index] = "";
              i["class" + index] = "";
              i["sdclass" + index] = "";
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    create_bill_ids() {
      ApiFn.requestapi("get", "/cdgc/gtjc/checkdata/create_bill", {
        rq: this.form.rq,
        cplx: this.form.cplx,
      }).then((res) => {
        if (res.code === 1) {
          this.billids = res.ids;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    save_gtjc_bill() {
      let postdata = [];
      if (this.form.jth1 && this.form.ewm1) {
        postdata.push({
          id: this.billids[0],
          rq: this.form.rq,
          cplx: this.form.cplx,
          th: this.form.th,
          jyry: this.form.jyy,
          jth: this.form.jth1,
          vin: this.form.ewm1,
          mh: this.form.mh1,
          jylb: this.form.jylb1,
          zxjcgtjcdetail: this.list.map((i) => {
            let mxobj = {
              jcid: i.id,
              cpfw: i.cpfw,
              kxmc: i.kxmc,
              kxcc: i.kjzsz,
              sdmj: i.sdzsz,
              kjval: i.result1,
              sdmjval: i.size1,
              jcjg: i.jg1,
            };
            return mxobj;
          }),
        });
      }
      if (this.form.jth2 && this.form.ewm2) {
        postdata.push({
          id: this.billids[1],
          rq: this.form.rq,
          cplx: this.form.cplx,
          th: this.form.th,
          jyry: this.form.jyy,
          jth: this.form.jth2,
          vin: this.form.ewm2,
          mh: this.form.mh2,
          jylb: this.form.jylb2,
          zxjcgtjcdetail: this.list.map((i) => {
            let mxobj = {
              jcid: i.id,
              cpfw: i.cpfw,
              kxmc: i.kxmc,
              kxcc: i.kjzsz,
              sdmj: i.sdzsz,
              kjval: i.result2,
              sdmjval: i.size2,
              jcjg: i.jg2,
            };
            return mxobj;
          }),
        });
      }
      if (this.form.jth3 && this.form.ewm3) {
        postdata.push({
          id: this.billids[2],
          rq: this.form.rq,
          cplx: this.form.cplx,
          th: this.form.th,
          jyry: this.form.jyy,
          jth: this.form.jth3,
          vin: this.form.ewm3,
          mh: this.form.mh3,
          jylb: this.form.jylb3,
          zxjcgtjcdetail: this.list.map((i) => {
            let mxobj = {
              jcid: i.id,
              cpfw: i.cpfw,
              kxmc: i.kxmc,
              kxcc: i.kjzsz,
              sdmj: i.sdzsz,
              kjval: i.result3,
              sdmjval: i.size3,
              jcjg: i.jg3,
            };
            return mxobj;
          }),
        });
      }
      if (this.form.jth4 && this.form.ewm4) {
        postdata.push({
          id: this.billids[3],
          rq: this.form.rq,
          cplx: this.form.cplx,
          th: this.form.th,
          jyry: this.form.jyy,
          jth: this.form.jth4,
          vin: this.form.ewm4,
          mh: this.form.mh4,
          jylb: this.form.jylb4,
          zxjcgtjcdetail: this.list.map((i) => {
            let mxobj = {
              jcid: i.id,
              cpfw: i.cpfw,
              kxmc: i.kxmc,
              kxcc: i.kjzsz,
              sdmj: i.sdzsz,
              kjval: i.result4,
              sdmjval: i.size4,
              jcjg: i.jg4,
            };
            return mxobj;
          }),
        });
      }
      try {
        if (postdata.length > 0) {
          ApiFn.requestapi(
            "post",
            "/cdgc/gtjc/checkdata/save_bill",
            postdata
          ).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("机台号、二维码、模号需输入完整");
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .gtjc_title {
  width: 100%;
  font-size: 35px;
  height: 35px;
  line-height: 35px;
  font-weight: bold;
  margin: 20px auto;
  text-align: center;
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
}
::v-deep .gtjc_body {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
}
::v-deep .gtjc_body td {
  padding: 0px;
  margin: 0px;
  height: 30px;
  line-height: 30px;
  border: 1px solid rgb(199, 199, 199);

  text-align: center;
}
::v-deep .td_label {
  font-weight: bold;
  background-color: rgb(231, 231, 231);
}
::v-deep .td_check_label {
  background-color: rgb(231, 231, 231);
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
::v-deep .tdjg {
  background-color: rgb(231, 231, 231);
}
::v-deep .gtjc_fixed {
  position: sticky;
  position: -webkit-sticky;
  top: 0px;
}
::v-deep .operate_bar {
  width: 100%;
  margin: 10px auto;
  text-align: right;
  position: sticky;
  bottom: 0;
}
</style>