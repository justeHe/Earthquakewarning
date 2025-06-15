<template>
  <view class="survey-page">
    <!-- 问卷标题 -->
    <view class="header">
      <text class="title">地震预警系统问卷</text>
      <text class="subtitle">请根据您的体验进行评分 (1=非常不满意, 5=非常满意)</text>
    </view>

    <!-- 系统性能部分 -->
    <view class="section">
      <text class="section-title">系统性能</text>
      
      <view class="question-item" v-for="(q, index) in systemPerformanceQuestions" :key="index">
        <text class="question-text">{{ q.text }}</text>
        <view class="rating-container">
          <view 
            v-for="i in 5" 
            :key="i" 
            class="rating-option" 
            :class="{ active: q.value === i }"
            @click="q.value = i"
          >
            {{ i }}
          </view>
        </view>
      </view>
    </view>

    <!-- 用户体验部分 -->
    <view class="section">
      <text class="section-title">用户体验</text>
      
      <view class="question-item" v-for="(q, index) in userExperienceQuestions" :key="index">
        <text class="question-text">{{ q.text }}</text>
        <view class="rating-container">
          <view 
            v-for="i in 5" 
            :key="i" 
            class="rating-option" 
            :class="{ active: q.value === i }"
            @click="q.value = i"
          >
            {{ i }}
          </view>
        </view>
      </view>
    </view>

    <!-- 信任与反馈部分 -->
    <view class="section">
      <text class="section-title">信任与反馈</text>
      
      <view class="question-item" v-for="(q, index) in trustFeedbackQuestions" :key="index">
        <text class="question-text">{{ q.text }}</text>
        <view class="rating-container">
          <view 
            v-for="i in 5" 
            :key="i" 
            class="rating-option" 
            :class="{ active: q.value === i }"
            @click="q.value = i"
          >
            {{ i }}
          </view>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-button" @click="submitSurvey">提交问卷</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'

// 系统性能问题
const systemPerformanceQuestions = ref([
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
])

// 用户体验问题
const userExperienceQuestions = ref([
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
])

// 信任与反馈问题
const trustFeedbackQuestions = ref([
  { 
    text: '对系统的信任程度："我将在未来的地震中依赖此系统"', 
    value: null 
  },
  { 
    text: '反馈机制有效性："报告误报或错误很容易"', 
    value: null 
  }
])

const submitSurvey = () => {
  // 检查是否所有问题都已回答
  const allAnswered = [
    ...systemPerformanceQuestions.value,
    ...userExperienceQuestions.value,
    ...trustFeedbackQuestions.value
  ].every(q => q.value !== null)
  
  if (!allAnswered) {
    uni.showToast({
      title: '请回答所有问题',
      icon: 'none'
    })
    return
  }
  
  // 这里可以添加提交逻辑，如API调用
  uni.showToast({
    title: '提交成功',
    icon: 'success'
  })
  
  // 重置表单
  systemPerformanceQuestions.value.forEach(q => q.value = null)
  userExperienceQuestions.value.forEach(q => q.value = null)
  trustFeedbackQuestions.value.forEach(q => q.value = null)
}
</script>

<style lang="scss" scoped>
.survey-page {
  padding: 32rpx;
  background: #f5f7fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 48rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8rpx;
  }
  
  .subtitle {
    font-size: 28rpx;
    color: #7f8c8d;
  }
}

.section {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #e74c3c;
    margin-bottom: 24rpx;
  }
}

.question-item {
  margin-bottom: 32rpx;
  
  .question-text {
    font-size: 28rpx;
    color: #2c3e50;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .rating-container {
    display: flex;
    justify-content: space-between;
    
    .rating-option {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #7f8c8d;
      transition: all 0.2s ease;
      
      &.active {
        background: #e74c3c;
        color: #fff;
        transform: scale(1.1);
      }
    }
  }
}

.submit-button {
  margin-top: 48rpx;
  background: #e74c3c;
  color: #fff;
  height: 96rpx;
  line-height: 96rpx;
  font-size: 32rpx;
  border-radius: 48rpx;
  
  &:active {
    opacity: 0.9;
  }
}
</style>