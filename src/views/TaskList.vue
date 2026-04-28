<template>
  <div class="task-list">
    <div v-if="!storeId" class="empty-tip">请先在顶部选择门店</div>
    <div v-else-if="!tasks.length" class="empty-tip">暂无待办任务</div>
    <div v-else>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="task-card"
        @click="$router.push(`/tasks/${task.id}`)"
      >
        <div class="task-card-header">
          <span class="task-name">{{ task.name }}</span>
          <span :class="['task-status', task.status === 'completed' ? 'status-done' : 'status-pending']">
            {{ task.status === 'completed' ? '已完成' : '待执行' }}
          </span>
        </div>
        <div class="task-card-body">
          <span class="task-count">要求排面数：<strong>{{ task.required_count }}</strong></span>
        </div>
        <div class="task-card-arrow">›</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../api'

const props = defineProps({ storeId: String })
const tasks = ref([])

const loadTasks = async () => {
  if (!props.storeId) return
  try {
    tasks.value = await api.getTasksByStore(props.storeId)
  } catch (e) {
    console.error('加载任务失败', e)
  }
}

onMounted(loadTasks)
watch(() => props.storeId, loadTasks)
</script>

<style scoped>
.empty-tip { text-align: center; padding: 60px 20px; color: #999; font-size: 14px; }
.task-card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); display: flex; align-items: center; cursor: pointer; transition: transform 0.15s; }
.task-card:active { transform: scale(0.98); }
.task-card-header { flex: 1; }
.task-name { font-size: 15px; font-weight: 600; display: block; margin-bottom: 6px; }
.task-status { font-size: 12px; padding: 2px 8px; border-radius: 10px; }
.status-pending { background: #fef3c7; color: #d97706; }
.status-done { background: #dcfce7; color: #16a34a; }
.task-card-body { margin-right: 12px; }
.task-count { font-size: 13px; color: #666; }
.task-count strong { color: #4f46e5; font-size: 16px; }
.task-card-arrow { font-size: 20px; color: #ccc; }
</style>
