import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/generateMd5",
      name: "generateMd5",
      component: () => import("../views/tt/GenerateMd5")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login")
    },
    {
      path: "/semail",
      component: () => import("../views/layout/Main"),
      children: [
        {
          path: "/",
          name: "home",
          meta: {
            title: "首页",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Home.vue")
        },
        {
          path: "send",
          name: "send",
          meta: {
            title: "发件",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Send.vue")
        },
        {
          path: "receive",
          name: "receive",
          meta: {
            title: "收件",
            keepAlive: false,
            menu: "main"
          },
          //component: () => import("../views/semail/Receive.vue")
          component: () => import("../views/semail/box/ReceiveBox.vue")
        },
        {
          path: "unread",
          name: "unread",
          meta: {
            title: "未阅",
            keepAlive: false,
            menu:"main"
          },
          component: () => import("../views/semail/Unread.vue")
        },
        {
          path: "recieveMailDetail",
          name: "recieveMailDetail",
          meta: {
            title: "邮件详情",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/recieveMailDetail.vue")
        },
        {
          path: "sendMailDetail",
          name: "sendMailDetail",
          meta: {
            title: "发件详情",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/SendMailDetail.vue")
        },
        {
          path: "box",
          name: "box",
          meta: {
            title: "邮件管理",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Box.vue"),
          children: [
            {
              path: "sendBox",
              name: "sendBox",
              meta: {
                title: "发件箱",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/SendBox.vue")
            },
            {
              path: "receiveBox",
              name: "receiveBox",
              meta: {
                title: "收件箱",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/ReceiveBox.vue")
            },
            {
              path: "draftBox",
              name: "draftBox",
              meta: {
                title: "草稿箱",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/DraftBox.vue")
            },
            {
              path: "trashBox",
              name: "TrashBox",
              meta: {
                title: "垃圾箱",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/TrashBox.vue")
            },
            {
              path: "cacheBox",
              name: "cacheBox",
              meta: {
                title: "缓存箱",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/CacheBox.vue")
            },
            {
              path: "delivery",
              name: "delivery",
              meta: {
                title: "投递状态",
                keepAlive: false,
                menu: "main"
              },
              component: () => import("../views/semail/box/Delivery.vue")
            }
          ]
        },
        {
          path: "contact",
          name: "contact",
          meta: {
            title: "通讯录",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Contact.vue")
        },
        {
          path: "setting",
          name: "setting",
          meta: {
            title: "个人设置",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Setting.vue")
        },
        {
          path: "search",
          name: "search",
          meta: {
            title: "高级检索",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/Search.vue")
        },
        {
          path: "searchList",
          name: "searchList",
          meta: {
            title: "检索列表",
            keepAlive: false,
            menu: "main"
          },
          component: () => import("../views/semail/SearchList.vue")
        },
        {
          path: "service",
          name: "service",
          meta: {
            title: "服务管理",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/service.vue")
        },
        {
          path: "config",
          name: "config",
          meta: {
            title: "配置管理",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/config.vue")
        },
        {
          path: "log",
          name: "log",
          meta: {
            title: "日志管理",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/log.vue")
        },
        {
          path: "others",
          name: "others",
          meta: {
            title: "其他管理",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/others.vue")
        },
        {
          path: "accessIn",
          name: "accessIn",
          meta: {
            title: "接入管理",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/accessIn.vue")
        },
        {
          path: "user",
          name: "user",
          meta: {
            title: "用户管理",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/user.vue")
        },
        {
          path: "userEdit",
          name: "userEdit",
          meta: {
            title: "编辑用户",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/userEdit.vue")
        },
        {
          path: "organ",
          name: "organ",
          meta: {
            title: "机构管理",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/organ.vue")
        },
        {
          path: "organAdd",
          name: "organAdd",
          meta: {
            title: "新建组织机构",
            keepAlive: false,
            menu:'business'
          },
          component: () => import("../views/semail/business/organAdd.vue"),
        },
        {
          path: "businessBox",
          name: "businessBox",
          meta: {
            title: "报箱管理",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/boxAssign.vue")
        },
        {
          path: "businessLog",
          name: "businessLog",
          meta: {
            title: "日志管理",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/businessLog.vue")
        },
        {
          path: "businessLogDetails",
          name: "businessLogDetails",
          meta: {
            title: "日志详情",
            keepAlive: false,
            menu: "business"
          },
          component: () =>
            import("../views/semail/business/businessLogDetails.vue")
        },
        {
          path: "receiveAndSend",
          name: "receiveAndSend",
          meta: {
            title: "报务统计",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/receiveAndSend.vue")
        },
        {
          path: "terminal",
          name: "terminal",
          meta: {
            title: "终端管理",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/terminal.vue")
        },
        {
          path: "terminalEdit",
          name: "terminalEdit",
          meta: {
            title: "编辑终端",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/terminalEdit.vue")
        },
        {
          path: "terminalAssign",
          name: "terminalAssign",
          meta: {
            title: "分配终端",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/terminalAssign.vue")
        },
        {
          path: "systermStatistics",
          name: "systermStatistics",
          meta: {
            title: "系统收发统计",
            keepAlive: false,
            menu: "business"
          },
          component: () =>
            import("../views/semail/operations/systermStatistics.vue")
        },
        {
          path: "paramConfig",
          name: "paramConfig",
          meta: {
            title: "参数配置",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/paramConfig.vue")
        },
        {
          path: "logDetail",
          name: "logDetail",
          meta: {
            title: "日志详情",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/logDetail.vue")
        },
        {
          path: "addVersion",
          name: "addVersion",
          meta: {
            title: "新增版本",
            keepAlive: false,
            menu: "operations"
          },
          component: () => import("../views/semail/operations/addVersion.vue")
        },
        {
          path: "addBusinessBox",
          name: "addBusinessBox",
          meta: {
            title: "添加专用报箱",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/addBox.vue")
        },
        {
          path: "editBusinessBox",
          name: "editBusinessBox",
          meta: {
            title: "编辑报箱",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/boxEdit.vue")
        },
        {
          path: "assignBusinessBox",
          name: "assignBusinessBox",
          meta: {
            title: "分配报箱",
            keepAlive: false,
            menu: "business"
          },
          component: () => import("../views/semail/business/boxAssign.vue")
        }
      
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  console.log("拦截器开始执行....");
  const token = sessionStorage.getItem("token");
  // const token = "ok";
  console.log(token);
  // console.log(token);
  console.log(to.path);
  if (!token && to.path !== "/login") {
    router.push({ name: "login" });
  } else {
    if (to.name == "userEdit") {
      if (window.sessionStorage.getItem("isCheck") == "true" ? true : false) {
        to.meta.title = "查看用户";
      } else {
        to.meta.title = "编辑用户";
      }
    }
    next();
  }
  console.log("拦截器执行结束!");
});

export default router;
