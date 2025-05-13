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
        time: "2023-05-15 08:23",
        distance: "85km",
        depth: "10km",
        warning: "不会对您所在区域造成明显影响",
        latitude: 40,
        longitude: 117
      },
      {
        id: 2,
        magnitude: "M5.8",
        time: "2023-05-12 14:37",
        distance: "120km",
        depth: "15km",
        warning: "部分地区有震感",
        latitude: 39.904,
        longitude: 116.4071
      }
    ]);
    const latitude = common_vendor.ref(39.90469);
    const longitude = common_vendor.ref(116.40717);
    const markers = common_vendor.ref([{
      id: 1,
      width: 30,
      height: 30
    }]);
    function processRegeoData(data) {
      data.regeocodeData || {};
      return {
        name: data[0].name || "无",
        desc: data[0].desc || "无",
        longitude: parseFloat(data[0].longitude) || 0,
        latitude: parseFloat(data[0].latitude) || 0
      };
    }
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
        common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:123", "处理后的结构化数据:", processedData);
        return processedData;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:127", "地址解析错误:", err.message);
        throw err;
      }
    };
    function updateAmapMarker() {
      markers.value = [
        {
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
        },
        ...quakes.value.map((quake) => ({
          id: quake.id + 1,
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
    function getWxLocationAsFallback() {
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/AlertTab/AlertTab.vue:174", res);
          longitude.value = res.longitude;
          latitude.value = res.latitude;
          updateAmapMarker();
          getAddress().then((data) => location.value = data.name).catch((err) => common_vendor.index.__f__("error", "at pages/AlertTab/AlertTab.vue:180", "操作失败:", err.message));
        }
      });
    }
    common_vendor.onMounted(() => {
      getWxLocationAsFallback();
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
        l: common_vendor.o((...args) => _ctx.handleMapTap && _ctx.handleMapTap(...args)),
        m: common_vendor.f(quakes.value, (quake, k0, i0) => {
          return {
            a: common_vendor.t(quake.magnitude),
            b: common_vendor.t(quake.time),
            c: common_vendor.t(quake.distance),
            d: common_vendor.t(quake.depth),
            e: common_vendor.t(quake.warning),
            f: common_vendor.t(quake.latitude.toFixed(4)),
            g: common_vendor.t(quake.longitude.toFixed(4)),
            h: quake.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f652d009"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/AlertTab.js.map
