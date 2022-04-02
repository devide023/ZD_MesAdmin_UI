export const upload_xls_mixin={
    methods: {
        before_upload_handle(file) {
            const isxls = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"].indexOf(file.type);
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (isxls < 0) {
                this.$message.error("上传文件只能是 xls|xlsx 格式!");
            }
            if (!isLt5M) {
                this.$message.error("上传文件大小不能超过 5MB!");
            }
            return isxls >= 0 && isLt5M;
        },
    },
}