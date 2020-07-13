import { mapState, mapActions } from "vuex";
import style from "./Login.module.scss";
import logo from "../assets/images/logo.png";
export default {
  data() {
    return {
      username: "",
      password: "",
      remenberMe: false,
      loginLoading: false
    };
  },

  methods: {
    login() {
      if (this.username == "") {
        this.$message({
          message: "请输入用户名!",
          type: "warning"
        });
        return;
      }
      if (this.password == "") {
        this.$message({
          message: "请输入密码!",
          type: "warning"
        });
        return;
      }
      this.loginAction({
        username: this.username,
        password: this.password,
        remenberMe: this.remenberMe
      });
    },
    ...mapActions(["loginAction"])
  },
  mounted() {
    let rem = localStorage.getItem("remenberMe");
    if (rem == "true") {
      this.remenberMe = true;
      this.username = localStorage.getItem("usernameRem");
      this.password = localStorage.getItem("passwordRem");
    }
  },
  render() {
    return (
      <div class={style.login}>
        <div class={style.loginForm}>
          <div class={style.loginHeader}>
            <img src={logo} width="85" height="85" alt="" />
            <p>安全电子邮件</p>
          </div>
          <ElInput
            placeholder="请输入用户名"
            suffix-icon="fa fa-user"
            class={style.elinput}
            vModel={this.username}
          />
          <ElInput
            placeholder="请输入密码"
            type="password"
            suffix-icon="fa fa-keyboard-o"
            class={style.elinput}
            vModel={this.password}
          />
          <ElButton
            type="primary"
            loading={this.loginLoading}
            onClick={this.login}
            style="width: 100%;margin-bottom: 18px"
          >
            登录
          </ElButton>
          <div>
            <ElCheckbox
              value={this.remenberMe}
              onChange={checked => (this.remenberMe = checked)}
            >
              记住我
            </ElCheckbox>
            {/* <a href="javascript:;" class={style.register}>
              注册
            </a> */}
            {this.$store.state.login.message
              ? this.$store.state.login.message
              : ""}
          </div>
        </div>
      </div>
    );
  }
};
