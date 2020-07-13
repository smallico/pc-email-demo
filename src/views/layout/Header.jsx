import Screenfull from "screenfull";
import logo from "../../assets/images/logo.png";
import adminIcon from "../../assets/img/admin.png";
import skin from "../../assets/img/skin-icon.png";
import mode from "../../assets/img/switch-mode.png";
import search from "../../assets/img/search-icon.png";
import {mapState, mapMutations} from "vuex";

export default {
    data() {
        return {
            term: "",
            theme: "0",
            isFullScreen: false
        };
    },
    computed: mapState({
        fixedTabBar: state => state.layout.fixedTabBar,
        switchTabBar: state => state.layout.switchTabBar,
        isCollapse: state => state.layout.isCollapse,
        emailType: state => state.emailType,//获取EMAIL TYPE
    }),
    methods: {
        // 改变EMAIL TYPE
        changeEmailType() {
            let emailType = this.emailType === 0 ? 1 : 0;
            this.updateEmailType(emailType)
        },
        //header搜索框
        search(e) {
            if (e.keyCode == 13) {
                this.$router.push("/semail/SearchList");
            }
        },
        //导航条宽度计算
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
        //点击头部小方块，隐藏整个菜单
        hiddenSidebar(e) {
            e.preventDefault();
            document.body.classList.toggle("sidebar-close");
            this.navBarWidth();
        },
        //点击全屏
        screenfullToggle() {
            if (!Screenfull.enabled) {
                this.$message({
                    message: "你的浏览器不支持全屏！",
                    type: "warning"
                });
                return false;
            }
            Screenfull.toggle();
            this.isFullScreen = !this.isFullScreen;
        },
        //是否开启导航菜单
        saveSwitchTabBarVal(v) {
            this.updateSwitchTabBar(v);
            let navAndContent = document.getElementById("navAndContent");
            let headerLogo = document.getElementById("header-logo");
            v
                ? this.fixedTabBar ? (navAndContent.style.paddingTop = "112px") : (navAndContent.style.paddingTop = "65px")
                : (navAndContent.style.paddingTop = "65px");
            v
                ? localStorage.setItem("switchTabBar", v)
                : localStorage.removeItem("switchTabBar");
            v
                ? (headerLogo.style.height = "112px")
                : (headerLogo.style.height = "65px");
            v
                ? (headerLogo.style.lineHeight = "112px")
                : (headerLogo.style.lineHeight = "65px");
            this.navBarWidth();
            setTimeout(() => {
                this.computedAsideBottomMarginTop();
            }, 400)
        },
        //导航条固定还是随页面滚动
        saveFixedTabBar(v) {
            this.updateLayoutFixedTabBar(v);
            v
                ? localStorage.setItem("fixedTabBar", v)
                : localStorage.removeItem("fixedTabBar");
            v
                ? document.getElementById("navAndContent").style.paddingTop = "112px"
                : document.getElementById("navAndContent").style.paddingTop = "65px"
            this.navBarWidth();
        },
        //切换灰度模式
        toggleGrayMode() {
            document.body.classList.toggle("gray-mode");
        },
        //退出登录
        logout() {
            sessionStorage.clear();
            this.$notify.closeAll();
            this.$router.push("/login");
        },
        //计算容量margin-top
        computedAsideBottomMarginTop() {
            var asideHeight = document.getElementById("aside-content").clientHeight;
            var menuHeight = document.getElementById("menu-box").clientHeight;
            console.log("menuHeight", menuHeight)
            var asideBottomHeight = document.getElementById("aside-bottom").clientHeight;
            var asideBottomMarginTop = 0;
            if (asideHeight - menuHeight - asideBottomHeight > 10) {
                asideBottomMarginTop = asideHeight - menuHeight - asideBottomHeight;
            } else {
                asideBottomMarginTop = 10;
            }
            this.$store.commit("updateAsideBottomMarginTop", asideBottomMarginTop);
        },
        ...mapMutations([
            "updateEmailType",
            "updateLayoutFixedTabBar",
            "updateSwitchTabBar",
            "updateIsCollapse"
        ])
    },
    mountend() {
        this.updateSwitchTabBar(
            localStorage.getItem("switchTabBar") ? true : false
        );
        this.updateLayoutFixedTabBar(
            localStorage.getItem("fixedTabBar") ? true : false
        );
    },
    render() {
        return (
            <div class="header" id="top-header">
                {/* <div class="logo" id="header-logo">
          <span class="big">安全电子邮件软件</span>
          <span class="min">
            <img width="40" style="margin-top: 10px" src={logo} alt="" />
          </span>
        </div> */}

                <span class="header-btn" onClick={this.hiddenSidebar}>
          <i class="el-icon-menu"/>
                    {this.emailType === 0 ? " 人到人模式 " : " 端到端模式 "}
        </span>


                <div class="right header-right">
                    <div class="search-box flex flex-ac" style="margin-bottom:4px;">
                        <ElInput
                            placeholder="请输入文件名称、收件人、发件人等搜索"
                            size="mini"
                            class="serch-input"
                            type="text"
                            style="width:250px;"
                            vModel={this.term}
                            nativeOnKeyup={this.search}
                        />
                        <img src={search} alt class="search-icon cur-p"/>
                    </div>
                    {/*      <div class="header-btn">
            <img src={skin} alt="" class="skin-icon" />
            <span>换肤</span>
          </div> */}

                    <ElTooltip
                        class="item"
                        effect="dark"
                        content={this.isFullScreen ? "退出全屏" : "全屏"}
                        placement="bottom"
                    >
            <span class="header-btn" onClick={this.screenfullToggle}>
              <i class="fa fa-arrows-alt"/>
            </span>
                    </ElTooltip>

                    <ElTooltip
                        class="item"
                        effect="dark"
                        content={this.emailType === 0 ? " 跳转单位邮箱模式 " : " 跳转人到人邮箱模式 "}
                        placement="bottom"

                    >
                        <div class="header-btn" onClick={this.changeEmailType}>
                            <img src={mode} alt="" class="mode-icon"/>
                        </div>
                    </ElTooltip>

                    <ElDropdown>
                        <ElTooltip
                            class="item"
                            effect="dark"
                            content="设置"
                            placement="bottom"
                        >
              <span class="header-btn">
                <i class="el-icon-setting"/>
              </span>
                        </ElTooltip>

                        <ElDropdownMenu slot="dropdown">
                            <div style="padding: 10px;text-align: center;width: 420px">
                                <div class="setting-category">
                                    <ElSwitch
                                        value={this.switchTabBar}
                                        onChange={this.saveSwitchTabBarVal}
                                        active-text="开启TabBar"
                                        inactive-text="关闭TabBar"
                                    />
                                    {this.switchTabBar
                                        ? [
                                            <ElSwitch
                                                value={this.fixedTabBar}
                                                onChange={this.saveFixedTabBar}
                                                style="margin-top: 10px"
                                                active-text="固定在顶部"
                                                inactive-text="随页面滚动"
                                            />,
                                            <ElAlert
                                                style="margin-top: 10px"
                                                title="导航标签超过容器时,可在导航上滚动鼠标来移动标签"
                                                type="info"
                                                show-icon
                                            />
                                        ]
                                        : ""}
                                </div>
                                <div
                                    class="setting-category"
                                    style="display: flex;height: 80px;align-items: center"
                                >
                                    {/*                <div style="width: 80px">
                    <ElButton
                      type="primary"
                      icon="el-icon-sort"
                      onClick={this.toggleGrayMode}
                      circle
                      style="transform: rotate(90deg)"
                    />
                  </div> */}
                                    <div style="flex: 1;margin-top: -8px">
                                        <span>默认主题：</span>
                                        <ElRadioGroup vModel={this.theme}>
                                            <ElRadio label="0">海阔天空</ElRadio>
                                            <ElRadio label="1">迷彩风</ElRadio>
                                            <ElRadio label="2">湛蓝</ElRadio>
                                        </ElRadioGroup>
                                        {/* <ElAlert
                      style="margin-top: 10px"
                      title="切换灰度模式!"
                      type="info"
                      show-icon
                    /> */}
                                    </div>
                                </div>
                            </div>
                        </ElDropdownMenu>
                    </ElDropdown>
                    {/* <span class="header-btn">
            <ElBadge value="3" class="badge">
              <i class="el-icon-bell" />
            </ElBadge>
          </span> */}
                    {/* <ElDropdown>
            {/* <ElDropdownMenu slot="dropdown">
              <ElDropdownItem
                nativeOnClick={e => this.$router.push("/semail/setting")}
              >
                个人设置
              </ElDropdownItem>
              <ElDropdownItem nativeOnClick={this.logout}>退出</ElDropdownItem>
            </ElDropdownMenu> *
          </ElDropdown> */}
                    <div class="header-btn">
                        <img src={adminIcon} alt="" class="admin-icon"/>
                        管理员
                        {/* <i class="el-icon-arrow-down el-icon--right" /> */}
                    </div>
                    <div class="header-btn" onClick={this.logout}>
                        退出
                    </div>
                </div>
            </div>
        );
    }
};
