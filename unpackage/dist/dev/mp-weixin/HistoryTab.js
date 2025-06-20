"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_load_more2 + _easycom_uni_icons2)();
}
const _easycom_uni_load_more = () => "./uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_load_more + _easycom_uni_icons)();
}
const API_URL = "https://api.wolfx.jp/cenc_eqlist.json";
const CACHE_TIME = 5 * 60 * 1e3;
const _sfc_main = {
  __name: "HistoryTab",
  setup(__props) {
    const filters = [
      { value: "all", label: "全部" },
      { value: "warning", label: "预警" },
      { value: "earthquake", label: "地震" }
    ];
    const activeFilter = common_vendor.ref("all");
    const historyItems = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(null);
    const lastFetchTime = common_vendor.ref(0);
    const goToTestPage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/EmergencyAlert/EmergencyAlert"
      });
    };
    const goToShelter = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Disaster-Report/Disaster-Report"
      });
    };
    const loadData = async () => {
      var _a;
      const now = Date.now();
      if (now - lastFetchTime.value < CACHE_TIME && historyItems.value.length > 0) {
        return;
      }
      loading.value = true;
      error.value = null;
      try {
        const [err, res] = await new Promise((resolve) => {
          common_vendor.index.request({
            url: API_URL,
            method: "GET",
            success: (res2) => resolve([null, res2]),
            fail: (err2) => resolve([err2, null])
          });
        });
        if (err) {
          throw err;
        }
        if (res.statusCode !== 200) {
          throw new Error(`请求失败，状态码: ${res.statusCode}`);
        }
        let rawData = [];
        if (((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.constructor) === Object) {
          rawData = Object.keys(res.data).map((key) => {
            return {
              No: key,
              // 保留原始编号
              ...res.data[key]
              // 展开对象属性
            };
          });
        }
        if (rawData.length === 0) {
          throw new Error("未找到有效地震数据");
        }
        historyItems.value = processData(rawData);
        lastFetchTime.value = now;
      } catch (err) {
        error.value = err.errMsg || err.message || "获取地震数据失败";
        common_vendor.index.__f__("error", "at pages/HistoryTab/HistoryTab.vue:162", "地震数据加载错误:", err);
        if (historyItems.value.length > 0) {
          error.value += " (显示缓存数据)";
        }
      } finally {
        loading.value = false;
      }
    };
    const processData = (data) => {
      const processedData = data.filter((item) => item && item.time && item.magnitude).sort((a, b) => new Date(b.time) - new Date(a.time)).map((item) => ({
        id: item.EventID || `eq-${item.time}-${item.magnitude}-${Math.random().toString(36).substr(2, 6)}`,
        type: item.type || "reviewed",
        magnitude: Number.parseFloat(item.magnitude).toFixed(1),
        title: formatLocation(item.location),
        status: item.type === "automatic" ? "自动预警" : "正式测定",
        time: formatTime(item.time),
        depth: item.depth ? `${Number.parseFloat(item.depth).toFixed(1)}` : "未知",
        intensity: item.intensity || "未知",
        epicenter: item.location,
        description: `震源深度${item.depth || "未知"}千米，坐标: ${item.latitude || "未知"}, ${item.longitude || "未知"}`,
        severityClass: getSeverityClass(item.magnitude),
        reportTime: item.ReportTime ? formatTime(item.ReportTime) : null,
        latitude: Number.parseFloat(item.latitude) || 0,
        longitude: Number.parseFloat(item.longitude) || 0
      }));
      common_vendor.index.setStorageSync("earthquakeHistory", processedData);
      return processedData;
    };
    const formatLocation = (location) => {
      if (!location)
        return "未知地点";
      return location.replace(/^中国(省|自治区|)/, "").trim() || location;
    };
    const formatTime = (timeString) => {
      try {
        const date = new Date(timeString);
        return Number.isNaN(date.getTime()) ? timeString : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      } catch {
        return timeString;
      }
    };
    const pad = (n) => n.toString().padStart(2, "0");
    const getSeverityClass = (magnitude) => {
      const value = Number.parseFloat(magnitude) || 0;
      if (value < 3.5)
        return "minor";
      if (value < 4.5)
        return "light";
      if (value < 6)
        return "moderate";
      if (value < 7)
        return "strong";
      return "major";
    };
    const filteredItems = common_vendor.computed(() => {
      if (activeFilter.value === "all")
        return historyItems.value;
      return historyItems.value.filter(
        (item) => activeFilter.value === "warning" ? item.type === "automatic" : item.type !== "automatic"
      );
    });
    const setFilter = (filter) => {
      activeFilter.value = filter;
    };
    const retryLoading = () => {
      loadData();
    };
    const viewEarthquakeMap = () => {
      if (historyItems.value.length > 0) {
        common_vendor.index.setStorageSync("earthquakeHistory", historyItems.value);
      }
      common_vendor.index.navigateTo({
        url: "/pages/EarthquakeMap/EarthquakeMap"
      });
    };
    common_vendor.onMounted(() => {
      loadData().then(() => {
        historyItems.value.unshift({
          id: "fake-test-001",
          type: "automatic",
          magnitude: "4.0",
          title: "测试地震·都江堰",
          status: "自动预警",
          time: formatTime((/* @__PURE__ */ new Date()).toISOString()),
          depth: "5.0",
          intensity: "V",
          epicenter: "四川成都市都江堰",
          description: "测试数据：深度5km，震中坐标 30.88, 103.49",
          severityClass: getSeverityClass(4),
          reportTime: formatTime((/* @__PURE__ */ new Date()).toISOString())
        });
      });
      setInterval(() => {
        if (!loading.value) {
          loadData();
        }
      }, 5 * 60 * 1e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(filters, (filter, k0, i0) => {
          return {
            a: common_vendor.t(filter.label),
            b: filter.value,
            c: common_vendor.n({
              active: activeFilter.value === filter.value
            }),
            d: common_vendor.o(($event) => setFilter(filter.value), filter.value)
          };
        }),
        b: common_vendor.o(viewEarthquakeMap),
        c: loading.value
      }, loading.value ? {
        d: common_vendor.p({
          status: "loading"
        })
      } : error.value ? {
        f: common_vendor.p({
          type: "info",
          size: "24",
          color: "#e74c3c"
        }),
        g: common_vendor.t(error.value),
        h: common_vendor.o(retryLoading)
      } : common_vendor.e({
        i: filteredItems.value.length === 0
      }, filteredItems.value.length === 0 ? {
        j: common_vendor.p({
          type: "folder",
          size: "24",
          color: "#95a5a6"
        })
      } : {}, {
        k: common_vendor.f(filteredItems.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.magnitude),
            b: common_vendor.n(item.severityClass),
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.status),
            e: common_vendor.n(item.type),
            f: item.id === "fake-test-001"
          }, item.id === "fake-test-001" ? {
            g: common_vendor.o(goToTestPage, item.id)
          } : {}, {
            h: "ed885364-3-" + i0,
            i: common_vendor.t(item.time),
            j: "ed885364-4-" + i0,
            k: common_vendor.t(item.depth),
            l: item.intensity
          }, item.intensity ? {
            m: "ed885364-5-" + i0,
            n: common_vendor.p({
              type: "notification",
              size: "14",
              color: "#888"
            }),
            o: common_vendor.t(item.intensity)
          } : {}, {
            p: item.epicenter
          }, item.epicenter ? {
            q: "ed885364-6-" + i0,
            r: common_vendor.p({
              type: "map",
              size: "14",
              color: "#888"
            }),
            s: common_vendor.t(item.epicenter)
          } : {}, {
            t: common_vendor.o(goToShelter, item.id),
            v: item.id
          });
        }),
        l: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "#666"
        }),
        m: common_vendor.p({
          type: "location",
          size: "14",
          color: "#666"
        })
      }), {
        e: error.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ed885364"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/HistoryTab.js.map
