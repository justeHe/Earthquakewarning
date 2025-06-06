"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "EarthquakeMap",
  setup(__props) {
    const centerLatitude = common_vendor.ref(35);
    const centerLongitude = common_vendor.ref(105);
    const scale = common_vendor.ref(5);
    const markers = common_vendor.ref([]);
    const circles = common_vendor.ref([]);
    const selectedQuake = common_vendor.ref(null);
    let markerFlashInterval = null;
    const myLocationMarker = common_vendor.computed(() => ({
      id: "my-location",
      latitude: centerLatitude.value,
      longitude: centerLongitude.value,
      width: 24,
      height: 24,
      iconPath: "/static/icons/location-pin.svg",
      anchor: { x: 0.5, y: 1 },
      callout: {
        content: "当前位置",
        color: "#FFFFFF",
        fontSize: 12,
        borderRadius: 4,
        padding: 4,
        bgColor: "#3B82F6",
        display: "ALWAYS"
      }
    }));
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const createMarkersAndCircles = (quakes) => {
      const newMarkers = [];
      const newCircles = [];
      quakes.forEach((quake, index) => {
        if (!quake.latitude || !quake.longitude)
          return;
        newMarkers.push({
          id: index,
          latitude: quake.latitude,
          longitude: quake.longitude,
          width: 12,
          height: 12,
          iconPath: "/static/icons/earthquake.svg",
          anchor: { x: 0.5, y: 0.5 },
          callout: {
            content: `${quake.magnitude}级`,
            color: "#FFFFFF",
            fontSize: 10,
            borderRadius: 4,
            padding: 4,
            bgColor: getColorByMagnitude(quake.magnitude),
            display: "ALWAYS"
          }
        });
        newCircles.push({
          latitude: quake.latitude,
          longitude: quake.longitude,
          color: getColorByMagnitude(quake.magnitude, 0.2),
          fillColor: getColorByMagnitude(quake.magnitude, 0.1),
          radius: getMagnitudeRadius(quake.magnitude),
          strokeWidth: 1
        });
      });
      markers.value = newMarkers;
      circles.value = newCircles;
    };
    const getColorByMagnitude = (magnitude, alpha = 1) => {
      const mag = Number.parseFloat(magnitude);
      let color;
      if (mag < 3.5)
        color = [74, 222, 128];
      else if (mag < 4.5)
        color = [250, 204, 21];
      else if (mag < 6)
        color = [251, 146, 60];
      else if (mag < 7)
        color = [248, 113, 113];
      else
        color = [220, 38, 38];
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
    };
    const getMagnitudeRadius = (magnitude) => {
      const mag = Number.parseFloat(magnitude);
      return 2 ** mag * 1e3;
    };
    const startMarkerFlash = () => {
      let visible = true;
      markerFlashInterval = setInterval(() => {
        markers.value = markers.value.map((marker) => ({
          ...marker,
          alpha: visible ? 1 : 0.3
        }));
        visible = !visible;
      }, 1e3);
    };
    const onMarkerTap = (e) => {
      if (e.detail.markerId === "my-location")
        return;
      const historyData = common_vendor.index.getStorageSync("earthquakeHistory");
      if (historyData) {
        selectedQuake.value = historyData[e.detail.markerId];
        centerLatitude.value = selectedQuake.value.latitude;
        centerLongitude.value = selectedQuake.value.longitude;
        scale.value = 8;
      }
    };
    const zoomIn = () => {
      if (scale.value < 14)
        scale.value++;
    };
    const zoomOut = () => {
      if (scale.value > 4)
        scale.value--;
    };
    const backToMyLocation = () => {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          centerLatitude.value = res.latitude;
          centerLongitude.value = res.longitude;
          scale.value = 8;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "无法获取位置",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onMounted(() => {
      const historyData = common_vendor.index.getStorageSync("earthquakeHistory");
      if (historyData) {
        createMarkersAndCircles(historyData);
        startMarkerFlash();
      }
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          centerLatitude.value = res.latitude;
          centerLongitude.value = res.longitude;
          scale.value = 8;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "无法获取位置",
            icon: "none"
          });
        }
      });
    });
    common_vendor.onUnmounted(() => {
      if (markerFlashInterval) {
        clearInterval(markerFlashInterval);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goBack),
        b: common_vendor.o(zoomIn),
        c: common_vendor.o(zoomOut),
        d: common_vendor.o(backToMyLocation),
        e: centerLatitude.value,
        f: centerLongitude.value,
        g: [...markers.value, myLocationMarker.value],
        h: circles.value,
        i: scale.value,
        j: common_vendor.o(onMarkerTap),
        k: selectedQuake.value
      }, selectedQuake.value ? {
        l: common_vendor.t(selectedQuake.value.magnitude),
        m: getColorByMagnitude(selectedQuake.value.magnitude),
        n: common_vendor.t(selectedQuake.value.title),
        o: common_vendor.o(($event) => selectedQuake.value = null),
        p: common_vendor.t(selectedQuake.value.depth),
        q: common_vendor.t(selectedQuake.value.time),
        r: common_vendor.t(selectedQuake.value.intensity),
        s: common_vendor.t(selectedQuake.value.status),
        t: common_vendor.n(selectedQuake.value.type),
        v: common_vendor.t(selectedQuake.value.latitude),
        w: common_vendor.t(selectedQuake.value.longitude)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-76cc4141"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/EarthquakeMap/EarthquakeMap.js.map
