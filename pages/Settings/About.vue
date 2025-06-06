<template>
  <view class="about-page">
    <view class="header">
      <image class="logo" src="/static/images/app-logo.svg" mode="aspectFit" />
      <text class="app-name">地震预警</text>
      <text class="version">版本 1.0.0</text>
      <text class="slogan">为您提供及时可靠的地震预警服务</text>
    </view>

    <view class="content">
      <view class="section">
        <text class="section-title">应用介绍</text>
        <text class="section-text">地震预警是一款专注于为用户提供实时地震预警信息的应用。我们利用先进的地震监测网络和数据分析技术，致力于在地震发生的第一时间向用户发出预警，帮助用户及时采取防护措施。</text>
      </view>

      <view class="section">
        <text class="section-title">主要功能</text>
        <view class="feature-list">
          <view class="feature-item">
            <uni-icons type="notification" size="24" color="#3B82F6"></uni-icons>
            <text class="feature-name">实时预警</text>
            <text class="feature-desc">第一时间发布地震预警信息</text>
          </view>
          <view class="feature-item">
            <uni-icons type="location" size="24" color="#22C55E"></uni-icons>
            <text class="feature-name">位置服务</text>
            <text class="feature-desc">精准定位周边地震信息</text>
          </view>
          <view class="feature-item">
            <uni-icons type="info" size="24" color="#F59E0B"></uni-icons>
            <text class="feature-name">避难指南</text>
            <text class="feature-desc">提供详细的避难场所信息</text>
          </view>
          <view class="feature-item">
            <uni-icons type="calendar" size="24" color="#8B5CF6"></uni-icons>
            <text class="feature-name">历史记录</text>
            <text class="feature-desc">查看历史地震记录</text>
          </view>
        </view>
      </view>

      <view class="section">
        <text class="section-title">联系我们</text>
        <view class="contact-list">
          <view class="contact-item">
            <text class="label">官方网站</text>
            <text class="value">www.example.com</text>
          </view>
          <view class="contact-item">
            <text class="label">客服电话</text>
            <text class="value">400-XXX-XXXX</text>
          </view>
          <view class="contact-item">
            <text class="label">电子邮箱</text>
            <text class="value">justebe@163.com</text>
          </view>
        </view>
      </view>

      <view class="copyright">
        <text>© 2025 地震预警. All rights reserved.</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.about-page {
  min-height: 100vh;
  background: #F8FAFC;
  padding-bottom: 32rpx;
}

.header {
  background: #FFFFFF;
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
  
  .logo {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 24rpx;
  }
  
  .app-name {
    font-size: 36rpx;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 8rpx;
  }
  
  .version {
    font-size: 24rpx;
    color: #64748B;
    margin-bottom: 16rpx;
  }
  
  .slogan {
    font-size: 28rpx;
    color: #334155;
    text-align: center;
  }
}

.content {
  padding: 0 32rpx;
}

.section {
  background: #FFFFFF;
  padding: 32rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 16rpx;
  }
  
  .section-text {
    font-size: 28rpx;
    color: #334155;
    line-height: 1.6;
  }
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  
  .feature-item {
    background: #F8FAFC;
    padding: 24rpx;
    border-radius: 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    
    .feature-name {
      font-size: 28rpx;
      font-weight: 600;
      color: #1E293B;
      margin: 12rpx 0 8rpx;
    }
    
    .feature-desc {
      font-size: 24rpx;
      color: #64748B;
      line-height: 1.4;
    }
  }
}

.contact-list {
  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1px solid #E2E8F0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      font-size: 28rpx;
      color: #334155;
    }
    
    .value {
      font-size: 28rpx;
      color: #64748B;
    }
  }
}

.copyright {
  text-align: center;
  padding: 32rpx 0;
  
  text {
    font-size: 24rpx;
    color: #64748B;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .about-page {
    background: #1A1A1A;
  }
  
  .header {
    background: #262626;
    
    .app-name {
      color: #E5E7EB;
    }
    
    .version {
      color: #9CA3AF;
    }
    
    .slogan {
      color: #D1D5DB;
    }
  }
  
  .section {
    background: #262626;
    
    .section-title {
      color: #E5E7EB;
    }
    
    .section-text {
      color: #D1D5DB;
    }
  }
  
  .feature-list {
    .feature-item {
      background: #1A1A1A;
      
      .feature-name {
        color: #E5E7EB;
      }
      
      .feature-desc {
        color: #9CA3AF;
      }
    }
  }
  
  .contact-list {
    .contact-item {
      border-bottom-color: rgba(255, 255, 255, 0.1);
      
      .label {
        color: #D1D5DB;
      }
      
      .value {
        color: #9CA3AF;
      }
    }
  }
  
  .copyright {
    text {
      color: #9CA3AF;
    }
  }
}
</style> 