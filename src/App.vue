<template>
  <div class="app">
    <header class="app-header">
      <h1>陈列巡检</h1>
      <div class="store-selector" v-if="stores.length">
        <select v-model="currentStoreId" @change="onStoreChange">
          <option value="">选择门店</option>
          <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
    </header>
    <main class="app-body">
      <router-view :storeId="currentStoreId" />
    </main>
    <nav class="app-tabbar">
      <router-link to="/tasks" class="tab-item">
        <span class="tab-icon">📋</span>
        <span class="tab-label">待办任务</span>
      </router-link>
      <router-link to="/history" class="tab-item">
        <span class="tab-icon">📊</span>
        <span class="tab-label">历史记录</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import api from './api'

const stores = ref([])
const currentStoreId = ref(localStorage.getItem('storeId') || '')

provide('currentStoreId', currentStoreId)

onMounted(async () => {
  try {
    stores.value = await api.getStores()
    if (!currentStoreId.value && stores.value.length) {
      currentStoreId.value = stores.value[0].id
      localStorage.setItem('storeId', currentStoreId.value)
    }
  } catch (e) {
    console.error('加载门店失败', e)
  }
})

const onStoreChange = () => {
  localStorage.setItem('storeId', currentStoreId.value)
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f7fa; color: #333; -webkit-font-smoothing: antialiased; }
.app { display: flex; flex-direction: column; height: 100vh; }
.app-header { background: #4f46e5; color: #fff; padding: 16px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
.app-header h1 { font-size: 18px; }
.store-selector select { padding: 6px 10px; border-radius: 6px; border: none; font-size: 13px; background: rgba(255,255,255,0.2); color: #fff; }
.store-selector select option { color: #333; }
.app-body { flex: 1; overflow-y: auto; padding: 16px; }
.app-tabbar { display: flex; background: #fff; border-top: 1px solid #e5e7eb; flex-shrink: 0; }
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 8px 0; text-decoration: none; color: #999; font-size: 12px; }
.tab-item.router-link-active { color: #4f46e5; }
.tab-icon { font-size: 20px; margin-bottom: 2px; }
.tab-label { font-size: 11px; }
</style>
