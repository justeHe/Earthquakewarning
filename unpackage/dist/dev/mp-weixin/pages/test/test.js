"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "test",
  setup(__props) {
    const amapFile = require("../../lib/amap-wx.130.js");
    common_vendor.ref("hello world");
    const getAddress = () => {
      const myAmapFun = new amapFile.AMapWX({ key: "3ceccd136aabe918552f561c13f20691" });
      myAmapFun.getRegeo({
        success: (data) => common_vendor.index.__f__("log", "at pages/test/test.vue:10", data),
        fail: (info) => common_vendor.index.__f__("log", "at pages/test/test.vue:11", info)
      });
    };
    common_vendor.onMounted(getAddress);
    return () => {
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/test/test.js.map
