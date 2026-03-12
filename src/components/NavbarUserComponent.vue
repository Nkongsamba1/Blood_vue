<template>
  <nav class="bg-slate-900/95 backdrop-blur-md text-white shadow-2xl sticky top-0 z-50 border-b border-white/5">
    <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

      <router-link to="/Dash_user" class="flex items-center gap-3 group">
        <div class="bg-gradient-to-br from-red-500 to-red-700 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black shadow-lg shadow-red-500/20 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
          KG
        </div>
        <div class="flex flex-col leading-none">
          <span class="font-black text-xl tracking-tighter uppercase italic text-white">Saint-Raphaël</span>
          <span class="text-[8px] font-bold uppercase tracking-[0.4em] text-red-500">Blood Care</span>
        </div>
      </router-link>

      <div class="hidden md:flex items-center gap-1">
        <router-link to="/Dash_user" class="nav-link" active-class="nav-active">
          <span>Accueil</span>
        </router-link>
        <router-link to="/Profil" class="nav-link" active-class="nav-active">
          <span>Profil</span>
        </router-link>
        <router-link to="/Historique" class="nav-link" active-class="nav-active">
          <span>Historique</span>
        </router-link>
        <router-link to="/Reservation" class="nav-link" active-class="nav-active">
          <span>Réservation</span>
        </router-link>
      </div>

      <div class="hidden md:flex items-center border-l border-white/10 pl-6 ml-2">
        <button 
          @click="handleLogout"
          class="flex items-center gap-2 bg-white/5 hover:bg-red-600 group px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 border border-white/10 hover:border-red-500"
        >
          <span class="text-red-500 group-hover:text-white transition-colors italic">Quitter</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-lg border border-white/10">
        <span :class="['block w-5 h-0.5 bg-white transition-all duration-300', isMenuOpen ? 'rotate-45 translate-y-2' : '']"></span>
        <span :class="['block w-3 h-0.5 bg-red-500 transition-all duration-300', isMenuOpen ? 'opacity-0' : '']"></span>
        <span :class="['block w-5 h-0.5 bg-white transition-all duration-300', isMenuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
      </button>
    </div>

    <transition name="slide">
      <div v-if="isMenuOpen" class="md:hidden bg-slate-900 border-t border-white/5 absolute w-full shadow-2xl overflow-hidden">
        <div class="px-6 py-8 flex flex-col gap-4">
          <router-link @click="isMenuOpen = false" to="/Dash_user" class="mobile-nav-link">Accueil</router-link>
          <router-link @click="isMenuOpen = false" to="/Profil" class="mobile-nav-link">Profil</router-link>
          <router-link @click="isMenuOpen = false" to="/Historique" class="mobile-nav-link">Historique</router-link>
          <router-link @click="isMenuOpen = false" to="/Reservation" class="mobile-nav-link">Réservation</router-link>
          
          <div class="pt-6 mt-2 border-t border-white/5">
            <button 
              @click="handleLogout"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-600/20 transition-all active:scale-95"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const isMenuOpen = ref(false);
const router = useRouter();

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Déconnexion ?',
    text: "Souhaitez-vous fermer votre session ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#334155',
    confirmButtonText: 'Oui, quitter',
    cancelButtonText: 'Annuler',
    background: '#1e293b',
    color: '#fff',
    didOpen: () => { Swal.getPopup().style.borderRadius = '2rem' }
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/logout`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Erreur serveur :", error);
    } finally {
      localStorage.clear();
      router.push('/');
      isMenuOpen.value = false;
    }
  }
};
</script>

<style scoped>
/* Style des liens Desktop */
.nav-link {
  @apply px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 transition-all duration-300 hover:text-white hover:bg-white/5;
}

/* Style du lien actif */
.nav-active {
  @apply text-red-500 bg-red-500/5;
}

/* Style des liens Mobile */
.mobile-nav-link {
  @apply text-sm font-black uppercase tracking-widest text-slate-300 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-red-500 transition-all;
}

/* Animation Slide */
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 400px;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>