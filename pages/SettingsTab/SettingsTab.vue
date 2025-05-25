<template>
  <view class="settings-container">
    <view
      class="setting-item"
      v-for="(setting, index) in settings"
      :key="index"
    >
      <!-- 左侧图标+标题 -->
      <view class="left">
        <image :src="setting.icon" class="icon" mode="aspectFit" />
        <text class="label">{{ setting.name }}</text>
      </view>

      <!-- 右侧控件 -->
      <view class="right">
        <!-- toggle -->
        <view
          v-if="setting.type === 'toggle'"
          class="custom-switch"
          :class="{ active: setting.value }"
          @tap="toggle(setting)"
        >
          <view class="circle" />
        </view>

        <!-- text -->
        <view
          v-else-if="setting.type === 'text'"
          class="text-setting"
          @tap="selectOption(setting)"
        >
          <text class="value">{{ setting.value }}</text>
          <uni-icons type="right" size="16" color="#999" />
        </view>

        <!-- slider -->
        <view v-else-if="setting.type === 'slider'" class="slider-setting">
          <slider
            :value="setting.value"
            :min="setting.min || 0"
            :max="setting.max || 100"
            activeColor="#4A90E2"
            backgroundColor="#ddd"
            block-color="#4A90E2"
            @change="e => setting.value = e.detail.value"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 图标路径配置
const icon = name => `/static/icons/${name}.svg`

// 设置项数据
const settings = reactive([
  { name: '预警通知', icon: icon('bell'), type: 'toggle', value: true },
  { name: '震动提醒', icon: icon('shale'), type: 'toggle', value: false },
  { name: '震动强度', icon: icon('shake'), type: 'slider', value: 60, min: 0, max: 100 },
  { name: '警报等级', icon: icon('level'), type: 'text', value: '5.0级及以上' },
  { name: '刷新频率', icon: icon('refresh'), type: 'text', value: '每10分钟' },
  { name: '夜间模式', icon: icon('moon'), type: 'toggle', value: false },
  { name: '语言', icon: icon('language'), type: 'text', value: '中文' }
])

// 切换 toggle 类型设置
function toggle(setting) {
  setting.value = !setting.value
}

// 点击 text 类型设置，弹出选项
function selectOption(setting) {
  const optionsMap = {
    '警报等级': ['4.0级', '5.0级以上', '所有预警'],
    '刷新频率': ['每5分钟', '每10分钟', '每30分钟'],
    '语言': ['中文', 'English']
  }
  const options = optionsMap[setting.name] || ['选项A', '选项B']

  uni.showActionSheet({
    itemList: options,
    success: res => {
      setting.value = options[res.tapIndex]
    }
  })
}
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 20rpx;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1px solid #eee;
}
.left {
  display: flex;
  align-items: center;
}
.icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 20rpx;
}
.label {
  font-size: 30rpx;
  color: #333;
}
.right {
  display: flex;
  align-items: center;
}

/* 自定义开关 */
.custom-switch {
  width: 92rpx;
  height: 48rpx;
  border-radius: 48rpx;
  background-color: #ccc;
  position: relative;
  transition: background-color 0.3s;
}
.custom-switch.active {
  background-color: #4A90E2;
}
.custom-switch .circle {
  width: 42rpx;
  height: 42rpx;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  top: 3rpx;
  left: 3rpx;
  transition: left 0.3s;
}
.custom-switch.active .circle {
  left: 47rpx;
}

/* 文字选择 */
.text-setting {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;
}
.text-setting .value {
  margin-right: 10rpx;
}

/* 滑块 */
.slider-setting {
  width: 300rpx;
}
</style>
