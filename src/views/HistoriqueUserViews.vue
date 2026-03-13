<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <NavbarUserComponent />

    <main class="max-w-5xl mx-auto p-4 md:p-6">
      <div class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter text-red-700 italic">Mes Participations</h1>
          <p class="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">Gérez vos réservations et consultez votre historique</p>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-10 h-10 border-4 border-[#A62639] border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="dons.length === 0" class="text-center py-20 bg-white rounded-[2.5rem] shadow-sm border-2 border-dashed border-gray-200">
        <p class="text-gray-400 font-bold uppercase text-xs">Aucune participation trouvée</p>
        <router-link to="/Campagnes" class="inline-block mt-4 text-[#A62639] font-black uppercase text-[10px] hover:underline">
          Découvrir les campagnes →
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="don in dons" :key="don.id" 
             class="bg-white border-2 border-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl hover:border-red-50 transition-all duration-500 group relative">
          
          <div v-if="don.statut === 'En attente' || don.statut === 'en attente'" class="absolute top-6 right-8 flex gap-2">
            <button @click="handleEdit(don)" class="p-2 bg-gray-100 hover:bg-slate-900 hover:text-white rounded-full transition-all text-gray-500" title="Modifier l'heure">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button @click="confirmDelete(don.id)" class="p-2 bg-red-50 hover:bg-red-600 hover:text-white rounded-full transition-all text-red-600" title="Annuler la réservation">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-6">
              <div class="bg-slate-900 text-white w-20 h-20 rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl group-hover:bg-[#A62639] transition-colors duration-500">
                <span class="text-2xl font-black">{{ getDay(don.date_don) }}</span>
                <span class="text-[9px] font-bold uppercase tracking-widest">{{ getMonth(don.date_don) }}</span>
              </div>

              <div>
                <h2 class="text-lg font-black uppercase text-gray-900 leading-tight mb-1">
                  {{ don.campagne ? don.campagne.titre : 'Don Spontané' }}
                </h2>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-xs font-medium">
                  <span class="flex items-center gap-1">📍 {{ don.lieu || 'Centre de collecte' }}</span>
                  <span class="text-red-600 font-bold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-lg">
                    ⏰ {{ formatHeure(don.heure_rdv) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between md:justify-end gap-10 border-t border-gray-50 md:border-none pt-4 md:pt-0">
              <div class="text-right">
                <p class="text-[9px] text-gray-400 uppercase font-black mb-1">Volume</p>
                <p class="font-black text-sm text-gray-800">{{ don.quantite ? don.quantite + ' ml' : '--' }}</p>
              </div>

              <div class="text-right">
                <p class="text-[9px] text-gray-400 uppercase font-black mb-2">Statut</p>
                <span :class="statusStyle(don.statut)" class="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter border shadow-sm transition-colors">
                  {{ don.statut }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiClient } from '@/main' // Import de l'instance Axios globale
import Swal from 'sweetalert2'
import NavbarUserComponent from '../components/NavbarUserComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'

const dons = ref([])
const loading = ref(true)

// Récupération de l'historique depuis l'API Railway
const fetchHistory = async () => {
  try {
    const res = await apiClient.get('/donneur/historique')
    dons.value = res.data
  } catch (err) {
    console.error("Erreur lors de la récupération :", err)
  } finally {
    loading.value = false
  }
}

// Suppression (Annulation) d'une réservation
const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Annuler la réservation ?',
    text: "Cette action libérera votre créneau pour un autre donneur.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#A62639',
    cancelButtonColor: '#1e293b',
    confirmButtonText: 'Oui, annuler',
    cancelButtonText: 'Retour',
    customClass: {
      popup: 'rounded-[2.5rem]'
    }
  })

  if (result.isConfirmed) {
    try {
      await apiClient.delete(`/donneur/reserver/${id}`)
      Swal.fire('Annulée !', 'Votre réservation a été supprimée.', 'success')
      fetchHistory() 
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de traiter la demande.', 'error')
    }
  }
}

// Modification de l'heure du rendez-vous
const handleEdit = async (don) => {
  const { value: newTime } = await Swal.fire({
    title: 'Modifier l\'heure',
    input: 'select',
    inputOptions: {
      '08:00': '08:00', '09:00': '09:00', '10:00': '10:00', 
      '11:00': '11:00', '14:00': '14:00', '15:00': '15:00',
      '16:00': '16:00'
    },
    inputPlaceholder: 'Choisir un nouvel horaire',
    showCancelButton: true,
    confirmButtonColor: '#A62639',
    cancelButtonText: 'Annuler',
    customClass: {
      popup: 'rounded-[2.5rem]'
    }
  })

  if (newTime) {
    try {
      await apiClient.put(`/donneur/reserver/${don.id}`, { heure_rdv: newTime })
      Swal.fire('Mis à jour !', 'Votre horaire a été modifié avec succès.', 'success')
      fetchHistory()
    } catch (err) {
      Swal.fire('Erreur', 'La modification a échoué.', 'error')
    }
  }
}

// Style dynamique des badges de statut
const statusStyle = (s) => {
  if (!s) return 'bg-gray-50 text-gray-400 border-gray-100'
  const status = s.toLowerCase()
  if (status === 'validé' || status === 'terminé' || status === 'confirmé') 
    return 'bg-green-50 text-green-700 border-green-100'
  if (status === 'en attente') 
    return 'bg-amber-50 text-amber-600 border-amber-100'
  return 'bg-red-50 text-red-600 border-red-100'
}

// Helpers de formatage
const formatHeure = (h) => h ? h.substring(0, 5).replace(':', 'h') : '--'

const getDay = (d) => {
  if (!d) return '--'
  return new Date(d).getDate().toString().padStart(2, '0')
}

const getMonth = (d) => {
  if (!d) return 'MOIS'
  return new Date(d).toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '')
}

onMounted(fetchHistory)
</script>

<style scoped>
/* Petit effet de fade-in pour les cartes */
.group {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>