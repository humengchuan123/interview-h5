<template>
  <div class="history-page">
    <h3 class="page-title">历史提交记录</h3>
    <div v-if="!records.length" class="empty-tip">暂无提交记录</div>
    <div v-else>
      <div v-for="record in records" :key="record.id" class="record-card">
        <div class="record-header">
          <span class="record-task">{{ record.tasks?.name || '-' }}</span>
          <span :class="['record-badge', record.result === 'passed' ? 'badge-pass' : 'badge-fail']">
            {{ record.result === 'passed' ? '✅ 合格' : '❌ 不达标' }}
          </span>
        </div>
        <div class="record-body">
          <span>实际排面数：<strong>{{ record.actual_count }}</strong></span>
          <span>要求数：<strong>{{ record.tasks?.required_count || '-' }}</strong></span>
        </div>
        <div class="record-time">{{ formatTime(record.submitted_at) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import api from '../api'

const currentStoreId = inject('currentStoreId')
const records = ref([])

onMounted(async () => {
  try {
    records.value = await api.getSubmissions()
  } catch (e) {
    console.error('加载历史记录失败', e)
  }
})

const formatTime = (t) => {
  if (!t) return '-'
  return new Date(t).toLocaleString('zh-CN')
}
</script>

<style scoped>
.page-title { font-size: 16px; margin-bottom: 16px; }
.empty-tip { text-align: center; padding: 60px 20px; color: #999; font-size: 14px; }
.record-card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.record-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.record-task { font-size: 15px; font-weight: 600; }
.record-badge { font-size: 12px; padding: 2px 8px; border-radius: 10px; }
.badge-pass { background: #dcfce7; color: #16a34a; }
.badge-fail { background: #fee2e2; color: #dc2626; }
.record-body { font-size: 13px; color: #666; display: flex; gap: 16px; margin-bottom: 4px; }
.record-body strong { color: #333; }
.record-time { font-size: 12px; color: #aaa; }
</style>
