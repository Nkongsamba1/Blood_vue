<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-[#A62639] rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-pulse">❄️</span>
        </div>
      </div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Vérification des réserves...
      </p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div class="ml-12 lg:ml-0">
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Banque de Sang</h2>
          <p class="text-[8px] lg:text-[10px] font-bold text-[#A62639] uppercase tracking-[0.2em] mt-1">Monitoring des réserves en temps réel</p>
        </div>
        
        <div class="hidden sm:flex gap-4">
            <div class="bg-slate-50 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl border border-slate-100 text-right">
              <p class="text-[7px] lg:text-[8px] font-black text-slate-400 uppercase leading-none">Conservation</p>
              <p class="text-xs lg:text-sm font-black text-blue-500 italic mt-1">❄️ 4.2°C Stable</p>
            </div>
        </div>
      </header>

      <main class="flex-1 p-6 lg:p-12 bg-[#fafafa]">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
          
          <div v-for="(groupe, index) in listeGroupes" :key="groupe" 
               class="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] p-8 lg:p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden animate-slide-up"
               :style="{ animationDelay: (index * 0.05) + 's' }"
               :class="getPercentage(groupe) < 25 ? 'border-red-200 bg-red-50/10' : ''">
            
            <div class="absolute top-6 right-6 lg:top-8 lg:right-8 px-3 py-1 rounded-full text-[9px] font-black italic uppercase transition-colors"
                 :class="getTauxColorClass(groupe)">
              {{ getPercentage(groupe) }}%
            </div>

            <div class="flex flex-col items-center mb-6 lg:mb-8 relative">
              <div class="text-3xl lg:text-4xl font-black text-slate-900 italic mb-4 lg:mb-6 tracking-tighter">{{ groupe }}</div>
              
              <div class="w-20 h-28 lg:w-24 lg:h-32 border-4 border-slate-100 rounded-b-[2rem] lg:rounded-b-[2.5rem] rounded-t-xl relative bg-slate-50 overflow-hidden shadow-inner">
                <div 
                  class="absolute bottom-0 w-full transition-all duration-1000 ease-in-out"
                  :class="getBloodColorClass(groupe)"
                  :style="{ height: getPercentage(groupe) + '%' }"
                >
                   <div class="w-full h-1 lg:h-1.5 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <div class="text-center space-y-1 mb-6">
              <p class="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">Volume actuel</p>
              <p class="text-3xl lg:text-4xl font-black text-slate-900 italic leading-none">
                {{ (getTotalVolumeMl(groupe) / 1000).toFixed(2) }} <span class="text-sm">L</span>
              </p>
            </div>

            <div v-if="getPercentage(groupe) < 25" class="py-2.5 lg:py-3 bg-[#A62639] text-white text-[8px] lg:text-[9px] font-black uppercase text-center rounded-xl lg:rounded-2xl animate-bounce shadow-lg shadow-red-200">
              ⚠️ Alerte Pénurie
            </div>
            <div v-else-if="getPercentage(groupe) < 60" class="py-2.5 lg:py-3 bg-orange-100 text-orange-600 text-[8px] lg:text-[9px] font-black uppercase text-center rounded-xl lg:rounded-2xl">
              ⚡ Niveau Vigilance
            </div>
            <div v-else class="py-2.5 lg:py-3 bg-green-100 text-green-600 text-[8px] lg:text-[9px] font-black uppercase text-center rounded-xl lg:rounded-2xl">
              ✅ Stock Optimal
            </div>
          </div>
        </div>

        <div class="mt-12 lg:mt-16 bg-slate-900 rounded-[2.5rem] lg:rounded-[4rem] p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden animate-slide-up" style="animation-delay: 0.6s">
          <div class="relative z-10 text-center md:text-left">
            <h3 class="text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Besoin de réapprovisionner ?</h3>
            <p class="text-slate-500 text-[8px] lg:text-[10px] font-bold uppercase tracking-[0.2em]">Ciblez les groupes critiques via une campagne d'urgence.</p>
          </div>
          
          <router-link 
            to="/NouvelleCampagne" 
            class="mt-6 md:mt-0 bg-[#A62639] text-white px-8 lg:px-10 py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black uppercase italic tracking-widest text-[10px] lg:text-xs shadow-xl hover:bg-white hover:text-[#A62639] transition-all z-10"
          >
            Lancer une Campagne 🚀
          </router-link>

          <div class="absolute -right-10 -bottom-10 text-[10rem] lg:text-[15rem] opacity-5 pointer-events-none italic font-black text-white select-none">STK</div>
        </div>
      </main>

      <FooterAdminComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/main';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';

const stocks = ref([]);
const loading = ref(true);
const listeGroupes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Seuil de 10 Litres par groupe pour considérer le stock comme "plein"
const SEUIL_SECURITE_ML = 10000; 

const fetchStocks = async () => {
  try {
    const res = await apiClient.get('/admin/stocks');
    stocks.value = res.data || [];
  } catch (e) {
    console.error("Erreur chargement stocks", e);
  } finally {
    loading.value = false;
  }
};

const getTotalVolumeMl = (nom) => {
  const item = stocks.value.find(s => s.groupe_sanguin === nom);
  return item ? parseFloat(item.total_ml) : 0;
};

const getPercentage = (nom) => {
  const total = getTotalVolumeMl(nom);
  const percentage = Math.round((total / SEUIL_SECURITE_ML) * 100);
  return Math.min(percentage, 100);
};

const getBloodColorClass = (nom) => {
  const p = getPercentage(nom);
  if (p < 25) return 'bg-gradient-to-t from-[#A62639] to-red-400 animate-pulse'; 
  if (p < 60) return 'bg-gradient-to-t from-orange-500 to-orange-300'; 
  return 'bg-gradient-to-t from-red-800 to-[#A62639]'; 
};

const getTauxColorClass = (nom) => {
  const p = getPercentage(nom);
  if (p < 25) return 'bg-[#A62639] text-white';
  if (p < 60) return 'bg-orange-100 text-orange-600';
  return 'bg-green-100 text-green-600';
};

onMounted(fetchStocks);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.5s ease-out both; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.overflow-y-auto::-webkit-scrollbar { width: 4px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
</style>