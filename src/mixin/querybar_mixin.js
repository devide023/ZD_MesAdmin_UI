import ApiFn from "@/api/baseapi";
import SearchForm from "@/mixin/search_form";
import { deepClone } from "@/utils/index";
export const querybarmixin = {
    data() {
        return {
            scxlist: [],
            searchform: SearchForm.form,
        }
    },
    mounted() {
        this.getscxlist();
    },
    methods: {
        getscxlist() {
            ApiFn.requestapi("get", "/ducar/baseinfo/scx").then((res) => {
                if (res.code === 1) {
                    this.scxlist = res.list;
                }
            });
        },
        scx_change_handle(val) {
            ApiFn.requestapi("get", "/ducar/baseinfo/gwzdbyscx", { scx: val }).then((res) => {
                if (res.code === 1) {
                    this.gwhs = res.list;
                }
            });
        },
        btn_search_handle() {
            let condition = [];
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
                condition.push(exp);
            });
            this.$emit("query", condition);
        },
    }
}