<template>
  <nav class="bg-[#1e293b] text-white shadow-lg sticky top-0 z-[100] border-b border-blue-500/10">
    <div class="max-w-[1440px] mx-auto px-6 h-16 flex justify-between items-center">

      <router-link to="/PersonnelDashboard" class="flex items-center gap-2 group">
        <div class="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-lg font-black transition-all group-hover:rotate-6 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          KG
        </div>
        <div class="flex flex-col">
          <span class="font-black text-lg tracking-tighter uppercase leading-none">Medical</span>
          <span class="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-0.5 italic">Espace Clinique</span>
        </div>
      </router-link>

      <div class="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
        <router-link to="/PersonnelDashboard" class="nav-item">Tableau de Bord</router-link>
        <router-link to="/PersonnelPlanning" class="nav-item">Planning</router-link>
        <router-link to="/PersonnelStocks" class="nav-item">Stocks Sang</router-link>
        <router-link to="/PersonnelProfils" class="nav-item">Donneurs</router-link>
      </div>

      <div class="hidden md:flex items-center gap-6">
        <div class="flex flex-col items-end mr-2">
          <p class="text-[10px] font-black text-white uppercase">{{ userName }}</p>
          <p class="text-[8px] font-bold text-blue-500 uppercase tracking-tighter italic">Connecté</p>
        </div>
        
        <button 
          @click="handleLogout"
          class="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase transition-all border border-blue-600/20 active:scale-95"
        >
          Déconnexion
        </button>
      </div>

      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 focus:outline-none">
        <div class="space-y-1.5">
          <span :class="['block w-6 h-0.5 bg-white transition-all duration-300', isMenuOpen ? 'rotate-45 translate-y-2' : '']"></span>
          <span :class="['block w-4 h-0.5 bg-blue-500 transition-all duration-300', isMenuOpen ? 'opacity-0' : '']"></span>
          <span :class="['block w-6 h-0.5 bg-white transition-all duration-300', isMenuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
        </div>
      </button>
    </div>

    <transition name="fade-slide">
      <div v-if="isMenuOpen" class="md:hidden bg-[#1e293b] border-t border-white/10 px-6 py-6 space-y-4 shadow-2xl">
        <router-link @click="isMenuOpen = false" to="/PersonnelDashboard" class="mobile-nav-item">Tableau de Bord</router-link>
        <router-link @click="isMenuOpen = false" to="/PersonnelPlanning" class="mobile-nav-item">Planning des collectes</router-link>
        <router-link @click="isMenuOpen = false" to="/PersonnelStocks" class="mobile-nav-item">Gestion des Stocks</router-link>
        <router-link @click="isMenuOpen = false" to="/PersonnelProfils" class="mobile-nav-item">Base Donneurs</router-link>
        
        <div class="pt-4 border-t border-white/5">
          <button 
            @click="handleLogout"
            class="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Se Déconnecter
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/main';
import Swal from 'sweetalert2';

const isMenuOpen = ref(false);
const router = useRouter();
const userName = ref('Pr. Médical');

onMounted(() => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      userName.value = user.nom_complet || 'Pr. Médical';
    } catch (e) {
      console.error("Erreur parsing user data");
    }
  }
});

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Clôturer la session ?',
    text: "Toutes les modifications non enregistrées seront perdues.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb', // Bleu médical
    cancelButtonColor: '#334155',
    confirmButtonText: 'Déconnexion',
    cancelButtonText: 'Rester',
    background: '#1e293b',
    color: '#fff',
    customClass: {
      popup: 'rounded-[1.5rem]'
    }
  });

  if (result.isConfirmed) {
    try {
      await apiClient.post('/logout');
    } catch (error) {
      console.error("Déconnexion API échouée :", error);
    } finally {
      // Nettoyage complet
      localStorage.clear();
      delete apiClient.defaults.headers.common['Authorization'];
      
      router.push('/');
      isMenuOpen.value = false;
    }
  }
};
</script>

<style scoped>
.nav-item {
  position: relative;
  @apply opacity-40 transition-all duration-300 hover:opacity-100 py-1 cursor-pointer;
}

.router-link-active.nav-item {
  @apply opacity-100 text-white;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); 
}

.router-link-active.nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  @apply bg-blue-500 shadow-[0_0_8px_#3b82f6];
  border-radius: 2px;
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-nav-item {
  @apply block text-[11px] font-black uppercase tracking-[0.2em] opacity-50 transition-all;
}

.router-link-active.mobile-nav-item {
  @apply opacity-100 text-blue-500 translate-x-3;
}

@keyframes slideIn {
  from { transform: scaleX(0); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>