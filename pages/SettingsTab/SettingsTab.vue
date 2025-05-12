<template>
  <div class="settings-tab">
    <div class="setting-item" v-for="setting in settings" :key="setting.id">
      <div class="setting-left">
        <div class="setting-icon">
          <i :class="setting.icon"></i>
        </div>
        <div class="setting-name">{{ setting.name }}</div>
      </div>
      <template v-if="setting.type === 'toggle'">
        <label class="switch">
          <input type="checkbox" v-model="setting.value" @change="onToggle(setting)" />
          <span class="slider"></span>
        </label>
      </template>
      <template v-else>
        <div class="setting-value">{{ setting.value }}</div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const settings = reactive([
  { id: 1, name: '预警通知', icon: 'fas fa-bell', type: 'toggle', value: true },
  { id: 2, name: '警报声音', icon: 'fas fa-volume-up', type: 'toggle', value: true },
  { id: 3, name: '振动提醒', icon: 'fas fa-vibrate', type: 'toggle', value: true },
  { id: 4, name: '预警阈值', icon: 'fas fa-broadcast-tower', type: 'text', value: '4.0级及以上' },
  { id: 5, name: '定位精度', icon: 'fas fa-map-marked-alt', type: 'text', value: '高精度' },
  { id: 6, name: '夜间模式', icon: 'fas fa-moon', type: 'toggle', value: false },
  { id: 7, name: '数据刷新频率', icon: 'fas fa-history', type: 'text', value: '自动' }
])

function onToggle(setting) {
  console.log(`${setting.name} ${setting.value ? '开启' : '关闭'}`)
}
</script>

<style scoped>
/* 主要背景颜色调整 */
.settings-tab {
  background-color: #f4f5f7;
  padding: 15px;
  border-radius: 10px;
}

/* 每一项的样式 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

/* 悬浮效果 */
.setting-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

/* 左侧图标和名称 */
.setting-left {
  display: flex;
  align-items: center;
}

/* 图标样式 */
.setting-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e3e4e8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: #4a90e2;
  font-size: 1rem;
}

/* 文字样式 */
.setting-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

/* 文字值样式 */
.setting-value {
  font-size: 0.9rem;
  color: #4a90e2;
  font-weight: bold;
}

/* 开关按钮 */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

/* 隐藏原始 input */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* 滑动条样式 */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 34px;
  transition: background-color 0.3s ease-in-out;
}

/* 开关圆点 */
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

/* 选中状态 */
input:checked + .slider {
  background-color: #4a90e2;
}

/* 选中状态的滑块动画 */
input:checked + .slider:before {
  transform: translateX(24px);
  background-color: #ffffff;
}

/* 增加开关的阴影效果 */
.slider:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
