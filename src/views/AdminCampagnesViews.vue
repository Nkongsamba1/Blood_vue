<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-bounce">📢</span>
        </div>
      </div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Chargement des campagnes...
      </p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div>
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Campagnes</h2>
          <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Suivi des collectes de sang</p>
        </div>
        <router-link to="/NouvelleCampagne" class="bg-red-600 text-white px-6 lg:px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[9px] lg:text-[10px] shadow-xl hover:bg-black transition-all">
          + Nouvelle Collecte
        </router-link>
      </header>

      <main class="flex-1 p-6 lg:p-12">
        <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
          <div v-for="(campagne, index) in campagnes" :key="campagne.id" 
               class="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden animate-slide-up"
               :style="{ animationDelay: (index * 0.1) + 's' }">
            
            <div class="absolute -right-4 -top-4 text-6xl opacity-[0.03] group-hover:opacity-10 transition-opacity">🩸</div>

            <div class="flex justify-between items-start mb-6">
              <span class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tighter">📍 {{ campagne.lieu }}</span>
              <button @click="deleteCampagne(campagne.id)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all">🗑️</button>
            </div>

            <h3 class="text-xl font-black text-slate-900 uppercase italic leading-tight mb-6 min-h-[3rem]">{{ campagne.titre }}</h3>
            
            <div class="mb-8 space-y-3">
              <div class="flex justify-between text-[10px] font-black uppercase italic">
                <span class="text-slate-400">Taux de remplissage</span>
                <span :class="getProgressTextColor(campagne)">{{ calculateProgress(campagne) }}%</span>
              </div>
              <div class="h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                <div 
                  class="h-full rounded-full transition-all duration-1000 ease-out" 
                  :class="getProgressBarColor(campagne)"
                  :style="{ width: calculateProgress(campagne) + '%' }"
                ></div>
              </div>
              <div class="flex justify-between text-[9px] font-bold text-slate-400 italic">
                <span>{{ campagne.dons_count || 0 }} poches</span>
                <span>Objectif: {{ campagne.capacite_max }}</span>
              </div>
            </div>

            <button @click="openEditModal(campagne)" class="w-full py-4 bg-[#111] text-white rounded-2xl font-black uppercase italic text-[9px] tracking-widest hover:bg-red-600 transition-all shadow-lg">
              Modifier les informations
            </button>
          </div>
        </div>

        <div v-if="campagnes.length === 0" class="py-20 text-center">
          <p class="text-slate-400 font-black uppercase italic tracking-widest">Aucune campagne en cours</p>
        </div>
      </main>

      <FooterAdminComponent />

      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative">
            <h2 class="text-2xl font-black uppercase italic mb-8 border-l-4 border-red-600 pl-4">Modifier la Campagne</h2>
            <form @submit.prevent="updateCampagne" class="space-y-5">
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Titre de la collecte</label>
                <input v-model="selectedCampagne.titre" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold italic focus:ring-2 ring-red-500 transition-all">
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Lieu</label>
                <input v-model="selectedCampagne.lieu" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold italic">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Objectif (Poches)</label>
                  <input v-model="selectedCampagne.capacite_max" type="number" class="bg-slate-50 border-none rounded-2xl w-full px-6 py-4 text-sm font-bold italic">
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Date de fin</label>
                  <input v-model="selectedCampagne.date_fin" type="date" class="bg-slate-50 border-none rounded-2xl w-full px-6 py-4 text-sm font-bold">
                </div>
              </div>
              <div class="flex gap-4 mt-8">
                <button type="button" @click="showModal = false" class="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-[9px] hover:bg-slate-200 transition-colors">Annuler</button>
                <button type="submit" class="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[9px] shadow-xl shadow-red-200 hover:bg-black transition-all">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const campagnes = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedCampagne = ref(null);

const fetchCampagnes = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/campagnes`);
    campagnes.value = response.data;
  } catch (error) {
    console.error("Erreur", error);
  } finally {
    // Petit délai pour la fluidité
    setTimeout(() => { loading.value = false; }, 800);
  }
};

const calculateProgress = (c) => {
  const p = Math.round(((c.dons_count || 0) / (c.capacite_max || 1)) * 100);
  return Math.min(p, 100);
};

const getProgressBarColor = (c) => {
  const p = calculateProgress(c);
  if (p < 30) return 'bg-slate-300';
  if (p < 70) return 'bg-orange-500';
  return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]';
};

const getProgressTextColor = (c) => {
  const p = calculateProgress(c);
  if (p < 30) return 'text-slate-400';
  if (p < 70) return 'text-orange-500';
  return 'text-red-600';
};

const openEditModal = (c) => {
  selectedCampagne.value = { ...c };
  showModal.value = true;
};

const updateCampagne = async () => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/campagnes/${selectedCampagne.value.id}`, selectedCampagne.value);
    showModal.value = false;
    fetchCampagnes();
    Swal.fire({ title: 'Mis à jour !', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
  } catch (error) {
    Swal.fire({ title: 'Erreur', icon: 'error', text: 'Impossible de modifier' });
  }
};

const deleteCampagne = async (id) => {
  const res = await Swal.fire({ 
    title: 'Supprimer ?', 
    text: "Cette action est irréversible",
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonColor: '#dc2626', 
    cancelButtonColor: '#111',
    confirmButtonText: 'Oui, supprimer' 
  });
  if (res.isConfirmed) {
    await axios.delete(`http://127.0.0.1:8000/api/campagnes/${id}`);
    fetchCampagnes();
  }
};

onMounted(fetchCampagnes);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in {
  animation: fadeIn 0.5s ease-out both;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>