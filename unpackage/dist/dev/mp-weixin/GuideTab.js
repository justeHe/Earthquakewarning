"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "GuideTab",
  setup(__props) {
    const guideCategories = common_vendor.ref([
      {
        id: 1,
        title: "居家避险",
        icon: "fas fa-house-damage",
        items: [
          { id: 1, title: "室内安全", icon: "fas fa-couch", desc: "迅速躲在结实的桌子、床下或内墙角落；远离窗户、玻璃及悬挂物；不要跳楼或使用电梯。" },
          { id: 2, title: "厨房避险", icon: "fas fa-utensils", desc: "立即关闭燃气阀门和电源；躲避时远离炉灶、冰箱等可能倾倒的重物。" }
        ]
      },
      {
        id: 2,
        title: "公共场所避险",
        icon: "fas fa-building",
        items: [
          { id: 1, title: "商场/超市", icon: "fas fa-store", desc: "就近躲在大柱子或坚固柜台旁；不要拥挤冲向出口，防止踩踏；避开货架及玻璃橱窗。" },
          { id: 2, title: "学校/办公室", icon: "fas fa-school", desc: "迅速躲在课桌或办公桌下；保护好头部；震动停止后有序疏散到空旷地带。" }
        ]
      },
      {
        id: 3,
        title: "户外避险",
        icon: "fas fa-car-crash",
        items: [
          { id: 1, title: "街道/开阔地", icon: "fas fa-road", desc: "远离建筑物、电线杆、广告牌；蹲下保护头部；不要返回室内取物。" },
          { id: 2, title: "行驶车辆", icon: "fas fa-car", desc: "尽快在安全地带停车；不要停在桥梁、隧道或高大建筑物旁；留在车内通常比跑出去更安全。" }
        ]
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(guideCategories.value, (category, k0, i0) => {
          return {
            a: common_vendor.n(category.icon),
            b: common_vendor.t(category.title),
            c: common_vendor.f(category.items, (item, k1, i1) => {
              return {
                a: common_vendor.n(item.icon),
                b: common_vendor.t(item.title),
                c: common_vendor.t(item.desc),
                d: item.id
              };
            }),
            d: category.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd15fc7"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/GuideTab.js.map
