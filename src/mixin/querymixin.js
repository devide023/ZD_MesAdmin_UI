import ApiFn from "@/api/baseapi";
export const querymixin = {
    methods: {
        datalist(data) {
            console.log(this.pageconfig)
            ApiFn.requestapi(
                this.pageconfig.queryapi.method,
                this.pageconfig.queryapi.url,
                data
            ).then((res) => {
                if (res.code === 1) {
                    this.resultcount = res.resultcount;
                    this.list = res.list.map((i) => {
                        i.isdb = true;
                        i.isedit = false;
                        return i;
                    });
                    this.pageconfig.queryapi.callback(this, res);
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
    },
}