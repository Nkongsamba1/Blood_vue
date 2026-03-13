import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 1. Configuration de l'instance
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL, 
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// 2. Création de l'application
const app = createApp(App)

// 3. Optionnel : rendre l'apiClient disponible partout via this.$http
app.config.globalProperties.$http = apiClient

app.use(router)
app.mount('#app')

// On exporte l'apiClient pour pouvoir l'importer dans d'autres fichiers JS/Vue
export { apiClient }