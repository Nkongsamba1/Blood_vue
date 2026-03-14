<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-700">
    <NavbarPersonnelComponent />

    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-pulse">📊</span>
        </div>
      </div>
      <p class="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Analyse des données en cours...
      </p>
    </div>

    <div v-else class="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      <aside class="lg:col-span-3 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <nav class="space-y-3">
            <router-link v-for="(item, idx) in menuItems" :key="idx" :to="item.path" 
               class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all hover:bg-red-50 group"
               :class="{'bg-red-600 text-white font-bold shadow-lg shadow-red-200': $route.path === item.path}">
              <span class="text-xl" :class="{'text-white': $route.path === item.path, 'text-slate-400 group-hover:text-red-500': $route.path !== item.path}">
                {{ item.icon }}
              </span>
              <span class="text-[11px] uppercase tracking-widest">{{ item.label }}</span>
            </router-link>
          </nav>
        </div>

        <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border-b-8 border-red-600">
          <p class="text-[10px] font-black uppercase opacity-50 tracking-[0.2em]">Efficacité Globale</p>
          <h3 class="text-5xl font-black mt-3 italic tracking-tighter">
            {{ stats.taux_reussite }}<span class="text-xl text-red-500">%</span>
          </h3>
          <p class="text-[9px] mt-2 opacity-40 font-bold italic uppercase">Performance des prélèvements</p>
          <div class="absolute -right-6 -bottom-6 text-white/5 text-8xl font-black italic">RED</div>
        </div>
      </aside>

      <main class="lg:col-span-9 space-y-8">
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="stat-card border-l-4 border-slate-300">
            <div>
              <p class="stat-label text-slate-400">Total Historique</p>
              <h4 class="stat-value text-slate-900">{{ stats.total_historique }}</h4>
            </div>
            <div class="stat-icon bg-slate-50 text-slate-400">📊</div>
          </div>

          <div class="stat-card border-l-4 border-amber-500">
            <div>
              <p class="stat-label text-amber-500">En Attente</p>
              <h4 class="stat-value text-amber-600">{{ stats.en_attente }}</h4>
            </div>
            <div class="stat-icon bg-amber-50 text-amber-500 animate-pulse">⏳</div>
          </div>

          <div class="stat-card border-l-4 border-red-500">
            <div>
              <p class="stat-label text-red-500">Dons Effectués</p>
              <h4 class="stat-value text-red-600">{{ stats.termines }}</h4>
            </div>
            <div class="stat-icon bg-red-50 text-red-500">🩸</div>
          </div>

          <div class="stat-card border-l-4 border-slate-900">
            <div>
              <p class="stat-label text-slate-800">Dons Annulés</p>
              <h4 class="stat-value text-slate-900">{{ stats.annules }}</h4>
            </div>
            <div class="stat-icon bg-slate-100 text-slate-800">🚫</div>
          </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-slide-up">
            <h3 class="section-title italic mb-6 text-red-600">Courbe des activités</h3>
            <div class="h-[300px] relative">
              <canvas id="globalDonationChart"></canvas>
            </div>
          </section>

          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 animate-slide-up" style="animation-delay: 0.1s">
            <div class="flex justify-between items-center mb-6">
              <h3 class="section-title italic">Flux récents</h3>
              <button @click="loadDashboard" class="text-[9px] font-bold text-red-500 hover:text-red-700 uppercase transition-all">Synchroniser 🔄</button>
            </div>
            
            <div class="space-y-3">
              <div v-for="m in mouvements" :key="m.id" class="mouvement-item group">
                <div class="flex items-center gap-4">
                  <div class="group-tag group-hover:bg-red-600 group-hover:text-white transition-all">{{ m.group }}</div>
                  <div>
                    <p class="text-[10px] font-black uppercase text-slate-800 leading-none">{{ m.nom }}</p>
                    <p class="text-[9px] text-slate-400 font-bold mt-1 italic">{{ m.date }}</p>
                  </div>
                </div>
                <div class="text-xs font-black text-red-600">+{{ m.volume }} ml</div>
              </div>
              <div v-if="mouvements.length === 0" class="py-10 text-center text-slate-300 italic text-[10px] uppercase font-bold">Aucune donnée disponible</div>
            </div>
          </section>
        </div>
      </main>
    </div>
    <FooterPersonnelComponent />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import Chart from 'chart.js/auto';
import { apiClient } from '@/main'; 
import FooterPersonnelComponent from '@/components/FooterPersonnelComponent.vue';
import NavbarPersonnelComponent from '@/components/NavbarPersonnelComponent.vue';

const stats = ref({ total_historique: 0, en_attente: 0, termines: 0, annules: 0, taux_reussite: 0 });
const mouvements = ref([]);
const isLoading = ref(true);
let chartInstance = null;

const loadDashboard = async () => {
  try {
    const [resStats, resMouv, resChart] = await Promise.all([
      apiClient.get('/personnel/dashboard-stats'),
      apiClient.get('/personnel/mouvements'),
      apiClient.get('/personnel/chart-data')
    ]);
    
    stats.value = resStats.data;
    mouvements.value = resMouv.data;

    // 1. On coupe le chargement
    isLoading.value = false;

    // 2. On attend que Vue injecte le HTML du canvas dans la page
    await nextTick();

    // 3. PETITE SÉCURITÉ SUPPLÉMENTAIRE : 
    // On laisse 100ms au navigateur pour "voir" le canvas
    setTimeout(() => {
      if (resChart.data && resChart.data.labels && resChart.data.labels.length > 0) {
          initChart(resChart.data);
      } else {
          console.warn("Données reçues mais vides ou mal formées :", resChart.data);
      }
    }, 100);

  } catch (err) {
    console.error("Erreur critique Dashboard:", err);
    isLoading.value = false;
  }
};

const initChart = (data) => {
  const ctx = document.getElementById('globalDonationChart');
  
  if (!ctx) {
      console.error("ERREUR : Le canvas #globalDonationChart est introuvable dans le DOM !");
      return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  try {
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels, 
        datasets: [{
          label: 'Dons',
          data: data.counts, 
          borderColor: '#ef4444', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: '#ef4444'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { 
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 1 } 
          },
          x: { grid: { display: false } }
        }
      }
    });
    console.log("Graphique dessiné avec succès !");
  } catch (chartError) {
    console.error("Erreur lors de la création de Chart.js:", chartError);
  }
};

onMounted(() => {
    loadDashboard();
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});

const menuItems = [
  { label: 'Tableau de Bord', icon: '📊', path: '/PersonnelDashboard' },
  { label: 'File d\'attente', icon: '🩺', path: '/PersonnelPlanning' },
  { label: 'Stocks Sang', icon: '🧪', path: '/PersonnelStocks' },
  { label: 'Mon Profil', icon: '👤', path: '/PersonnelProfils' },
];
</script>

<style scoped>
.stat-card { @apply bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:shadow-lg; }
.stat-label { @apply text-[9px] font-black uppercase tracking-widest; }
.stat-value { @apply text-3xl font-black italic tracking-tighter; }
.stat-icon { @apply w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm; }
.section-title { @apply text-[11px] font-black uppercase tracking-[0.2em]; }
.mouvement-item { @apply flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-red-200; }
.group-tag { @apply w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-red-600 text-xs border border-slate-100; }

.animate-fade-in { animation: fadeIn 0.6s ease-out; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>