<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    <NavbarAdminComponent />

    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-[#A62639] rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-bounce">🛡️</span>
        </div>
      </div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Initialisation de la console admin...
      </p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div>
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Dashboard</h2>
          <p class="text-[10px] font-bold text-[#A62639] uppercase tracking-widest mt-1">Analyse des réserves globales</p>
        </div>

        <router-link to="/AdminProfil" v-if="admin" class="flex items-center gap-4 bg-slate-50 p-2 pr-6 rounded-2xl hover:bg-slate-900 transition-all group">
          <div class="w-12 h-12 bg-slate-900 rounded-xl overflow-hidden border-2 border-white">
            <img v-if="admin.photo" :src="admin.photo.startsWith('http') ? admin.photo : `http://127.0.0.1:8000/storage/${admin.photo}`" class="w-full h-full object-cover">
            <span v-else class="text-white flex items-center justify-center h-full font-black">{{ admin.nom_complet?.charAt(0) }}</span>
          </div>
          <div class="hidden sm:block">
            <p class="text-[10px] font-black uppercase text-slate-900 group-hover:text-white">{{ admin.nom_complet }}</p>
            <p class="text-[8px] font-bold text-[#A62639] uppercase">Connecté</p>
          </div>
        </router-link>
      </header>

      <main class="flex-1 p-6 lg:p-12 space-y-12 bg-[#fafafa]">
        
        <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 0.1s">
            <h3 class="text-[10px] font-black text-slate-400 uppercase italic">Donneurs Inscrits</h3>
            <p class="text-5xl font-black text-slate-900 mt-2 italic">{{ stats.total_donneurs }}</p>
          </div>

          <div class="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 0.2s">
            <h3 class="text-[10px] font-black text-slate-400 uppercase italic">Volume Global</h3>
            <p class="text-5xl font-black text-[#A62639] mt-2 italic">{{ stats.volume_total_litres }}<span class="text-2xl ml-1">L</span></p>
          </div>

          <div class="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center animate-slide-up" style="animation-delay: 0.3s">
            <h3 class="text-[10px] font-black opacity-50 uppercase italic mb-2">Statut des Stocks</h3>
            <transition name="fade-slide" mode="out-in">
              <div v-if="stats.alertes_stock?.length > 0" :key="currentIndex">
                <p class="text-2xl font-black text-[#A62639] animate-pulse uppercase italic">
                  {{ stats.alertes_stock[currentIndex % stats.alertes_stock.length].groupe_sanguin }} CRITIQUE
                </p>
                <p class="text-[10px] font-bold opacity-70 italic mt-1">
                  Seulement {{ stats.alertes_stock[currentIndex % stats.alertes_stock.length].total }} ml disponibles
                </p>
              </div>
              <div v-else><p class="text-2xl font-black italic text-emerald-400">Stock Optimal ✅</p></div>
            </transition>
            <div class="absolute -right-4 -bottom-4 text-7xl opacity-5 italic font-black">SOS</div>
          </div>
        </div>

        <div v-if="stockDetails.length" class="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 0.4s">
          <div class="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h3 class="text-xs font-black text-slate-900 uppercase tracking-widest italic border-l-4 border-[#A62639] pl-4">Répartition par Groupe</h3>
            
            <div class="flex bg-slate-100 p-1 rounded-xl">
              <button @click="viewMode = 'ml'" :class="viewMode === 'ml' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'" class="px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all">Volume (ml)</button>
              <button @click="viewMode = 'poches'" :class="viewMode === 'poches' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'" class="px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all">Poches</button>
            </div>
          </div>

          <div class="flex items-end justify-between h-64 px-4 border-b border-slate-100 pb-4 overflow-x-auto min-w-[600px]">
            <div v-for="s in stockDetails" :key="s.groupe_sanguin" class="flex flex-col items-center gap-4 group relative flex-1 max-w-[80px]">
              
              <span class="absolute -top-10 text-[9px] font-bold bg-slate-900 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                {{ viewMode === 'ml' ? s.total_ml + 'ml' : s.total_poches + ' pcs' }}
              </span>

              <div class="w-10 lg:w-12 rounded-t-2xl transition-all duration-1000 ease-out relative" 
                   :class="parseFloat(s.total_ml) < 2000 ? 'bg-[#A62639] animate-pulse' : 'bg-slate-900'"
                   :style="{ height: calculateHeight(s) + 'px' }">
                <div class="absolute inset-y-0 left-1 w-1 bg-white/10 rounded-full"></div>
              </div>

              <span class="text-[10px] font-black text-slate-400 uppercase italic">{{ s.groupe_sanguin }}</span>
            </div>
          </div>
        </div>
      </main>

      <FooterAdminComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { apiClient } from '@/main';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';

const stats = ref(null);
const stockDetails = ref([]);
const admin = ref(null);
const viewMode = ref('ml');
const currentIndex = ref(0);
const isLoading = ref(true);
let alertTimer = null;

const fetchData = async () => {
  try {
    const [resStats, resStocks, resUser] = await Promise.all([
      apiClient.get('/admin/stats-globales'),
      apiClient.get('/admin/stocks'),
      apiClient.get('/user-profile')
    ]);

    stats.value = resStats.data;
    stockDetails.value = resStocks.data;
    admin.value = resUser.data;
  } catch (e) {
    console.error("Erreur Dashboard Admin:", e);
  } finally {
    setTimeout(() => { isLoading.value = false; }, 600);
  }
};

const calculateHeight = (s) => {
  // On base la hauteur sur un max de 10L ou 30 poches pour l'échelle visuelle
  const max = viewMode.value === 'ml' ? 10000 : 30; 
  const val = viewMode.value === 'ml' ? parseFloat(s.total_ml) : parseInt(s.total_poches);
  return Math.min(Math.max((val / max) * 240, 10), 240); 
};

onMounted(() => {
  fetchData();
  alertTimer = setInterval(() => { 
    if (stats.value?.alertes_stock?.length > 0) {
      currentIndex.value++; 
    }
  }, 4000);
});

onUnmounted(() => { 
  if (alertTimer) clearInterval(alertTimer); 
});
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(10px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-10px); }

.animate-fade-in { animation: fadeIn 0.5s ease-out both; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

/* Scrollbar discrète pour le graphique sur mobile */
.overflow-x-auto::-webkit-scrollbar { height: 4px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>