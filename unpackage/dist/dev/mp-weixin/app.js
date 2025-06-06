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
  "./pages/EarthquakeMap/EarthquakeMap.js";
  "./pages/Disaster-Report/Disaster-Report.js";
  "./pages/SeismicData/SeismicData.js";
}
const _sfc_main = {
  onLaunch: () => {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: () => {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: () => {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
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
