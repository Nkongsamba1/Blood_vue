<template>
  <button 
    @click="isOpen = !isOpen" 
    class="lg:hidden fixed top-8 left-6 z-[60] bg-[#111] p-3 rounded-xl shadow-2xl border border-white/10 text-white active:scale-90 transition-transform"
  >
    <span v-if="!isOpen" class="text-xl">☰</span>
    <span v-else class="text-xl">✕</span>
  </button>

  <div 
    v-if="isOpen" 
    @click="isOpen = false" 
    class="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
  ></div>

  <aside 
    :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    class="fixed lg:sticky top-0 left-0 z-50 w-80 bg-[#111] text-white flex flex-col shrink-0 border-r border-white/5 h-screen overflow-y-auto custom-scrollbar transition-transform duration-500 ease-in-out"
  >
    
    <div class="p-10 border-b border-white/5 flex items-center gap-4 group">
      <div class="w-12 h-12 bg-[#A62639] rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:rotate-12 transition-transform duration-500">
        <span class="text-2xl">🩸</span>
      </div>
      <div>
        <h1 class="font-black uppercase italic tracking-tighter text-xl text-white leading-none">Saint-Raphaël</h1>
        <p class="text-[8px] font-bold text-[#A62639] uppercase tracking-[0.3em] mt-1">Management Système</p>
      </div>
    </div>

    <nav class="p-6 space-y-2 flex-1">
      
      <router-link to="/AdminDashboard" class="nav-link group" @click="closeOnMobile">
        <span class="text-lg opacity-70 group-hover:opacity-100 transition-opacity">📊</span>
        <span class="flex-1">Tableau de Bord</span>
      </router-link>

      <div class="space-y-1">
        <button @click="toggleMenu('stocks')" :class="{'bg-white/5 text-white': menus.stocks}" class="nav-link w-full group">
          <span class="text-lg opacity-70">📦</span>
          <span class="flex-1 text-left">Gestion des Stocks</span>
          <span class="text-[8px] transition-transform duration-300" :class="{'rotate-180': menus.stocks}">▼</span>
        </button>
        <transition name="slide">
          <div v-show="menus.stocks" class="pl-12 space-y-1 overflow-hidden">
            <router-link to="/AdminStocks" class="sub-nav-link" @click="closeOnMobile">Inventaire Global</router-link>
            </div>
        </transition>
      </div>

      <div class="space-y-1">
        <button @click="toggleMenu('users')" :class="{'bg-white/5 text-white': menus.users}" class="nav-link w-full group">
          <span class="text-lg opacity-70">👥</span>
          <span class="flex-1 text-left">Utilisateurs</span>
          <span class="text-[8px] transition-transform duration-300" :class="{'rotate-180': menus.users}">▼</span>
        </button>
        <transition name="slide">
          <div v-show="menus.users" class="pl-12 space-y-1">
            <router-link to="/AdminUsers" class="sub-nav-link" @click="closeOnMobile">Liste Complète</router-link>
          </div>
        </transition>
      </div>

      <router-link to="/AdminCampagnes" class="nav-link group" @click="closeOnMobile">
        <span class="text-lg opacity-70 group-hover:opacity-100">📢</span>
        <span class="flex-1">Campagnes</span>
      </router-link>

      <div class="pt-8 pb-2">
        <p class="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] px-8 italic">Configuration</p>
      </div>

      <router-link to="/AdminProfil" class="nav-link group" @click="closeOnMobile">
        <span class="text-lg opacity-70">👤</span>
        <span class="flex-1">Mon Profil</span>
      </router-link>
    </nav>

    <div class="p-6 border-t border-white/5">
      <button 
        @click="handleLogout" 
        class="flex items-center gap-4 w-full px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#A62639] hover:bg-[#A62639] hover:text-white transition-all duration-300 group shadow-lg hover:shadow-red-900/20"
      >
        <span class="group-hover:scale-125 transition-transform">🚪</span>
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/main';
import Swal from 'sweetalert2';

const router = useRouter();
const isOpen = ref(false);

const menus = reactive({
  stocks: false,
  users: false
});

const toggleMenu = (name) => {
  menus[name] = !menus[name];
};

const closeOnMobile = () => {
  if (window.innerWidth < 1024) {
    isOpen.value = false;
  }
};

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'Déconnexion ?',
    text: "Vous allez être redirigé vers l'accueil.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#A62639',
    cancelButtonColor: '#333',
    confirmButtonText: 'Quitter la console',
    cancelButtonText: 'Rester',
    background: '#111',
    color: '#fff',
    customClass: {
      popup: 'rounded-[1.5rem] border border-white/5'
    }
  });

  if (result.isConfirmed) {
    try {
      await apiClient.post('/logout');
    } catch (e) {
      console.error("Erreur de déconnexion", e);
    } finally {
      localStorage.clear();
      delete apiClient.defaults.headers.common['Authorization'];
      router.push('/');
    }
  }
};
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-4 px-8 py-4 rounded-[1.2rem] text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-300 italic text-white/50 hover:text-white hover:bg-white/5 cursor-pointer;
}

/* On utilise une couleur plus vive pour l'actif */
.router-link-active {
  @apply bg-[#A62639] text-white shadow-2xl shadow-red-900/40 !important;
}

.sub-nav-link {
  @apply block py-3 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-[#A62639] transition-colors border-l border-white/5 pl-4 hover:border-[#A62639] cursor-pointer;
}

.sub-nav-link.router-link-active {
  @apply bg-transparent text-[#A62639] border-[#A62639] shadow-none !important;
}

/* Transition du menu déroulant */
.slide-enter-active, .slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 250px;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { @apply bg-white/10 rounded-full; }
</style>