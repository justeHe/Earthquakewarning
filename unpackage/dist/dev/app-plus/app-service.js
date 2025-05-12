if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _imports_0 = "/static/location-icon.png";
  const _imports_1 = "/static/address-icon.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$a = {
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
          await this.initNativeMap();
          this.locateMe();
        } catch (e) {
          formatAppLog("error", "at pages/Header/Header.vue:64", "地图初始化失败:", e);
          uni.showToast({
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
        this.map = uni.createMapContext("mapContainer", this);
      },
      // 定位核心方法
      async locateMe() {
        if (this.locating)
          return;
        this.locating = true;
        try {
          await this.nativeLocation();
        } catch (e) {
          formatAppLog("error", "at pages/Header/Header.vue:113", "定位失败:", e);
          uni.showToast({
            title: "定位失败: " + (e.message || "未知错误"),
            icon: "none"
          });
        } finally {
          this.locating = false;
        }
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
        const [err, res] = await uni.getLocation({
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
        this.map.translateMarker({
          markerId: 1,
          destination: {
            latitude: position[1],
            longitude: position[0]
          },
          autoRotate: false
        });
      },
      // 逆地理编码获取地址
      async reverseGeocode() {
        try {
          const [err, res] = await uni.request({
            url: "https://restapi.amap.com/v3/geocode/regeo",
            data: {
              key: "eb59d743db0924ca2ed1310a303eba45",
              location: `${this.longitude},${this.latitude}`
            }
          });
          if (res.data.status === "1") {
            this.address = res.data.regeocode.formatted_address;
          }
        } catch (e) {
          formatAppLog("error", "at pages/Header/Header.vue:236", "逆地理编码失败:", e);
          this.address = "地址解析失败";
        }
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 地图容器 "),
      vue.createElementVNode("view", {
        id: "mapContainer",
        style: { "width": "100%", "height": "calc(100vh - 88rpx)" }
      }),
      vue.createCommentVNode(" 位置信息展示 "),
      vue.createElementVNode("view", { class: "info-card" }, [
        vue.createElementVNode("view", { class: "info-row" }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            class: "info-icon"
          }),
          vue.createElementVNode(
            "text",
            { class: "info-text" },
            "经度: " + vue.toDisplayString($data.longitude.toFixed(6)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-row" }, [
          vue.createElementVNode("image", {
            src: _imports_0,
            class: "info-icon"
          }),
          vue.createElementVNode(
            "text",
            { class: "info-text" },
            "纬度: " + vue.toDisplayString($data.latitude.toFixed(6)),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-row" }, [
          vue.createElementVNode("image", {
            src: _imports_1,
            class: "info-icon"
          }),
          vue.createElementVNode(
            "text",
            { class: "info-text" },
            vue.toDisplayString($data.address || "正在获取地址..."),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createCommentVNode(" 定位按钮 "),
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.locateMe && $options.locateMe(...args)),
        class: "locate-btn"
      }, [
        vue.createElementVNode("image", {
          src: $data.locating ? "/static/locating.gif" : "/static/location-btn.png"
        }, null, 8, ["src"])
      ])
    ]);
  }
  const PagesHeaderHeader = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/Header/Header.vue"]]);
  const _sfc_main$9 = {};
  function _sfc_render$8(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "emergency-alert" }, [
      vue.createElementVNode("i", { class: "fas fa-exclamation-triangle alert-icon" }),
      vue.createElementVNode("div", { class: "emergency-text" }, [
        vue.createElementVNode("div", { class: "emergency-title" }, "紧急地震预警"),
        vue.createElementVNode("div", { class: "emergency-time" }, "预计20秒后到达")
      ]),
      vue.createElementVNode("button", {
        class: "close-alert",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
      }, [
        vue.createElementVNode("i", { class: "fas fa-times" })
      ])
    ]);
  }
  const PagesEmergencyAlertEmergencyAlert = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-838185bf"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/EmergencyAlert/EmergencyAlert.vue"]]);
  const _sfc_main$8 = {
    __name: "TabBar",
    props: {
      activeTab: { type: String, required: true }
    },
    emits: ["changeTab"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const tabs = [
        { name: "alert", label: "预警", icon: "fas fa-bell" },
        { name: "history", label: "历史", icon: "fas fa-clock-rotate-left" },
        { name: "guide", label: "指南", icon: "fas fa-book-open" },
        { name: "settings", label: "设置", icon: "fas fa-sliders" }
      ];
      function selectTab(tabName) {
        emit("changeTab", tabName);
      }
      const __returned__ = { props, emit, tabs, selectTab };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "tab-bar" }, [
      (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.tabs, (tab) => {
          return vue.createElementVNode("div", {
            key: tab.name,
            class: vue.normalizeClass(["tab", { active: $props.activeTab === tab.name }]),
            onClick: ($event) => $setup.selectTab(tab.name)
          }, [
            vue.createElementVNode(
              "i",
              {
                class: vue.normalizeClass(["tab-icon", tab.icon])
              },
              null,
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "span",
              { class: "tab-label" },
              vue.toDisplayString(tab.label),
              1
              /* TEXT */
            )
          ], 10, ["onClick"]);
        }),
        64
        /* STABLE_FRAGMENT */
      ))
    ]);
  }
  const PagesTabBarTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-744d263b"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/TabBar/TabBar.vue"]]);
  const _sfc_main$7 = {
    __name: "AlertTab",
    setup(__props, { expose: __expose }) {
      __expose();
      const alertStatus = vue.ref("safe");
      const alertIcon = vue.ref("fas fa-check-circle");
      const alertTitle = vue.ref("当前安全");
      const alertMessage = vue.ref("您所在区域当前无地震威胁");
      const location = vue.ref("正在获取位置...");
      const isRefreshing = vue.ref(false);
      const quakes = vue.ref([
        { id: 1, magnitude: "M4.2", time: "2023-05-15 08:23", distance: "85km", depth: "10km", warning: "不会对您所在区域造成明显影响" },
        { id: 2, magnitude: "M5.8", time: "2023-05-12 14:37", distance: "120km", depth: "15km", warning: "部分地区有震感" }
      ]);
      async function refreshLocation() {
        if (isRefreshing.value)
          return;
        isRefreshing.value = true;
        location.value = "正在获取位置...";
        try {
        } catch (err) {
          formatAppLog("error", "at pages/AlertTab/AlertTab.vue:308", "刷新位置失败:", err);
          location.value = "刷新位置失败";
        } finally {
          isRefreshing.value = false;
        }
      }
      vue.onMounted(() => {
      });
      const __returned__ = { alertStatus, alertIcon, alertTitle, alertMessage, location, isRefreshing, quakes, refreshLocation, ref: vue.ref, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "alert-tab" }, [
      vue.createCommentVNode(" 安全状态提示 "),
      vue.createElementVNode(
        "div",
        {
          class: vue.normalizeClass(["alert-status", $setup.alertStatus])
        },
        [
          vue.createElementVNode(
            "i",
            {
              class: vue.normalizeClass([$setup.alertIcon, "alert-icon"])
            },
            null,
            2
            /* CLASS */
          ),
          vue.createElementVNode(
            "h3",
            { class: "alert-title" },
            vue.toDisplayString($setup.alertTitle),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "p",
            { class: "alert-message" },
            vue.toDisplayString($setup.alertMessage),
            1
            /* TEXT */
          )
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" 位置信息 "),
      vue.createElementVNode("div", { class: "location-info" }, [
        vue.createElementVNode("i", { class: "fas fa-map-marker-alt location-icon" }),
        vue.createElementVNode("div", { class: "location-text" }, [
          vue.createElementVNode("div", { class: "location-name" }, "当前位置"),
          vue.createElementVNode(
            "div",
            { class: "location-address" },
            vue.toDisplayString($setup.location),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("button", {
          class: "refresh-btn",
          onClick: $setup.refreshLocation,
          disabled: $setup.isRefreshing
        }, [
          vue.createElementVNode(
            "i",
            {
              class: vue.normalizeClass(["fas", $setup.isRefreshing ? "fa-spinner fa-pulse" : "fa-sync-alt"])
            },
            null,
            2
            /* CLASS */
          )
        ], 8, ["disabled"])
      ]),
      vue.createCommentVNode(" H5地图容器 "),
      vue.createCommentVNode(" 小程序地图容器 "),
      vue.createCommentVNode(" 地震信息 "),
      vue.createElementVNode("h3", { class: "quake-title" }, "周边地震"),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.quakes, (quake) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            class: "quake-card",
            key: quake.id
          }, [
            vue.createElementVNode("div", { class: "quake-header" }, [
              vue.createElementVNode(
                "div",
                { class: "quake-magnitude" },
                vue.toDisplayString(quake.magnitude),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "div",
                { class: "quake-time" },
                vue.toDisplayString(quake.time),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("div", { class: "quake-details" }, [
              vue.createElementVNode(
                "div",
                { class: "quake-distance" },
                "距离: " + vue.toDisplayString(quake.distance),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "div",
                { class: "quake-depth" },
                "深度: " + vue.toDisplayString(quake.depth),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("div", { class: "quake-warning" }, [
              vue.createElementVNode("i", { class: "fas fa-exclamation-triangle warning-icon" }),
              vue.createElementVNode(
                "div",
                null,
                vue.toDisplayString(quake.warning),
                1
                /* TEXT */
              )
            ])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesAlertTabAlertTab = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-f652d009"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/AlertTab/AlertTab.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform;
  setTimeout(() => {
    platform = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t
  } = initVueI18n(messages);
  const _sfc_main$6 = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZV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"
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages = getCurrentPages();
      var page = pages[pages.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-9245e42c"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$5 = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v) => v.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-d31e1c47"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const API_URL = "https://api.wolfx.jp/cenc_eqlist.json";
  const CACHE_TIME = 5 * 60 * 1e3;
  const _sfc_main$4 = {
    __name: "HistoryTab",
    setup(__props, { expose: __expose }) {
      __expose();
      const filters = [
        { value: "all", label: "全部" },
        { value: "warning", label: "预警" },
        { value: "earthquake", label: "地震" }
      ];
      const activeFilter = vue.ref("all");
      const historyItems = vue.ref([]);
      const loading = vue.ref(false);
      const error = vue.ref(null);
      const lastFetchTime = vue.ref(0);
      const loadData = async () => {
        const now = Date.now();
        if (now - lastFetchTime.value < CACHE_TIME && historyItems.value.length > 0) {
          return;
        }
        loading.value = true;
        error.value = null;
        try {
          const [err, res] = await new Promise((resolve) => {
            uni.request({
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
          if (res.data && typeof res.data === "object") {
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
          formatAppLog("error", "at pages/HistoryTab/HistoryTab.vue:136", "地震数据加载错误:", err);
          if (historyItems.value.length > 0) {
            error.value += " (显示缓存数据)";
          }
        } finally {
          loading.value = false;
        }
      };
      const processData = (data) => {
        return data.filter((item) => item && item.time && item.magnitude).sort((a, b) => new Date(b.time) - new Date(a.time)).map((item) => ({
          id: item.EventID || `eq-${item.time}-${item.magnitude}-${Math.random().toString(36).substr(2, 6)}`,
          type: item.type || "reviewed",
          magnitude: parseFloat(item.magnitude).toFixed(1),
          title: formatLocation(item.location),
          status: item.type === "automatic" ? "自动预警" : "正式测定",
          time: formatTime(item.time),
          depth: item.depth ? `${parseFloat(item.depth).toFixed(1)}` : "未知",
          intensity: item.intensity || "未知",
          epicenter: item.location,
          description: `震源深度${item.depth || "未知"}千米，坐标: ${item.latitude || "未知"}, ${item.longitude || "未知"}`,
          severityClass: getSeverityClass(item.magnitude),
          reportTime: item.ReportTime ? formatTime(item.ReportTime) : null
        }));
      };
      const formatLocation = (location) => {
        if (!location)
          return "未知地点";
        return location.replace(/^中国(省|自治区|)/, "").trim() || location;
      };
      const formatTime = (timeString) => {
        try {
          const date = new Date(timeString);
          return isNaN(date.getTime()) ? timeString : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
        } catch {
          return timeString;
        }
      };
      const pad = (n) => n.toString().padStart(2, "0");
      const getSeverityClass = (magnitude) => {
        const value = parseFloat(magnitude) || 0;
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
      const filteredItems = vue.computed(() => {
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
      vue.onMounted(() => {
        loadData();
        setInterval(() => {
          if (!loading.value) {
            loadData();
          }
        }, 5 * 60 * 1e3);
      });
      const __returned__ = { API_URL, CACHE_TIME, filters, activeFilter, historyItems, loading, error, lastFetchTime, loadData, processData, formatLocation, formatTime, pad, getSeverityClass, filteredItems, setFilter, retryLoading, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0);
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "history-tab" }, [
      vue.createCommentVNode(" 过滤按钮 "),
      vue.createElementVNode("view", { class: "history-filter" }, [
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.filters, (filter) => {
            return vue.createElementVNode("button", {
              key: filter.value,
              class: vue.normalizeClass(["filter-btn", { active: $setup.activeFilter === filter.value }]),
              onClick: ($event) => $setup.setFilter(filter.value)
            }, vue.toDisplayString(filter.label), 11, ["onClick"]);
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 加载状态 "),
      $setup.loading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-state"
      }, [
        vue.createVNode(_component_uni_load_more, { status: "loading" })
      ])) : $setup.error ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "error-state"
      }, [
        vue.createVNode(_component_uni_icons, {
          type: "info",
          size: "24",
          color: "#e74c3c"
        }),
        vue.createElementVNode(
          "text",
          null,
          "数据加载失败: " + vue.toDisplayString($setup.error),
          1
          /* TEXT */
        ),
        vue.createElementVNode("button", {
          onClick: $setup.retryLoading,
          class: "retry-btn"
        }, "重试")
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        [
          vue.createCommentVNode(" 历史记录列表 "),
          $setup.filteredItems.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "empty-state"
          }, [
            vue.createVNode(_component_uni_icons, {
              type: "folder",
              size: "24",
              color: "#95a5a6"
            }),
            vue.createElementVNode("text", null, "暂无地震数据")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.filteredItems, (item) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "history-item",
                key: item.id
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["history-severity", item.severityClass])
                  },
                  [
                    vue.createElementVNode(
                      "text",
                      { class: "magnitude" },
                      vue.toDisplayString(item.magnitude),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", { class: "magnitude-label" }, "级")
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("view", { class: "history-content" }, [
                  vue.createElementVNode("view", { class: "history-title" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "location" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["status-badge", item.type])
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString(item.status),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "history-meta" }, [
                    vue.createElementVNode("text", { class: "history-time" }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "calendar",
                        size: "14",
                        color: "#666"
                      }),
                      vue.createTextVNode(
                        " " + vue.toDisplayString(item.time),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("text", { class: "history-depth" }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "location",
                        size: "14",
                        color: "#666"
                      }),
                      vue.createTextVNode(
                        " 深度: " + vue.toDisplayString(item.depth) + "km ",
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "history-desc" }, [
                    item.intensity ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "notification",
                        size: "14",
                        color: "#888"
                      }),
                      vue.createTextVNode(
                        " 最大烈度: " + vue.toDisplayString(item.intensity),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true),
                    item.epicenter ? (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, [
                      vue.createVNode(_component_uni_icons, {
                        type: "map",
                        size: "14",
                        color: "#888"
                      }),
                      vue.createTextVNode(
                        " 震中: " + vue.toDisplayString(item.epicenter),
                        1
                        /* TEXT */
                      )
                    ])) : vue.createCommentVNode("v-if", true)
                  ])
                ])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        64
        /* STABLE_FRAGMENT */
      ))
    ]);
  }
  const PagesHistoryTabHistoryTab = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-ed885364"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/HistoryTab/HistoryTab.vue"]]);
  const _sfc_main$3 = {
    __name: "GuideTab",
    setup(__props, { expose: __expose }) {
      __expose();
      const guideCategories = vue.ref([
        {
          id: 1,
          title: "居家避险",
          icon: "fas fa-house-damage",
          items: [
            { id: 1, title: "室内安全", icon: "fas fa-couch", desc: "迅速躲在结实的桌子、床下或内墙角落；远离窗户、玻璃及悬挂物；不要跳楼或使用电梯。" },
            { id: 2, title: "厨房避险", icon: "fas fa-utensils", desc: "立即关闭燃气阀门和电源；躲避时远离炉灶、冰箱等可能倾倒的重物。" }
          ]
        },
        {
          id: 2,
          title: "公共场所避险",
          icon: "fas fa-building",
          items: [
            { id: 1, title: "商场/超市", icon: "fas fa-store", desc: "就近躲在大柱子或坚固柜台旁；不要拥挤冲向出口，防止踩踏；避开货架及玻璃橱窗。" },
            { id: 2, title: "学校/办公室", icon: "fas fa-school", desc: "迅速躲在课桌或办公桌下；保护好头部；震动停止后有序疏散到空旷地带。" }
          ]
        },
        {
          id: 3,
          title: "户外避险",
          icon: "fas fa-car-crash",
          items: [
            { id: 1, title: "街道/开阔地", icon: "fas fa-road", desc: "远离建筑物、电线杆、广告牌；蹲下保护头部；不要返回室内取物。" },
            { id: 2, title: "行驶车辆", icon: "fas fa-car", desc: "尽快在安全地带停车；不要停在桥梁、隧道或高大建筑物旁；留在车内通常比跑出去更安全。" }
          ]
        }
      ]);
      const __returned__ = { guideCategories, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "guide-tab" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.guideCategories, (category) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            class: "guide-category",
            key: category.id
          }, [
            vue.createElementVNode("h3", { class: "guide-title" }, [
              vue.createElementVNode(
                "i",
                {
                  class: vue.normalizeClass(category.icon)
                },
                null,
                2
                /* CLASS */
              ),
              vue.createTextVNode(
                vue.toDisplayString(category.title),
                1
                /* TEXT */
              )
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList(category.items, (item) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  class: "guide-item",
                  key: item.id
                }, [
                  vue.createElementVNode("h4", { class: "guide-item-title" }, [
                    vue.createElementVNode(
                      "i",
                      {
                        class: vue.normalizeClass(item.icon)
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    vue.createTextVNode(
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "p",
                    { class: "guide-item-desc" },
                    vue.toDisplayString(item.desc),
                    1
                    /* TEXT */
                  )
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesGuideTabGuideTab = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-2fd15fc7"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/GuideTab/GuideTab.vue"]]);
  const _sfc_main$2 = {
    __name: "SettingsTab",
    setup(__props, { expose: __expose }) {
      __expose();
      const settings = vue.reactive([
        { id: 1, name: "预警通知", icon: "fas fa-bell", type: "toggle", value: true },
        { id: 2, name: "警报声音", icon: "fas fa-volume-up", type: "toggle", value: true },
        { id: 3, name: "振动提醒", icon: "fas fa-vibrate", type: "toggle", value: true },
        { id: 4, name: "预警阈值", icon: "fas fa-broadcast-tower", type: "text", value: "4.0级及以上" },
        { id: 5, name: "定位精度", icon: "fas fa-map-marked-alt", type: "text", value: "高精度" },
        { id: 6, name: "夜间模式", icon: "fas fa-moon", type: "toggle", value: false },
        { id: 7, name: "数据刷新频率", icon: "fas fa-history", type: "text", value: "自动" }
      ]);
      function onToggle(setting) {
        formatAppLog("log", "at pages/SettingsTab/SettingsTab.vue:37", `${setting.name} ${setting.value ? "开启" : "关闭"}`);
      }
      const __returned__ = { settings, onToggle, reactive: vue.reactive };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "settings-tab" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($setup.settings, (setting) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            class: "setting-item",
            key: setting.id
          }, [
            vue.createElementVNode("div", { class: "setting-left" }, [
              vue.createElementVNode("div", { class: "setting-icon" }, [
                vue.createElementVNode(
                  "i",
                  {
                    class: vue.normalizeClass(setting.icon)
                  },
                  null,
                  2
                  /* CLASS */
                )
              ]),
              vue.createElementVNode(
                "div",
                { class: "setting-name" },
                vue.toDisplayString(setting.name),
                1
                /* TEXT */
              )
            ]),
            setting.type === "toggle" ? (vue.openBlock(), vue.createElementBlock("label", {
              key: 0,
              class: "switch"
            }, [
              vue.withDirectives(vue.createElementVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": ($event) => setting.value = $event,
                onChange: ($event) => $setup.onToggle(setting)
              }, null, 40, ["onUpdate:modelValue", "onChange"]), [
                [vue.vModelCheckbox, setting.value]
              ]),
              vue.createElementVNode("span", { class: "slider" })
            ])) : (vue.openBlock(), vue.createElementBlock(
              "div",
              {
                key: 1,
                class: "setting-value"
              },
              vue.toDisplayString(setting.value),
              1
              /* TEXT */
            ))
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesSettingsTabSettingsTab = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-9bc93f33"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/SettingsTab/SettingsTab.vue"]]);
  const _sfc_main$1 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const currentTab = vue.ref("alert");
      const showEmergencyAlert = vue.ref(false);
      function changeTab(tab) {
        currentTab.value = tab;
      }
      function closeEmergencyAlert() {
        showEmergencyAlert.value = false;
      }
      vue.onMounted(() => {
        setTimeout(() => {
          if (Math.random() < 0.05) {
            showEmergencyAlert.value = true;
            setTimeout(() => {
              showEmergencyAlert.value = false;
            }, 1e4);
          }
        }, 3e3);
      });
      const __returned__ = { currentTab, showEmergencyAlert, changeTab, closeEmergencyAlert, ref: vue.ref, onMounted: vue.onMounted, Header: PagesHeaderHeader, EmergencyAlert: PagesEmergencyAlertEmergencyAlert, TabBar: PagesTabBarTabBar, AlertTab: PagesAlertTabAlertTab, HistoryTab: PagesHistoryTabHistoryTab, GuideTab: PagesGuideTabGuideTab, SettingsTab: PagesSettingsTabSettingsTab };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "container" }, [
      vue.createCommentVNode(" 紧急警报 "),
      $setup.showEmergencyAlert ? (vue.openBlock(), vue.createBlock($setup["EmergencyAlert"], {
        key: 0,
        onClose: $setup.closeEmergencyAlert
      })) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 头部 "),
      vue.createVNode($setup["Header"]),
      vue.createCommentVNode(" 主内容区，根据 currentTab 动态切换 "),
      vue.createElementVNode("div", { class: "content" }, [
        $setup.currentTab === "alert" ? (vue.openBlock(), vue.createBlock($setup["AlertTab"], { key: 0 })) : $setup.currentTab === "history" ? (vue.openBlock(), vue.createBlock($setup["HistoryTab"], { key: 1 })) : $setup.currentTab === "guide" ? (vue.openBlock(), vue.createBlock($setup["GuideTab"], { key: 2 })) : $setup.currentTab === "settings" ? (vue.openBlock(), vue.createBlock($setup["SettingsTab"], { key: 3 })) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 底部标签栏 "),
      vue.createVNode($setup["TabBar"], {
        activeTab: $setup.currentTab,
        onChangeTab: $setup.changeTab
      }, null, 8, ["activeTab"])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/Header/Header", PagesHeaderHeader);
  __definePage("pages/EmergencyAlert/EmergencyAlert", PagesEmergencyAlertEmergencyAlert);
  __definePage("pages/TabBar/TabBar", PagesTabBarTabBar);
  __definePage("pages/AlertTab/AlertTab", PagesAlertTabAlertTab);
  __definePage("pages/HistoryTab/HistoryTab", PagesHistoryTabHistoryTab);
  __definePage("pages/GuideTab/GuideTab", PagesGuideTabGuideTab);
  __definePage("pages/SettingsTab/SettingsTab", PagesSettingsTabSettingsTab);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/hedong/Documents/HBuilderProjects/地震预警/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
