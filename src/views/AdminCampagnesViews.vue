<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-[#A62639] rounded-full animate-spin"></div>
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
          <p class="text-[10px] font-bold text-[#A62639] uppercase tracking-widest mt-1">Suivi des collectes de sang</p>
        </div>
        <router-link to="/NouvelleCampagne" class="bg-[#A62639] text-white px-6 lg:px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[9px] lg:text-[10px] shadow-xl hover:bg-slate-900 transition-all">
          + Nouvelle Collecte
        </router-link>
      </header>

      <main class="flex-1 p-6 lg:p-12">
        <div v-if="campagnes.length > 0" class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
          <div v-for="(campagne, index) in campagnes" :key="campagne.id" 
               class="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden animate-slide-up"
               :style="{ animationDelay: (index * 0.05) + 's' }">
            
            <div class="absolute -right-4 -top-4 text-6xl opacity-[0.03] group-hover:opacity-10 transition-opacity">🩸</div>

            <div class="flex justify-between items-start mb-6">
              <span class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tighter">📍 {{ campagne.lieu }}</span>
              <button @click="deleteCampagne(campagne.id)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-600 transition-all">🗑️</button>
            </div>

            <h3 class="text-xl font-black text-slate-900 uppercase italic leading-tight mb-6 min-h-[3rem]">{{ campagne.titre }}</h3>
            
            <div class="mb-8 space-y-3">
              <div class="flex justify-between text-[10px] font-black uppercase italic">
                <span class="text-slate-400">Objectif atteint</span>
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
                <span>{{ campagne.dons_count || 0 }} poches collectées</span>
                <span>Cible: {{ campagne.capacite_max }}</span>
              </div>
            </div>

            <button @click="openEditModal(campagne)" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#A62639] transition-all shadow-lg">
              Modifier les informations
            </button>
          </div>
        </div>

        <div v-else class="py-20 flex flex-col items-center justify-center text-center">
          <div class="text-6xl mb-4 opacity-20">📢</div>
          <p class="text-slate-400 font-black uppercase italic tracking-widest">Aucune campagne active pour le moment</p>
        </div>
      </main>

      <FooterAdminComponent />

      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative animate-slide-up">
            <h2 class="text-2xl font-black uppercase italic mb-8 border-l-4 border-[#A62639] pl-4">Éditer la Campagne</h2>
            <form @submit.prevent="updateCampagne" class="space-y-5">
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Titre de l'événement</label>
                <input v-model="selectedCampagne.titre" class="custom-modal-input" placeholder="Titre">
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Lieu de collecte</label>
                <input v-model="selectedCampagne.lieu" class="custom-modal-input" placeholder="Lieu">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Objectif (Poches)</label>
                  <input v-model="selectedCampagne.capacite_max" type="number" class="custom-modal-input">
                </div>
                <div class="space-y-1">
                  <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Date de clôture</label>
                  <input v-model="selectedCampagne.date_fin" type="date" class="custom-modal-input">
                </div>
              </div>
              <div class="flex gap-4 mt-8">
                <button type="button" @click="showModal = false" class="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-[9px] hover:bg-slate-200 transition-colors">Annuler</button>
                <button type="submit" class="flex-[2] py-4 bg-[#A62639] text-white rounded-2xl font-black uppercase text-[9px] shadow-xl shadow-red-100 hover:bg-slate-900 transition-all">Mettre à jour</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '@/main';
import Swal from 'sweetalert2';
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';

const campagnes = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedCampagne = ref(null);

const fetchCampagnes = async () => {
  try {
    const response = await apiClient.get('/campagnes');
    campagnes.value = response.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des campagnes", error);
  } finally {
    setTimeout(() => { loading.value = false; }, 600);
  }
};

const calculateProgress = (c) => {
  if (!c.capacite_max) return 0;
  const p = Math.round(((c.dons_count || 0) / c.capacite_max) * 100);
  return Math.min(p, 100);
};

const getProgressBarColor = (c) => {
  const p = calculateProgress(c);
  if (p < 30) return 'bg-slate-300';
  if (p < 70) return 'bg-orange-500';
  return 'bg-[#A62639] shadow-[0_0_10px_rgba(166,38,57,0.3)]';
};

const getProgressTextColor = (c) => {
  const p = calculateProgress(c);
  if (p < 30) return 'text-slate-400';
  if (p < 70) return 'text-orange-500';
  return 'text-[#A62639]';
};

const openEditModal = (c) => {
  selectedCampagne.value = { ...c };
  showModal.value = true;
};

const updateCampagne = async () => {
  try {
    await apiClient.put(`/campagnes/${selectedCampagne.value.id}`, selectedCampagne.value);
    showModal.value = false;
    fetchCampagnes();
    Swal.fire({ 
      title: 'Campagne actualisée', 
      icon: 'success', 
      background: '#1e293b', 
      color: '#fff',
      toast: true, 
      position: 'top-end', 
      showConfirmButton: false, 
      timer: 2500 
    });
  } catch (error) {
    Swal.fire({ title: 'Erreur', icon: 'error', text: 'Modification impossible' });
  }
};

const deleteCampagne = async (id) => {
  const res = await Swal.fire({ 
    title: 'Supprimer la campagne ?', 
    text: "Les données liées à cette collecte seront archivées.",
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonColor: '#A62639', 
    cancelButtonColor: '#1e293b',
    confirmButtonText: 'Confirmer',
    cancelButtonText: 'Annuler'
  });
  
  if (res.isConfirmed) {
    try {
      await apiClient.delete(`/campagnes/${id}`);
      fetchCampagnes();
      Swal.fire({ title: 'Supprimé', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire('Erreur', 'Impossible de supprimer cette campagne.', 'error');
    }
  }
};

onMounted(fetchCampagnes);
</script>

<style scoped>
.custom-modal-input {
  width: 100%;
  background-color: #f1f5f9; /* bg-slate-50 */
  border: none;
  border-radius: 1rem; /* rounded-2xl */
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem;
  padding-top: 1rem; /* py-4 */
  padding-bottom: 1rem;
  font-size: 0.875rem; /* text-sm */
  font-weight: 700; /* font-bold */
  font-style: italic;
  outline: none;
  transition: all 0.2s ease;
}

.custom-modal-input:focus {
  box-shadow: 0 0 0 4px rgba(166,38,57,0.08); /* focus:ring-2 ring-[#A62639] */
}


.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in { animation: fadeIn 0.5s ease-out both; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>