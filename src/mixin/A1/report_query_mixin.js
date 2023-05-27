import ApiFn from "@/api/baseapi";
import SearchForm from "@/mixin/search_form";
import { deepClone } from "@/utils/index";
export const querybarmixin={
    data() {
        return {
            jclxlist:[],
            scxlist: [],
            searchform: SearchForm.form,
            gwhs:[],
            search_condition:[]
        }
    },
    mounted() {
        this.getscxlist();
    },
    methods: {
        getscxlist() {
            ApiFn.requestapi("get", "/a1/baseinfo/scx").then((res) => {
                if (res.code === 1) {
                    this.scxlist = res.list;
                }
            });
        },
        getjclxlist() {
            ApiFn.requestapi("get", "/a1/baseinfo/zxjclx").then((res) => {
                if (res.code === 1) {
                    this.jclxlist = res.list;
                }
            });
        },
        scx_change_handle(val) {
            ApiFn.requestapi("get", "/a1/baseinfo/gwzdbyscx", { scx: val }).then((res) => {
                if (res.code === 1) {
                    this.gwhs = res.list;
                }
            });
        },
        get_search_condition(){
            this.search_condition = [];
            Object.keys(this.form).forEach((i) => {
                let exp = deepClone(this.searchform);
                exp.colname = i;
                if (Object.prototype.toString.call(this.form[i]) === "[object Array]") {
                    exp.coltype = "list";
                    exp.values = this.form[i];
                    exp.oper = "in";
                }
                else {
                    exp.coltype = "string";
                    exp.value = this.form[i];
                    exp.oper = "=";
                }
                this.search_condition.push(exp);
            });
        },
        btn_search_handle() {
            this.get_search_condition();
            this.$emit("query", this.search_condition);
        },
        btn_export_handle(){
            this.get_search_condition();
            this.$emit("export_to_excel", this.search_condition);
        }
    }
}