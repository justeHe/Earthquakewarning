"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (EmergencyAlert + Header + AlertTab + HistoryTab + GuideTab + SettingsTab + TabBar)();
}
const Header = () => "../Header/Header2.js";
const EmergencyAlert = () => "../EmergencyAlert/EmergencyAlert2.js";
const TabBar = () => "../TabBar/TabBar2.js";
const AlertTab = () => "../AlertTab/AlertTab2.js";
const HistoryTab = () => "../HistoryTab/HistoryTab2.js";
const GuideTab = () => "../GuideTab/GuideTab2.js";
const SettingsTab = () => "../SettingsTab/SettingsTab2.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const currentTab = common_vendor.ref("alert");
    const showEmergencyAlert = common_vendor.ref(false);
    function changeTab(tab) {
      currentTab.value = tab;
    }
    function closeEmergencyAlert() {
      showEmergencyAlert.value = false;
    }
    common_vendor.onMounted(() => {
      setTimeout(() => {
        if (Math.random() < 0.05) {
          showEmergencyAlert.value = true;
          setTimeout(() => {
            showEmergencyAlert.value = false;
          }, 1e4);
        }
      }, 3e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showEmergencyAlert.value
      }, showEmergencyAlert.value ? {
        b: common_vendor.o(closeEmergencyAlert)
      } : {}, {
        c: currentTab.value === "alert"
      }, currentTab.value === "alert" ? {} : currentTab.value === "history" ? {} : currentTab.value === "guide" ? {} : currentTab.value === "settings" ? {} : {}, {
        d: currentTab.value === "history",
        e: currentTab.value === "guide",
        f: currentTab.value === "settings",
        g: common_vendor.o(changeTab),
        h: common_vendor.p({
          activeTab: currentTab.value
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
