"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/Header/Header.js";
  "./pages/EmergencyAlert/EmergencyAlert.js";
  "./pages/TabBar/TabBar.js";
  "./pages/AlertTab/AlertTab.js";
  "./pages/HistoryTab/HistoryTab.js";
  "./pages/GuideTab/GuideTab.js";
  "./pages/SettingsTab/SettingsTab.js";
  "./pages/Emergenciecenter/Emergenciecenter.js";
  "./pages/Shelter/Shelter.js";
  "./pages/Settings/About.js";
  "./pages/Settings/Privacy.js";
  "./pages/Disaster-Report/Disaster-Report.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
    common_vendor.index.__f__("log", "at App.vue:5", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:8", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
