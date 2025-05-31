"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_cover_text = common_vendor.resolveComponent("cover-text");
  (_easycom_uni_icons2 + _component_cover_text)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "Emergenciecenter",
  setup(__props) {
    const contacts = common_vendor.ref([
      { name: "紧急报警", number: "110", icon: "/static/icons/bell.svg", color: "#e74c3c" },
      { name: "消防急救", number: "119", icon: "/static/icons/fire.svg", color: "#f39c12" },
      { name: "医疗救护", number: "120", icon: "/static/icons/aid.svg", color: "#2ecc71" },
      { name: "交通事故", number: "122", icon: "/static/icons/car.svg", color: "#3498db" }
    ]);
    const organizations = common_vendor.ref([
      {
        name: "中国红十字会",
        desc: "提供紧急医疗救援和人道主义援助",
        url: "https://www.redcross.org.cn",
        logo: "/static/icons/red_cross.svg",
        tags: ["医疗支援", "物资发放", "灾后重建"]
      },
      {
        name: "蓝天救援队",
        desc: "专业民间紧急救援力量",
        url: "https://www.bsr.org",
        logo: "/static/icons/bluesky-logo.png",
        tags: ["山地救援", "水域救援", "城市救援"]
      }
    ]);
    const mapCenter = common_vendor.ref({
      latitude: 39.90469,
      longitude: 116.40717
    });
    const shelterMarkers = common_vendor.ref([
      {
        id: 1,
        latitude: 39.90469,
        longitude: 116.40717,
        iconPath: "/static/shelter.png",
        width: 36,
        height: 36,
        callout: {
          content: "朝阳区应急避难所\n可容纳500人\n物资：充足",
          color: "#ffffff",
          bgColor: "#e74c3c",
          padding: 12,
          borderRadius: 8,
          textAlign: "center"
        }
      }
    ]);
    const legend = common_vendor.ref([
      { color: "#e74c3c", text: "避难所" },
      { color: "#2ecc71", text: "医疗点" },
      { color: "#3498db", text: "物资站" }
    ]);
    const handleCall = (number) => {
      common_vendor.index.makePhoneCall({
        phoneNumber: number,
        success: () => {
          common_vendor.index.vibrateShort({ type: "heavy" });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "呼叫失败，请检查网络",
            icon: "none"
          });
        }
      });
    };
    const openLink = (url) => {
      common_vendor.index.setClipboardData({
        data: url,
        success: () => {
          common_vendor.index.showToast({
            title: "链接已复制",
            icon: "success"
          });
        }
      });
    };
    const refreshLocation = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          mapCenter.value = {
            latitude: res.latitude,
            longitude: res.longitude
          };
        }
      });
    };
    const navBack = () => {
      common_vendor.index.navigateBack();
    };
    const goToShelterDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Shelter/Shelter"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          type: "info-filled",
          size: "28",
          color: "#fff"
        }),
        b: common_vendor.p({
          type: "phone",
          size: "22",
          color: "#e74c3c"
        }),
        c: common_vendor.f(contacts.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: item.color,
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.number),
            e: index,
            f: common_vendor.o(($event) => handleCall(item.number), index),
            g: item.number === "120" ? "medical-hover" : "contact-hover"
          };
        }),
        d: common_vendor.p({
          type: "team-filled",
          size: "22",
          color: "#e74c3c"
        }),
        e: common_vendor.f(organizations.value, (org, index, i0) => {
          return {
            a: org.logo,
            b: common_vendor.t(org.name),
            c: common_vendor.t(org.desc),
            d: common_vendor.f(org.tags, (tag, tIndex, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tIndex
              };
            }),
            e: index,
            f: common_vendor.o(($event) => openLink(org.url), index)
          };
        }),
        f: common_vendor.p({
          type: "location-filled",
          size: "22",
          color: "#e74c3c"
        }),
        g: common_vendor.o(refreshLocation),
        h: common_vendor.p({
          type: "right",
          size: "12",
          color: "#666"
        }),
        i: common_vendor.o(goToShelterDetail),
        j: common_vendor.f(legend.value, (item, k0, i0) => {
          return {
            a: item.color,
            b: common_vendor.t(item.text),
            c: "0f85c3a8-5-" + i0,
            d: item.text
          };
        }),
        k: mapCenter.value.latitude,
        l: mapCenter.value.longitude,
        m: shelterMarkers.value,
        n: _ctx.polyline,
        o: common_vendor.p({
          type: "arrow-left",
          size: "24",
          color: "#fff"
        }),
        p: common_vendor.o(navBack)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-0f85c3a8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Emergenciecenter/Emergenciecenter.js.map
