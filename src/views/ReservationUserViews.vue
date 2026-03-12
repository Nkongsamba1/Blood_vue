<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <NavbarUserComponent />
    
    <main class="max-w-5xl mx-auto p-6">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-black uppercase text-red-700 tracking-tighter italic">Réserver un Don</h1>
        <p class="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Votre sang est un cadeau précieux</p>
      </div>

      <div v-if="loading" class="flex flex-col items-center py-20">
        <div class="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="!eligibilite.eligible" class="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 text-center border-2 border-red-50 shadow-2xl shadow-red-100/30 animate-fadeIn">
        <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">🩺</div>
        <h2 class="text-2xl font-black text-gray-900 uppercase mb-4">Délai de récupération</h2>
        <p class="text-gray-500 text-sm mb-10 leading-relaxed">
          Votre dernier prélèvement a été effectué le <span class="text-gray-900 font-bold">{{ eligibilite.date_dernier_don }}</span>.<br>
          Il s'est écoulé <span class="text-red-600 font-black">{{ eligibilite.jours_ecoules }} jours</span>.
        </p>

        <div class="bg-red-600 rounded-[2.5rem] p-8 text-white mb-8 shadow-xl shadow-red-200">
          <p class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Prochain don possible dans</p>
          <div class="text-5xl font-black">{{ eligibilite.jours_restants }} <span class="text-lg">JOURS</span></div>
        </div>
        
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Revenez vers le {{ calculNextDate(eligibilite.jours_restants) }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div v-for="c in campagnes" :key="c.id" 
             @click="selectedCampagne = c"
             :class="selectedCampagne?.id === c.id ? 'border-red-600 ring-4 ring-red-50 shadow-2xl scale-[1.02]' : 'border-gray-100'"
             class="bg-white rounded-[2.5rem] p-8 border-2 cursor-pointer transition-all duration-500 hover:border-red-200 relative group overflow-hidden">
          
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-6">
              <span class="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase">Disponible</span>
              <span class="text-red-600 text-[10px] font-black uppercase flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                <span class="animate-pulse">⏳</span> {{ getJoursRestants(c.date_fin) }} jours restants
              </span>
            </div>
            
            <h2 class="text-2xl font-black text-gray-900 uppercase mb-2 group-hover:text-red-700 transition-colors leading-tight">{{ c.titre }}</h2>
            
            <div class="space-y-2 mb-8">
              <p class="text-gray-500 text-[11px] font-bold uppercase flex items-center gap-2">📍 {{ c.lieu }}</p>
              <p class="text-slate-900 text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                📅 Du {{ formatDateShort(c.date_debut) }} au {{ formatDateShort(c.date_fin) }}
              </p>
            </div>
            
            <div v-if="selectedCampagne?.id === c.id" class="mt-4 pt-6 border-t border-gray-100 animate-slideUp">
              <p class="text-[9px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em] text-center italic">Sélectionnez votre créneau</p>
              <div class="grid grid-cols-3 gap-2 mb-8">
                <button v-for="h in hours" :key="h" 
                        @click.stop="form.heure = h"
                        :class="form.heure === h ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'"
                        class="py-3 rounded-2xl text-[10px] font-black transition-all hover:bg-gray-100">
                  {{ h }}
                </button>
              </div>
              
              <button @click.stop="handleReserve" 
                      :disabled="!form.heure"
                      class="w-full bg-slate-900 text-white font-black py-4 rounded-[1.5rem] transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-red-700 disabled:opacity-10">
                Confirmer pour {{ form.heure }}
              </button>
            </div>

            <p v-else class="text-center text-[10px] font-black text-red-600 uppercase tracking-widest mt-4 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all">
              Cliquer pour planifier
            </p>
          </div>
        </div>

        <div v-if="campagnes.length === 0" class="col-span-full text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
           <p class="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Aucune campagne disponible actuellement</p>
        </div>
      </div>
    </main>
      <FooterComponent />
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import NavbarUserComponent from '../components/NavbarUserComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

const router = useRouter()
const loading = ref(true)
const eligibilite = ref({ eligible: true })
const campagnes = ref([])
const selectedCampagne = ref(null)
const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
const form = ref({ heure: '' })

// Calcule les jours restants pour une campagne
const getJoursRestants = (dateFin) => {
  const diff = new Date(dateFin) - new Date()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

// Initialisation
const init = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    // 1. Vérification médicale
    const resElig = await axios.get(`${process.env.VUE_APP_API_URL}/api/donneur/check-eligibilite`, { headers })
    eligibilite.value = resElig.data

    // 2. Si éligible, charger les campagnes
    if (eligibilite.value.eligible) {
      const resCamp = await axios.get(`${process.env.VUE_APP_API_URL}/api/campagnes/disponibles`, { headers })
      campagnes.value = resCamp.data
    }
  } catch (err) {
    console.error("Erreur", err)
  } finally {
    loading.value = false
  }
}

const handleReserve = async () => {
  if (!selectedCampagne.value || !form.value.heure) return

  const result = await Swal.fire({
    title: 'Confirmer ?',
    text: `RDV le ${formatDateShort(selectedCampagne.value.date_debut)} à ${form.value.heure}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonColor: '#111827',
    confirmButtonText: 'Oui, je réserve',
    didOpen: () => { Swal.getPopup().style.borderRadius = '2.5rem' }
  })

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token')
      await axios.post('${process.env.VUE_APP_API_URL}/api/donneur/reserver', {
        campagne_id: selectedCampagne.value.id,
        heure_rdv: form.value.heure,
        date_don: selectedCampagne.value.date_debut
      }, { headers: { Authorization: `Bearer ${token}` } })

      Swal.fire({ icon: 'success', title: 'Réservé !', timer: 2000, showConfirmButton: false })
      router.push('/Historique')
    } catch (err) {
      Swal.fire('Oups', err.response?.data?.message || 'Erreur lors de la réservation', 'error')
    }
  }
}

// Formatage de dates
const formatDateShort = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase() : ""
const calculNextDate = (jours) => {
  const d = new Date()
  d.setDate(d.getDate() + jours)
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(init)
</script>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.8s ease-out; }
.animate-slideUp { animation: slideUp 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>