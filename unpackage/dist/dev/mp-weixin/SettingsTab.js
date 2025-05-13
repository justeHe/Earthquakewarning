"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "SettingsTab",
  setup(__props) {
    const iconPaths = {
      bell: "/static/icons/bell.svg",
      volume: "/static/icons/volume.svg",
      vibrate: "/static/icons/shake.svg",
      broadcast: "/static/icons/level.svg",
      location: "/static/icons/location.svg",
      moon: "/static/icons/moon.svg",
      refresh: "/static/icons/refresh.svg",
      language: "/static/icons/language.svg"
    };
    const settings = common_vendor.reactive([
      { id: 1, name: "预警通知", icon: iconPaths.bell, type: "toggle", value: true },
      { id: 2, name: "警报声音", icon: iconPaths.volume, type: "toggle", value: true },
      { id: 3, name: "振动提醒", icon: iconPaths.vibrate, type: "toggle", value: true },
      { id: 4, name: "预警阈值", icon: iconPaths.broadcast, type: "text", value: "4.0级及以上" },
      { id: 5, name: "定位精度", icon: iconPaths.location, type: "text", value: "高精度" },
      { id: 6, name: "夜间模式", icon: iconPaths.moon, type: "toggle", value: false },
      { id: 7, name: "数据刷新频率", icon: iconPaths.refresh, type: "text", value: "自动" },
      { id: 9, name: "语言", icon: iconPaths.language, type: "text", value: "中文" }
    ]);
    function onToggle(setting) {
      common_vendor.index.__f__("log", "at pages/SettingsTab/SettingsTab.vue:51", `${setting.name} ${setting.value ? "开启" : "关闭"}`);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(settings, (setting, k0, i0) => {
          return common_vendor.e({
            a: setting.icon,
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
