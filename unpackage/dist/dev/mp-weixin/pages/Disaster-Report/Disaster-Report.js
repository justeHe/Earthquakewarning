"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _component_cover_button = common_vendor.resolveComponent("cover-button");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_cover_button + _easycom_uni_popup2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "Disaster-Report",
  setup(__props) {
    const mapCenter = common_vendor.ref({ latitude: 35.6895, longitude: 139.6917 });
    const impactMarkers = common_vendor.ref([
      {
        id: 1,
        latitude: 35.6895,
        longitude: 139.6917,
        iconPath: "/static/location.png",
        width: 40,
        height: 40,
        title: "东京震中"
      }
    ]);
    const impactAreas = common_vendor.ref([
      {
        points: [
          { latitude: 35.6895, longitude: 139.6917 },
          { latitude: 35.7, longitude: 139.7 }
        ],
        color: "#FF000033",
        width: 2
      }
    ]);
    const stats = common_vendor.ref([
      { id: 1, icon: "/static/icons/building.svg", value: "5.8级", label: "最大震级" },
      { id: 2, icon: "/static/icons/alert.svg", value: "12k", label: "受影响人数" },
      { id: 3, icon: "/static/icons/clock.svg", value: "48h", label: "响应时间" }
    ]);
    const photos = common_vendor.ref([
      {
        url: "/static/disaster.png",
        location: "东京新宿区"
      }
    ]);
    const timeline = common_vendor.ref([
      {
        date: "2023-08-20 14:00",
        title: "房屋修复",
        description: "主要干道恢复通车",
        images: ["/static/repair.png"]
      }
    ]);
    const userReport = common_vendor.ref({
      content: "",
      images: [],
      location: null
    });
    const lastUpdate = common_vendor.computed(() => {
      var _a;
      return ((_a = timeline.value[0]) == null ? void 0 : _a.date) || "暂无数据";
    });
    const submissionPopup = common_vendor.ref(null);
    const fabScale = common_vendor.ref(1);
    const handleFabTouch = () => {
      fabScale.value = 0.95;
    };
    const handleFabTouchEnd = () => {
      fabScale.value = 1;
    };
    const cardScale = common_vendor.ref(1);
    const handleCardTouch = () => {
      cardScale.value = 0.98;
    };
    const handleCardTouchEnd = () => {
      cardScale.value = 1;
    };
    const openSubmission = async () => {
      try {
        const location = await getLocation();
        userReport.value.location = location;
        submissionPopup.value.open();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Disaster-Report/Disaster-Report.vue:230", "获取位置失败:", error);
      }
    };
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getLocation({
          type: "gcj02",
          success: (res) => resolve(res),
          fail: reject
        });
      });
    };
    const addPhoto = () => {
      common_vendor.index.chooseImage({
        count: 3,
        success: (res) => {
          userReport.value.images.push(...res.tempFilePaths);
        }
      });
    };
    const submitReport = () => {
      submissionPopup.value.close();
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(_ctx.openHeatmap),
        c: common_assets._imports_1,
        d: common_vendor.o(_ctx.switchLayer),
        e: mapCenter.value.latitude,
        f: mapCenter.value.longitude,
        g: impactMarkers.value,
        h: impactAreas.value,
        i: common_vendor.o((...args) => _ctx.handleMarkerTap && _ctx.handleMarkerTap(...args)),
        j: common_vendor.f(stats.value, (stat, k0, i0) => {
          return {
            a: stat.icon,
            b: common_vendor.t(stat.value),
            c: common_vendor.t(stat.label),
            d: stat.id,
            e: common_vendor.o(handleCardTouch, stat.id),
            f: common_vendor.o(handleCardTouchEnd, stat.id)
          };
        }),
        k: `scale(${cardScale.value})`,
        l: common_vendor.t(photos.value.length),
        m: common_vendor.f(photos.value, (photo, index, i0) => {
          return {
            a: photo.url,
            b: common_vendor.t(photo.location),
            c: index,
            d: common_vendor.o(($event) => _ctx.previewImage(index), index)
          };
        }),
        n: common_assets._imports_2,
        o: common_vendor.t(lastUpdate.value),
        p: common_vendor.f(timeline.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.date),
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.description),
            d: item.images
          }, item.images ? {
            e: common_vendor.f(item.images, (img, i, i1) => {
              return {
                a: i,
                b: img
              };
            })
          } : {}, {
            f: index
          });
        }),
        q: common_assets._imports_3,
        r: common_vendor.o(openSubmission),
        s: common_vendor.o(handleFabTouch),
        t: common_vendor.o(handleFabTouchEnd),
        v: `scale(${fabScale.value})`,
        w: userReport.value.content,
        x: common_vendor.o(($event) => userReport.value.content = $event.detail.value),
        y: common_assets._imports_4,
        z: common_vendor.o(addPhoto),
        A: common_vendor.o(submitReport),
        B: common_vendor.sr(submissionPopup, "066c48c3-2", {
          "k": "submissionPopup"
        }),
        C: common_vendor.p({
          type: "bottom"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-066c48c3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Disaster-Report/Disaster-Report.js.map
