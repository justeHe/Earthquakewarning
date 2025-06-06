"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "Disaster-Report",
  setup(__props) {
    const mapCenter = common_vendor.ref({ latitude: 30.88, longitude: 103.49 });
    const impactMarkers = common_vendor.ref([
      {
        id: 1,
        latitude: 30.88,
        longitude: 103.49,
        iconPath: "/static/location.png",
        width: 40,
        height: 40,
        title: "东京震中"
      }
    ]);
    const impactAreas = common_vendor.ref([
      {
        points: [
          { latitude: 30.88, longitude: 103.49 },
          { latitude: 30.89, longitude: 103.5 }
        ],
        color: "#FF000033",
        width: 2
      }
    ]);
    const stats = common_vendor.ref([
      { id: 1, icon: "/static/icons/building.svg", value: "4.0级", label: "最大震级" },
      { id: 2, icon: "/static/icons/alert.svg", value: "12k", label: "受影响人数" },
      { id: 3, icon: "/static/icons/clock.svg", value: "48h", label: "响应时间" }
    ]);
    const photos = common_vendor.ref([
      {
        url: "/static/disaster.png",
        location: "成都市都江堰"
      }
    ]);
    const timeline = common_vendor.ref([
      {
        date: "2025-06-06 14:00",
        title: "房屋修复",
        description: "主要干道恢复通车",
        images: ["/static/repair.png"]
      }
    ]);
    const discussions = common_vendor.ref([]);
    const userReport = common_vendor.ref({
      content: "",
      images: [],
      location: null,
      time: null
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
        common_vendor.index.__f__("error", "at pages/Disaster-Report/Disaster-Report.vue:290", "获取位置失败:", error);
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
    const removeImage = (index) => {
      userReport.value.images.splice(index, 1);
    };
    const previewDiscussionImage = (images, index) => {
      common_vendor.index.previewImage({
        urls: images,
        current: index
      });
    };
    const formatTime = (date) => {
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return `${Math.floor(diff / 6e4)}分钟前`;
      if (diff < 864e5)
        return `${Math.floor(diff / 36e5)}小时前`;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const submitReport = () => {
      var _a;
      if (!userReport.value.content) {
        common_vendor.index.showToast({
          title: "请输入内容",
          icon: "none"
        });
        return;
      }
      const newDiscussion = {
        content: userReport.value.content,
        images: [...userReport.value.images],
        location: ((_a = userReport.value.location) == null ? void 0 : _a.address) || "位置未知",
        time: formatTime(/* @__PURE__ */ new Date())
      };
      discussions.value.unshift(newDiscussion);
      const savedDiscussions = common_vendor.index.getStorageSync("disaster-discussions") || [];
      savedDiscussions.unshift(newDiscussion);
      common_vendor.index.setStorageSync("disaster-discussions", savedDiscussions);
      userReport.value = {
        content: "",
        images: [],
        location: null,
        time: null
      };
      submissionPopup.value.close();
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success"
      });
    };
    common_vendor.onMounted(() => {
      const savedDiscussions = common_vendor.index.getStorageSync("disaster-discussions") || [];
      discussions.value = savedDiscussions;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: mapCenter.value.latitude,
        b: mapCenter.value.longitude,
        c: impactMarkers.value,
        d: impactAreas.value,
        e: common_vendor.o((...args) => _ctx.handleMarkerTap && _ctx.handleMarkerTap(...args)),
        f: common_vendor.f(stats.value, (stat, k0, i0) => {
          return {
            a: stat.icon,
            b: common_vendor.t(stat.value),
            c: common_vendor.t(stat.label),
            d: stat.id,
            e: common_vendor.o(handleCardTouch, stat.id),
            f: common_vendor.o(handleCardTouchEnd, stat.id)
          };
        }),
        g: `scale(${cardScale.value})`,
        h: common_vendor.t(photos.value.length),
        i: common_vendor.f(photos.value, (photo, index, i0) => {
          return {
            a: photo.url,
            b: common_vendor.t(photo.location),
            c: index,
            d: common_vendor.o(($event) => _ctx.previewImage(index), index)
          };
        }),
        j: common_assets._imports_0$1,
        k: common_vendor.t(lastUpdate.value),
        l: common_vendor.f(timeline.value, (item, index, i0) => {
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
        m: common_vendor.t(discussions.value.length),
        n: common_vendor.f(discussions.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.time),
            b: common_vendor.t(item.content),
            c: item.images && item.images.length
          }, item.images && item.images.length ? {
            d: common_vendor.f(item.images, (img, imgIndex, i1) => {
              return {
                a: imgIndex,
                b: img,
                c: common_vendor.o(($event) => previewDiscussionImage(item.images, imgIndex), imgIndex)
              };
            })
          } : {}, {
            e: common_vendor.t(item.location || "位置未知"),
            f: index
          });
        }),
        o: common_assets._imports_1,
        p: common_assets._imports_0$1,
        q: common_assets._imports_2,
        r: common_vendor.o(openSubmission),
        s: common_vendor.o(handleFabTouch),
        t: common_vendor.o(handleFabTouchEnd),
        v: `scale(${fabScale.value})`,
        w: userReport.value.content,
        x: common_vendor.o(($event) => userReport.value.content = $event.detail.value),
        y: userReport.value.images.length
      }, userReport.value.images.length ? {
        z: common_vendor.f(userReport.value.images, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => removeImage(index), index),
            c: index
          };
        })
      } : {}, {
        A: common_assets._imports_3,
        B: common_vendor.o(addPhoto),
        C: common_vendor.o(submitReport),
        D: !userReport.value.content,
        E: common_vendor.sr(submissionPopup, "066c48c3-0", {
          "k": "submissionPopup"
        }),
        F: common_vendor.p({
          type: "bottom"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-066c48c3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Disaster-Report/Disaster-Report.js.map
