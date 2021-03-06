import ApiFn from '@/api/baseapi';
export const lbj_baseinfo_mixin = {
    data() {
        return {
            gcxx_list: [],
            scxxx_list: [],
            gwzd_list: [],
            dbxx_list: [],
            unuse_dbxx_list:[],
            rjxx_list: [],
            sbxx_list: [],
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
        get_sbxx_list(){
            ApiFn.requestapi('get', 'lbj/baseinfo/sbxx').then(res => {
                if (res.code === 1) {
                    this.sbxx_list = res.list;
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
        get_unusedbxx_list(){
            ApiFn.requestapi('get', 'lbj/baseinfo/unuse_dbxx').then(res => {
                if (res.code === 1) {
                    this.unuse_dbxx_list = res.list;
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

    },
}