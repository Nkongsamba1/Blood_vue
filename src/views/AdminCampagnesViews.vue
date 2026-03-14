<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="w-24 h-24 border-4 border-slate-200 border-t-[#A62639] rounded-full animate-spin"></div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Synchronisation...</p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div>
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Campagnes</h2>
          <p class="text-[10px] font-bold text-[#A62639] uppercase tracking-widest mt-1">Planification des collectes</p>
        </div>
        <router-link to="/NouvelleCampagne" class="bg-[#A62639] text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:bg-slate-900 transition-all">
          + Nouvelle Collecte
        </router-link>
      </header>

      <main class="flex-1 p-6 lg:p-12">
        <div v-if="campagnes.length > 0" class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
          <div v-for="(campagne, index) in campagnes" :key="campagne.id" 
               class="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group relative overflow-hidden animate-slide-up"
               :style="{ animationDelay: (index * 0.05) + 's' }">
            
            <div class="absolute -right-4 -top-4 text-6xl opacity-[0.03]">🩸</div>

            <div class="flex justify-between items-start mb-6">
              <span class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tighter">📍 {{ campagne.lieu }}</span>
              <button @click="deleteCampagne(campagne.id)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-600">🗑️</button>
            </div>

            <h3 class="text-xl font-black text-slate-900 uppercase italic leading-tight mb-4">{{ campagne.titre }}</h3>
            
            <div class="flex items-center gap-2 mb-6 text-[10px] font-bold text-slate-400 uppercase italic">
              <span>Du {{ formatDate(campagne.date_debut) }}</span>
              <span>•</span>
              <span>Au {{ formatDate(campagne.date_fin) }}</span>
            </div>

            <div class="mb-8 space-y-3">
              <div class="flex justify-between text-[10px] font-black uppercase italic">
                <span class="text-slate-400">Poches collectées</span>
                <span :class="getProgressTextColor(campagne)">{{ calculateProgress(campagne) }}%</span>
              </div>
              <div class="h-3 bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div class="h-full rounded-full transition-all duration-1000" 
                     :class="getProgressBarColor(campagne)"
                     :style="{ width: calculateProgress(campagne) + '%' }"></div>
              </div>
            </div>

            <button @click="openEditModal(campagne)" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#A62639] transition-all">
              Modifier le Planning
            </button>
          </div>
        </div>

        <div v-else class="py-20 flex flex-col items-center justify-center text-center">
          <div class="text-6xl mb-4 opacity-20">📢</div>
          <p class="text-slate-400 font-black uppercase italic tracking-widest">Aucune campagne active</p>
        </div>
      </main>

      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-black uppercase italic mb-8 border-l-4 border-[#A62639] pl-4">Éditer le Planning</h2>
            
            <form @submit.prevent="updateCampagne" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="label-mini">Titre</label>
                  <input v-model="selectedCampagne.titre" class="custom-modal-input">
                </div>
                <div class="space-y-1">
                  <label class="label-mini">Lieu</label>
                  <input v-model="selectedCampagne.lieu" class="custom-modal-input">
                </div>
              </div>

              <div class="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div class="flex justify-between items-center mb-2">
                  <h4 class="text-[10px] font-black uppercase italic text-slate-500">Dates & Heures de passage</h4>
                  <button type="button" @click="addDateRow" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase">+ Ajouter une date</button>
                </div>

                <div v-for="(slots, date) in selectedCampagne.planning" :key="date" class="bg-white p-4 rounded-2xl shadow-sm space-y-3">
                  <div class="flex gap-4 items-center border-b border-slate-50 pb-2">
                    <input type="date" :value="date" @change="(e) => updateDateKey(date, e.target.value)" 
                           class="flex-1 text-[11px] font-black text-[#A62639] border-none outline-none">
                    <button type="button" @click="removeDateRow(date)" class="text-red-400 hover:text-red-600">✕</button>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    <div v-for="(time, tIndex) in slots" :key="tIndex" class="flex items-center bg-slate-100 rounded-lg px-2 py-1">
                      <span class="text-[9px] font-black text-slate-600">{{ time }}</span>
                      <button type="button" @click="removeTime(date, tIndex)" class="ml-2 text-red-500">✕</button>
                    </div>
                    <input type="time" @change="(e) => { addTime(date, e.target.value); e.target.value = '' }"
                           class="text-[9px] font-bold bg-slate-50 border border-dashed border-slate-300 rounded-lg p-1 w-20 outline-none">
                  </div>
                </div>
              </div>

              <div class="flex gap-4 pt-4">
                <button type="button" @click="showModal = false" class="flex-1 py-4 bg-slate-100 rounded-2xl font-black uppercase text-[9px]">Annuler</button>
                <button type="submit" class="flex-[2] py-4 bg-[#A62639] text-white rounded-2xl font-black uppercase text-[9px] shadow-xl hover:bg-slate-800 transition-all">Sauvegarder les modifications</button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
    <FooterAdminComponent />
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
const selectedCampagne = ref({ planning: {} });

const fetchCampagnes = async () => {
  try {
    const response = await apiClient.get('/campagnes');
    campagnes.value = response.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const calculateProgress = (c) => {
  if (!c.capacite_max) return 0;
  return Math.min(Math.round(((c.dons_count || 0) / c.capacite_max) * 100), 100);
};

const getProgressBarColor = (c) => calculateProgress(c) > 70 ? 'bg-[#A62639]' : 'bg-orange-500';
const getProgressTextColor = (c) => calculateProgress(c) > 70 ? 'text-[#A62639]' : 'text-orange-500';

// --- LOGIQUE DU PLANNING ---
const openEditModal = (c) => {
  selectedCampagne.value = JSON.parse(JSON.stringify(c)); // Deep copy
  if (!selectedCampagne.value.planning || Array.isArray(selectedCampagne.value.planning)) {
    selectedCampagne.value.planning = {};
  }
  showModal.value = true;
};

const addDateRow = () => {
  const today = new Date().toISOString().split('T')[0];
  if (!selectedCampagne.value.planning[today]) {
    selectedCampagne.value.planning[today] = [];
  }
};

const updateDateKey = (oldDate, newDate) => {
  if (oldDate === newDate || !newDate) return;
  selectedCampagne.value.planning[newDate] = [...selectedCampagne.value.planning[oldDate]];
  delete selectedCampagne.value.planning[oldDate];
};

const removeDateRow = (date) => delete selectedCampagne.value.planning[date];

const addTime = (date, time) => {
  if (!time) return;
  if (!selectedCampagne.value.planning[date].includes(time)) {
    selectedCampagne.value.planning[date].push(time);
    selectedCampagne.value.planning[date].sort();
  }
};

const removeTime = (date, index) => selectedCampagne.value.planning[date].splice(index, 1);

const updateCampagne = async () => {
  try {
    await apiClient.put(`/campagnes/${selectedCampagne.value.id}`, selectedCampagne.value);
    showModal.value = false;
    fetchCampagnes();
    Swal.fire({ title: 'Mis à jour !', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
  } catch (e) {
    Swal.fire('Erreur', 'Échec de la sauvegarde', 'error');
  }
};

const deleteCampagne = async (id) => {
  const res = await Swal.fire({ title: 'Supprimer ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#A62639' });
  if (res.isConfirmed) {
    await apiClient.delete(`/campagnes/${id}`);
    fetchCampagnes();
  }
};

onMounted(fetchCampagnes);
</script>

<style scoped>
.label-mini { @apply text-[9px] font-black uppercase text-slate-400 ml-4 italic; }
.custom-modal-input { @apply w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:ring-2 ring-[#A62639]/10 transition-all; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>