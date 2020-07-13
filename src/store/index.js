import Vue from "vue";
import Vuex from "vuex";
import { request } from "../api/data-api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false,
      message: ""
    },
    layout: {
      fixedTabBar: true,
      switchTabBar: true,
      isCollapse: false
    },
    emailType:0,//人到人模式:0 端到端:1
    showNotify: 0,
    sendPercent: 0,
    timer: null,
    notifyMsg: "",
    nav: [], //导航条
    menuList: [], //菜单列表
    currentMenu: "main", //当前菜单类型
    asideBottomMarginTop: 0, //左侧导航容量的margin-top
    sendBoxTableData: [], //发件箱表格数据
    sendTotal: 0, //发件箱数据总数
    receiveBoxTableData: [], //收件箱表格数据
    receiveTotal: 0, //收件箱数据总数
    draftBoxTableData: [], //收件箱表格数据
    draftTotal: 0, //收件箱数据总数
    trashBoxTableData: [], //垃圾箱表格数据
    trashTotal: 0, //垃圾箱数据总数
    unreadTableData: [], //未读表格数据
    unreadTotal: 0, //未读数据总数
    unreadStarTableData: [], //星标未读表格数据
    unreadStarTotal: 0, //星标未读数据总数
    searchListTableData: [], //高级搜索表格数据
    searchListTotal: 0, //高级搜索数据总数
    terminalItem: "", //终端管理编辑item
    terminalListData: "", //终端管理编辑总数据
    userListData: "", //用户管理总数据
    assessList: {}, // 接入管理数据列表
    editAssessIndex: -1, // 修改接入管理index
    activeName: "", //日志查询类型
    boxList: [], //报箱列表
    unreadActiveName: "unread" //未读邮件类型
  },
  mutations: {
    //更新未读邮件数据
    updateEmailType(state, data) {
      state.emailType = data;
    },

    updateLoginStatus(state, loginStatus) {
      state.login = {
        ...loginStatus
      };
    },
    updateLayoutFixedTabBar(state, fixedTabBar) {
      state.layout.fixedTabBar = fixedTabBar;
    },
    updateSwitchTabBar(state, switchTabBar) {
      state.layout.switchTabBar = switchTabBar;
    },
    updateIsCollapse(state, isCollapse) {
      state.layout.isCollapse = isCollapse;
    },
    //设置下方进度条
    setPercentTimer(state, timer) {
      state.timer = setInterval(() => {
        state.notifyMsg = "邮件发送中...";
        state.sendPercent += 10;
        if (state.sendPercent == 100) {
          clearInterval(state.timer);
          state.timer = null;
          state.notifyMsg = "发送成功";
          setTimeout(() => {
            state.showNotify = 0;
            state.sendPercent = 0;
          }, 2000);
        }
      }, 500);
    },
    updateSendPercent(state, percent) {
      state.sendPercent = percent;
    },
    //是否显示下方提示框
    updateShowNotify(state, showNotify) {
      state.showNotify = showNotify;
    },
    //更新导航条数据
    updateNav(state, nav) {
      state.nav = nav;
    },
    //当前菜单数据
    updateMenuList(state, menuList) {
      state.menuList = menuList;
    },
    //当前菜单类型
    updateCurrentMenu(state, current) {
      state.currentMenu = current;
    },
    //更新左侧导航容量margin-top
    updateAsideBottomMarginTop(state, marginTop) {
      state.asideBottomMarginTop = marginTop;
    },
    //更新发件箱表格数据
    updateSendBoxTableData(state, data) {
      sessionStorage.setItem("sendBoxTableData", JSON.stringify(data));
      state.sendBoxTableData = data;
    },
    //更新发件箱数据总数
    updateSendTotal(state, data) {
      sessionStorage.setItem("sendTotal", data);
      state.sendTotal = data;
    },
    //更新收件箱表格数据
    updateReceiveBoxTableData(state, data) {
      sessionStorage.setItem("receiveBoxTableData", JSON.stringify(data));
      state.receiveBoxTableData = data;
    },
    //更新收件箱数据总数
    updateReceiveTotal(state, data) {
      sessionStorage.setItem("receiveTotal", data);
      state.receiveTotal = data;
    },
    //更新草稿箱表格数据
    updateDraftBoxTableData(state, data) {
      sessionStorage.setItem("draftBoxTableData", JSON.stringify(data));
      state.draftBoxTableData = data;
    },
    //更新草稿箱数据总数
    updateDraftTotal(state, data) {
      sessionStorage.setItem("draftTotal", data);
      state.draftTotal = data;
    },
    //更新垃圾箱表格数据
    updateTrashBoxTableData(state, data) {
      sessionStorage.setItem("trashBoxTableData", JSON.stringify(data));
      state.trashBoxTableData = data;
    },
    //更新垃圾箱数据总数
    updateTrashTotal(state, data) {
      sessionStorage.setItem("trashTotal", data);
      state.trashTotal = data;
    },
    //更新未读邮件数据
    updateUnreadTableData(state, data) {
      sessionStorage.setItem("unreadTableData", JSON.stringify(data));
      state.unreadTableData = data;
    },
    //更新未读邮件总数
    updateUnreadTotal(state, data) {
      sessionStorage.setItem("unreadTotal", data);
      state.unreadTotal = data;
    },
    //更新星标未读邮件数据
    updateUnreadStarTableData(state, data) {
      sessionStorage.setItem("unreadStarTableData", JSON.stringify(data));
      state.unreadStarTableData = data;
    },
    //更新星标未读邮件总数
    updateUnreadStarTotal(state, data) {
      sessionStorage.setItem("unreadStarTotal", data);
      state.unreadStarTotal = data;
    },
    //更新高级搜索数据
    updateSearchListTableData(state, data) {
      sessionStorage.setItem("searchListTableData", JSON.stringify(data));
      state.searchListTableData = data;
    },
    //更新高级搜索总数
    updateSearchListTotal(state, data) {
      sessionStorage.setItem("searchListTotal", data);
      state.searchListTotal = data;
    },
    /**
     * 更新终端编辑数据
     * @param {*} state
     * @param {*} currentTerminal
     */
    updateTerminalItem(state, currentTerminal) {
      state.terminalItem = currentTerminal;
    },
    /**
     * 更新终端总数据
     * @param {*} state
     * @param {*} currentTerminalList
     */
    updateTerminalListData(state, currentTerminalList) {
      state.terminalListData = currentTerminalList;
    },
    /**
     * 更新用户的总条数
     * @param {*} state
     * @param {*} currentUserList
     */
    updateUserListData(state, currentUserList) {
      state.userListData = currentUserList;
    },
    // 更新接入管理数据
    updateAssessList(state, assessList) {
      state.assessList = assessList;
    },
    // 修改接入管理index
    updateAssessIndex(state, index) {
      state.editAssessIndex = index;
    },
    // 修改日志类型
    updateActiveName(status, type) {
      status.activeName = type;
    },
    //修改报箱列表
    updateBoxList(state, currentList) {
      state.boxList = currentList;
    },
    //修改未读邮件类型
    updateUnreadActiveName (state,currentActiveName) {
      state.unreadActiveName =currentActiveName;
    }
  },
  actions: {
    loginAction(context, { username, password, remenberMe }) {
      var obj = {
        username: username,
        password: password
      };

      request("/loginRetData", data => {
        //登录成功
        context.commit("updateLoginStatus", {
          status: true,
          message: ""
        });
        Vue.prototype.$message({
          message: "登录成功",
          type: "success"
        });
        var nav = [
          {
            path: "/semail/",
            title: "首页",
            query: {}
          },
          {
            path: "/semail/receive",
            title: "收件",
            query: {}
          },
          {
            path: "/semail/box/receiveBox",
            title: "收件箱",
            query: {}
          },
          {
            path: "/semail/contact",
            title: "通讯录",
            query: {}
          }
        ];
        sessionStorage.setItem("token", "1234567890");
        sessionStorage.setItem("menu", JSON.stringify(data.menu));
        sessionStorage.setItem("currentMenu", "main");
        context.commit("updateCurrentMenu", "main");
        context.commit("updateMenuList", data.menu);
        context.commit("updateNav", nav);
        this.$router.push("/semail/");
        remenberMe == true
          ? localStorage.setItem("usernameRem", username)
          : localStorage.removeItem("usernameRem");
        remenberMe == true
          ? localStorage.setItem("passwordRem", password)
          : localStorage.removeItem("passwordRem");
        remenberMe == true
          ? localStorage.setItem("remenberMe", true)
          : localStorage.removeItem("remenberMe");
      });
    },
    percentAction(context) {
      setTimeout(function() {
        context.commit("updateSendPercent", 100);
      }, 4000);
    }
  }
});
