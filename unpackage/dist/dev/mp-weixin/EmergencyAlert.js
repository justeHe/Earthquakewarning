"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "EmergencyAlert",
  props: {
    duration: { type: Number, default: 20 },
    // 倒计时总时长
    magnitude: { type: Number, default: 4 },
    // 震级
    depth: { type: Number, default: 10 },
    // 深度
    epicenter: { type: String, default: "四川省成都市" }
    // 震中
  },
  emits: ["close", "mute", "unmute", "show-guide"],
  setup(__props, { emit: __emit }) {
    const goToMain = () => {
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
        // 替换为你的测试页面路径
      });
    };
    const goToEemerCenter = () => {
      common_vendor.index.navigateTo({
        url: "/pages/Emergenciecenter/Emergenciecenter"
        // 替换为你的测试页面路径
      });
    };
    const props = __props;
    const emit = __emit;
    const remainingTime = common_vendor.ref(props.duration);
    const isMuted = common_vendor.ref(false);
    let timer = null;
    const formattedTime = common_vendor.computed(() => {
      return remainingTime.value.toString().padStart(2, "0");
    });
    const progress = common_vendor.computed(() => {
      return (props.duration - remainingTime.value) / props.duration * 100;
    });
    const startCountdown = () => {
      timer = setInterval(() => {
        if (remainingTime.value > 0) {
          remainingTime.value--;
        } else {
          clearInterval(timer);
        }
      }, 1e3);
    };
    const toggleMute = () => {
      isMuted.value = !isMuted.value;
      emit(isMuted.value ? "mute" : "unmute");
    };
    common_vendor.onMounted(() => {
      startCountdown();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formattedTime.value),
        b: progress.value + "%",
        c: common_vendor.t(__props.magnitude),
        d: common_vendor.t(__props.depth),
        e: common_vendor.t(__props.epicenter),
        f: common_vendor.n(isMuted.value ? "icon-volume-off" : "icon-volume-up"),
        g: common_vendor.t(isMuted.value ? "取消静音" : "静音"),
        h: common_vendor.o(toggleMute),
        i: isMuted.value ? "取消静音" : "静音警报",
        j: common_vendor.o(goToEemerCenter),
        k: common_vendor.o(goToMain),
        l: common_vendor.o(($event) => _ctx.$emit("close"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-838185bf"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/EmergencyAlert.js.map
