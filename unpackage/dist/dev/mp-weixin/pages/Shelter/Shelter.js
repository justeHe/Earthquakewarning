"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "Shelter",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "e6d4df30": selectedLocation.value ? selectedLocation.value.typeBgColor : "#f8fafc"
    }));
    const currentLocation = common_vendor.ref({
      latitude: 39.90469,
      longitude: 116.40717
    });
    const markerTypes = [
      { type: "shelter", label: "避难所", icon: "/static/icons/shelter.svg", color: "#3b82f6", bgColor: "#EFF6FF" },
      { type: "medical", label: "医疗站", icon: "/static/icons/medical.svg", color: "#10b981", bgColor: "#ECFDF5" },
      { type: "supplies", label: "物资站", icon: "/static/icons/supplies.svg", color: "#f59e0b", bgColor: "#FEF3C7" }
    ];
    const tabs = [
      { value: "all", label: "全部", icon: "/static/icons/all.svg" },
      { value: "shelter", label: "避难所", icon: "/static/icons/shelter.svg" },
      { value: "medical", label: "医疗站", icon: "/static/icons/medical.svg" },
      { value: "supplies", label: "物资站", icon: "/static/icons/supplies.svg" }
    ];
    const activeTab = common_vendor.ref("all");
    const locations = common_vendor.ref([
      {
        id: 1,
        type: "shelter",
        name: "朝阳区应急避难所",
        latitude: 39.90569,
        longitude: 116.40817,
        distance: "0.3",
        capacity: 500,
        currentPeople: 120,
        vacancyRate: 76,
        supplies: "充足",
        contact: "010-12345678",
        manager: "张主任",
        typeColor: "#3b82f6",
        typeBgColor: "#EFF6FF",
        typeIcon: "/static/icons/shelter.svg",
        routeInfo: "从当前位置向东200米，右转进入幸福小区，避难所位于小区东南角",
        suppliesList: [
          { name: "饮用水", status: "充足", percentage: 85, color: "#3b82f6", statusClass: "status-good" },
          { name: "食品", status: "充足", percentage: 80, color: "#3b82f6", statusClass: "status-good" },
          { name: "医疗用品", status: "中等", percentage: 60, color: "#f59e0b", statusClass: "status-medium" },
          { name: "帐篷", status: "充足", percentage: 90, color: "#3b82f6", statusClass: "status-good" }
        ]
      },
      {
        id: 2,
        type: "medical",
        name: "朝阳区第一医疗站",
        latitude: 39.90669,
        longitude: 116.40917,
        distance: "0.5",
        capacity: 200,
        currentPeople: 45,
        vacancyRate: 77.5,
        supplies: "充足",
        contact: "010-12345679",
        manager: "李医生",
        typeColor: "#10b981",
        typeBgColor: "#ECFDF5",
        typeIcon: "/static/icons/medical.svg",
        routeInfo: "从当前位置向北300米，左转进入医院大门，医疗站位于急诊部一层",
        suppliesList: [
          { name: "医疗器械", status: "充足", percentage: 90, color: "#3b82f6", statusClass: "status-good" },
          { name: "药品", status: "充足", percentage: 85, color: "#3b82f6", statusClass: "status-good" },
          { name: "防护用品", status: "中等", percentage: 65, color: "#f59e0b", statusClass: "status-medium" }
        ]
      },
      {
        id: 3,
        type: "supplies",
        name: "朝阳区物资储备站",
        latitude: 39.90369,
        longitude: 116.40617,
        distance: "0.4",
        capacity: 1e3,
        currentPeople: 80,
        vacancyRate: 92,
        supplies: "充足",
        contact: "010-12345680",
        manager: "王站长",
        typeColor: "#f59e0b",
        typeBgColor: "#FEF3C7",
        typeIcon: "/static/icons/supplies.svg",
        routeInfo: "从当前位置向西400米，物资站位于体育场旁",
        suppliesList: [
          { name: "食品", status: "充足", percentage: 95, color: "#3b82f6", statusClass: "status-good" },
          { name: "饮用水", status: "充足", percentage: 90, color: "#3b82f6", statusClass: "status-good" },
          { name: "生活用品", status: "充足", percentage: 85, color: "#3b82f6", statusClass: "status-good" },
          { name: "帐篷", status: "中等", percentage: 70, color: "#f59e0b", statusClass: "status-medium" }
        ]
      }
    ]);
    const allMarkers = common_vendor.computed(() => {
      return locations.value.map((location) => ({
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        iconPath: location.typeIcon,
        width: 32,
        height: 32,
        callout: {
          content: `${location.name}
距离: ${location.distance}km`,
          color: "#ffffff",
          fontSize: 12,
          borderRadius: 4,
          padding: 8,
          bgColor: location.typeColor,
          display: "BYCLICK",
          textAlign: "center",
          anchorY: -60
        }
      }));
    });
    const filteredLocations = common_vendor.computed(() => {
      if (activeTab.value === "all") {
        return locations.value;
      }
      return locations.value.filter((location) => location.type === activeTab.value);
    });
    const selectedLocation = common_vendor.ref(null);
    const detailPopup = common_vendor.ref(null);
    const showLocationDetail = (location) => {
      selectedLocation.value = location;
      detailPopup.value.open();
    };
    const closeDetail = () => {
      detailPopup.value.close();
    };
    const onMarkerTap = (e) => {
      const location = locations.value.find((loc) => loc.id === e.detail.markerId);
      if (location) {
        showLocationDetail(location);
      }
    };
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
    const startNavigation = () => {
      if (!selectedLocation.value)
        return;
      common_vendor.index.openLocation({
        latitude: selectedLocation.value.latitude,
        longitude: selectedLocation.value.longitude,
        name: selectedLocation.value.name,
        address: selectedLocation.value.routeInfo,
        success: () => {
          common_vendor.index.showToast({
            title: "正在打开导航",
            icon: "success"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(markerTypes, (item, k0, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.label),
            c: item.type
          };
        }),
        b: currentLocation.value.latitude,
        c: currentLocation.value.longitude,
        d: allMarkers.value,
        e: common_vendor.o(onMarkerTap),
        f: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: tab.icon,
            b: common_vendor.t(tab.label),
            c: tab.value,
            d: common_vendor.n({
              active: activeTab.value === tab.value
            }),
            e: common_vendor.o(($event) => activeTab.value = tab.value, tab.value)
          };
        }),
        g: common_vendor.f(filteredLocations.value, (item, k0, i0) => {
          return {
            a: item.typeIcon,
            b: item.typeBgColor,
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.distance),
            e: "61b16127-0-" + i0,
            f: "61b16127-1-" + i0,
            g: common_vendor.t(item.capacity),
            h: "61b16127-2-" + i0,
            i: common_vendor.t(item.supplies),
            j: "61b16127-3-" + i0,
            k: common_vendor.t(item.contact),
            l: item.id,
            m: common_vendor.o(($event) => showLocationDetail(item), item.id)
          };
        }),
        h: common_vendor.p({
          type: "right",
          size: "16",
          color: "#999"
        }),
        i: common_vendor.p({
          type: "staff",
          size: "16",
          color: "#666"
        }),
        j: common_vendor.p({
          type: "shop",
          size: "16",
          color: "#666"
        }),
        k: common_vendor.p({
          type: "phone",
          size: "16",
          color: "#666"
        }),
        l: common_vendor.p({
          type: "close",
          size: "20",
          color: "#666"
        }),
        m: common_vendor.o(closeDetail),
        n: selectedLocation.value
      }, selectedLocation.value ? {
        o: selectedLocation.value.typeIcon,
        p: selectedLocation.value.typeBgColor,
        q: common_vendor.t(selectedLocation.value.name),
        r: common_vendor.t(selectedLocation.value.distance),
        s: common_vendor.t(selectedLocation.value.type),
        t: common_vendor.t(selectedLocation.value.capacity),
        v: common_vendor.t(selectedLocation.value.currentPeople),
        w: common_vendor.t(selectedLocation.value.vacancyRate),
        x: common_vendor.f(selectedLocation.value.suppliesList, (supply, k0, i0) => {
          return {
            a: common_vendor.t(supply.name),
            b: common_vendor.t(supply.status),
            c: common_vendor.n(supply.statusClass),
            d: supply.percentage + "%",
            e: supply.color,
            f: supply.name
          };
        }),
        y: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#2563eb"
        }),
        z: common_vendor.t(selectedLocation.value.contact),
        A: common_vendor.o(($event) => handleCall(selectedLocation.value.contact)),
        B: common_vendor.p({
          type: "staff",
          size: "20",
          color: "#2563eb"
        }),
        C: common_vendor.t(selectedLocation.value.manager),
        D: common_vendor.t(selectedLocation.value.routeInfo),
        E: common_vendor.p({
          type: "forward",
          size: "16",
          color: "#fff"
        }),
        F: common_vendor.o(startNavigation)
      } : {}, {
        G: common_vendor.sr(detailPopup, "61b16127-4", {
          "k": "detailPopup"
        }),
        H: common_vendor.p({
          type: "bottom"
        }),
        I: common_vendor.s(_ctx.__cssVars())
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-61b16127"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Shelter/Shelter.js.map
