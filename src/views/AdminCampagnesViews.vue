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
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Campagnes</h2>
          <p class="text-[10px] font-bold text-[#A62639] uppercase tracking-widest mt-1">Planification des collectes</p>
        </div>
        <router-link to="/NouvelleCampagne" class="bg-[#A62639] text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:bg-slate-900 transition-all transform active:scale-95">
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
              <span class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-tighter italic">📍 {{ campagne.lieu }}</span>
              <button @click="deleteCampagne(campagne.id)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-600 transition-colors">
                🗑️
              </button>
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

            <button @click="openEditModal(campagne)" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-[9px] tracking-widest hover:bg-[#A62639] transition-all shadow-lg">
              Modifier la Campagne
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
          <div class="bg-white w-full max-w-2xl rounded-[3.5rem] p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-black uppercase italic mb-8 border-l-4 border-[#A62639] pl-4">Éditer la Campagne</h2>
            
            <form @submit.prevent="updateCampagne" class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="label-mini">Titre</label>
                  <input v-model="selectedCampagne.titre" class="custom-modal-input" required>
                </div>
                <div class="space-y-1">
                  <label class="label-mini">Lieu</label>
                  <input v-model="selectedCampagne.lieu" class="custom-modal-input" required>
                </div>
              </div>

              <div class="space-y-4 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-[10px] font-black uppercase italic text-slate-500">Planning & Créneaux</h4>
                  <button type="button" @click="addDateRow" class="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 transition-colors">+ Ajouter Date</button>
                </div>

                <div v-if="Object.keys(selectedCampagne.planning).length === 0" class="text-center py-6 text-[9px] text-slate-400 uppercase font-bold italic">
                  Aucun créneau défini.
                </div>

                <div v-for="(slots, date) in selectedCampagne.planning" :key="date" class="bg-white p-5 rounded-3xl shadow-sm space-y-4 border border-slate-100">
                  <div class="flex gap-4 items-center border-b border-slate-50 pb-3">
                    <input type="date" :value="date" @change="(e) => updateDateKey(date, e.target.value)" 
                           class="flex-1 text-[11px] font-black text-[#A62639] border-none outline-none bg-transparent">
                    <button type="button" @click="removeDateRow(date)" class="text-slate-300 hover:text-red-600 transition-colors">✕</button>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    <div v-for="(time, tIndex) in slots" :key="tIndex" class="flex items-center bg-red-50 text-red-700 rounded-xl px-3 py-1.5 border border-red-100">
                      <span class="text-[9px] font-black italic">{{ time }}</span>
                      <button type="button" @click="removeTime(date, tIndex)" class="ml-2 text-[10px] hover:text-red-900">✕</button>
                    </div>
                    <div class="flex items-center">
                      <input type="time" @change="(e) => { addTime(date, e.target.value); e.target.value = '' }"
                             class="text-[9px] font-bold bg-white border border-dashed border-slate-300 rounded-xl px-3 py-1.5 w-24 outline-none focus:border-[#A62639]">
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex gap-4 pt-4">
                <button type="button" @click="showModal = false" class="flex-1 py-5 bg-slate-100 rounded-2xl font-black uppercase text-[9px] hover:bg-slate-200 transition-colors">Annuler</button>
                <button type="submit" class="flex-[2] py-5 bg-[#A62639] text-white rounded-2xl font-black uppercase text-[9px] shadow-xl hover:bg-slate-800 transition-all">Sauvegarder les modifications</button>
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
  loading.value = true;
  try {
    const response = await apiClient.get('/campagnes');
    // Important: Désérialiser le JSON du planning pour chaque campagne
    campagnes.value = (response.data || []).map(c => ({
      ...c,
      planning: typeof c.planning === 'string' ? JSON.parse(c.planning) : (c.planning || {})
    }));
  } catch (error) {
    console.error("Erreur fetch:", error);
    Swal.fire('Erreur', 'Impossible de charger les campagnes', 'error');
  } finally {
    loading.value = false;
  }
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '...';

const calculateProgress = (c) => {
  const objectif = parseInt(c.objectif) || 1;
  const dons = parseInt(c.dons_count) || 0;
  return Math.min(Math.round((dons / objectif) * 100), 100);
};

const getProgressBarColor = (c) => calculateProgress(c) > 70 ? 'bg-green-500' : 'bg-orange-500';
const getProgressTextColor = (c) => calculateProgress(c) > 70 ? 'text-green-600' : 'text-orange-500';

// --- LOGIQUE DU PLANNING ---
const openEditModal = (c) => {
  // Deep copy pour éviter de modifier la liste en direct
  selectedCampagne.value = JSON.parse(JSON.stringify(c));
  showModal.value = true;
};

const addDateRow = () => {
  const nextDate = new Date().toISOString().split('T')[0];
  if (!selectedCampagne.value.planning[nextDate]) {
    selectedCampagne.value.planning[nextDate] = [];
  }
};

const updateDateKey = (oldDate, newDate) => {
  if (oldDate === newDate || !newDate) return;
  // Déplacer les créneaux vers la nouvelle clé de date
  selectedCampagne.value.planning[newDate] = [...(selectedCampagne.value.planning[oldDate] || [])];
  delete selectedCampagne.value.planning[oldDate];
};

const removeDateRow = (date) => {
  delete selectedCampagne.value.planning[date];
};

const addTime = (date, time) => {
  if (!time) return;
  if (!selectedCampagne.value.planning[date].includes(time)) {
    selectedCampagne.value.planning[date].push(time);
    selectedCampagne.value.planning[date].sort();
  }
};

const removeTime = (date, index) => {
  selectedCampagne.value.planning[date].splice(index, 1);
};

const updateCampagne = async () => {
  try {
    // Préparation du payload : le planning doit redevenir une string JSON
    const payload = {
      ...selectedCampagne.value,
      planning: JSON.stringify(selectedCampagne.value.planning)
    };

    await apiClient.put(`/campagnes/${selectedCampagne.value.id}`, payload);
    
    showModal.value = false;
    await fetchCampagnes();
    
    Swal.fire({
      title: 'Campagne mise à jour',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } catch (e) {
    console.error("Erreur update:", e);
    Swal.fire('Erreur', 'Échec de la sauvegarde', 'error');
  }
};

const deleteCampagne = async (id) => {
  const res = await Swal.fire({
    title: 'Supprimer cette campagne ?',
    text: "Toutes les réservations associées seront impactées.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#A62639',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'OUI, SUPPRIMER',
    cancelButtonText: 'ANNULER'
  });

  if (res.isConfirmed) {
    try {
      await apiClient.delete(`/campagnes/${id}`);
      fetchCampagnes();
      Swal.fire('Supprimé', 'La campagne a été retirée.', 'success');
    } catch (e) {
      Swal.fire('Erreur', 'Suppression impossible.', 'error');
    }
  }
};

onMounted(fetchCampagnes);
</script>

<style scoped>
.label-mini { @apply text-[9px] font-black uppercase text-slate-400 ml-4 italic; }
.custom-modal-input { @apply w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold italic outline-none focus:ring-2 ring-[#A62639]/10 transition-all; }

.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.animate-slide-up { animation: slideUp 0.5s ease-out backwards; }
@keyframes slideUp { 
  from { opacity: 0; transform: translateY(20px); } 
  to { opacity: 1; transform: translateY(0); } 
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>