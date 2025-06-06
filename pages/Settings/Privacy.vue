<template>
    <view class="privacy-page">
      <view class="header">
        <text class="title">隐私政策</text>
        <text class="update-time">更新时间：2025年6月</text>
      </view>
  
      <scroll-view class="content" scroll-y>
        <view class="section">
          <text class="section-title">信息收集</text>
          <text class="section-text">我们收集的信息包括：</text>
          <view class="list">
            <view class="list-item">
              <text class="dot">•</text>
              <text>位置信息：用于提供准确的地震预警服务</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>设备信息：用于优化应用性能</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>使用数据：用于改进服务质量</text>
            </view>
          </view>
        </view>
  
        <view class="section">
          <text class="section-title">信息使用</text>
          <text class="section-text">我们使用收集的信息：</text>
          <view class="list">
            <view class="list-item">
              <text class="dot">•</text>
              <text>提供地震预警服务</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>优化用户体验</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>提供紧急避难信息</text>
            </view>
          </view>
        </view>
  
        <view class="section">
          <text class="section-title">信息安全</text>
          <text class="section-text">我们采取多重措施保护您的信息：</text>
          <view class="list">
            <view class="list-item">
              <text class="dot">•</text>
              <text>数据加密存储</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>安全传输协议</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>定期安全审计</text>
            </view>
          </view>
        </view>
  
        <view class="section">
          <text class="section-title">信息共享</text>
          <text class="section-text">我们不会向第三方出售您的个人信息。仅在以下情况下共享信息：</text>
          <view class="list">
            <view class="list-item">
              <text class="dot">•</text>
              <text>获得您的明确同意</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>法律法规要求</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>紧急情况处理</text>
            </view>
          </view>
        </view>
  
        <view class="section">
          <text class="section-title">您的权利</text>
          <text class="section-text">您拥有以下权利：</text>
          <view class="list">
            <view class="list-item">
              <text class="dot">•</text>
              <text>访问您的个人信息</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>更正不准确的信息</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>要求删除个人信息</text>
            </view>
            <view class="list-item">
              <text class="dot">•</text>
              <text>限制信息处理</text>
            </view>
          </view>
        </view>
  
        <view class="section">
          <text class="section-title">联系我们</text>
          <text class="section-text">如果您对我们的隐私政策有任何疑问，请通过以下方式联系我们：</text>
          <view class="contact-info">
            <text>邮箱：justebe@163.com</text>
            <text>电话：400-XXX-XXXX</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </template>
  
  <style lang="scss" scoped>
  .privacy-page {
    min-height: 100vh;
    background: #F8FAFC;
    padding-bottom: 32rpx;
  }
  
  .header {
    background: #FFFFFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
    
    .title {
      font-size: 36rpx;
      font-weight: 600;
      color: #1E293B;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .update-time {
      font-size: 24rpx;
      color: #64748B;
    }
  }
  
  .content {
    height: calc(100vh - 180rpx);
  }
  
  .section {
    background: #FFFFFF;
    padding: 32rpx;
    margin-bottom: 20rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1E293B;
      display: block;
      margin-bottom: 16rpx;
    }
    
    .section-text {
      font-size: 28rpx;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 16rpx;
      display: block;
    }
  }
  
  .list {
    margin-top: 16rpx;
    
    .list-item {
      display: flex;
      margin-bottom: 12rpx;
      
      .dot {
        color: #3B82F6;
        margin-right: 12rpx;
        font-size: 28rpx;
      }
      
      text {
        font-size: 28rpx;
        color: #334155;
        line-height: 1.6;
      }
    }
  }
  
  .contact-info {
    margin-top: 16rpx;
    
    text {
      font-size: 28rpx;
      color: #334155;
      line-height: 1.6;
      display: block;
      margin-bottom: 8rpx;
    }
  }
  
  /* 暗黑模式适配 */
  @media (prefers-color-scheme: dark) {
    .privacy-page {
      background: #1A1A1A;
    }
    
    .header,
    .section {
      background: #262626;
    }
    
    .header {
      .title {
        color: #E5E7EB;
      }
      
      .update-time {
        color: #9CA3AF;
      }
    }
    
    .section {
      .section-title {
        color: #E5E7EB;
      }
      
      .section-text {
        color: #D1D5DB;
      }
    }
    
    .list {
      .list-item {
        text {
          color: #D1D5DB;
        }
      }
    }
    
    .contact-info {
      text {
        color: #D1D5DB;
      }
    }
  }
  </style>