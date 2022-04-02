import { getToken } from "@/utils/auth";
export const upload_img_mixin={
    data() {
        return {
            headers: {
                Authorization: "Bearer " + getToken(),
            }
        }
    },
    methods: {
        beforeImgUpload(file) {
            const isJPG =
                file.type === "image/jpeg" ||
                file.type === "image/jpg" ||
                file.type === "image/png";
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isJPG) {
                this.$message.error("上传头像图片只能是JPG,PNG格式!");
            }
            if (!isLt5M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt5M;
        },
        handleImageSuccess(res, file) {
            if (res.code === 1) {
                if (res.files.length > 0) {
                    var rowguid = res.files[0].rowguid;
                    var findrow = this.list.find((t) => t.rowguid === rowguid);
                    if (findrow) {
                        findrow[this.img_colname] = res.files[0].serverfilename;
                    }
                }
            } else {
                this.$message.error(res.msg);
            }
        },
    },
}