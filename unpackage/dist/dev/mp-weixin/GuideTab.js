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
  __name: "GuideTab",
  setup(__props) {
    const navigateToEmergency = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Emergenciecenter/Emergenciecenter"
      });
    };
    const guideCategories = common_vendor.ref([
      {
        id: 1,
        title: "居家避险",
        icon: "home",
        // uni-icons 类型
        items: [
          { id: 1, title: "室内安全", icon: "1", desc: "迅速躲在结实的桌子、床下或内墙角落；远离窗户、玻璃及悬挂物；不要跳楼或使用电梯。" },
          { id: 2, title: "厨房避险", icon: "1", desc: "立即关闭燃气阀门和电源；躲避时远离炉灶、冰箱等可能倾倒的重物。" }
        ]
      },
      {
        id: 2,
        title: "公共场所避险",
        icon: "shop",
        items: [
          { id: 1, title: "商场/超市", icon: "1", desc: "就近躲在大柱子或坚固柜台旁；不要拥挤冲向出口，防止踩踏；避开货架及玻璃橱窗。" },
          { id: 2, title: "学校/办公室", icon: "1", desc: "迅速躲在课桌或办公桌下；保护好头部；震动停止后有序疏散到空旷地带。" }
        ]
      },
      {
        id: 3,
        title: "户外避险",
        icon: "location",
        items: [
          { id: 1, title: "街道/开阔地", icon: "1", desc: "远离建筑物、电线杆、广告牌；蹲下保护头部；不要返回室内取物。" },
          { id: 2, title: "行驶车辆", icon: "1", desc: "尽快在安全地带停车；不要停在桥梁、隧道或高大建筑物旁；留在车内通常比跑出去更安全。" }
        ]
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "fire",
          size: "22",
          color: "#fff"
        }),
        b: common_vendor.o(navigateToEmergency),
        c: common_vendor.f(guideCategories.value, (category, k0, i0) => {
          return {
            a: "2fd15fc7-1-" + i0,
            b: common_vendor.p({
              type: category.icon,
              size: "20",
              color: "#fff"
            }),
            c: common_vendor.t(category.title),
            d: common_vendor.f(category.items, (item, k1, i1) => {
              return {
                a: "2fd15fc7-2-" + i0 + "-" + i1,
                b: common_vendor.p({
                  type: item.icon,
                  size: "18",
                  color: "#e74c3c"
                }),
                c: common_vendor.t(item.title),
                d: common_vendor.t(item.desc),
                e: item.id
              };
            }),
            e: category.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fd15fc7"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/GuideTab.js.map
