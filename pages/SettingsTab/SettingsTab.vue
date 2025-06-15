<template>
  <view class="settings-container">
    <!-- 应用信息卡片 -->
    <view class="app-card">
      <view class="app-info">
        <image class="app-logo" src="/static/images/app-logo-small.svg" mode="aspectFit" />
        <view class="app-details">
          <text class="app-name">地震预警</text>
          <text class="version">版本 1.0.0</text>
        </view>
      </view>
    </view>

    <!-- 设置分组 -->
    <view class="settings-group" v-for="(group, groupIndex) in settingsGroups" :key="groupIndex">
      <text class="group-title">{{ group.title }}</text>
      
      <view class="settings-list">
        <view 
          class="setting-item" 
          v-for="(setting, index) in group.items" 
          :key="index"
          :class="{ 'no-border': index === group.items.length - 1 }"
          @click="handleSettingClick(setting)"
        >
          <!-- 左侧区域 -->
          <view class="item-left">
            <view class="icon-wrapper" :style="{ background: setting.iconBg || '#EBF5FF' }">
              <!-- 使用自定义SVG图标 -->
              <image 
                v-if="setting.customIcon" 
                :src="'/static/icons/' + setting.customIcon" 
                class="custom-icon"
                :style="{ color: setting.iconColor || '#3B82F6' }"
              />
              <!-- 使用uni-icons -->
              <uni-icons 
                v-else 
                :type="setting.icon" 
                size="20" 
                :color="setting.iconColor || '#3B82F6'"
              ></uni-icons>
            </view>
            <text class="label">{{ setting.name }}</text>
          </view>

          <!-- 右侧区域 -->
          <view class="item-right">
            <!-- 开关类型 -->
            <template v-if="setting.type === 'toggle'">
              <switch
                :checked="setting.value"
                @change="(e) => handleToggle(setting, e)"
                color="#3B82F6"
                class="custom-switch"
              />
            </template>

            <!-- 文本类型 -->
            <template v-else-if="setting.type === 'text'">
              <view class="text-value">
                <text>{{ setting.value }}</text>
                <uni-icons type="right" size="14" color="#999"></uni-icons>
              </view>
            </template>

            <!-- 滑块类型 -->
            <template v-else-if="setting.type === 'slider'">
              <view class="slider-wrapper">
                <view class="slider-header">
                  <text class="slider-value">{{ setting.value }}{{ setting.unit || '%' }}</text>
                </view>
                <view class="slider-container">
                  <slider
                    class="slider"
                    :value="setting.value"
                    :min="setting.min"
                    :max="setting.max"
                    :step="setting.step || 1"
                    activeColor="#3B82F6"
                    backgroundColor="#E2E8F0"
                    block-color="#FFFFFF"
                    block-size="24"
                    @change="(e) => handleSliderChange(setting, e)"
                  />
                  <view class="slider-marks">
                    <text>0</text>
                    <text>50</text>
                    <text>100</text>
                  </view>
                </view>
              </view>
            </template>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

// 设置分组数据
const settingsGroups = reactive([
  {
    title: '预警设置',
    items: [
      { 
        name: '预警通知', 
        icon: 'notification', 
        type: 'toggle', 
        value: true,
        iconBg: '#EBF5FF',
        iconColor: '#3B82F6'
      },
      { 
        name: '声音提醒', 
        icon: 'sound', 
        type: 'toggle', 
        value: true,
        iconBg: '#F0FDF4',
        iconColor: '#22C55E'
      },
      { 
        name: '声音大小', 
        icon: 'sound', 
        type: 'slider', 
        value: 80,
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        iconBg: '#FEF3C7',
        iconColor: '#F59E0B'
      },
      { 
        name: '震动提醒', 
        customIcon: 'shake.svg', 
        type: 'toggle', 
        value: true,
        iconBg: '#F0FDF4',
        iconColor: '#22C55E'
      },
      { 
        name: '震动强度', 
        icon: 'settings', 
        type: 'slider', 
        value: 60,
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        iconBg: '#FEF3C7',
        iconColor: '#F59E0B'
      }
    ]
  },
  {
    title: '应用设置',
    items: [
      { 
        name: '警报等级', 
        icon: 'info', 
        type: 'text', 
        value: '5.0级及以上',
        options: ['4.0级', '5.0级及以上', '6.0级及以上', '所有预警'],
        iconBg: '#EBF5FF',
        iconColor: '#3B82F6'
      },
      { 
        name: '刷新频率', 
        icon: 'reload', 
        type: 'text', 
        value: '每10分钟',
        options: ['每5分钟', '每10分钟', '每30分钟', '每小时'],
        iconBg: '#F0FDF4',
        iconColor: '#22C55E'
      },
      // { 
      //   name: '深色模式', 
      //   icon: 'eye', 
      //   type: 'toggle', 
      //   value: false,
      //   iconBg: '#FEF3C7',
      //   iconColor: '#F59E0B'
      // },
      { 
        name: '位置信息', 
        icon: 'location', 
        type: 'toggle', 
        value: true,
        iconBg: '#EBF5FF',
        iconColor: '#3B82F6'
      }
    ]
  },
  {
    title: '其他',
    items: [
      { 
        name: '问卷报告', 
        icon: 'help', 
        type: 'text', 
        value: '提供反馈',
        iconBg: '#F5F3FF',
        iconColor: '#8B5CF6',
      },
      { 
        name: '清除缓存', 
        icon: 'trash', 
        type: 'text', 
        value: '12.5MB',
        iconBg: '#FEE2E2',
        iconColor: '#EF4444'
      },
      { 
        name: '检查更新', 
        icon: 'download', 
        type: 'text', 
        value: 'v1.0.0',
        iconBg: '#EBF5FF',
        iconColor: '#3B82F6'
      },
      { 
        name: '隐私政策', 
        customIcon: 'privacy.svg', 
        type: 'text', 
        value: '',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA'
      },
      { 
        name: '关于我们', 
        icon: 'info', 
        type: 'text', 
        value: '',
        iconBg: '#F3E8FF',
        iconColor: '#9333EA'
      }
    ]
  }
])

// 从本地存储加载设置
const loadSettings = () => {
  try {
    for (const group of settingsGroups) {
      for (const setting of group.items) {
        const storedValue = uni.getStorageSync(`setting_${setting.name}`)
        if (storedValue !== '') {
          setting.value = storedValue
        }
      }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// 保存设置到本地存储
const saveSettings = (settingName, value) => {
  try {
    uni.setStorageSync(`setting_${settingName}`, value)
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

// 处理设置项点击
const handleSettingClick = (setting) => {
  if (setting.type === 'text') {
    if (setting.options) {
      uni.showActionSheet({
        itemList: setting.options,
        success: (res) => {
          setting.value = setting.options[res.tapIndex]
        }
      })
    } else {
      switch (setting.name) {
        case '清除缓存':
          handleClearCache()
          break
        case '检查更新':
          handleCheckUpdate()
          break
        case '隐私政策':
          uni.navigateTo({ url: '/pages/Settings/Privacy' })
          break
        case '关于我们':
          uni.navigateTo({ url: '/pages/Settings/About' })
          break
        case '问卷报告':
          uni.navigateTo({ url: '/pages/SurveyReport/SurveyReport' })
          break
      }
    }
  }
}

// 处理开关切换
const handleToggle = (setting, event) => {
  const value = event.detail.value
  setting.value = value
  saveSettings(setting.name, value)

  switch (setting.name) {
    case '震动提醒':
      uni.setStorageSync('vibrationEnabled', value)
      uni.showToast({
        title: value ? '已开启震动提醒' : '已关闭震动提醒',
        icon: 'none'
      })
      break
      
    case '声音提醒':
      uni.setStorageSync('soundEnabled', value)
      uni.showToast({
        title: value ? '已开启声音提醒' : '已关闭声音提醒',
        icon: 'none'
      })
      break
      
    case '预警通知':
      uni.setStorageSync('notificationEnabled', value)
      if (value) {
        uni.requestSubscribeMessage({
          tmplIds: ['earthquake_warning_template'], // 替换为实际的模板ID
          success: (res) => {
            console.log('订阅消息成功', res)
          },
          fail: (err) => {
            console.error('订阅消息失败', err)
            setting.value = false
            saveSettings(setting.name, false)
          }
        })
      }
      break
      
    case '位置信息':
      if (value) {
        uni.getLocation({
          type: 'gcj02',
          success: () => {
            uni.showToast({
              title: '已开启位置权限',
              icon: 'success'
            })
            uni.setStorageSync('locationEnabled', true)
          },
          fail: () => {
            setting.value = false
            saveSettings(setting.name, false)
            uni.showToast({
              title: '请在系统设置中开启位置权限',
              icon: 'none'
            })
          }
        })
      } else {
        uni.setStorageSync('locationEnabled', false)
      }
      break
  }
}

// 处理滑块变化
const handleSliderChange = (setting, event) => {
  const value = event.detail.value
  setting.value = value
  saveSettings(setting.name, value)
  
  switch (setting.name) {
    case '震动强度':
      uni.setStorageSync('vibrationIntensity', value)
      break
    case '声音大小': {
      uni.setStorageSync('soundVolume', value)
      // 如果有背景音乐实例，直接调整音量
      const bgAudio = uni.getBackgroundAudioManager()
      if (bgAudio) {
        bgAudio.volume = value / 100
      }
      break
    }
  }
}

// 处理清除缓存
const handleClearCache = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        // TODO: 实现缓存清理逻辑
        uni.showToast({
          title: '清除成功',
          icon: 'success'
        })
        // 更新缓存大小显示
        const cacheItem = settingsGroups[2].items.find(item => item.name === '清除缓存')
        if (cacheItem) {
          cacheItem.value = '0MB'
        }
      }
    }
  })
}

// 处理检查更新
const handleCheckUpdate = () => {
  uni.showLoading({
    title: '检查更新中'
  })
  
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已是最新版本',
      icon: 'success'
    })
  }, 1500)
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 20rpx 0;
}

// 应用信息卡片样式
.app-card {
  margin: 0 32rpx 32rpx;
  padding: 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .app-info {
    display: flex;
    align-items: center;
    
    .app-logo {
      width: 88rpx;
      height: 88rpx;
      border-radius: 16rpx;
      margin-right: 24rpx;
    }

    .app-details {
      .app-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #1E293B;
        display: block;
        margin-bottom: 4rpx;
      }

      .version {
        font-size: 24rpx;
        color: #64748B;
      }
    }
  }
}

// 设置组样式
.settings-group {
  margin-bottom: 32rpx;

  .group-title {
    font-size: 28rpx;
    color: #64748B;
    padding: 0 32rpx;
    margin-bottom: 12rpx;
  }

  .settings-list {
    background: #FFFFFF;
    padding: 0 32rpx;
  }
}

// 设置项样式
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &.no-border {
    border-bottom: none;
  }

  .item-left {
    display: flex;
    align-items: center;

    .icon-wrapper {
      width: 48rpx;
      height: 48rpx;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .custom-icon {
        width: 24rpx;
        height: 24rpx;
      }
    }

    .label {
      font-size: 28rpx;
      color: #1E293B;
    }
  }

  .item-right {
    .text-value {
      display: flex;
      align-items: center;
      
      text {
        font-size: 26rpx;
        color: #64748B;
        margin-right: 8rpx;
      }
    }

    .slider-wrapper {
      width: 300rpx;
      display: flex;
      flex-direction: column;
      
      .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8rpx;
        
        .slider-value {
          font-size: 24rpx;
          color: #64748B;
          min-width: 60rpx;
          text-align: right;
        }
      }
      
      .slider-container {
        position: relative;
        height: 40rpx;
        display: flex;
        align-items: center;
        
        .slider {
          width: 100%;
          margin: 0;
        }
        
        .slider-marks {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -24rpx;
          display: flex;
          justify-content: space-between;
          padding: 0 4rpx;
          
          text {
            font-size: 20rpx;
            color: #94A3B8;
            transform: scale(0.8);
          }
        }
      }
    }
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .settings-container {
    background: #1A1A1A;
  }

  .app-card {
    background: #262626;
    box-shadow: none;

    .app-details {
      .app-name {
        color: #E5E7EB;
      }

      .version {
        color: #9CA3AF;
      }
    }
  }

  .settings-group {
    .settings-list {
      background: #262626;
    }
  }

  .setting-item {
    border-bottom-color: rgba(255, 255, 255, 0.1);

    .item-left {
      .label {
        color: #E5E7EB;
      }
    }

    .item-right {
      .text-value {
        text {
          color: #9CA3AF;
        }
      }

      .slider-wrapper {
        .slider-header {
          .slider-value {
            color: #94A3B8;
          }
        }
        
        .slider-container {
          .slider-marks {
            text {
              color: #64748B;
            }
          }
        }
      }
    }
  }
}
</style>
