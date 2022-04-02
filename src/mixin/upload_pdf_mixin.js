export const upload_pdf_mixin={
    methods: {
        before_upload_PDFHandle(file) {
            const ispdf = ["application/pdf"].indexOf(file.type);
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (ispdf < 0) {
                this.$message.error("上传文件只能是pdf格式!");
            }
            if (!isLt5M) {
                this.$message.error("上传文件不能超过5MB!");
            }
            let isok = ispdf >= 0 && isLt5M;
            return isok;
        },
        
    },
}