<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-700">
    <NavbarPersonnelComponent />

    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-bounce">🩺</span>
        </div>
      </div>
      <p class="mt-6 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Préparation de la file d'attente...
      </p>
    </div>

    <div v-else class="max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      
      <aside class="lg:col-span-3 space-y-6">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <nav class="space-y-3">
            <router-link v-for="(item, idx) in menuItems" :key="idx" :to="item.path" 
               class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all hover:bg-red-50 group"
               :class="{'bg-red-600 text-white font-bold shadow-lg shadow-red-200': $route.path === item.path}">
              <span class="text-xl">{{ item.icon }}</span>
              <span class="text-[11px] uppercase tracking-widest">{{ item.label }}</span>
            </router-link>
          </nav>
        </div>

        <div class="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <p class="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">En attente d'examen</p>
          <h3 class="text-6xl font-black mt-3 italic tracking-tighter">{{ totalAttente }}</h3>
          <div class="absolute -right-6 -bottom-6 text-white/10 text-8xl font-black italic">WAIT</div>
        </div>
      </aside>

      <main class="lg:col-span-9 space-y-8">
        
        <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-8">
            <div>
              <h2 class="text-2xl font-black text-slate-900 uppercase italic leading-none">File d'attente</h2>
              <p class="text-[9px] font-black text-red-500 uppercase mt-2 tracking-widest">Aujourd'hui, {{ dateActuelle }}</p>
            </div>
            <button @click="fetchFileAttente" class="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-2xl transition-all border border-slate-100">
              🔄
            </button>
          </div>

          <div v-if="fileAttente.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="don in fileAttente" :key="don.id" 
                 @click="selectionnerDonneur(don)"
                 :class="selectedDon?.id === don.id ? 'border-red-500 bg-red-50/30' : 'border-slate-100 hover:border-red-200'"
                 class="p-5 border-2 rounded-[2rem] transition-all cursor-pointer bg-white flex justify-between items-center group">
              <div class="flex items-center gap-4">
                <div :class="don.statut === 'Apte' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-slate-900 shadow-slate-200'" class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black shadow-lg text-xs">
                  {{ don.donneur.groupe_sanguin }}
                </div>
                <div>
                  <h4 class="font-black text-slate-900 uppercase text-[10px] leading-tight">{{ don.donneur.user.nom_complet }}</h4>
                  <p class="text-[9px] font-bold text-slate-400 uppercase mt-1">🕒 {{ don.heure_rdv }}</p>
                </div>
              </div>
              <span v-if="don.statut === 'Apte'" class="text-emerald-500 text-[10px] font-black italic animate-pulse">✓ APTE</span>
            </div>
          </div>
          <div v-else class="text-center py-16 border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 text-[10px] font-black uppercase tracking-widest">
              Aucun rendez-vous pour aujourd'hui
          </div>
        </section>

        <div v-if="selectedDon" class="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-slide-up">
          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 class="text-xs font-black uppercase italic mb-8 flex items-center gap-3 text-slate-400">
              <span class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-sm">✓</span>
              Évaluation Médicale
            </h3>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Tension</label>
                  <input v-model="formAptitude.tension" type="text" placeholder="12/8" class="input-styled" />
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Poids (kg)</label>
                  <input v-model="formAptitude.poids" type="number" class="input-styled" />
                </div>
              </div>
              <div class="flex gap-3">
                <button @click="validerExamen(true)" class="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition shadow-lg shadow-emerald-100">
                  Valider l'Aptitude
                </button>
                <button @click="validerExamen(false)" class="bg-slate-100 text-slate-400 px-6 rounded-2xl font-black text-[10px] uppercase hover:bg-red-50 hover:text-red-500 transition">
                  Inapte
                </button>
              </div>
            </div>
          </section>

          <section class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all" 
                   :class="{'opacity-25 pointer-events-none grayscale': selectedDon.statut !== 'Apte'}">
            <h3 class="text-xs font-black uppercase italic mb-8 flex items-center gap-3 text-red-600">
              <span class="w-8 h-8 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-sm">🩸</span>
              Prélèvement
            </h3>
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[9px] font-black text-slate-400 uppercase ml-2">ID Poche Unique</label>
                <input v-model="formPrelevement.num_poche" type="text" placeholder="EX: P-2026-001" class="input-styled focus:border-red-500" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Volume (ml)</label>
                  <input v-model="formPrelevement.quantite" type="number" class="input-styled" />
                </div>
                <div class="space-y-2">
                  <label class="text-[9px] font-black text-slate-400 uppercase ml-2">Heure</label>
                  <input v-model="formPrelevement.heure_debut" type="time" class="input-styled" />
                </div>
              </div>
              <button @click="finaliserDon" class="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition shadow-2xl">
                Finaliser et Stocker
              </button>
            </div>
          </section>
        </div>

        <div v-else class="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sélectionnez un patient pour commencer</p>
        </div>
      </main>
    </div>
    <FooterPersonnelComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import FooterPersonnelComponent from '@/components/FooterPersonnelComponent.vue';
import NavbarPersonnelComponent from '@/components/NavbarPersonnelComponent.vue';

const fileAttente = ref([]);
const totalAttente = ref(0);
const selectedDon = ref(null);
const isLoading = ref(true);
const dateActuelle = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const formAptitude = ref({ tension: '', poids: '', est_apte: true });
const formPrelevement = ref({ num_poche: '', quantite: 450, heure_debut: '' });

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const fetchFileAttente = async () => {
  // On ne montre le gros loader qu'au premier chargement
  try {
    const response = await api.get('/personnel/file-attente');
    fileAttente.value = response.data.liste;
    totalAttente.value = response.data.total_attente;
  } catch (error) {
    console.error("Erreur API");
  } finally {
    isLoading.value = false;
  }
};

const selectionnerDonneur = (don) => {
  selectedDon.value = don;
  formAptitude.value.tension = don.tension_arterielle || '';
  formAptitude.value.poids = don.poids_donneur || '';
  const now = new Date();
  formPrelevement.value.heure_debut = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
};

const validerExamen = async (apte) => {
  try {
    await api.post(`/personnel/valider-aptitude/${selectedDon.value.id}`, { ...formAptitude.value, est_apte: apte });
    Swal.fire({ icon: 'success', title: apte ? 'Apte' : 'Inapte', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    await fetchFileAttente();
    if (!apte) selectedDon.value = null;
    else selectedDon.value.statut = 'Apte';
  } catch {
    Swal.fire('Erreur', 'Données invalides', 'error');
  }
};

const finaliserDon = async () => {
  try {
    await api.post(`/personnel/finaliser-prelevement/${selectedDon.value.id}`, formPrelevement.value);
    Swal.fire({ icon: 'success', title: 'Poche enregistrée', confirmButtonColor: '#ef4444' });
    selectedDon.value = null;
    fetchFileAttente();
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || 'Erreur lors du stockage', 'error');
  }
};

onMounted(() => {
  setTimeout(() => fetchFileAttente(), 600); // Petit délai pour l'effet visuel
});

const menuItems = [
  { label: 'Tableau de Bord', icon: '📊', path: '/PersonnelDashboard' },
  { label: 'File d\'attente', icon: '🩺', path: '/PersonnelPlanning' },
  { label: 'Stocks Sang', icon: '🧪', path: '/PersonnelStocks' },
  { label: 'Mon Profil', icon: '👤', path: '/PersonnelProfils' },
];
</script>

<style scoped>
.input-styled {
  @apply w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 focus:bg-white transition-all outline-none font-bold text-sm;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>