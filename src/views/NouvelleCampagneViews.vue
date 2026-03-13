<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    
    <NavbarAdminComponent />

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div class="ml-12 lg:ml-0">
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Configuration</h2>
          <p class="text-[8px] lg:text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Lancer une nouvelle collecte</p>
        </div>
        <router-link to="/AdminCampagnes" class="text-[10px] lg:text-xs font-black uppercase text-slate-400 hover:text-red-600 transition tracking-widest">
          ✕ Annuler
        </router-link>
      </header>

      <div class="flex-1 overflow-y-auto p-6 lg:p-12">
        <form @submit.prevent="submitCampagne" class="max-w-5xl mx-auto space-y-10">
          
          <div class="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
            <div class="flex items-center gap-4 border-b border-slate-50 pb-6">
                <span class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px] font-black">01</span>
                <span class="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Informations de base</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div class="flex flex-col gap-2 group">
                <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4 group-focus-within:text-red-600 transition-colors">Titre du Projet</label>
                <input type="text" v-model="form.titre" placeholder="Ex: Collecte Campus Sud" class="input-field" required>
              </div>

              <div class="flex flex-col gap-2 group">
                <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4 group-focus-within:text-red-600 transition-colors">Lieu d'intervention</label>
                <input type="text" v-model="form.lieu" placeholder="Ex: Hall Principal" class="input-field" required>
              </div>

              <div class="flex flex-col gap-2 group">
                <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4 group-focus-within:text-red-600 transition-colors">Objectif (Poches)</label>
                <input type="number" v-model="form.objectif" placeholder="150" class="input-field" required>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4">Début</label>
                  <input type="date" v-model="form.date_debut" class="input-field text-[11px]" required>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4">Fin</label>
                  <input type="date" v-model="form.date_fin" class="input-field text-[11px]" required>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#111] p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[4rem] shadow-2xl text-white relative overflow-hidden">
            <div class="absolute -right-10 -top-10 text-[10rem] opacity-5 pointer-events-none italic font-black">PLAN</div>
            <div class="flex justify-between items-center mb-10 border-b border-white/5 pb-6 relative z-10">
                <div class="flex items-center gap-4">
                  <span class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">02</span>
                  <span class="text-[10px] lg:text-[11px] font-black text-red-500 uppercase tracking-widest italic">Planning de Récupération</span>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
              <div v-for="(day, index) in daysOfWeek" :key="index" 
                   class="p-6 rounded-[2rem] transition-all border group relative"
                   :class="day.active ? 'bg-white/5 border-red-600/50 shadow-xl' : 'bg-transparent border-white/5 opacity-30'">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xs font-black uppercase italic">{{ day.name }}</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="day.active" class="sr-only peer">
                    <div class="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:bg-red-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </div>
                <div v-if="day.active" class="space-y-3 animate-in">
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] font-black text-slate-500 uppercase italic">In</span>
                    <input type="time" v-model="day.start" class="bg-white/5 border-none rounded-lg p-2 text-[10px] font-bold text-white outline-none w-20">
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-[8px] font-black text-slate-500 uppercase italic">Out</span>
                    <input type="time" v-model="day.end" class="bg-white/5 border-none rounded-lg p-2 text-[10px] font-bold text-white outline-none w-20">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100 space-y-8">
            <div class="flex items-center gap-4 border-b border-slate-50 pb-6">
                <span class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px] font-black">2.5</span>
                <span class="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Ciblage & Alerte Mail Automatique</span>
            </div>
            
            <div class="grid grid-cols-4 lg:grid-cols-8 gap-3">
              <button 
                v-for="groupe in ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']" 
                :key="groupe"
                type="button"
                @click="toggleGroup(groupe)"
                :class="form.groupes_cibles.includes(groupe) 
                  ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100 scale-105' 
                  : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'"
                class="py-4 rounded-2xl text-[10px] font-black border-2 transition-all duration-300 italic"
              >
                {{ groupe }}
              </button>
            </div>
            <p class="text-[9px] font-bold text-slate-400 uppercase italic text-center">
              💡 Sélectionnez les groupes qui recevront une notification mail immédiate.
            </p>
          </div>

          <div class="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100 space-y-6">
            <div class="flex items-center gap-4 border-b border-slate-50 pb-6">
                <span class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-[10px] font-black">03</span>
                <span class="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Contenu du message</span>
            </div>
            
            <div class="flex flex-col gap-3 group">
              <label class="text-[9px] lg:text-[10px] font-black uppercase text-slate-400 ml-4 group-focus-within:text-red-600 transition-colors">Corps du message (Email & SMS)</label>
              <textarea v-model="form.message" placeholder="Décrivez l'importance de cette collecte..." 
                        class="bg-slate-50 border-none rounded-[2rem] p-6 lg:p-8 text-xs font-bold outline-none focus:ring-2 focus:ring-red-100 transition h-32 lg:h-40 resize-none italic"></textarea>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-6 pb-12">
            <button type="submit" :disabled="loading"
                    class="flex-[3] bg-red-600 text-white py-6 lg:py-7 rounded-2xl lg:rounded-[2.5rem] font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-red-200 hover:bg-[#111] transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50">
              <span v-if="!loading">🚀 Lancer la campagne</span>
              <span v-else class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-if="!loading" class="text-xl lg:text-2xl text-white/50">🩸</span>
            </button>
            <router-link to="/AdminCampagnes" class="flex-1 bg-white text-slate-400 py-6 lg:py-7 rounded-2xl lg:rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition">
              Annuler
            </router-link>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
// Utilisation de l'apiClient configuré globalement
import { apiClient } from '@/main'; 

const router = useRouter();
const loading = ref(false);

const form = reactive({
  titre: '',
  lieu: '',
  objectif: '',
  date_debut: '',
  date_fin: '',
  message: '',
  groupes_cibles: [], 
  planning: []
});

const daysOfWeek = ref([
  { name: 'Lundi', active: true, start: '08:00', end: '16:30' },
  { name: 'Mardi', active: true, start: '08:00', end: '16:30' },
  { name: 'Mercredi', active: true, start: '08:00', end: '16:30' },
  { name: 'Jeudi', active: true, start: '08:00', end: '16:30' },
  { name: 'Vendredi', active: true, start: '08:00', end: '16:30' },
  { name: 'Samedi', active: false, start: '09:00', end: '13:00' },
  { name: 'Dimanche', active: false, start: '00:00', end: '00:00' }
]);

const toggleGroup = (groupe) => {
  const index = form.groupes_cibles.indexOf(groupe);
  if (index > -1) {
    form.groupes_cibles.splice(index, 1);
  } else {
    form.groupes_cibles.push(groupe);
  }
};

const submitCampagne = async () => {
  loading.value = true;
  try {
    form.planning = daysOfWeek.value.filter(d => d.active);
    
    // Appel via apiClient vers Railway
    const response = await apiClient.post(`/campagnes`, form);

    if (response.status === 201 || response.status === 200) {
      Swal.fire({
        title: '<span class="italic font-black uppercase tracking-tighter">Mission Lancée</span>',
        text: 'La campagne est active et les donneurs ciblés ont été alertés.',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: '#fff',
        confirmButtonText: 'TERMINER'
      });
      router.push('/AdminCampagnes');
    }
  } catch (error) {
    console.error("Erreur Publication:", error);
    Swal.fire('Erreur', 'Impossible de publier la campagne. Vérifiez les données.', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply bg-slate-50 border-none rounded-2xl lg:rounded-[1.8rem] px-6 lg:px-8 py-4 lg:py-5 text-sm font-bold outline-none focus:ring-2 focus:ring-red-100 transition placeholder:text-slate-300 w-full italic;
}

.animate-in {
  animation: fadeInSlide 0.4s ease-out forwards;
}

@keyframes fadeInSlide {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>