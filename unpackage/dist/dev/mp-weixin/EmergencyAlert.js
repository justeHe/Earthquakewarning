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
    epicenter: { type: String, default: "四川省都江堰" }
    // 震中
  },
  emits: ["close", "mute", "unmute", "show-guide"],
  setup(__props, { emit: __emit }) {
    const goToMain = () => {
      if (vibrationTimer) {
        clearInterval(vibrationTimer);
        vibrationTimer = null;
      }
      isVibrationEnabled.value = false;
      if (alertAudio.value) {
        alertAudio.value.stop();
      }
      common_vendor.index.navigateTo({
        url: "/pages/index/index"
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
    const isVibrationEnabled = common_vendor.ref(true);
    const alertAudio = common_vendor.ref(null);
    let timer = null;
    let vibrationTimer = null;
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
    const initAudio = () => {
      try {
        const soundEnabled = common_vendor.index.getStorageSync("soundEnabled");
        if (soundEnabled === false) {
          isMuted.value = true;
          return;
        }
        const innerAudioContext = common_vendor.index.createInnerAudioContext();
        innerAudioContext.src = "/static/music/alert.mp3";
        innerAudioContext.loop = true;
        innerAudioContext.onPlay(() => {
          common_vendor.index.__f__("log", "at pages/EmergencyAlert/EmergencyAlert.vue:172", "开始播放警报音频");
        });
        innerAudioContext.onError((res) => {
          common_vendor.index.__f__("error", "at pages/EmergencyAlert/EmergencyAlert.vue:176", "音频播放错误:", res.errMsg);
        });
        const volume = common_vendor.index.getStorageSync("soundVolume");
        if (typeof volume === "number") {
          innerAudioContext.volume = volume / 100;
        }
        alertAudio.value = innerAudioContext;
        if (!isMuted.value) {
          innerAudioContext.play();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/EmergencyAlert/EmergencyAlert.vue:192", "音频初始化失败:", error);
      }
    };
    const vibrate = () => {
      const vibrationEnabled = common_vendor.index.getStorageSync("vibrationEnabled");
      if (vibrationEnabled === false) {
        if (vibrationTimer) {
          clearInterval(vibrationTimer);
          vibrationTimer = null;
        }
        return;
      }
      try {
        if (common_vendor.index.vibrateLong) {
          common_vendor.index.vibrateLong({
            success: () => {
              common_vendor.index.__f__("log", "at pages/EmergencyAlert/EmergencyAlert.vue:213", "振动成功");
            },
            fail: () => {
              common_vendor.index.__f__("error", "at pages/EmergencyAlert/EmergencyAlert.vue:216", "振动失败");
            }
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/EmergencyAlert/EmergencyAlert.vue:221", "振动API不可用:", error);
      }
    };
    const toggleMute = () => {
      isMuted.value = !isMuted.value;
      if (alertAudio.value) {
        if (isMuted.value) {
          alertAudio.value.pause();
        } else {
          alertAudio.value.play();
        }
      }
      emit(isMuted.value ? "mute" : "unmute");
    };
    const toggleVibration = () => {
      isVibrationEnabled.value = !isVibrationEnabled.value;
      if (!isVibrationEnabled.value && vibrationTimer) {
        clearInterval(vibrationTimer);
        vibrationTimer = null;
      } else if (isVibrationEnabled.value) {
        startVibration();
      }
    };
    const startVibration = () => {
      const vibrationEnabled = common_vendor.index.getStorageSync("vibrationEnabled");
      if (vibrationEnabled === false) {
        isVibrationEnabled.value = false;
        return;
      }
      if (vibrationTimer) {
        clearInterval(vibrationTimer);
      }
      vibrate();
      vibrationTimer = setInterval(() => {
        vibrate();
      }, 3e3);
    };
    common_vendor.onMounted(() => {
      startCountdown();
      startVibration();
      initAudio();
    });
    common_vendor.onUnmounted(() => {
      if (vibrationTimer) {
        clearInterval(vibrationTimer);
        vibrationTimer = null;
      }
      if (alertAudio.value) {
        alertAudio.value.destroy();
        alertAudio.value = null;
      }
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
        j: common_vendor.n(isVibrationEnabled.value ? "icon-vibration" : "icon-vibration-off"),
        k: common_vendor.t(isVibrationEnabled.value ? "关闭振动" : "开启振动"),
        l: common_vendor.o(toggleVibration),
        m: isVibrationEnabled.value ? "关闭振动" : "开启振动",
        n: common_vendor.o(goToEemerCenter),
        o: common_vendor.o(goToMain),
        p: common_vendor.o(($event) => _ctx.$emit("close"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-838185bf"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/EmergencyAlert.js.map
