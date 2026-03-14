<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900">
    <NavbarUserComponent />

    <main class="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-10 h-10 border-4 border-[#A62639] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Chargement de votre espace...</p>
      </div>

      <template v-else>
        <header class="bg-gradient-to-br from-red-800 to-[#A62639] rounded-[2.5rem] p-6 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
          
          <div class="relative shrink-0 group" @click="triggerUpload">
            <div class="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-white/20 p-1 transition-all group-hover:scale-105 cursor-pointer bg-white overflow-hidden shadow-lg flex items-center justify-center">
                <img v-if="utilisateur.photo" :src="utilisateur.photo" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-[#A62639] text-4xl font-black italic">
                  {{ utilisateur.groupe_sanguin }}
                </div>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <span class="text-[10px] font-bold uppercase">Modifier</span>
                </div>
            </div>
            <input type="file" ref="fileInput" class="hidden" @change="handlePhotoUpload" accept="image/*" />
          </div>
          
          <div class="flex-1 z-10 text-center md:text-left">
            <p class="text-red-100 text-2xl font-black uppercase tracking-[0.3em] mb-1">
               {{ messageBienvenue }}
            </p>
            <p class="text-red-200 text-xs italic mb-4 opacity-80">Votre sang sauve des vies au quotidien.</p>
            
            <div class="flex flex-wrap justify-center md:justify-start gap-3">
               <div class="bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black border border-white/10 uppercase italic">
                 🩸 Groupe {{ utilisateur.groupe_sanguin }}
               </div>
               <div v-if="utilisateur.delai > 0" class="bg-black/20 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 italic uppercase text-red-200">
                 Prochain don possible dans : {{ utilisateur.delai }} jours 
               </div>
               <div v-else class="bg-green-500/30 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 italic uppercase text-white">
                 ✅ Éligible pour un don aujourd'hui
               </div>
            </div>
          </div>
          <div class="absolute -right-10 -bottom-10 text-white/5 text-[12rem] font-black select-none pointer-events-none italic">LIFE</div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col min-h-[220px] md:h-[380px]">
            <p class="text-[10px] font-black uppercase mb-4 tracking-widest text-gray-400">Mon Historique</p>
            <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div v-for="don in historique" :key="don.id" class="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center transition-all hover:translate-x-1">
                <div>
                  <p class="text-[10px] font-black">{{ formatDate(don.date_don) }}</p>
                  <p class="text-[8px] font-bold text-gray-400 italic uppercase">📍 {{ don.lieu || 'Centre Mobile' }}</p>
                </div>
                <span :class="statutColor(don.statut)" class="text-[7px] px-2 py-1 rounded-full font-black uppercase tracking-tighter border">
                  {{ don.statut }}
                </span>
              </div>
              <div v-if="historique.length === 0" class="flex flex-col items-center justify-center h-full opacity-50">
                <p class="text-[10px] italic uppercase font-black text-gray-400">Aucun don enregistré</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-400 p-6 md:p-8 rounded-[2rem] shadow-sm text-amber-950 flex flex-col justify-center text-center relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">💡</div>
            <p class="text-[10px] font-black uppercase mb-2 tracking-widest opacity-60 italic text-amber-800">Conseil du Jour</p>
            <p class="text-lg font-black italic leading-snug relative z-10">"{{ astuceDuJour }}"</p>
          </div>

          <div class="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white flex flex-col min-h-[220px] md:h-[380px]">
            <p class="text-[10px] font-black uppercase mb-4 tracking-widest text-red-500">Campagnes Actives</p>
            <div class="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div v-for="camp in campagnes" :key="camp.id" class="p-4 rounded-2xl bg-white/5 border border-white/5 border-l-2 border-l-red-600 hover:bg-white/10 transition-all cursor-pointer">
                <div class="flex justify-between items-start mb-1">
                  <h4 class="font-black text-[10px] uppercase text-red-50">{{ camp.titre }}</h4>
                  <span class="text-[7px] text-red-500 font-black animate-pulse uppercase">{{ camp.jours_restants }}j restants</span>
                </div>
                <p class="text-[8px] font-bold text-slate-500 uppercase italic">📍 {{ camp.lieu }}</p>
              </div>
              <div v-if="campagnes.length === 0" class="flex flex-col items-center justify-center h-full opacity-40">
                <p class="text-[10px] italic uppercase font-black">Aucun événement proche</p>
              </div>
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
import { useRouter } from 'vue-router'
import { apiClient } from '@/main' // Instance optimisée pour Railway
import Swal from 'sweetalert2'
import NavbarUserComponent from '../components/NavbarUserComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

const router = useRouter()
const loading = ref(true)
const fileInput = ref(null)
const utilisateur = ref({ nom_complet: '', groupe_sanguin: '?', delai: 0, photo: null })
const historique = ref([])
const campagnes = ref([])

const astuces = [
  "Buvez au moins 500ml d'eau juste avant votre don.",
  "Un seul don peut sauver jusqu'à 3 vies !",
  "Mangez un repas équilibré sans trop de graisses avant le don.",
  "Évitez les efforts physiques intenses après avoir donné.",
  "Le fer (lentilles, épinards) aide à régénérer vos globules rouges."
]
const astuceDuJour = ref(astuces[Math.floor(Math.random() * astuces.length)])

const messageBienvenue = computed(() => {
  const h = new Date().getHours()
  const prenom = utilisateur.value.nom_complet ? utilisateur.value.nom_complet.split(' ')[0] : 'Donneur'
  return `${(h >= 5 && h < 18) ? "Bonjour" : "Bonsoir"}, ${prenom} !`
})

// --- CORRECTION : Récupération des données avec Token ---
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await apiClient.get('/donneur/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    utilisateur.value = response.data
    historique.value = response.data.historique || []
    campagnes.value = response.data.campagnes || []
  } catch (e) {
    console.error("Erreur Dashboard:", e)
    
    // Si 401, on redirige vers la connexion
    if (e.response && e.response.status === 401) {
      router.push('/Connexion')
    } else {
      Swal.fire('Erreur', 'Impossible de charger vos données.', 'error')
    }
  } finally {
    loading.value = false
  }
}

const statutColor = (s) => {
  if (!s) return 'border-gray-100 text-gray-400'
  const status = s.toLowerCase()
  if (status === 'validé' || status === 'terminé') return 'bg-green-500/10 text-green-600 border-green-100'
  if (status === 'annulé') return 'bg-red-500/10 text-red-600 border-red-100'
  return 'bg-amber-500/10 text-amber-600 border-amber-100'
}

const triggerUpload = () => fileInput.value.click()

// --- CORRECTION : Upload photo avec Token ---
const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  const token = localStorage.getItem('token');
  const fd = new FormData()
  fd.append('photo', file)

  try {
    const res = await apiClient.post('/donneur/update-photo', fd, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })
    utilisateur.value.photo = res.data.url
    Swal.fire({ icon: 'success', title: 'Photo mise à jour', showConfirmButton: false, timer: 1500 })
  } catch (err) {
    Swal.fire('Erreur', 'Le format de l\'image n\'est pas supporté.', 'error')
  }
}

const formatDate = (d) => {
  if (!d) return '--/--'
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()
}

onMounted(fetchDashboardData)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.slate-900 .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }

/* Animation des cartes */
.grid > div {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>