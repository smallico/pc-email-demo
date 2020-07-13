import Header from "./Header";
import Footer from "./Footer";
import MenuListEl from "./Menu";
import NavBar from "./NavBar";
import logo from "../../assets/images/logo.png";
import { mapState, mapMutations } from "vuex";
import "./Main.scss";
import qs from "qs";

export default {
  data() {
    return {
      defaultActive: ""
    };
  },
  computed: mapState({
    fixedTabBar: state => state.layout.fixedTabBar,
    switchTabBar: state => state.layout.switchTabBar,
    isCollapse: state => state.layout.isCollapse,
    menuList: state => state.menuList
  }),
  methods: {
    //nav宽度计算
    navBarWidth() {
      this.headPadding();
      this.footerPadding();
      let navBar = document.getElementById("nav-bar");
      if (!navBar) return;
      if (!(this.fixedTabBar && this.switchTabBar)) {
        navBar.style.width = "100%";
        return;
      }
      let sidebarClose = document.body.classList.contains("sidebar-close");
      if (sidebarClose) {
        navBar.style.width = "100%";
      } else if (this.isCollapse) {
        navBar.style.width = "calc(100% - 64px)";
      } else {
        navBar.style.width = "calc(100% - 230px)";
      }
    },
    //头部padding-left计算
    headPadding() {
      let header = document.getElementById("top-header");
      let sidebarClose = document.body.classList.contains("sidebar-close");
      if (sidebarClose) {
        header.style.paddingLeft = "0px";
      } else if (this.isCollapse) {
        header.style.paddingLeft = "64px";
      } else {
        header.style.paddingLeft = "230px";
      }
    },
    //脚部padding-left计算
    footerPadding() {
      let footer = document.getElementById("footer");
      let sidebarClose = document.body.classList.contains("sidebar-close");
      if (sidebarClose) {
        footer.style.paddingLeft = "0px";
      } else if (this.isCollapse) {
        footer.style.paddingLeft = "64px";
      } else {
        footer.style.paddingLeft = "230px";
      }
    },
    //头部logo文字height计算
    headLogoHeight() {
      let headerLogo = document.getElementById("header-logo");
      if (this.switchTabBar) {
        headerLogo.style.height = "112px";
        headerLogo.style.lineHeight = "112px";
      } else {
        headerLogo.style.height = "65px";
        headerLogo.style.lineHeight = "65px";
      }
      setTimeout(() => {
        this.computedAsideBottomMarginTop();
      }, 400);
    },

    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //关闭菜单
    },
    //菜单collapse
    sidebarToggle(e) {
      e.preventDefault();
      if (this.isCollapse) {
        document.body.classList.remove("sidebar-hidden");
        this.siteName = "安全电子邮件";
        // this.isCollapse = false;
        this.updateIsCollapse(false);
      } else {
        document.body.classList.add("sidebar-hidden");
        this.updateIsCollapse(true);
        // this.isCollapse = true;
      }
      this.navBarWidth();
    },
    //计算左侧容量的margin-top
    computedAsideBottomMarginTop() {
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
    },
    //关闭notify
    closeNotify() {
      debugger;
      this.$store.commit("updateShowNotify", 0);
    },
    ...mapMutations([
      "updateLayoutFixedTabBar",
      "updateSwitchTabBar",
      "updateIsCollapse"
    ])
  },
  created() {
    this.defaultActive = this.$route.path;
    //解决页面刷新Store丢失问题
    if (sessionStorage.getItem("store")) {
      //从缓存中取出state;
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
        )
      );
    }
    window.addEventListener("beforeunload", () => {
      //将Store中state缓存
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
  },
  mounted() {
    /*     document.getElementById("navAndContent").style.height =
    "calc(100vh-100px)"; */
    if (this.switchTabBar) {
      if (this.fixedTabBar) {
        document.getElementById("navAndContent").style.paddingTop = "112px";
      } else {
        document.getElementById("navAndContent").style.paddingTop = "65px";
      }
    } else {
      document.getElementById("navAndContent").style.paddingTop = "65px";
    }

    if (!this.isCollapse) {
      document.body.classList.remove("sidebar-hidden");
      this.siteName = "安全电子邮件";
    } else {
      document.body.classList.add("sidebar-hidden");
    }

    /* setTimeout(() => {
      this.navBarWidth();
      this.headLogoHeight();
    }, 200); */
    this.navBarWidth();
    this.headLogoHeight();
  },
  watch: {
    $route(n) {
      if (JSON.stringify(n.query) == "{}") {
        this.defaultActive = n.path;
      } else {
        this.defaultActive = n.path + "?" + qs.stringify(n.query);
      }
    }
  },

  render() {
    return (
      <div class="main">
        <div class="app">
          <div
            class="notify-box"
            style={
              this.$store.state.showNotify == 1
                ? "display:inline-block;"
                : "display:none;"
            }
          >
            <span class="close-notify" onClick={this.closeNotify}>
              X
            </span>
            <h3 class="notify-header">系统提示</h3>
            <ElProgress percentage={this.$store.state.sendPercent} />
            <div class="notify-msg">
              <i
                class="el-icon-success"
                style={
                  this.$store.state.sendPercent == 100
                    ? "display:inline-block;"
                    : "display:none;"
                }
              />
              {this.$store.state.notifyMsg}
            </div>
          </div>
          <div class="aside" id="aside">
            <div class="aside-content" id="aside-content">
              <div class="menu" id="menu-box">
                <div class="logo" id="header-logo">
                  <span class="big">安全电子邮件软件</span>
                  <span class="min">
                    <img
                      width="40"
                      style="margin-top: 10px"
                      src={logo}
                      alt=""
                    />
                  </span>
                </div>
                <ElMenu
                  router
                  background-color="#222d32"
                  text-color="#fff"
                  default-active={this.defaultActive}
                  class="menu"
                  onOpen={this.handleOpen}
                  onClose={this.handleClose}
                  collapse={this.isCollapse}
                >
                  <MenuListEl menuList={this.menuList} />
                </ElMenu>
              </div>
              <div
                class="aside-bottom"
                id="aside-bottom"
                style={
                  "margin-top:" + this.$store.state.asideBottomMarginTop + "px;"
                }
              >
                <div class="capacity-div">
                  <div>
                    收件箱：<span class="has-used">1.2GB</span>/10GB
                  </div>
                  <div>
                    发件箱：<span class="has-used">2.5GB</span>/10GB
                  </div>
                </div>
                <div class="sidebar-toggle" onClick={this.sidebarToggle}>
                  <div class="icon-left">
                    {/* <i class="el-icon-back" style={{ fontSize: "12px" }} /> */}
                    <i
                      class="el-icon-arrow-left"
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-part">
            <Header />
            <div class="app-body">
              <div id="navAndContent">
                {this.switchTabBar ? (
                  <NavBar
                    id="nav-bar"
                    style={
                      this.fixedTabBar && this.switchTabBar
                        ? "position: fixed;top: 65px;"
                        : ""
                    }
                  />
                ) : ("")}
              
                <div
                  id="mainContainer"
                  class="main-container"
                >
                  <router-view />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
};
