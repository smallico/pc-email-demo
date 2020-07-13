import style from "./NavBar.module.scss";
import ScrollPanel from "../../components/ScrollPanel";
import qs from "qs";
import {mapState, mapMutations} from "vuex";
import {request} from "../../api/data-api";

export default {
    computed: {
        ...mapState(["nav"])
    },
    created() {
        console.log('nav', this.nav)
        this.$router.afterEach(this.afterEachHandler);
    },
    mounted: function () {
        if (
            !this.nav.some(
                item =>
                    item.path === this.$route.path &&
                    qs.stringify(item.query) === qs.stringify(this.$route.query)
            )
        ) {
            this.nav.push({
                path: this.$route.path,
                title: this.$route.meta.title,
                query: this.$route.query
            });

        }
    },
    methods: {
        afterEachHandler(to, from) {
            // //判断当前标签是否需要保持，如果不，则关闭本标签
            //keepAlive用来缓存页面的。
            // if (!from.meta.keepAlive) {
            //   this.nav = this.nav.filter(item => item.path !== from.path);
            // }
            //判断当前是否存在即将跳转的标签，如果不存在，则创建
            //console.log("after---", this.nav);
            //console.log("navBar",this.nav);
            setTimeout(() => {
                if (
                    !this.nav.some(                                                  //判断是否已经打开的标签(包括固定标签)
                        item => 
                         (item.path === to.path && qs.stringify(item.query) === qs.stringify(to.query))     
                    )
                ) {
                    var navBar = document.getElementById('nav-bar');  //导航条总长度
                    var navContent = document.getElementsByClassName('ScrollPanel-module_scrollWrapper_2olHS')[0]; //当前导航页的长度
                    if (navBar) {
                        var navWidth = navBar.offsetWidth;
                        var navContetWidth = navContent.offsetWidth;
                        // console.log("totalLen",navBar.offsetWidth,"currentLen",navContent.offsetWidth,"占比",((navContetWidth/navWidth)*10));
                        if (((navContetWidth / navWidth) * 10) > 8) {
                            this.$message({
                                message: "页签已满，请先清除部分页签",
                                type: "warning"
                            });
                            this.$router.replace(from.fullPath);
                        } else {
                            this.nav.push({
                                path: to.path,
                                title: to.meta.title,
                                query: to.query
                            });
                        }
                    }


                }
                if (to.meta.menu != this.$store.state.currentMenu) {
                    if (to.meta.menu == "main") {
                        this.tabMain();
                    } else if (to.meta.menu == "operations") {
                        this.tabOperations();
                    } else {
                        this.tabBusiness();
                    }
                }
            }, 100);
        },
        //切换运维管理
        tabOperations() {
            request("/operationMenuList", data => {
                sessionStorage.setItem("menu", JSON.stringify(data.menu));
                sessionStorage.setItem("currentMenu", "operations");
                this.$store.commit(
                    "updateMenuList",
                    JSON.parse(sessionStorage.getItem("menu"))
                );
                this.$store.commit(
                    "updateCurrentMenu",
                    sessionStorage.getItem("currentMenu")
                );
                setTimeout(() => {
                    this.getMarginTop();
                }, 100);
            });
        },
        //切换业务管理
        tabBusiness() {
            request("/businessMenu", data => {
                sessionStorage.setItem("menu", JSON.stringify(data.menu));
                sessionStorage.setItem("currentMenu", "business");
                this.$store.commit(
                    "updateMenuList",
                    JSON.parse(sessionStorage.getItem("menu"))
                );
                this.$store.commit(
                    "updateCurrentMenu",
                    sessionStorage.getItem("currentMenu")
                );
                setTimeout(() => {
                    this.getMarginTop();
                }, 100);
            });
        },
        //切换业务应用
        tabMain() {
            request("/loginRetData", data => {
                sessionStorage.setItem("menu", JSON.stringify(data.menu));
                sessionStorage.setItem("currentMenu", "main");
                this.$store.commit(
                    "updateMenuList",
                    JSON.parse(sessionStorage.getItem("menu"))
                );
                this.$store.commit(
                    "updateCurrentMenu",
                    sessionStorage.getItem("currentMenu")
                );
                setTimeout(() => {
                    this.getMarginTop();
                }, 100);
            });
        },
        //菜单切换需要重新计算margin-top
        getMarginTop() {
            if (document.getElementById("aside")) {
                var asideHeight = document.getElementById("aside").clientHeight;
                var menuHeight = document.getElementById("menu-box").clientHeight;
                var asideBottomMarginTop = 0;
                if (asideHeight - menuHeight > 100) {
                    asideBottomMarginTop = asideHeight - menuHeight - 100;
                } else {
                    asideBottomMarginTop = 100;
                }
                this.$store.commit("updateAsideBottomMarginTop", asideBottomMarginTop);
            }
        },
        closeSelectedTag(i) {
            let nav = this.nav;
            let thisPath = nav[i].path;
            nav.splice(i, 1);
            if (thisPath == this.$route.path) {
                this.$router.push(nav[nav.length - 1].path);
            }
        }
    },

    render() {
        const NavEl = ({props: {navs, path, query}}) =>
            navs.map((v, i) => (
                <RouterLink
                    to={v.query ? v.path + "?" + qs.stringify(v.query) : v.path}
                    class={[
                        style.navBarTag,
                        path == v.path  && qs.stringify(v.query) == qs.stringify(query)
                            ? style.active
                            : ""
                    ]}
                    key={v.query ? v.path + "?" + qs.stringify(v.query) : v.path}
                >
                    <i class={style.point}/>


                    {v.query.activeName ? "未阅": v.title}
                    {v.path == "/semail/" ||
                    (v.path == "/semail/receive" && !v.query.activeName)||
                    v.path == "/semail/box/receiveBox" ||
                    v.path == "/semail/contact" ? (
                        ""
                    ) : (
                        <div class={style.closeBox}>
              <span
                  class={["el-icon-close", style.elIconClose]}
                  onClick={e => {
                      this.closeSelectedTag(i);
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                  }}
              />
                        </div>
                    )}
                </RouterLink>
            ));
        return (
            <nav class={style.navBar}>
                <ScrollPanel class={style.scrollContainer}>
                    <NavEl
                        navs={this.nav}
                        path={this.$route.path}
                        query={this.$route.query}
                    />
                </ScrollPanel>
            </nav>
        );
    }
};
