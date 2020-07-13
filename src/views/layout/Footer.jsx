import { request } from "../../api/data-api";
import { mapState, mapMutations } from "vuex";
export default {
  created() {
    //console.log("currentMenu", this.$store.state.currentMenu);
  },
  computed: {
    ...mapState(["nav"])
  },
  methods: {
    ...mapMutations(["updateCurrentMenu", "updateMenuList", "updateNav"]),
    //切换运维管理
    tabOperations() {
      request("/operationMenuList", data => {
        sessionStorage.setItem("menu", JSON.stringify(data.menu));
        sessionStorage.setItem("currentMenu", "operations");
        this.updateMenuList(JSON.parse(sessionStorage.getItem("menu")));
        this.updateCurrentMenu(sessionStorage.getItem("currentMenu"));
        this.nav.splice(4, this.nav.length - 4);
        this.updateNav(this.nav);
        setTimeout(() => {
          this.getMarginTop();
        }, 100);
        this.$router.push(data.menu[0].path);
      });
    },
    //切换业务管理
    tabBusiness() {
      request("/businessMenu", data => {
        sessionStorage.setItem("menu", JSON.stringify(data.menu));
        sessionStorage.setItem("currentMenu", "business");
        this.updateMenuList(JSON.parse(sessionStorage.getItem("menu")));
        this.updateCurrentMenu(sessionStorage.getItem("currentMenu"));
        this.nav.splice(4, this.nav.length - 4);
        this.updateNav(this.nav);
        setTimeout(() => {
          this.getMarginTop();
        }, 100);
        this.$router.push(data.menu[0].path);
      });
    },
    //切换业务应用
    tabMain() {
      request("/loginRetData", data => {
        sessionStorage.setItem("menu", JSON.stringify(data.menu));
        sessionStorage.setItem("currentMenu", "main");
        this.updateMenuList(JSON.parse(sessionStorage.getItem("menu")));
        this.updateCurrentMenu(sessionStorage.getItem("currentMenu"));
        this.nav.splice(4, this.nav.length - 4);
        this.updateNav(this.nav);
        setTimeout(() => {
          this.getMarginTop();
        }, 100);
        this.$router.push(data.menu[0].path);
      });
    },
    //菜单切换需要重新计算margin-top
    getMarginTop() {
      var asideHeight = document.getElementById("aside-content").clientHeight;
      var menuHeight = document.getElementById("menu-box").clientHeight;
      var asideBottomHeight = document.getElementById("aside-bottom")
        .clientHeight;
      var asideBottomMarginTop = 0;
      if (asideHeight - menuHeight - asideBottomHeight > 10) {
        asideBottomMarginTop = asideHeight - menuHeight - asideBottomHeight;
      } else {
        asideBottomMarginTop = 10;
      }
      this.$store.commit("updateAsideBottomMarginTop", asideBottomMarginTop);
    }
  },
  render() {
    return (
      <div class="footer" id="footer">
        <span class="copyright">
          Copyright © <a href="javascript:;">安全邮件</a>
        </span>
        <div
          class="footer-right-link"
          style={
            this.$store.state.currentMenu == "main"
              ? "display:inline-block;"
              : "display:none;"
          }
        >
          <span class="cur-p" onClick={this.tabOperations}>
            运维管理&nbsp;&nbsp;
          </span>
          <span>|</span>
          <span class="cur-p" onClick={this.tabBusiness}>
            &nbsp;&nbsp;业务管理
          </span>
        </div>
        <div
          class="footer-right-link"
          style={
            this.$store.state.currentMenu == "operations"
              ? "display:inline-block;"
              : "display:none;"
          }
        >
          <span class="cur-p" onClick={this.tabMain}>
            业务应用&nbsp;&nbsp;
          </span>
          <span>|</span>
          <span class="cur-p" onClick={this.tabBusiness}>
            &nbsp;&nbsp;业务管理
          </span>
        </div>
        <div
          class="footer-right-link"
          style={
            this.$store.state.currentMenu == "business"
              ? "display:inline-block;"
              : "display:none;"
          }
        >
          <span class="cur-p" onClick={this.tabOperations}>
            运维管理&nbsp;&nbsp;
          </span>
          <span>|</span>
          <span class="cur-p" onClick={this.tabMain}>
            &nbsp;&nbsp;业务应用
          </span>
        </div>
      </div>
    );
  }
};
