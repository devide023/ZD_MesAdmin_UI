export const batoperatemixin = {
    methods: {
        before_upload_PDFHandle(file) {
            const ispdf = ["application/pdf"].indexOf(file.type);
            const isLt5M = file.size / 1024 / 1024 < 50;
            if (ispdf < 0) {
                this.$message.error("上传文件只能是pdf格式!");
            }
            if (!isLt5M) {
                this.$message.error("上传文件不能超过50MB!");
            }
            let isok = ispdf >= 0 && isLt5M;
            if (isok) {
                this.$loading({
                    lock: true,
                    text: "正在上传文件",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            }
            return isok;
        },
        before_upload_Mp4Handle(file) {
            const ismp4 = ["video/mp4"].indexOf(file.type);
            const isLt500M = file.size / 1024 / 1024 < 500;
            if (ismp4 < 0) {
                this.$message.error("上传文件只能是Mp4格式!");
            }
            if (!isLt500M) {
                this.$message.error("上传文件不能超过500MB!");
            }
            let isok = ismp4 >= 0 && isLt500M;
            if (isok) {
                this.$loading({
                    lock: true,
                    text: "正在上传文件",
                    spinner: "el-icon-loading",
                    background: "rgba(0, 0, 0, 0.7)",
                });
            }
            return isok;
        },
        import_by_add(res, file) {
            try {
                if (typeof (this.pageconfig.batoperate.import_by_add) === 'function') {
                    this.pageconfig.batoperate.import_by_add(this, res, file);
                } else {
                    this.$message.error('is not a function');
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        import_by_replace(res, file) {
            try {
                if (typeof (this.pageconfig.batoperate.import_by_replace) === 'function') {
                    this.pageconfig.batoperate.import_by_replace(this, res, file);
                } else {
                    this.$message.error('is not a function');
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        import_by_zh(res, file) {
            try {
                if (typeof (this.pageconfig.batoperate.import_by_zh) === 'function') {
                    this.pageconfig.batoperate.import_by_zh(this, res, file);
                } else {
                    this.$message.error('is not a function');
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
        export_excel() {
            try {
                if (typeof (this.pageconfig.batoperate.export_excel) === 'function') {
                    this.pageconfig.batoperate.export_excel(this);
                } else {
                    this.$message.error('is not a function');
                }
            } catch (error) {
                this.$message.error(error);
            }
        },
    },
}