export const upload_mp4_mixin = {
    methods: {
        before_upload_Mp4Handle(file) {
            const ismp4 = ["video/mp4"].indexOf(file.type);
            const isLt5M = file.size / 1024 / 1024 < 500;
            if (ismp4 < 0) {
                this.$message.error("上传文件只能是Mp4格式!");
            }
            if (!isLt5M) {
                this.$message.error("上传文件不能超过500MB!");
            }
            let isok = ismp4 >= 0 && isLt5M;
            if (isok) {
                this.uploadloading = this.$loading({
                    lock: true,
                    text: "正在上传文件",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            }
            return isok;
        },

    },
}