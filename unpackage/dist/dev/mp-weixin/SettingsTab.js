"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "SettingsTab",
  setup(__props) {
    const settings = common_vendor.reactive([
      { id: 1, name: "预警通知", icon: "fas fa-bell", type: "toggle", value: true },
      { id: 2, name: "警报声音", icon: "fas fa-volume-up", type: "toggle", value: true },
      { id: 3, name: "振动提醒", icon: "fas fa-vibrate", type: "toggle", value: true },
      { id: 4, name: "预警阈值", icon: "fas fa-broadcast-tower", type: "text", value: "4.0级及以上" },
      { id: 5, name: "定位精度", icon: "fas fa-map-marked-alt", type: "text", value: "高精度" },
      { id: 6, name: "夜间模式", icon: "fas fa-moon", type: "toggle", value: false },
      { id: 7, name: "数据刷新频率", icon: "fas fa-history", type: "text", value: "自动" }
    ]);
    function onToggle(setting) {
      common_vendor.index.__f__("log", "at pages/SettingsTab/SettingsTab.vue:37", `${setting.name} ${setting.value ? "开启" : "关闭"}`);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(settings, (setting, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.n(setting.icon),
            b: common_vendor.t(setting.name),
            c: setting.type === "toggle"
          }, setting.type === "toggle" ? {
            d: common_vendor.o(($event) => onToggle(setting), setting.id),
            e: setting.value,
            f: common_vendor.o(($event) => setting.value = $event.detail.value, setting.id)
          } : {
            g: common_vendor.t(setting.value)
          }, {
            h: setting.id
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9bc93f33"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/SettingsTab.js.map
