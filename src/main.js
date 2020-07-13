import Vue from "vue";
import router from "./router/";
import store from "./store/";
import ElementUI from "element-ui";
import App from "./App";
import Quill from "quill";
var Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px"
];
Quill.register(Size, true);
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "./assets/css/style.scss";
import "./assets/css/quillfontsize.css";
var echarts = require("echarts");
Vue.config.productionTip = false;
store.$router = router;
Vue.use(ElementUI, VueQuillEditor);
Vue.prototype.echarts = echarts;
//时间转换函数
Vue.prototype.timestampFormateDate = function(timestamp) {
  if (timestamp == null) {
    return "--";
  }
  var time = new Date(timestamp);

  var sign = "-";
  var Y = time.getFullYear();
  var M =
    time.getMonth() + 1 < 10
      ? "0" + (time.getMonth() + 1)
      : time.getMonth() + 1;
  var D = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
  var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var s = time.getSeconds() < 10 ? "0" + time.getHours() : time.getSeconds();
  var result = Y + sign + M + sign + D + " " + h + ":" + m + ":" + s;
  return result;
};
//对象深拷贝
Vue.prototype.clone = function(obj) {
  if (obj === null) {
    return null;
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (obj.constructor === Date) {
    return new Date(obj);
  }
  if (obj.constructor === RegExp) {
    return new RegExp(obj);
  }
  var newObj = new obj.constructor();
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var val = obj[key];
      newObj[key] = typeof val === "object" ? arguments.callee(val) : val;
    }
  }
  return newObj;
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
