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

      <div v-else-if="!eligibilite.eligible" class="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 text-center border-2 border-red-50 shadow-2xl animate-fadeIn">
        <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">🩺</div>
        <h2 class="text-2xl font-black text-gray-900 uppercase mb-4">Délai de récupération</h2>
        <div class="bg-red-600 rounded-[2.5rem] p-8 text-white mb-8 shadow-xl">
          <p class="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Prochain don possible dans</p>
          <div class="text-5xl font-black">{{ eligibilite.jours_restants }} <span class="text-lg">JOURS</span></div>
        </div>
        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Revenez vers le {{ calculNextDate(eligibilite.jours_restants) }}</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div v-for="c in campagnes" :key="c.id" 
             @click="selectCampagne(c)"
             :class="selectedCampagne?.id === c.id ? 'border-red-600 ring-4 ring-red-50 shadow-2xl scale-[1.02]' : 'border-gray-100'"
             class="bg-white rounded-[2.5rem] p-8 border-2 cursor-pointer transition-all duration-500 hover:border-red-200 relative group overflow-hidden">
          
          <div class="relative z-10">
            <div class="flex justify-between items-center mb-6">
              <span class="bg-green-100 text-green-700 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase">Disponible</span>
              <span class="text-red-600 text-[10px] font-black uppercase bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 italic">
                ⏳ {{ getJoursRestants(c.date_fin) }} jours
              </span>
            </div>
            
            <h2 class="text-2xl font-black text-gray-900 uppercase mb-2 group-hover:text-red-700 transition-colors">{{ c.titre }}</h2>
            <p class="text-gray-500 text-[11px] font-bold uppercase flex items-center gap-2 mb-6 italic">📍 {{ c.lieu }}</p>
            
            <div v-if="selectedCampagne?.id === c.id" class="mt-4 pt-6 border-t border-gray-100 animate-slideUp">
              
              <p class="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em] italic">1. Choisissez une date</p>
              <div class="flex flex-wrap gap-2 mb-6">
                <button v-for="(hoursList, date) in sortedPlanning(c.planning)" :key="date"
                        @click.stop="!isDatePassed(date) ? (form.date = date, form.heure = '') : null"
                        :disabled="isDatePassed(date)"
                        :class="[
                          form.date === date ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700',
                          isDatePassed(date) ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-105'
                        ]"
                        class="px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all relative">
                  {{ formatDateShort(date) }}
                  <span v-if="isDatePassed(date)" class="absolute inset-0 flex items-center justify-center text-[7px] font-black text-red-900/40">PASSÉ</span>
                </button>
              </div>

              <div v-if="form.date">
                <p class="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-[0.2em] italic">2. Choisissez l'heure</p>
                <div class="grid grid-cols-3 gap-2 mb-8">
                  <button v-for="h in c.planning[form.date]" :key="h" 
                          @click.stop="!isHourPassed(form.date, h) ? (form.heure = h) : null"
                          :disabled="isHourPassed(form.date, h)"
                          :class="[
                            form.heure === h ? 'bg-slate-900 text-white shadow-lg' : 'bg-gray-50 text-gray-400',
                            isHourPassed(form.date, h) ? 'opacity-20 cursor-not-allowed' : 'hover:bg-gray-100'
                          ]"
                          class="py-3 rounded-2xl text-[10px] font-black transition-all">
                    {{ h }}
                  </button>
                </div>
                
                <button @click.stop="handleReserve" 
                        :disabled="!form.heure"
                        class="w-full bg-red-600 text-white font-black py-4 rounded-[1.5rem] transition-all uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-red-700 disabled:opacity-20">
                  Confirmer pour le {{ formatDateShort(form.date) }} à {{ form.heure }}
                </button>
              </div>
            </div>

            <p v-else class="text-center text-[10px] font-black text-red-600 uppercase tracking-widest mt-4 group-hover:opacity-100 opacity-0 transition-all">
              Cliquer pour planifier
            </p>
          </div>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { apiClient } from '../main' 
import NavbarUserComponent from '../components/NavbarUserComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

const router = useRouter()
const loading = ref(true)
const eligibilite = ref({ eligible: true })
const campagnes = ref([])
const selectedCampagne = ref(null)
const form = ref({ date: '', heure: '' })

/**
 * Triage du planning par ordre chronologique
 * (Les objets JS ne garantissent pas l'ordre des clés)
 */
const sortedPlanning = (planning) => {
  if (!planning) return {};
  return Object.keys(planning)
    .sort()
    .reduce((obj, key) => {
      obj[key] = planning[key];
      return obj;
    }, {});
}

// Vérifie si la date est passée
const isDatePassed = (dateString) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateToCompare = new Date(dateString)
  dateToCompare.setHours(0, 0, 0, 0)
  return dateToCompare < today
}

// Vérifie si l'heure est passée (pour aujourd'hui)
const isHourPassed = (dateString, hourString) => {
  const today = new Date()
  const dateToCompare = new Date(dateString)
  
  if (dateToCompare.toDateString() === today.toDateString()) {
    const [hours, minutes] = hourString.split(':').map(Number)
    const slotTime = new Date()
    slotTime.setHours(hours, minutes, 0, 0)
    return slotTime < today
  }
  return false
}

const getJoursRestants = (dateFin) => {
  const diff = new Date(dateFin) - new Date()
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
}

const init = async () => {
  loading.value = true
  try {
    const resElig = await apiClient.get('/donneur/check-eligibilite')
    eligibilite.value = resElig.data

    if (eligibilite.value.eligible) {
      // Note: Assure-toi que l'URL correspond à ton API
      const resCamp = await apiClient.get('/campagnes/disponibles')
      campagnes.value = resCamp.data.map(c => ({
        ...c,
        // Conversion du JSON string en objet si nécessaire
        planning: typeof c.planning === 'string' ? JSON.parse(c.planning) : (c.planning || {})
      }))
    }
  } catch (err) {
    console.error("Erreur API", err)
    Swal.fire('Erreur', 'Impossible de charger les données.', 'error')
  } finally {
    loading.value = false
  }
}

const selectCampagne = (c) => {
  selectedCampagne.value = c
  form.value.date = ''
  form.value.heure = ''
}

const handleReserve = async () => {
  if (!selectedCampagne.value || !form.value.heure || !form.value.date) return

  const result = await Swal.fire({
    title: 'Confirmer la réservation ?',
    text: `RDV le ${formatDateShort(form.value.date)} à ${form.value.heure}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#b91c1c',
    cancelButtonText: 'Annuler',
    confirmButtonText: 'Oui, je confirme'
  })

  if (result.isConfirmed) {
    try {
      // Envoi de la date_don et de l'heure au serveur
      await apiClient.post('/donneur/reserver', {
        campagne_id: selectedCampagne.value.id,
        heure_rdv: form.value.heure,
        date_don: form.value.date
      })
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Réservé !', 
        text: 'Votre rendez-vous est enregistré.',
        timer: 2500, 
        showConfirmButton: false 
      })
      router.push('/Historique')
    } catch (err) {
      Swal.fire('Erreur', err.response?.data?.message || 'Erreur lors de la réservation', 'error')
    }
  }
}

const formatDateShort = (d) => {
  if (!d) return ""
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }).toUpperCase()
}

const calculNextDate = (jours) => {
  const d = new Date()
  d.setDate(d.getDate() + (jours || 0))
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(init)
</script>

<style scoped>
.animate-fadeIn { animation: fadeIn 0.6s ease-out; }
.animate-slideUp { animation: slideUp 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Désactivation visuelle des boutons passés */
button:disabled {
  pointer-events: none;
}
</style>