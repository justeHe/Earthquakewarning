<template>
  <view class="guide-container">
    <!-- 应急中心快速入口 -->
    <view class="emergency-button" @click="navigateToEmergency">
      <uni-icons type="warn" size="24" color="#FFFFFF"></uni-icons>
      <text class="button-text">紧急求助</text>
    </view>

    <!-- 顶部动画区域 -->
    <view class="animation-section">
      <image class="guide-gif" src="/static/images/guide.gif" mode="aspectFit" />
      <text class="animation-tip">地震来临时保持冷静，遵循以下指南</text>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="guide-content" scroll-y>
      <!-- 室内避险指南 -->
      <view class="guide-section">
        <view class="section-header">
          <uni-icons type="home" size="24" color="#3B82F6"></uni-icons>
          <text class="section-title">室内避险指南</text>
        </view>
        <view class="steps-list">
          <view class="step-item">
            <text class="step-number">1</text>
            <text class="step-text">立即躲在结实的桌子下方或承重墙角落</text>
          </view>
          <view class="step-item">
            <text class="step-number">2</text>
            <text class="step-text">远离窗户、玻璃和悬挂物</text>
          </view>
          <view class="step-item">
            <text class="step-number">3</text>
            <text class="step-text">关闭煤气和电源</text>
          </view>
          <view class="step-item">
            <text class="step-number">4</text>
            <text class="step-text">不要使用电梯，等待地震结束后有序撤离</text>
          </view>
        </view>
      </view>

      <!-- 户外避险指南 -->
      <view class="guide-section">
        <view class="section-header">
          <uni-icons type="location" size="24" color="#22C55E"></uni-icons>
          <text class="section-title">户外避险指南</text>
        </view>
        <view class="steps-list">
          <view class="step-item">
            <text class="step-number">1</text>
            <text class="step-text">迅速远离建筑物、广告牌和电线杆</text>
          </view>
          <view class="step-item">
            <text class="step-number">2</text>
            <text class="step-text">寻找开阔地带，避免在高大建筑之间停留</text>
          </view>
          <view class="step-item">
            <text class="step-number">3</text>
            <text class="step-text">注意防范余震，不要返回建筑物内</text>
          </view>
          <view class="step-item">
            <text class="step-number">4</text>
            <text class="step-text">听从现场指挥人员的疏散指示</text>
          </view>
        </view>
      </view>

      <!-- 交通工具中的避险指南 -->
      <view class="guide-section">
        <view class="section-header">
          <image class="custom-icon" src="/static/icons/vehicle.svg" mode="aspectFit" />
          <text class="section-title">交通工具中的避险指南</text>
        </view>
        <view class="steps-list">
          <view class="step-item">
            <text class="step-number">1</text>
            <text class="step-text">减速靠右行驶，选择安全地点停车</text>
          </view>
          <view class="step-item">
            <text class="step-number">2</text>
            <text class="step-text">避免在桥梁、隧道或高架路上停留</text>
          </view>
          <view class="step-item">
            <text class="step-number">3</text>
            <text class="step-text">打开应急灯，保持车内广播开启</text>
          </view>
          <view class="step-item">
            <text class="step-number">4</text>
            <text class="step-text">不要立即离开车辆，等待地震结束</text>
          </view>
        </view>
      </view>

      <!-- 地震后注意事项 -->
      <view class="guide-section">
        <view class="section-header">
          <uni-icons type="info" size="24" color="#8B5CF6"></uni-icons>
          <text class="section-title">地震后注意事项</text>
        </view>
        <view class="steps-list">
          <view class="step-item">
            <text class="step-number">1</text>
            <text class="step-text">检查自身及周围人员伤势</text>
          </view>
          <view class="step-item">
            <text class="step-number">2</text>
            <text class="step-text">警惕余震，不要进入受损建筑</text>
          </view>
          <view class="step-item">
            <text class="step-number">3</text>
            <text class="step-text">保持通讯设备畅通，关注官方信息</text>
          </view>
          <view class="step-item">
            <text class="step-number">4</text>
            <text class="step-text">配合救援人员工作，有序参与救援</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

// 跳转到应急中心
const navigateToEmergency = () => {
  uni.navigateTo({
    url: '/pages/Emergenciecenter/Emergenciecenter'
  })
}
</script>

<style lang="scss" scoped>
.guide-container {
  min-height: 100vh;
  background: #F8FAFC;
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
}

.emergency-button {
  position: fixed;
  top: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  background: #EF4444;
  padding: 16rpx 32rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.2);
  z-index: 100;
  
  .button-text {
    color: #FFFFFF;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.animation-section {
  background: #FFFFFF;
  padding: 32rpx;
  padding-top: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .guide-gif {
    width: 100%;
    height: 300rpx;
    margin-bottom: 16rpx;
  }
  
  .animation-tip {
    font-size: 28rpx;
    color: #64748B;
    text-align: center;
  }
}

.guide-content {
  padding: 20rpx;
}

.guide-section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  
  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1E293B;
      margin-left: 12rpx;
    }

    .custom-icon {
      width: 48rpx;
      height: 48rpx;
      color: #F59E0B;
    }
  }
}

.steps-list {
  .step-item {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .step-number {
      width: 40rpx;
      height: 40rpx;
      background: #3B82F6;
      color: #FFFFFF;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      margin-right: 16rpx;
      flex-shrink: 0;
    }
    
    .step-text {
      font-size: 28rpx;
      color: #334155;
      line-height: 1.5;
    }
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .guide-container {
    background: #1A1A1A;
  }
  
  .animation-section,
  .guide-section {
    background: #262626;
  }
  
  .animation-section {
    .animation-tip {
      color: #9CA3AF;
    }
  }
  
  .section-header {
    .section-title {
      color: #E5E7EB;
    }
  }
  
  .steps-list {
    .step-item {
      .step-text {
        color: #D1D5DB;
      }
    }
  }
}
</style>
