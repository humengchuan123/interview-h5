import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.message || '请求失败'
    return Promise.reject(new Error(msg))
  }
)

export default {
  getStores: () => api.get('/stores'),
  getTasksByStore: (storeId) => api.get(`/tasks/store/${storeId}`),
  submitResult: (data) => api.post('/submissions', data),
  getSubmissions: (taskId) => api.get('/submissions', { params: { taskId } }),
}
