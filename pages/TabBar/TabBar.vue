<template>
  <div class="tab-bar">
    <div 
      v-for="tab in tabs" 
      :key="tab.name" 
      :class="['tab', { active: activeTab === tab.name }]"
      @click="selectTab(tab.name)"
    >
      <i :class="['tab-icon', tab.icon]"></i>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  activeTab: { type: String, required: true }
})
const emit = defineEmits(['changeTab'])

const tabs = [
  { name: 'alert', label: '预警', icon: 'fas fa-bell' },
  { name: 'history', label: '历史', icon: 'fas fa-clock-rotate-left' },
  { name: 'guide', label: '指南', icon: 'fas fa-book-open' },
  { name: 'settings', label: '设置', icon: 'fas fa-sliders' }
]

function selectTab(tabName) {
  emit('changeTab', tabName)
}
</script>

<style scoped>
.tab-bar {
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  padding: 6px 0;
  z-index: 100;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8e8e93;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 12px;
  margin: 0 6px;
  font-family: -apple-system, BlinkMacSystemFont, 
               'Segoe UI', Roboto, Oxygen,
               Ubuntu, Cantarell, 'Open Sans', 
               'Helvetica Neue', sans-serif;
}

.tab.active {
  color: #e74c3c;
}

.tab-icon {
  font-size: 1.4rem;
  margin-bottom: 5px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab.active .tab-icon {
  transform: translateY(-6px);
  filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.2));
}

.tab-label {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.8;
}

.tab.active .tab-label {
  transform: scale(1.08);
  opacity: 1;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(231, 76, 60, 0.1);
}

.tab::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 4px;
  background: linear-gradient(135deg, #e74c3c, #ff6b6b);
  border-radius: 4px;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.tab.active::before {
  opacity: 1;
  top: 0;
}

.tab:hover {
  background-color: rgba(231, 76, 60, 0.06);
}

.tab.active:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

/* 适配暗色模式 */
@media (prefers-color-scheme: dark) {
  .tab-bar {
    background-color: #1e1e1e;
    border-top-color: rgba(255, 255, 255, 0.08);
  }
  
  .tab {
    color: #9a9a9e;
  }
  
  .tab.active {
    color: #ff6b6b;
  }
  
  .tab:hover {
    background-color: rgba(255, 107, 107, 0.08);
  }
  
  .tab.active:hover {
    background-color: rgba(255, 107, 107, 0.15);
  }
}
</style>