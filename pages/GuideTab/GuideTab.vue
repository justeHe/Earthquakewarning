<template>
  <div class="guide-tab">
    <div class="guide-category" v-for="category in guideCategories" :key="category.id">
      <h3 class="guide-title">
        <i :class="category.icon"></i>{{ category.title }}
      </h3>
      <div class="guide-item" v-for="item in category.items" :key="item.id">
        <h4 class="guide-item-title">
          <i :class="item.icon"></i>{{ item.title }}
        </h4>
        <p class="guide-item-desc">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const guideCategories = ref([
  {
    id: 1,
    title: '居家避险',
    icon: 'fas fa-house-damage',
    items: [
      { id: 1, title: '室内安全', icon: 'fas fa-couch', desc: '迅速躲在结实的桌子、床下或内墙角落；远离窗户、玻璃及悬挂物；不要跳楼或使用电梯。' },
      { id: 2, title: '厨房避险', icon: 'fas fa-utensils', desc: '立即关闭燃气阀门和电源；躲避时远离炉灶、冰箱等可能倾倒的重物。' }
    ]
  },
  {
    id: 2,
    title: '公共场所避险',
    icon: 'fas fa-building',
    items: [
      { id: 1, title: '商场/超市', icon: 'fas fa-store', desc: '就近躲在大柱子或坚固柜台旁；不要拥挤冲向出口，防止踩踏；避开货架及玻璃橱窗。' },
      { id: 2, title: '学校/办公室', icon: 'fas fa-school', desc: '迅速躲在课桌或办公桌下；保护好头部；震动停止后有序疏散到空旷地带。' }
    ]
  },
  {
    id: 3,
    title: '户外避险',
    icon: 'fas fa-car-crash',
    items: [
      { id: 1, title: '街道/开阔地', icon: 'fas fa-road', desc: '远离建筑物、电线杆、广告牌；蹲下保护头部；不要返回室内取物。' },
      { id: 2, title: '行驶车辆', icon: 'fas fa-car', desc: '尽快在安全地带停车；不要停在桥梁、隧道或高大建筑物旁；留在车内通常比跑出去更安全。' }
    ]
  }
])
</script>

<style scoped>
.guide-tab {
  font-family: 'Arial', sans-serif;
  margin: 20px;
  background: #f4f6f9; /* 背景颜色：浅灰色 */
  padding: 20px;
  border-radius: 8px;
}

.guide-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  background: linear-gradient(90deg, rgba(52, 152, 219, 1) 0%, rgba(41, 128, 185, 1) 100%); /* 渐变背景 */
  padding: 8px 15px;
  border-radius: 5px;
}

.guide-title i {
  margin-right: 10px;
  color: #fff;
}

.guide-category {
  margin-bottom: 25px;
}

.guide-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.guide-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.guide-item-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #34495e;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.guide-item-title i {
  margin-right: 10px;
  color: #e74c3c;
}

.guide-item-desc {
  font-size: 0.95rem;
  color: #7f8c8d;
}

.guide-item-desc::before {
  content: "→ "; /* 添加箭头图标前缀 */
  color: #e74c3c;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .guide-tab {
    margin: 10px;
  }

  .guide-title {
    font-size: 1rem;
  }

  .guide-item {
    padding: 15px;
  }
}
</style>
