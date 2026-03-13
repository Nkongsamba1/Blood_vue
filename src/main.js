import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 1. Configuration de l'instance
const apiClient = axios.create({
  // Vérifie bien que la variable s'appelle VUE_APP_API_URL dans Vercel
  baseURL: process.env.VUE_APP_API_URL, 
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// --- ÉTAPE CRUCIALE : L'INTERCEPTEUR DE TOKEN ---
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// ------------------------------------------------

// 2. Création de l'application
const app = createApp(App)

// 3. Rendre l'apiClient disponible partout
app.config.globalProperties.$http = apiClient

app.use(router)
app.mount('#app')

// Export pour tes composants (Dashboard, Profil, etc.)
export { apiClient }