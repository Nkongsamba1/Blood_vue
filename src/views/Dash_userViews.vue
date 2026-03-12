<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <NavbarUserComponent />

    <main class="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      </div>

      <template v-else>
        <header class="bg-gradient-to-br from-red-800 to-red-600 rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
          
          <div class="relative shrink-0 group" @click="triggerUpload">
            <div class="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white/20 p-1 transition-all group-hover:scale-105 cursor-pointer bg-white overflow-hidden shadow-lg">
                <img v-if="utilisateur.photo" :src="utilisateur.photo" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-red-700 text-4xl font-black italic">
                  {{ utilisateur.groupe_sanguin }}
                </div>
            </div>
            <input type="file" ref="fileInput" class="hidden" @change="handlePhotoUpload" accept="image/*" />
          </div>
          
          <div class="flex-1 z-10 text-center md:text-left">
            <p class="text-red-100 text-2xl font-black uppercase tracking-[0.3em] mb-1">
               {{ messageBienvenue }}
            </p>
            <h1 class="text-xl md:text-4xl font-black uppercase tracking-tighter mb-1">
            
            </h1>
            <p class="text-red-200 text-xs italic mb-4 opacity-80">Votre sang sauve des vies.</p>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
               <div class="bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black border border-white/10 uppercase italic">
                 🩸Groupe {{ utilisateur.groupe_sanguin }}
               </div>
               <div v-if="utilisateur.delai > 0" class="bg-black/20 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 italic uppercase text-red-200">
                 Vous pourrez faire un prochain don dans : {{ utilisateur.delai }}j 
               </div>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 text-white/5 text-[12rem] font-black select-none pointer-events-none italic">LIFE</div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col h-[350px]">
            <p class="text-[10px] font-black uppercase mb-4 tracking-widest text-gray-400">Historique des dons</p>
            <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div v-for="don in historique" :key="don.id" class="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black">{{ formatDate(don.date_don) }}</p>
                  <p class="text-[8px] font-bold text-gray-400 italic">📍 {{ don.lieu || 'St-Raphaël' }}</p>
                </div>
                <span :class="statutColor(don.statut)" class="text-[7px] px-2 py-1 rounded-full font-black uppercase">
                  {{ don.statut }}
                </span>
              </div>
              <p v-if="historique.length === 0" class="text-center py-10 text-[10px] italic opacity-50 text-gray-400 uppercase font-black">Aucun don</p>
            </div>
          </div>

          <div class="bg-amber-400 p-8 rounded-[2rem] shadow-sm text-amber-950 flex flex-col justify-center text-center">
            <div class="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl">💡</div>
            <p class="text-[10px] font-black uppercase mb-2 tracking-widest opacity-60 italic text-amber-800">Conseil Santé</p>
            <p class="text-sm font-black italic leading-snug">"{{ astuceDuJour }}"</p>
          </div>

          <div class="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white flex flex-col h-[350px]">
            <p class="text-[10px] font-black uppercase mb-4 tracking-widest text-red-500">Campagnes Actives</p>
            <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div v-for="camp in campagnes" :key="camp.id" class="p-4 rounded-2xl bg-white/5 border border-white/5 border-l-2 border-l-red-600">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-black text-[10px] uppercase text-red-50">{{ camp.titre }}</h4>
                  <span class="text-[7px] text-red-500 font-black animate-pulse">{{ camp.jours_restants }}j restants</span>
                </div>
                <p class="text-[8px] font-bold text-slate-500 uppercase italic">📍 {{ camp.lieu }}</p>
              </div>
              <p v-if="campagnes.length === 0" class="text-center py-10 text-[10px] italic opacity-40 uppercase font-black">Aucune campagne</p>
            </div>
          </div>

        </div>
      </template>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import NavbarUserComponent from '../components/NavbarUserComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

const loading = ref(true)
const fileInput = ref(null)
const utilisateur = ref({ nom_complet: '', groupe_sanguin: '?', delai: 0, photo: null })
const historique = ref([])
const campagnes = ref([])

const astuces = [
  "Buvez beaucoup d'eau avant votre don.",
  "Un don peut sauver 3 vies, merci !",
  "Mangez léger avant de venir nous voir.",
  "Reposez-vous 15 min après votre don.",
  "Le fer aide à régénérer votre sang."
]
const astuceDuJour = ref(astuces[Math.floor(Math.random() * astuces.length)])

const messageBienvenue = computed(() => {
  const h = new Date().getHours()
  return `${(h >= 5 && h < 18) ? "Bonjour" : "Bonsoir"}, ${utilisateur.value.nom_complet.split(' ')[0] || 'Donneur'} !`
})

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/donneur/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    utilisateur.value = response.data
    historique.value = response.data.historique
    campagnes.value = response.data.campagnes
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const statutColor = (s) => {
  if (s === 'Validé') return 'bg-green-500/10 text-green-500'
  if (s === 'Annulé') return 'bg-red-500/10 text-red-500'
  return 'bg-amber-500/10 text-amber-500'
}

const triggerUpload = () => fileInput.value.click()

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  const fd = new FormData(); fd.append('photo', file)
  try {
    const res = await axios.post('${process.env.VUE_APP_API_URL}/api/donneur/update-photo', fd, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
    })
    utilisateur.value.photo = res.data.url
    Swal.fire({ icon: 'success', title: 'Profil mis à jour', showConfirmButton: false, timer: 1000 })
  } catch { Swal.fire('Erreur', 'Upload échoué', 'error') }
}

const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()
onMounted(fetchDashboardData)
</script>

<style scoped>
/* Scrollbar stylisée */
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.slate-900 .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>