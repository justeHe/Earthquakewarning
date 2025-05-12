"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "TabBar",
  props: {
    activeTab: { type: String, required: true }
  },
  emits: ["changeTab"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const tabs = [
      { name: "alert", label: "预警", icon: "fas fa-bell" },
      { name: "history", label: "历史", icon: "fas fa-clock-rotate-left" },
      { name: "guide", label: "指南", icon: "fas fa-book-open" },
      { name: "settings", label: "设置", icon: "fas fa-sliders" }
    ];
    function selectTab(tabName) {
      emit("changeTab", tabName);
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.n(tab.icon),
            b: common_vendor.t(tab.label),
            c: tab.name,
            d: common_vendor.n({
              active: __props.activeTab === tab.name
            }),
            e: common_vendor.o(($event) => selectTab(tab.name), tab.name)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-744d263b"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/TabBar.js.map
