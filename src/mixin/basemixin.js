import Vue from 'vue'
import ApiFn from "@/api/baseapi";
import { deepClone, newGuid, parseTime } from "@/utils/index";
import condition from "./search_form";
Vue.prototype.$newGuid = newGuid;
Vue.prototype.$parseTime = parseTime;
Vue.prototype.$deepClone = deepClone;
Vue.prototype.$request = ApiFn.requestapi;
export const basemixin = {
    data() {
        return {
            list: [],
            selectlist: [],
            colshowlist: [],
            btnlist: [],
            batbtnlist: [],
            pagepermis: {},
            pageconfig: {},
            editstatus: false,
            dialogvisible: false,
            resultcount: 0,
            queryform: {
                search_condition: [],
                px_condition: [],
                pageindex: 1,
                pagesize: 20,
            },
            trbginfo: {},
        }
    },
    computed: {
        edittxt() {
            if (this.editstatus) {
                return '取消编辑';
            } else {
                return '编辑';
            }
        }
    },
    created() {
        this.getpageconfig();
        Vue.prototype.$basepage = this;
    },
    mounted() {
    },
    methods: {
        getpageconfig() {
            try {
                ApiFn.pageconfig().then((res) => {
                    if (res.code === 1) {
                        //this.pageconfig = eval(res.pageconfig);
                        this.pageconfig = Function('return ' + res.pageconfig)();
                        this.pagepermis = res.pagepermis;
                        this.btnlist = res.pagebtns;
                        this.batbtnlist = res.batbtns;
                        let hidecols = this.pagepermis.hidefields;
                        var ddlcol = this.pageconfig.fields.filter(i => i.inioptionapi);
                        if (ddlcol) {
                            ddlcol.forEach(i => {
                                try {
                                    if (i.inioptionapi) {
                                        ApiFn.requestapi(i.inioptionapi.method, i.inioptionapi.url, {}).then(result => {
                                            if (result.code === 1) {
                                                i.options = result.list;
                                            } else if (result.code === 0) {
                                                this.$message.error(result.msg);
                                            }
                                        });
                                    }
                                } catch (error) {
                                    this.$message.error(error);
                                }
                            })
                        }
                        this.colshowlist = this.pageconfig.fields.filter((item) => {
                            return !hidecols.some((t) => t === item.prop);
                        });
                        if (this.pageconfig.pagefuns) {
                            Object.keys(this.pageconfig.pagefuns).forEach((key) => {
                                this[key] = this.pageconfig.pagefuns[key];
                            });
                        }
                        if (this.pageconfig.trbginfo) {
                            this.trbginfo = this.pageconfig.trbginfo;
                        }
                        this.getlist(this.queryform);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            } catch (error) {
                this.$message.error(error);
            }
        },
        getlist(data) {
            try {
                if (this.pageconfig.queryapi) {
                    ApiFn.requestapi(
                        this.pageconfig.queryapi.method,
                        this.pageconfig.queryapi.url,
                        data
                    ).then((res) => {
                        if (res.code === 1) {
                            this.$message.success(res.msg);
                            this.editstatus = false;
                            this.resultcount = res.resultcount;
                            this.list = res.list.map((i) => {
                                i.rowkey = newGuid();
                                i.isdb = true;
                                i.isedit = false;
                                return i;
                            });
                            this.pageconfig.queryapi.callback(this, res);
                        } else {
                            this.$message.error(res.msg);
                        }
                    });
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        invokfn(f) {
            this[f]();
        },
        edit_handle() {
            try {
                if (this.selectlist.length > 0) {
                    this.editstatus = !this.editstatus;
                    if (this.editstatus) {
                        this.selectlist.forEach(i => {
                            if (this.pageconfig.disedit) {
                                if (i[this.pageconfig.disedit.fieldname] === this.pageconfig.disedit.fieldvalue) {
                                    i.isedit = false;
                                } else {
                                    i.isedit = true;
                                }
                            } else {
                                i.isedit = true;
                            }
                        });
                    } else {
                        this.selectlist.forEach(i => {
                            i.isedit = false;
                        });
                    }
                } else {
                    this.$message.warning('请选择要编辑的项目');
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        del_handle() {
            try {
                if (this.selectlist.length > 0) {
                    this.$confirm("你确定要删除?", "警告", {
                        type: "warning",
                        cancelButtonClass: "el-button--primary",
                        confirmButtonClass: "el-button--danger",
                    }).then(() => {
                        let cachedata = this.selectlist.filter((i) => !i.isdb);
                        if (cachedata.length > 0) {
                            cachedata.forEach((t) => {
                                let pos = this.list.findIndex(
                                    (i) => i.rowkey === t.rowkey
                                );
                                if (pos !== -1) {
                                    this.list.splice(pos, 1);
                                }
                            });
                        }
                        let dbdata = this.selectlist.filter((i) => i.isdb);
                        if (dbdata.length > 0) {
                            try {
                                if (this.pageconfig.delapi) {
                                    ApiFn.requestapi(
                                        this.pageconfig.delapi.method,
                                        this.pageconfig.delapi.url,
                                        dbdata
                                    ).then(res => {
                                        if (res.code === 1) {
                                            this.$message.success(res.msg);

                                            if (this.pageconfig.isfresh) {
                                                this.getlist(this.queryform);
                                            } else {
                                                dbdata.forEach((t) => {
                                                    let pos = this.list.findIndex(
                                                        (i) => i.rowkey === t.rowkey
                                                    );
                                                    if (pos !== -1) {
                                                        this.list.splice(pos, 1);
                                                    }
                                                });
                                            }
                                            this.pageconfig.delapi.callback(this, res);
                                        } else {
                                            this.$message.error(res.msg);
                                        }
                                    });
                                }
                            } catch (error) {
                                this.$message.error(error);
                            }
                        }
                        this.$refs.tablecomponent.clearSelection();
                    });
                } else {
                    this.$message.warning("请选择项目");
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        save_handle() {
            try {
                let cachedata = this.list.filter((i) => !i.isdb && i.isedit);
                let dbdata = this.list.filter((i) => i.isdb && i.isedit);
                if (cachedata.length > 0) {
                    try {
                        if (this.pageconfig.addapi) {
                            ApiFn.requestapi(this.pageconfig.addapi.method, this.pageconfig.addapi.url, cachedata).then((res) => {
                                if (res.code === 1) {
                                    this.$message.success(res.msg);
                                    if (this.pageconfig.isfresh) {
                                        this.getlist(this.queryform);
                                    } else {
                                        cachedata.forEach(i => { i.isedit = false; i.isdb = true; });
                                        this.editstatus = false;
                                        this.pageconfig.addapi.callback(this, res);
                                    }
                                }
                                else if (res.code === 2) {
                                    this.$message.warning(res.msg);
                                    this.pageconfig.addapi.callback(this, res);
                                }
                                else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    } catch (error) {
                        this.$message.error(error);
                    }
                }
                if (dbdata.length > 0) {
                    try {
                        if (this.pageconfig.editapi) {
                            ApiFn.requestapi(this.pageconfig.editapi.method, this.pageconfig.editapi.url, dbdata).then((res) => {
                                if (res.code === 1) {
                                    if (this.pageconfig.isfresh) {
                                        this.getlist(this.queryform);
                                    } else {
                                        dbdata.forEach(i => { i.isedit = false; i.isdb = true; })
                                        this.editstatus = false;
                                        this.pageconfig.editapi.callback(this, res);
                                    }
                                } else {
                                    this.$message.error(res.msg);
                                }
                            });
                        }
                    } catch (error) {
                        this.$message.error(error);
                    }
                }
                this.$refs.tablecomponent.clearSelection();
            } catch (error) {
                this.$message.error(error);
            }
        },
        pageindex_change_handle(index) {
            this.queryform.pageindex = index;
            this.getlist(this.queryform);
        },
        pagesize_change_handle(value) {
            this.queryform.pagesize = value;
            this.getlist(this.queryform);
        },
        query_handle(data) {
            if (data.field) {
                let exp = deepClone(condition.form);
                exp.colname = data.field;
                exp.coltype = data.fieldtype;
                exp.oper = data.operate;
                exp.value = data.value;
                exp.values = data.values;
                this.queryform.search_condition = [];
                this.queryform.px_condition = [];
                this.queryform.search_condition.push(exp);
            } else {
                this.queryform.search_condition = [];
                this.queryform.px_condition = [];
            }
            this.queryform.pageindex = 1;
            this.getlist(this.queryform);
        },
        grade_query_handle(data) {
            this.queryform.search_condition = [];
            this.queryform.px_condition = [];
            data.list.forEach((i) => {
                let exp = deepClone(condition.form);
                exp.colname = i.colname;
                exp.coltype = i.coltype;
                exp.oper = i.oper;
                exp.logic = i.logic;
                exp.value = i.value;
                exp.values = i.values;
                this.queryform.search_condition.push(exp);
            });
            if (data.pxlist) {
                this.queryform.px_condition = data.pxlist;
            }
            this.queryform.pageindex = 1;
            this.getlist(this.queryform);
        },
    },
}