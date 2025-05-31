"use strict";
const common_vendor = require("./common/vendor.js");
const common_assets = require("./common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "./uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "SettingsTab",
  setup(__props) {
    const settingsGroups = common_vendor.reactive([
      {
        title: "预警设置",
        items: [
          {
            name: "预警通知",
            icon: "notification",
            type: "toggle",
            value: true,
            iconBg: "#EBF5FF",
            iconColor: "#3B82F6"
          },
          {
            name: "震动提醒",
            customIcon: "shake.svg",
            type: "toggle",
            value: false,
            iconBg: "#F0FDF4",
            iconColor: "#22C55E"
          },
          {
            name: "震动强度",
            icon: "settings",
            type: "slider",
            value: 60,
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
            iconBg: "#FEF3C7",
            iconColor: "#F59E0B"
          }
        ]
      },
      {
        title: "应用设置",
        items: [
          {
            name: "警报等级",
            icon: "info",
            type: "text",
            value: "5.0级及以上",
            options: ["4.0级", "5.0级及以上", "6.0级及以上", "所有预警"],
            iconBg: "#EBF5FF",
            iconColor: "#3B82F6"
          },
          {
            name: "刷新频率",
            icon: "reload",
            type: "text",
            value: "每10分钟",
            options: ["每5分钟", "每10分钟", "每30分钟", "每小时"],
            iconBg: "#F0FDF4",
            iconColor: "#22C55E"
          },
          {
            name: "深色模式",
            icon: "eye",
            type: "toggle",
            value: false,
            iconBg: "#FEF3C7",
            iconColor: "#F59E0B"
          },
          {
            name: "位置信息",
            icon: "location",
            type: "toggle",
            value: true,
            iconBg: "#EBF5FF",
            iconColor: "#3B82F6"
          }
        ]
      },
      {
        title: "其他",
        items: [
          {
            name: "清除缓存",
            icon: "trash",
            type: "text",
            value: "12.5MB",
            iconBg: "#FEE2E2",
            iconColor: "#EF4444"
          },
          {
            name: "检查更新",
            icon: "download",
            type: "text",
            value: "v1.0.0",
            iconBg: "#EBF5FF",
            iconColor: "#3B82F6"
          },
          {
            name: "隐私政策",
            customIcon: "privacy.svg",
            type: "text",
            value: "",
            iconBg: "#F3E8FF",
            iconColor: "#9333EA"
          },
          {
            name: "关于我们",
            icon: "info",
            type: "text",
            value: "",
            iconBg: "#F3E8FF",
            iconColor: "#9333EA"
          }
        ]
      }
    ]);
    const handleSettingClick = (setting) => {
      if (setting.type === "text") {
        if (setting.options) {
          common_vendor.index.showActionSheet({
            itemList: setting.options,
            success: (res) => {
              setting.value = setting.options[res.tapIndex];
            }
          });
        } else {
          switch (setting.name) {
            case "清除缓存":
              handleClearCache();
              break;
            case "检查更新":
              handleCheckUpdate();
              break;
            case "隐私政策":
              common_vendor.index.navigateTo({ url: "/pages/Settings/Privacy" });
              break;
            case "关于我们":
              common_vendor.index.navigateTo({ url: "/pages/Settings/About" });
              break;
          }
        }
      }
    };
    const handleToggle = (setting, event) => {
      setting.value = event.detail.value;
      if (setting.name === "深色模式") {
        common_vendor.index.showToast({
          title: event.detail.value ? "已开启深色模式" : "已关闭深色模式",
          icon: "none"
        });
      } else if (setting.name === "位置信息") {
        if (event.detail.value) {
          common_vendor.index.getLocation({
            type: "gcj02",
            success: () => {
              common_vendor.index.showToast({
                title: "已开启位置权限",
                icon: "success"
              });
            },
            fail: () => {
              setting.value = false;
              common_vendor.index.showToast({
                title: "请在系统设置中开启位置权限",
                icon: "none"
              });
            }
          });
        }
      }
    };
    const handleSliderChange = (setting, event) => {
      setting.value = event.detail.value;
    };
    const handleClearCache = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除缓存吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "清除成功",
              icon: "success"
            });
            const cacheItem = settingsGroups[2].items.find((item) => item.name === "清除缓存");
            if (cacheItem) {
              cacheItem.value = "0MB";
            }
          }
        }
      });
    };
    const handleCheckUpdate = () => {
      common_vendor.index.showLoading({
        title: "检查更新中"
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "已是最新版本",
          icon: "success"
        });
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$3,
        b: common_vendor.f(settingsGroups, (group, groupIndex, i0) => {
          return {
            a: common_vendor.t(group.title),
            b: common_vendor.f(group.items, (setting, index, i1) => {
              return common_vendor.e({
                a: setting.customIcon
              }, setting.customIcon ? {
                b: "/static/icons/" + setting.customIcon,
                c: setting.iconColor || "#3B82F6"
              } : {
                d: "9bc93f33-0-" + i0 + "-" + i1,
                e: common_vendor.p({
                  type: setting.icon,
                  size: "20",
                  color: setting.iconColor || "#3B82F6"
                })
              }, {
                f: setting.iconBg || "#EBF5FF",
                g: common_vendor.t(setting.name),
                h: setting.type === "toggle"
              }, setting.type === "toggle" ? {
                i: setting.value,
                j: common_vendor.o((e) => handleToggle(setting, e), index)
              } : setting.type === "text" ? {
                l: common_vendor.t(setting.value),
                m: "9bc93f33-1-" + i0 + "-" + i1,
                n: common_vendor.p({
                  type: "right",
                  size: "14",
                  color: "#999"
                })
              } : setting.type === "slider" ? {
                p: setting.value,
                q: setting.min,
                r: setting.max,
                s: setting.step || 1,
                t: common_vendor.o((e) => handleSliderChange(setting, e), index),
                v: common_vendor.t(setting.value),
                w: common_vendor.t(setting.unit || "%")
              } : {}, {
                k: setting.type === "text",
                o: setting.type === "slider",
                x: index,
                y: index === group.items.length - 1 ? 1 : "",
                z: common_vendor.o(($event) => handleSettingClick(setting), index)
              });
            }),
            c: groupIndex
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9bc93f33"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/SettingsTab.js.map
