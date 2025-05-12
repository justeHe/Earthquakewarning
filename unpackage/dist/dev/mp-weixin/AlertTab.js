"use strict";
const common_vendor = require("./common/vendor.js");
const common_assets = require("./common/assets.js");
const _sfc_main = {
  __name: "AlertTab",
  setup(__props) {
    const alertStatus = common_vendor.ref("safe");
    const alertIcon = common_vendor.ref("fas fa-check-circle");
    const alertTitle = common_vendor.ref("当前安全");
    const alertMessage = common_vendor.ref("您所在区域当前无地震威胁");
    const location = common_vendor.ref("正在获取位置...");
    const isRefreshing = common_vendor.ref(false);
    const quakes = common_vendor.ref([
      { id: 1, magnitude: "M4.2", time: "2023-05-15 08:23", distance: "85km", depth: "10km", warning: "不会对您所在区域造成明显影响" },
      { id: 2, magnitude: "M5.8", time: "2023-05-12 14:37", distance: "120km", depth: "15km", warning: "部分地区有震感" }
    ]);
    const latitude = common_vendor.ref(39.90469);
    const longitude = common_vendor.ref(116.40717);
    const markers = common_vendor.ref([{
      id: 1,
      width: 30,
      height: 30
    }]);
    const canOpenAmap = common_vendor.ref(false);
    function getAmapLocation() {
      common_vendor.wx$1.request({
        url: "https://restapi.amap.com/v3/ip",
        data: {
          key: "3ceccd136aabe918552f561c13f20691",
          output: "JSON"
        },
        success: (res) => {
          if (res.data.status === "1") {
            const { rectangle } = res.data;
            const coords = rectangle.split(";")[0].split(",");
            longitude.value = parseFloat(coords[0]);
            latitude.value = parseFloat(coords[1]);
            updateAmapMarker();
            getAmapAddress(longitude.value, latitude.value);
          } else {
            getWxLocationAsFallback();
          }
        },
        fail: () => {
          getWxLocationAsFallback();
        }
      });
    }
    function getAmapAddress(lng, lat) {
      common_vendor.wx$1.request({
        url: "https://restapi.amap.com/v3/geocode/regeo",
        data: {
          key: "3ceccd136aabe918552f561c13f20691",
          location: `${lng},${lat}`,
          radius: 1e3,
          extensions: "base",
          output: "JSON"
        },
        success: (res) => {
          if (res.data.status === "1") {
            location.value = res.data.regeocode.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          } else {
            location.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          }
        },
        fail: () => {
          location.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      });
    }
    function updateAmapMarker() {
      markers.value = [{
        id: 1,
        latitude: latitude.value,
        longitude: longitude.value,
        // iconPath: '/static/location.png',
        width: 30,
        height: 30,
        callout: {
          content: "我的位置",
          color: "#ffffff",
          bgColor: "#1890ff",
          padding: 5,
          borderRadius: 4,
          display: "ALWAYS"
        }
      }];
    }
    function getWxLocationAsFallback() {
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        success: (res) => {
          longitude.value = res.longitude;
          latitude.value = res.latitude;
          updateAmapMarker();
          getAmapAddress(res.longitude, res.latitude);
        }
      });
    }
    function openAmap() {
      common_vendor.wx$1.navigateToMiniProgram({
        appId: "wx9f4d9a2e9b9d9b9d",
        // 高德地图小程序appid
        path: `pages/map/map?location=${latitude.value},${longitude.value}&name=我的位置`,
        success: () => common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:181", "跳转成功"),
        fail: (err) => common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:182", "跳转失败:", err)
      });
    }
    function handleMapTap(e) {
      common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:187", "地图点击:", e);
    }
    common_vendor.onMounted(() => {
      getAmapLocation();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
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
        l: common_vendor.o(handleMapTap),
        m: canOpenAmap.value
      }, canOpenAmap.value ? {
        n: common_assets._imports_0,
        o: common_vendor.o(openAmap)
      } : {}, {
        p: common_vendor.f(quakes.value, (quake, k0, i0) => {
          return {
            a: common_vendor.t(quake.magnitude),
            b: common_vendor.t(quake.time),
            c: common_vendor.t(quake.distance),
            d: common_vendor.t(quake.depth),
            e: common_vendor.t(quake.warning),
            f: quake.id
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f652d009"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/AlertTab.js.map
