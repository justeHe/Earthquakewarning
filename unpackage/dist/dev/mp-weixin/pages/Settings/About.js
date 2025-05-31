"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.p({
      type: "notification",
      size: "24",
      color: "#3B82F6"
    }),
    c: common_vendor.p({
      type: "location",
      size: "24",
      color: "#22C55E"
    }),
    d: common_vendor.p({
      type: "info",
      size: "24",
      color: "#F59E0B"
    }),
    e: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#8B5CF6"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e8f8f839"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Settings/About.js.map
