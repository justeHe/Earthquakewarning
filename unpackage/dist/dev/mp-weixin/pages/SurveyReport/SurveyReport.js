"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "SurveyReport",
  setup(__props) {
    const systemPerformanceQuestions = common_vendor.ref([
      {
        text: '预警及时性："预警提供了足够的反应时间(1=太晚,5=立即)"',
        value: null
      },
      {
        text: '预警准确性："预警的严重程度与实际风险匹配(如震级、位置)"',
        value: null
      },
      {
        text: '覆盖区域："系统准确识别了我所在位置的风险等级"',
        value: null
      },
      {
        text: '误报率："我经历了不必要的警报"(反向计分)',
        value: null
      },
      {
        text: '漏报率："关键预警被延迟或未送达"(反向计分)',
        value: null
      }
    ]);
    const userExperienceQuestions = common_vendor.ref([
      {
        text: '界面清晰度："警报屏幕的布局(颜色、按钮、文本)立即可以理解"',
        value: null
      },
      {
        text: '呈现清晰度："视觉/音频提示(如警报声、闪烁的红色横幅)有效传达了紧迫性"',
        value: null
      },
      {
        text: '指导有效性："指令可操作且清晰"',
        value: null
      },
      {
        text: '多渠道传递："我通过应用、短信和警报器(如适用)一致地收到警报"',
        value: null
      }
    ]);
    const trustFeedbackQuestions = common_vendor.ref([
      {
        text: '对系统的信任程度："我将在未来的地震中依赖此系统"',
        value: null
      },
      {
        text: '反馈机制有效性："报告误报或错误很容易"',
        value: null
      }
    ]);
    const submitSurvey = () => {
      const allAnswered = [
        ...systemPerformanceQuestions.value,
        ...userExperienceQuestions.value,
        ...trustFeedbackQuestions.value
      ].every((q) => q.value !== null);
      if (!allAnswered) {
        common_vendor.index.showToast({
          title: "请回答所有问题",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success"
      });
      systemPerformanceQuestions.value.forEach((q) => q.value = null);
      userExperienceQuestions.value.forEach((q) => q.value = null);
      trustFeedbackQuestions.value.forEach((q) => q.value = null);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(systemPerformanceQuestions.value, (q, index, i0) => {
          return {
            a: common_vendor.t(q.text),
            b: common_vendor.f(5, (i, k1, i1) => {
              return {
                a: common_vendor.t(i),
                b: i,
                c: q.value === i ? 1 : "",
                d: common_vendor.o(($event) => q.value = i, i)
              };
            }),
            c: index
          };
        }),
        b: common_vendor.f(userExperienceQuestions.value, (q, index, i0) => {
          return {
            a: common_vendor.t(q.text),
            b: common_vendor.f(5, (i, k1, i1) => {
              return {
                a: common_vendor.t(i),
                b: i,
                c: q.value === i ? 1 : "",
                d: common_vendor.o(($event) => q.value = i, i)
              };
            }),
            c: index
          };
        }),
        c: common_vendor.f(trustFeedbackQuestions.value, (q, index, i0) => {
          return {
            a: common_vendor.t(q.text),
            b: common_vendor.f(5, (i, k1, i1) => {
              return {
                a: common_vendor.t(i),
                b: i,
                c: q.value === i ? 1 : "",
                d: common_vendor.o(($event) => q.value = i, i)
              };
            }),
            c: index
          };
        }),
        d: common_vendor.o(submitSurvey)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7a6357b4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/SurveyReport/SurveyReport.js.map
