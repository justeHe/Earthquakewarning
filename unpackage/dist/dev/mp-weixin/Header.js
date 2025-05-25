"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  data() {
    return {
      map: null,
      AMap: null,
      longitude: 0,
      latitude: 0,
      address: "",
      locating: false,
      marker: null
    };
  },
  onReady() {
    this.initMap();
  },
  methods: {
    async initMap() {
      try {
        this.locateMe();
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/Header/Header.vue:42", "地图初始化失败:", e);
        common_vendor.index.showToast({
          title: "地图加载失败",
          icon: "none"
        });
      }
    },
    // H5端高德地图初始化
    async initWebAMap() {
      const AMap = await AMapLoader.load({
        key: "您的高德Web端Key",
        version: "2.0",
        plugins: ["AMap.Geolocation", "AMap.Geocoder"]
      });
      this.AMap = AMap;
      this.map = new AMap.Map("mapContainer", {
        zoom: 15,
        viewMode: "3D"
      });
      this.map.addControl(new AMap.ControlBar({
        showZoomBar: true,
        showControlButton: true
      }));
    },
    // App端原生定位
    async initNativeMap() {
      this.map = common_vendor.index.createMapContext("mapContainer", this);
    },
    // 定位核心方法
    async locateMe() {
      common_vendor.index.navigateTo({
        url: "/pages/Disaster-Report/Disaster-Report",
        success: () => {
          common_vendor.index.__f__("log", "at pages/Header/Header.vue:102", "跳转成功");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Header/Header.vue:105", "跳转失败:", err);
          common_vendor.index.showToast({
            title: "无法打开警报页面",
            icon: "none"
          });
        }
      });
    },
    // H5端定位
    async webLocation() {
      return new Promise((resolve, reject) => {
        const geolocation = new this.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 1e4,
          showMarker: false
        });
        geolocation.getCurrentPosition((status, result) => {
          if (status === "complete") {
            this.handleLocationSuccess(result.position);
            resolve();
          } else {
            reject(new Error(result.message || "获取位置失败"));
          }
        });
      });
    },
    // App端定位
    async nativeLocation() {
      const [err, res] = await common_vendor.index.getLocation({
        type: "gcj02",
        altitude: true,
        isHighAccuracy: true
      });
      if (err)
        throw err;
      this.longitude = res.longitude;
      this.latitude = res.latitude;
      this.map.moveToLocation({
        latitude: this.latitude,
        longitude: this.longitude
      });
      this.addMarker([this.longitude, this.latitude]);
      this.reverseGeocode();
    },
    // 处理定位成功
    handleLocationSuccess(position) {
      this.longitude = position.lng;
      this.latitude = position.lat;
      this.map.setCenter([this.longitude, this.latitude]);
      this.addMarker([this.longitude, this.latitude]);
      this.reverseGeocode();
    },
    // 添加标记
    addMarker(position) {
      if (this.marker) {
        this.map.remove(this.marker);
      }
    },
    // 逆地理编码获取地址
    async reverseGeocode() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/Header.js.map
