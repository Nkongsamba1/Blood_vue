<template>
  <div class="min-h-screen bg-[#edf2f7] font-sans text-slate-700">
    <NavbarPersonnelComponent />

    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[10px] font-black uppercase text-blue-600 animate-pulse">🩸</span>
        </div>
      </div>
      <p class="mt-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
        Synchronisation des réserves...
      </p>
    </div>

    <main v-else class="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 class="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Inventaire <span class="text-blue-600">Global</span>
          </h2>
          <p class="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em] mt-2">
            Surveillance des réserves en temps réel
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="generatePDF" class="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-50 transition shadow-sm">
            Exporter PDF
          </button>
          <button class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100 hover:scale-105 transition">
            + Nouvelle Expédition
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="blood in bloodStocks" :key="blood.group" 
             class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white group hover:-translate-y-2 transition-all duration-500">
          
          <div class="flex justify-between items-start mb-6">
            <div :class="blood.status === 'Critique' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'" 
                 class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-inner">
              {{ blood.group }}
            </div>
            <span :class="blood.status === 'Critique' ? 'text-red-500 animate-pulse' : 'text-green-500'" 
                  class="text-[9px] font-black uppercase tracking-widest">
              ● {{ blood.status }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-end">
              <p class="text-3xl font-black text-slate-800">{{ (blood.liters / 1000).toFixed(1) }}<span class="text-sm ml-1 text-slate-400 font-bold">L</span></p>
              <p class="text-[10px] font-bold text-slate-400 uppercase">{{ blood.percentage }}% Capacité</p>
            </div>
            <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div :class="blood.status === 'Critique' ? 'bg-red-500' : 'bg-blue-600'" 
                   class="h-full transition-all duration-1000 ease-out"
                   :style="{ width: blood.percentage + '%' }"></div>
            </div>
          </div>
          <p class="mt-6 text-[10px] font-bold text-slate-400 uppercase leading-relaxed">Mise à jour : <span class="text-slate-600">Instantanée</span></p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        
        <div class="lg:col-span-8 bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="text-xl font-black uppercase tracking-tighter italic">Flux des Dons</h3>
            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Activité réelle des 7 derniers jours</p>
            
            <div class="mt-12 h-48 flex items-end justify-between gap-2">
              <div v-for="(val, idx) in chartData" :key="idx" 
                   class="w-full bg-blue-500/20 rounded-t-xl hover:bg-blue-500 transition-all duration-700 cursor-help relative group"
                   :style="{ height: val + '%' }">
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow-xl uppercase">
                   Niveau: {{ val }}%
                </span>
              </div>
            </div>
            <div class="flex justify-between mt-4 text-[9px] font-black uppercase text-slate-500 tracking-widest">
              <span v-for="jour in joursLabels" :key="jour">{{ jour }}</span>
            </div>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32"></div>
        </div>

        <div class="lg:col-span-4 bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-xl border border-white">
          <h3 class="text-sm font-black uppercase tracking-widest text-slate-800 mb-6">Mouvements</h3>
          <div class="space-y-6">
            <div v-for="move in movements" :key="move.id" class="flex items-center gap-4">
              <div :class="move.type === 'Entrée' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" 
                   class="w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-sm">
                {{ move.type === 'Entrée' ? '↓' : '↑' }}
              </div>
              <div class="flex-1">
                <p class="text-[11px] font-black text-slate-800 uppercase tracking-tight">{{ move.destination }}</p>
                <p class="text-[9px] text-slate-400 font-bold uppercase">{{ move.date }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs font-black text-slate-800">{{ (move.volume / 1000).toFixed(2) }}L</p>
                <p class="text-[9px] font-black text-blue-600 uppercase">{{ move.group }}</p>
              </div>
            </div>
          </div>
          <button class="w-full mt-8 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-blue-300 hover:text-blue-500 transition">
            Voir tout l'historique
          </button>
        </div>

      </div>
    </main>
    <FooterPersonnelComponent />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavbarPersonnelComponent from '@/components/NavbarPersonnelComponent.vue';
import FooterPersonnelComponent from '@/components/FooterPersonnelComponent.vue';
const bloodStocks = ref([]);
const movements = ref([]);
const chartData = ref([0, 0, 0, 0, 0, 0, 0]);
const joursLabels = ref([]);
const isLoading = ref(true); // État de chargement initialisé à true

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { 
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Accept': 'application/json'
  }
});

const generateJours = () => {
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const res = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    res.push(days[d.getDay()]);
  }
  joursLabels.value = res;
};

const fetchInventoryData = async () => {
  isLoading.value = true; // On s'assure qu'il est actif au début
  try {
    // Petit délai artificiel de 500ms pour éviter le flash si la connexion est trop rapide
    // Supprimer la ligne Promise si tu veux une vitesse maximale
    await new Promise(resolve => setTimeout(resolve, 800));

    const response = await api.get('/personnel/stocks');
    bloodStocks.value = response.data.stocks;
    movements.value = response.data.recent_moves;
    chartData.value = response.data.chart_data;
  } catch (error) {
    console.error("Erreur de chargement des stocks :", error);
  } finally {
    isLoading.value = false; // Arrêt du chargement quoi qu'il arrive
  }
};

const generatePDF = () => { window.print(); };

onMounted(() => {
  generateJours();
  fetchInventoryData();
});
</script>

<style scoped>
main { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>