<template>
  <div>
    <!-- 缸体检测 -->
    <div class="gtjc_title">{{ form.cplx }}缸体检测记录表</div>
    <table class="gtjc_body">
      <tr>
        <td colspan="2" class="td_label">日期</td>
        <td>
          {{ form.rq | parseTime("{y}-{m}-{d}") }}
        </td>
        <td class="td_label" style="width: 100px">检验员</td>
        <td>
          {{ form.jyy }}
        </td>
        <td colspan="3" class="td_label" style="width: 100px">检验类别</td>
        <td>
          {{ form.jylb }}
        </td>
      </tr>
      <tr>
        <td rowspan="3" colspan="2" class="td_label">图号</td>
        <td rowspan="3" colspan="3">
          {{ form.th }}
        </td>
        <td colspan="3" class="td_label" style="width: 100px">机台号</td>
        <td>
          {{ form.jth }}
        </td>
      </tr>
      <tr>
        <td colspan="3" class="td_label" style="width: 100px">二维码</td>
        <td>
          {{ form.ewm }}
        </td>
      </tr>
      <tr>
        <td colspan="3" class="td_label" style="width: 100px">
          模号{{ form.mh }}
        </td>
        <td>
          {{ form.mh }}
        </td>
      </tr>
      <tr>
        <td colspan="2" class="td_label">检验项目</td>
        <td colspan="3" class="td_label">图样技术要求</td>
        <td colspan="4" class="td_label">实测数据</td>
      </tr>
      <tr>
        <td  class="td_label" style="width: 50px">序号</td>
        <td  class="td_label" style="width: 70px">产品方位</td>
        <td  class="td_label" style="width: 50px">孔系名称</td>
        <td  class="td_label" style="width: 70px">孔径尺寸</td>
        <td  class="td_label" style="width: 70px">深度面距</td>
        <!-- 实测数据 -->
        <td colspan="3" class="td_label">孔径尺寸</td>
        <td  class="td_label">深度面距尺寸</td>
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
            <span v-if="item.kjtype === 'radio'">
              {{item.result1 | jgformat}}
            </span>
            <span v-else-if="item.kjtype === 'text'">
                {{item.result1}}
            </span>
          </td>
          <td :class="item.sdclass1">
            <span v-if="item.sdtype === 'text'">
                {{item.size1}}
            </span>
            <span v-else-if="item.sdtype === 'none'">/</span>
          </td>
        </template>
        <template v-else>
          <td class="td_check_label" colspan="3">{{ item.kxmc }}</td>
          <td colspan="4">
            <span>{{item.jg1}}</span>
          </td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { parseTime } from "@/utils/index";
export default {
  name: "GtjcviewComponent",
  data() {
    return {
      list: [],
      cplxlist: [],
      jylblist: [],
      billids: [0, 0, 0, 0],
      form: {
        cplx: "", //缸体类型
        th: "", //图号
        mh: "", //模号
        rq: parseTime(new Date()),
        jyy: "",
        jth: "1",
        ewm: "",
        jylb: "",
        datalist: [],
      },
    };
  },
  props: {
    billid: {
      type: Number,
      default: 0,
    },
    lx:{
        type:String,
        default:''
    }
  },
  mounted() {
    this.get_cplx_list(this.lx);
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
    this.load_data();
  },
  filters: {
    jgformat: function(value) {
        if(value === 'TZ'){
            return 'T进Z止'
        }
        else if(value === 'T'){
             return 'T不进'
        }
        else if(value === 'Z'){
             return 'Z不止'
        }else{
        return value;
        }
    }
  },
  methods: {
    load_data() {
      ApiFn.requestapi("get", "/cdgc/gtjchis/billinfo", {
        billid: this.billid,
      }).then((res) => {
        if (res.code === 1) {
          console.log(res.bill);
          if(res.bill){
            this.form.cplx = res.bill.cplx;
            this.form.rq = res.bill.rq;
            this.form.th = res.bill.th;
            this.form.mh = res.bill.mh;
            this.form.jyy = res.bill.jyy;
            this.form.jth = res.bill.jth;
            this.form.ewm = res.bill.vin;
            this.form.jylb = res.bill.jylb;
            console.log(res.bill);
            this.form.datalist = res.bill.zxjcgtjcdetail;
            console.log(res.bill.zxjcgtjcdetail);
            res.bill.zxjcgtjcdetail.forEach(e=>{
               let elindex = this.list.findIndex(i=>i.id === e.jcid);
                if(elindex!==-1){
                    this.list[elindex].result1 = e.kjval;
                    this.list[elindex].size1 = e.sdmjval;
                    this.list[elindex].jg1 = e.jcjg;
                }
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    get_cplx_list(lx) {
      try {
        ApiFn.requestapi("get", "/cdgc/gtjc/jcsj/get_jcdata_lx",{lx:lx})
          .then((res) => {
            if (res.code === 1) {
                console.log(res.list);
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
          })
          .finally();
      } catch (error) {
        this.$message.error(error);
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
}
::v-deep .gtjc_body {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
}
::v-deep .gtjc_body td {
  padding: 5px;
  margin: 0px;
  height: 30px;
  line-height: 30px;
  border: 1px solid rgb(199, 199, 199);
  white-space: nowrap;
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