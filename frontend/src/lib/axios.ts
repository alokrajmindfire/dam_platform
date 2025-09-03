import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log("axios error",error)
    if (error.code === 'ERR_NETWORK') {
      const currentPath = window.location.pathname + window.location.search
      if (window.location.pathname !== '/network-issue') {
        sessionStorage.setItem('previous_path', currentPath)
        window.location.href = '/network-issue'
      }
    }
    // console.log("window.location.pathname",window.location.pathname)
    if (
      error.response &&
      error.response.status === 401 &&
      window.location.pathname != '/login' &&
      window.location.pathname != '/register'
    ) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default api
