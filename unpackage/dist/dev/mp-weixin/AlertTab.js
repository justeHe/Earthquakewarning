"use strict";
const common_vendor = require("./common/vendor.js");
require("./lib/amap-wx.130.js");
const mapKey = "3ceccd136aabe918552f561c13f20691";
const _sfc_main = {
  __name: "AlertTab",
  setup(__props) {
    const amapFile = require("./lib/amap-wx.130.js");
    const alertStatus = common_vendor.ref("safe");
    const alertIcon = common_vendor.ref("fas fa-check-circle");
    const alertTitle = common_vendor.ref("当前安全");
    const alertMessage = common_vendor.ref("您所在区域当前无地震威胁");
    const location = common_vendor.ref("正在获取位置...");
    const isRefreshing = common_vendor.ref(false);
    const quakes = common_vendor.ref([
      {
        id: 1,
        magnitude: "M4.2",
        time: "2025-05-15 08:23",
        distance: "1525km",
        depth: "10km",
        warning: "无明显震感",
        latitude: 39.90469,
        longitude: 116.40717
      },
      {
        id: 2,
        magnitude: "M3.9",
        time: "2025-05-12 14:37",
        distance: "64.82km",
        depth: "5km",
        warning: "部分地区有震感",
        latitude: 30.88,
        longitude: 103.49
      }
    ]);
    const latitude = common_vendor.ref(39.90469);
    const longitude = common_vendor.ref(116.40717);
    const markers = common_vendor.ref([]);
    const myLatitude = common_vendor.ref(39.90469);
    const myLongitude = common_vendor.ref(116.40717);
    const processRegeoData = (data) => {
      data.regeocodeData || {};
      return {
        name: data[0].name || "无",
        desc: data[0].desc || "无",
        longitude: Number.parseFloat(data[0].longitude) || 0,
        latitude: Number.parseFloat(data[0].latitude) || 0
      };
    };
    const getAddress = async () => {
      const myAmapFun = new amapFile.AMapWX({ key: mapKey });
      try {
        const [err, data] = await new Promise((resolve) => {
          myAmapFun.getRegeo({
            success: (res) => resolve([null, res]),
            fail: (err2) => resolve([err2, null])
          });
        });
        if (err) {
          throw new Error(err.errMsg || "逆地理编码请求失败");
        }
        if (!data || typeof data !== "object") {
          throw new Error("无效的逆地理编码响应格式");
        }
        const processedData = processRegeoData(data);
        common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:147", "处理后的结构化数据:", processedData);
        return processedData;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:151", "地址解析错误:", err.message);
        throw err;
      }
    };
    const updateMarkers = (activeId = null) => {
      if (activeId) {
        const quake = quakes.value.find((q) => q.id === activeId);
        if (quake) {
          markers.value = [{
            id: quake.id,
            latitude: quake.latitude,
            longitude: quake.longitude,
            width: 40,
            height: 40,
            callout: {
              content: `${quake.magnitude} ${quake.distance}
${quake.warning}`,
              color: "#ffffff",
              bgColor: "#1890ff",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            }
          }];
        }
      } else {
        markers.value = [
          {
            id: 0,
            latitude: myLatitude.value,
            longitude: myLongitude.value,
            width: 30,
            height: 30,
            callout: {
              content: "当前位置",
              color: "#ffffff",
              bgColor: "#1890ff",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            }
          },
          ...quakes.value.map((quake) => ({
            id: quake.id,
            latitude: quake.latitude,
            longitude: quake.longitude,
            width: 30,
            height: 30,
            callout: {
              content: `${quake.magnitude} ${quake.distance}
${quake.warning}`,
              color: "#ffffff",
              bgColor: "#ff4d4f",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            }
          }))
        ];
      }
    };
    const moveToQuake = (quake) => {
      common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:219", "点击地震卡片:", quake);
      isViewingQuake.value = true;
      latitude.value = quake.latitude;
      longitude.value = quake.longitude;
      updateMarkers(quake.id);
    };
    const isUpdatingLocation = common_vendor.ref(false);
    const getWxLocationAsFallback = () => {
      isUpdatingLocation.value = true;
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:237", "获取位置成功:", res);
          myLongitude.value = res.longitude;
          myLatitude.value = res.latitude;
          if (!isViewingQuake.value) {
            longitude.value = res.longitude;
            latitude.value = res.latitude;
          }
          updateMarkers();
          getAddress().then((data) => {
            location.value = data.name;
          }).catch((err) => common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:249", "获取地址失败:", err.message));
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:252", "获取位置失败:", err);
          common_vendor.index.showToast({
            title: "获取位置失败",
            icon: "none"
          });
        },
        complete: () => {
          isUpdatingLocation.value = false;
        }
      });
    };
    const backToMyLocation = () => {
      isViewingQuake.value = false;
      latitude.value = myLatitude.value;
      longitude.value = myLongitude.value;
      updateMarkers();
      getWxLocationAsFallback();
    };
    const isViewingQuake = common_vendor.ref(false);
    const goToEarthquakeMap = () => {
      common_vendor.index.setStorageSync("earthquakeHistory", quakes.value);
      common_vendor.index.navigateTo({
        url: "/pages/EarthquakeMap/EarthquakeMap"
      });
    };
    const goToSeismicData = () => {
      common_vendor.index.navigateTo({
        url: "/pages/SeismicData/SeismicData",
        success: () => {
          common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:295", "成功跳转到数据分析页面");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:298", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:308", "初始化地图组件");
      getWxLocationAsFallback();
      updateMarkers();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.n(alertIcon.value),
        b: common_vendor.t(alertTitle.value),
        c: common_vendor.t(alertMessage.value),
        d: common_vendor.n(alertStatus.value),
        e: common_vendor.t(location.value),
        f: common_vendor.n(isRefreshing.value ? "fa-spinner fa-pulse" : "fa-sync-alt"),
        g: common_vendor.o((...args) => _ctx.refreshLocation && _ctx.refreshLocation(...args)),
        h: isRefreshing.value,
        i: latitude.value,
        j: longitude.value,
        k: markers.value,
        l: isUpdatingLocation.value ? 1 : "",
        m: common_vendor.o(backToMyLocation),
        n: common_vendor.o(goToSeismicData),
        o: common_vendor.f(quakes.value, (quake, k0, i0) => {
          return {
            a: common_vendor.t(quake.magnitude),
            b: common_vendor.t(quake.time),
            c: common_vendor.t(quake.distance),
            d: common_vendor.t(quake.depth),
            e: common_vendor.t(quake.warning),
            f: common_vendor.t(quake.latitude.toFixed(4)),
            g: common_vendor.t(quake.longitude.toFixed(4)),
            h: common_vendor.o(goToEarthquakeMap, quake.id),
            i: quake.id,
            j: common_vendor.o(($event) => moveToQuake(quake), quake.id)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f652d009"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/AlertTab.js.map
