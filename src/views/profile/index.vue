<template>
  <div>
    <el-card>
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="操作日志" name="operate_log">
          <log-component></log-component>
        </el-tab-pane>
        <el-tab-pane label="账号" name="account">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            label-position="right"
            :rules="rules"
          >
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="form.pass"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="form.checkPass"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="change_user_pwd"
                >修改</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import ApiFn from "@/api/baseapi";
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import LogComponent from "./components/UserOperateLog.vue";
export default {
  name: "Profile",
  components: { UserCard, LogComponent },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: {},
      form: {
        id: 0,
        pass: "",
        checkPass: "",
      },
      rules: {
        pass: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
      activeTab: "operate_log",
    };
  },
  computed: {
    ...mapGetters(["name", "avatar"]),
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        avatar: this.avatar,
      };
      this.form.id = this.$store.getters.userinfo.id;
    },
    change_user_pwd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          ApiFn.requestapi("post", "/user/changpwd", this.form).then((res) => {
            if (res.code === 1) {
              this.$message.success(res.msg);
            } else if (res.code === 0) {
              this.$message.error(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
</style>
