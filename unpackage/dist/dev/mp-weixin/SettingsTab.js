"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "SettingsTab",
  setup(__props) {
    const icon = (name) => `/static/icons/${name}.svg`;
    const settings = common_vendor.reactive([
      { name: "预警通知", icon: icon("bell"), type: "toggle", value: true },
      { name: "震动提醒", icon: icon("shale"), type: "toggle", value: false },
      { name: "震动强度", icon: icon("shake"), type: "slider", value: 60, min: 0, max: 100 },
      { name: "警报等级", icon: icon("level"), type: "text", value: "5.0级及以上" },
      { name: "刷新频率", icon: icon("refresh"), type: "text", value: "每10分钟" },
      { name: "夜间模式", icon: icon("moon"), type: "toggle", value: false },
      { name: "语言", icon: icon("language"), type: "text", value: "中文" }
    ]);
    function toggle(setting) {
      setting.value = !setting.value;
    }
    function selectOption(setting) {
      const optionsMap = {
        "警报等级": ["4.0级", "5.0级以上", "所有预警"],
        "刷新频率": ["每5分钟", "每10分钟", "每30分钟"],
        "语言": ["中文", "English"]
      };
      const options = optionsMap[setting.name] || ["选项A", "选项B"];
      common_vendor.index.showActionSheet({
        itemList: options,
        success: (res) => {
          setting.value = options[res.tapIndex];
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(settings, (setting, index, i0) => {
          return common_vendor.e({
            a: setting.icon,
            b: common_vendor.t(setting.name),
            c: setting.type === "toggle"
          }, setting.type === "toggle" ? {
            d: setting.value ? 1 : "",
            e: common_vendor.o(($event) => toggle(setting), index)
          } : setting.type === "text" ? {
            g: common_vendor.t(setting.value),
            h: "9bc93f33-0-" + i0,
            i: common_vendor.p({
              type: "right",
              size: "16",
              color: "#999"
            }),
            j: common_vendor.o(($event) => selectOption(setting), index)
          } : setting.type === "slider" ? {
            l: setting.value,
            m: setting.min || 0,
            n: setting.max || 100,
            o: common_vendor.o((e) => setting.value = e.detail.value, index)
          } : {}, {
            f: setting.type === "text",
            k: setting.type === "slider",
            p: index
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9bc93f33"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/SettingsTab.js.map
