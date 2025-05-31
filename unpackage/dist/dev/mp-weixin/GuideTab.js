"use strict";
const common_vendor = require("./common/vendor.js");
const common_assets = require("./common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "GuideTab",
  setup(__props) {
    const navigateToEmergency = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Emergenciecenter/Emergenciecenter"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "warn",
          size: "24",
          color: "#FFFFFF"
        }),
        b: common_vendor.o(navigateToEmergency),
        c: common_assets._imports_0$2,
        d: common_vendor.p({
          type: "home",
          size: "24",
          color: "#3B82F6"
        }),
        e: common_vendor.p({
          type: "location",
          size: "24",
          color: "#22C55E"
        }),
        f: common_assets._imports_1$1,
        g: common_vendor.p({
          type: "info",
          size: "24",
          color: "#8B5CF6"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd15fc7"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/GuideTab.js.map
