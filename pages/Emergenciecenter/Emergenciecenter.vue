<template>
  <view class="emergency-page">
    <!-- 紧急头部 -->
    <view class="emergency-header">
      <view class="header-content">
        <uni-icons type="info-filled" size="28" color="#fff" />
        <text class="title">应急服务中心</text>
        <text class="subtitle">24小时紧急支援</text>
      </view>
      <view class="header-wave"></view>
    </view>

    <!-- 核心功能区 -->
    <scroll-view 
      class="emergency-scroll"
      scroll-y
      :show-scrollbar="false"
      :enhanced="true"
    >
      <!-- 紧急呼叫 -->
      <view class="section emergency-call">
        <view class="section-title">
          <uni-icons type="phone" size="22" color="#e74c3c" />
          <text class="title-text">紧急联络</text>
        </view>
        <view class="contact-grid">
          <view 
            v-for="(item,index) in contacts"
            :key="index"
            class="contact-card"
            @click="handleCall(item.number)"
            :hover-class="item.number === '120' ? 'medical-hover' : 'contact-hover'"
          >
            <view class="icon-bg" :style="{background: item.color}">
              <image :src="item.icon" class="contact-icon" />
            </view>
            <text class="contact-name">{{ item.name }}</text>
            <text class="contact-number">{{ item.number }}</text>
          </view>
        </view>
      </view>

      <!-- 救援组织 -->
      <view class="section rescue-org">
        <view class="section-title">
          <uni-icons type="team-filled" size="22" color="#e74c3c" />
          <text class="title-text">救援机构</text>
        </view>
        <view class="org-list">
          <view 
            v-for="(org,index) in organizations"
            :key="index"
            class="org-card"
            @click="openLink(org.url)"
          >
            <image :src="org.logo" class="org-logo" mode="aspectFit" />
            <view class="org-info">
              <text class="org-name">{{ org.name }}</text>
              <text class="org-desc">{{ org.desc }}</text>
              <view class="org-tag">
                <text class="tag" v-for="(tag,tIndex) in org.tags" :key="tIndex">{{ tag }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 社区避难所 -->
      <view class="section shelter-section">
        <view class="shelter-header">
          <view class="section-title">
            <uni-icons type="location-filled" size="22" color="#e74c3c" />
            <text class="title-text">附近避难所</text>
          </view>
          <view class="header-actions">
            <text class="refresh-btn" @click="refreshLocation">刷新位置</text>
            <text class="detail-link" @click="goToShelterDetail">
              查看详情
              <uni-icons type="right" size="12" color="#666"></uni-icons>
            </text>
          </view>
        </view>
        
        <map 
          id="emergency-map"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :markers="shelterMarkers"
          :polyline="polyline"
          style="width: 100%; height: 320rpx;"
          show-location
        >
          <cover-view class="map-legend">
            <cover-view class="legend-item" v-for="item in legend" :key="item.text">
              <cover-view class="legend-color" :style="{background: item.color}"></cover-view>
              <cover-text class="legend-text">{{ item.text }}</cover-text>
            </cover-view>
          </cover-view>
        </map>
      </view>
    </scroll-view>

    <!-- 悬浮返回按钮 -->
    <view class="float-action" @click="navBack">
      <uni-icons type="arrow-left" size="24" color="#fff" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const contacts = ref([
  { name: '紧急报警', number: '110', icon: '/static/icons/bell.svg', color: '#e74c3c' },
  { name: '消防急救', number: '119', icon: '/static/icons/fire.svg', color: '#f39c12' },
  { name: '医疗救护', number: '120', icon: '/static/icons/aid.svg', color: '#2ecc71' },
  { name: '交通事故', number: '122', icon: '/static/icons/car.svg', color: '#3498db' }
])

const organizations = ref([
  {
    name: '中国红十字会',
    desc: '提供紧急医疗救援和人道主义援助',
    url: 'https://www.redcross.org.cn',
    logo: '/static/icons/red_cross.svg',
    tags: ['医疗支援', '物资发放', '灾后重建']
  },
  {
    name: '蓝天救援队',
    desc: '专业民间紧急救援力量',
    url: 'https://www.bsr.org',
    logo: '/static/icons/bluesky-logo.png',
    tags: ['山地救援', '水域救援', '城市救援']
  }
])

const mapCenter = ref({
  latitude: 39.90469,
  longitude: 116.40717
})

const shelterMarkers = ref([
  {
    id: 1,
    latitude: 39.90469,
    longitude: 116.40717,
    iconPath: '/static/shelter.png',
    width: 36,
    height: 36,
    callout: {
      content: '朝阳区应急避难所\n可容纳500人\n物资：充足',
      color: '#ffffff',
      bgColor: '#e74c3c',
      padding: 12,
      borderRadius: 8,
      textAlign: 'center'
    }
  }
])

const legend = ref([
  { color: '#e74c3c', text: '避难所' },
  { color: '#2ecc71', text: '医疗点' },
  { color: '#3498db', text: '物资站' }
])

// 拨打电话
const handleCall = (number) => {
  uni.makePhoneCall({
    phoneNumber: number,
    success: () => {
      uni.vibrateShort({ type: 'heavy' })
    },
    fail: () => {
      uni.showToast({
        title: '呼叫失败，请检查网络',
        icon: 'none'
      })
    }
  })
}

// 处理链接打开
const openLink = (url) => {
  // #ifdef MP-WEIXIN
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({
        title: '链接已复制',
        icon: 'success'
      })
    }
  })
  // #endif
  
  // #ifdef H5
  window.open(url, '_blank')
  // #endif
}

// 刷新定位
const refreshLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: res => {
      mapCenter.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }
    }
  })
}

// 返回上级
const navBack = () => {
  uni.navigateBack()
}

// 跳转到避难所详情页
const goToShelterDetail = () => {
  uni.navigateTo({
    url: '/pages/Shelter/Shelter'
  })
}
</script>

<style lang="scss" scoped>
.emergency-page {
  background: #f8f9fa;
  min-height: 100vh;
}

/* 头部样式 */
.emergency-header {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  padding-bottom: 120rpx;
  position: relative;
  overflow: hidden;

  .header-content {
    padding: 60rpx 40rpx 40rpx;
    position: relative;
    z-index: 2;
  }

  .title {
    display: block;
    font-size: 44rpx;
    font-weight: 700;
    color: #fff;
    margin: 20rpx 0 12rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: rgba(255,255,255,0.9);
  }

  .header-wave {
    position: absolute;
    bottom: -20rpx;
    left: 0;
    right: 0;
    height: 80rpx;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTIwMCAxMjAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxwYXRoIGZpbGw9IiNmOGY5ZmEiIGQ9Ik0wIDY0LjQ1QzI2LjcgNTUuMyA1My40IDUxIDgwIDUxczUzLjMgNC4zIDgwIDEzLjQ1YzI2LjcgOS4xNSA1My40IDEzLjQ1IDgwIDEzLjQ1czUzLjMtNC4zIDgwLTEzLjQ1YzI2LjctOS4xNSA1My40LTEzLjQ1IDgwLTEzLjQ1czUzLjMgNC4zIDgwIDEzLjQ1YzI2LjcgOS4xNSA1My40IDEzLjQ1IDgwIDEzLjQ1czUzLjMtNC4zIDgwLTEzLjQ1YzI2LjctOS4xNSA1My40LTEzLjQ1IDgwLTEzLjQ1czUzLjMgNC4zIDgwIDEzLjQ1VjEyMEgwVjY0LjQ1eiIvPjwvc3ZnPg==');
  }
}

/* 通用区块样式 */
.section {
  background: #fff;
  margin: 24rpx;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
  
  &-title {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    
    .title-text {
      font-size: 36rpx;
      font-weight: 600;
      margin-left: 16rpx;
    }
    
    .refresh-btn {
      margin-left: auto;
      font-size: 26rpx;
      color: #e74c3c;
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      background: rgba(231,76,60,0.1);
    }
  }
}

/* 紧急联络网格 */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32rpx;
  
  .contact-card {
    padding: 32rpx;
    background: #fff;
    border-radius: 24rpx;
    text-align: center;
    transition: all 0.3s ease;
    
    .icon-bg {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin: 0 auto 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
    }
    
    .contact-name {
      display: block;
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
    
    .contact-number {
      display: block;
      font-size: 28rpx;
      color: #666;
      margin-top: 12rpx;
    }
  }
  
  .contact-hover {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 32rpx rgba(231,76,60,0.15);
  }
  
  .medical-hover {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 32rpx rgba(46,204,113,0.15);
  }
}

/* 救援机构列表 */
.org-list {
  .org-card {
    display: flex;
    padding: 32rpx;
    margin-bottom: 24rpx;
    background: #fff;
    border-radius: 24rpx;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.98);
    }
    
    .org-logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: 16rpx;
      margin-right: 32rpx;
      flex-shrink: 0;
    }
    
    .org-info {
      flex: 1;
      
      .org-name {
        font-size: 32rpx;
        font-weight: 500;
        color: #333;
      }
      
      .org-desc {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin: 12rpx 0;
      }
      
      .org-tag {
        display: flex;
        flex-wrap: wrap;
        gap: 12rpx;
        
        .tag {
          padding: 6rpx 16rpx;
          background: rgba(231,76,60,0.1);
          color: #e74c3c;
          border-radius: 8rpx;
          font-size: 24rpx;
        }
      }
    }
  }
}

/* 地图容器 */
.map-legend {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  background: rgba(255,255,255,0.9);
  padding: 16rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
  
  .legend-item {
    display: flex;
    align-items: center;
    margin: 8rpx 0;
    
    .legend-color {
      width: 24rpx;
      height: 24rpx;
      border-radius: 6rpx;
      margin-right: 12rpx;
    }
    
    .legend-text {
      font-size: 24rpx;
      color: #666;
    }
  }
}

/* 悬浮按钮 */
.float-action {
  position: fixed;
  left: 32rpx;
  bottom: 160rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(231,76,60,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(231,76,60,0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
    opacity: 0.8;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .emergency-page {
    background: #1a1a1a;
  }
  
  .section {
    background: #2d2d2d;
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.3);
  }
  
  .contact-card {
    background: #262626;
    
    .contact-name {
      color: #fff;
    }
    
    .contact-number {
      color: #999;
    }
  }
  
  .org-card {
    background: #262626;
    
    .org-name {
      color: #fff;
    }
    
    .org-desc {
      color: #999;
    }
  }
  
  .map-legend {
    background: rgba(45,45,45,0.9);
    
    .legend-text {
      color: #fff;
    }
  }
}
.contact-icon {
  width: 48rpx;
  height: 48rpx;
}

.shelter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  
  .section-title {
    display: flex;
    align-items: center;
    
    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      margin-left: 12rpx;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16rpx;
    
    .refresh-btn {
      font-size: 24rpx;
      color: #e74c3c;
      padding: 4rpx 12rpx;
      border-radius: 6rpx;
      background: rgba(231,76,60,0.1);
    }
    
    .detail-link {
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #666;
      padding: 4rpx 0;
      
      .uni-icons {
        margin-left: 4rpx;
      }
      
      &:active {
        opacity: 0.7;
      }
    }
  }
}
</style>