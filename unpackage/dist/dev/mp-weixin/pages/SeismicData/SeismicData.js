"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "SeismicData",
  setup(__props) {
    const timePeriods = [
      { label: "24小时", value: 24 },
      { label: "7天", value: 168 },
      { label: "30天", value: 720 }
    ];
    const selectedPeriod = common_vendor.ref(24);
    const magnitudeRange = ["3.0", "4.0", "5.0", "6.0"];
    const magnitudeIndex = common_vendor.ref(0);
    const mapCenter = common_vendor.ref({
      latitude: 39.9042,
      longitude: 116.4074
    });
    const intensityLevels = [
      { label: "≥6.0", color: "#DC2626" },
      { label: "5.0-5.9", color: "#FB923C" },
      { label: "4.0-4.9", color: "#FBBF24" },
      { label: "3.0-3.9", color: "#22C55E" }
    ];
    const aftershocks = common_vendor.ref([
      {
        magnitude: 4.5,
        time: new Date(Date.now() - 36e5),
        position: 15
      },
      {
        magnitude: 3.8,
        time: new Date(Date.now() - 72e5),
        position: 30
      },
      {
        magnitude: 5.2,
        time: new Date(Date.now() - 144e5),
        position: 45
      }
    ]);
    const intensityCircles = common_vendor.ref([
      {
        latitude: 39.9042,
        longitude: 116.4074,
        color: "#DC262650",
        fillColor: "#DC262620",
        radius: 5e3,
        strokeWidth: 2
      },
      {
        latitude: 39.9042,
        longitude: 116.4074,
        color: "#FB923C50",
        fillColor: "#FB923C20",
        radius: 1e4,
        strokeWidth: 2
      },
      {
        latitude: 39.9042,
        longitude: 116.4074,
        color: "#FBBF2450",
        fillColor: "#FBBF2420",
        radius: 15e3,
        strokeWidth: 2
      }
    ]);
    const currentConfidence = common_vendor.ref(85);
    const filteredAftershocks = common_vendor.computed(() => {
      const minMagnitude = Number.parseFloat(magnitudeRange[magnitudeIndex.value]);
      return aftershocks.value.filter((event) => event.magnitude >= minMagnitude);
    });
    const getEventColor = (magnitude) => {
      if (magnitude >= 6)
        return "#DC2626";
      if (magnitude >= 5)
        return "#FB923C";
      if (magnitude >= 4)
        return "#FBBF24";
      return "#22C55E";
    };
    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    };
    const onMagnitudeChange = (e) => {
      magnitudeIndex.value = e.detail.value;
    };
    const drawSeismicWave = () => {
      const ctx = common_vendor.index.createCanvasContext("seismicGraph");
      const width = 600;
      const height = 200;
      const padding = 20;
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.setStrokeStyle("#94A3B8");
      ctx.stroke();
      const points = [];
      for (let i = 0; i < 100; i++) {
        const x = padding + (width - 2 * padding) * (i / 100);
        const y = height / 2 + Math.sin(i / 5) * 30 * Math.exp(-i / 50);
        points.push([x, y]);
      }
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (const point of points) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.setStrokeStyle("#3B82F6");
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1] + 20);
      for (const point of points) {
        ctx.lineTo(point[0], point[1] + 20 + Math.cos(point[0] / 10) * 10);
      }
      ctx.setStrokeStyle("#EF4444");
      ctx.stroke();
      ctx.draw();
    };
    common_vendor.onMounted(() => {
      drawSeismicWave();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(timePeriods, (period, index, i0) => {
          return {
            a: common_vendor.t(period.label),
            b: index,
            c: common_vendor.n({
              active: selectedPeriod.value === period.value
            }),
            d: common_vendor.o(($event) => selectedPeriod.value = period.value, index)
          };
        }),
        b: common_vendor.t(magnitudeRange[magnitudeIndex.value]),
        c: magnitudeIndex.value,
        d: magnitudeRange,
        e: common_vendor.o(onMagnitudeChange),
        f: common_vendor.f(filteredAftershocks.value, (event, index, i0) => {
          return {
            a: event.magnitude * 8 + "rpx",
            b: event.magnitude * 8 + "rpx",
            c: getEventColor(event.magnitude),
            d: common_vendor.t(event.magnitude),
            e: common_vendor.t(formatTime(event.time)),
            f: index,
            g: event.position + "%"
          };
        }),
        g: common_vendor.t(currentConfidence.value),
        h: common_vendor.f(intensityLevels, (level, index, i0) => {
          return {
            a: level.color,
            b: common_vendor.t(level.label),
            c: index
          };
        }),
        i: mapCenter.value.latitude,
        j: mapCenter.value.longitude,
        k: intensityCircles.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2111ba09"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/SeismicData/SeismicData.js.map
