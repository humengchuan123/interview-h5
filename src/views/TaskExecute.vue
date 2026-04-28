<template>
  <div class="execute-page">
    <div v-if="task" class="content">
      <div class="task-info">
        <h2>{{ task.name }}</h2>
        <p class="required">要求排面数：<strong>{{ task.required_count }}</strong></p>
      </div>

      <div class="input-section" v-if="!submitted">
        <label>输入实际排面数</label>
        <input
          v-model.number="actualCount"
          type="number"
          min="0"
          placeholder="请输入实际排面数"
          class="count-input"
        />
        <button class="submit-btn" @click="handleSubmit" :disabled="actualCount === null">
          提交
        </button>
      </div>

      <div v-if="submitted" class="result-section">
        <div :class="['result-card', validationResult.result === 'passed' ? 'result-pass' : 'result-fail']">
          <div class="result-icon">{{ validationResult.result === 'passed' ? '✅' : '❌' }}</div>
          <div class="result-text">{{ validationResult.result === 'passed' ? '合格' : '不达标' }}</div>
          <div class="result-detail">{{ validationResult.message }}</div>
        </div>
        <button class="back-btn" @click="$router.push('/tasks')">返回任务列表</button>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api'

const route = useRoute()
const task = ref(null)
const actualCount = ref(null)
const submitted = ref(false)
const validationResult = ref({})

onMounted(async () => {
  try {
    const tasks = await api.getTasksByStore(localStorage.getItem('storeId'))
    task.value = tasks.find(t => t.id === route.params.id)
  } catch (e) {
    console.error('加载任务失败', e)
  }
})

const handleSubmit = async () => {
  try {
    const res = await api.submitResult({
      task_id: route.params.id,
      actual_count: actualCount.value,
    })
    validationResult.value = res.validation
    submitted.value = true
  } catch (e) {
    alert('提交失败：' + e.message)
  }
}
</script>

<style scoped>
.execute-page { min-height: 100%; }
.task-info { background: #fff; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.task-info h2 { font-size: 18px; margin-bottom: 8px; }
.required { font-size: 14px; color: #666; }
.required strong { color: #4f46e5; font-size: 20px; }
.input-section { background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.input-section label { display: block; font-size: 14px; margin-bottom: 10px; color: #666; }
.count-input { width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 24px; text-align: center; font-weight: 700; }
.count-input:focus { outline: none; border-color: #4f46e5; }
.submit-btn { width: 100%; margin-top: 16px; padding: 14px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
.submit-btn:disabled { opacity: 0.5; }
.result-section { margin-top: 16px; }
.result-card { border-radius: 10px; padding: 32px 20px; text-align: center; }
.result-pass { background: #dcfce7; }
.result-fail { background: #fee2e2; }
.result-icon { font-size: 48px; margin-bottom: 12px; }
.result-text { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.result-pass .result-text { color: #16a34a; }
.result-fail .result-text { color: #dc2626; }
.result-detail { font-size: 14px; color: #666; }
.back-btn { width: 100%; margin-top: 16px; padding: 14px; background: #fff; color: #4f46e5; border: 2px solid #4f46e5; border-radius: 8px; font-size: 16px; cursor: pointer; }
.loading { text-align: center; padding: 60px; color: #999; }
</style>
