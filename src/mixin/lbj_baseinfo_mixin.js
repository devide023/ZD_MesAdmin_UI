import ApiFn from '@/api/baseapi';
export const lbj_baseinfo_mixin = {
    data() {
        return {
            gcxx_list: [],
            scxxx_list: [],
            gwzd_list: [],
            dbxx_list: [],
            free_dbxx_list: [],
            rjxx_list: [],
            cnc_list: [],
            free_cnc_list: [],
        }
    },
    methods: {
        get_gcxx_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/gcxx').then(res => {
                if (res.code === 1) {
                    this.gcxx_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_scxxx_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/scx?gcdm=9902').then(res => {
                if (res.code === 1) {
                    this.scxxx_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_gwzd_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/gwzd').then(res => {
                if (res.code === 1) {
                    this.gwzd_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_dbxx_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/dbxx').then(res => {
                if (res.code === 1) {
                    this.dbxx_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_freedb_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/free_db_list').then(res => {
                if (res.code === 1) {
                    this.free_dbxx_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_rjxx_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/rjlx').then(res => {
                if (res.code === 1) {
                    this.rjxx_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            });
        },
        get_cnc_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/cnc_list').then(res => {
                if (res.code === 1) {
                    this.cnc_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            })
        },
        get_free_cnc_list() {
            ApiFn.requestapi('get', 'lbj/baseinfo/free_cnc_list').then(res => {
                if (res.code === 1) {
                    this.free_cnc_list = res.list;
                }
                else if (res.code === 0) {
                    this.$message.error(res.msg);
                }
            })
        }
    },
}