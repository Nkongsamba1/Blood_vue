<template>
  <footer class="mt-12 bg-slate-900 text-slate-400 py-12 px-4 md:px-8 border-t border-slate-800">
    <div class="max-w-[1600px] mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        <div class="md:col-span-1 space-y-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-red-900/20">
              🩸
            </div>
            <span class="text-white font-black uppercase tracking-tighter text-xl italic">
              HEMO<span class="text-red-600">LINK</span> <span class="text-[10px] not-italic text-slate-500 ml-1">STAFF</span>
            </span>
          </div>
          <p class="text-[10px] font-bold uppercase tracking-widest leading-relaxed opacity-60">
            Interface de gestion sécurisée destinée au personnel de santé agréé.
          </p>
        </div>

        <div>
          <h4 class="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-6">Navigation</h4>
          <ul class="space-y-3 text-[10px] font-bold uppercase tracking-widest">
            <li><router-link to="/PersonnelDashboard" class="hover:text-red-500 transition-colors">Tableau de bord</router-link></li>
            <li><router-link to="/PersonnelPlanning" class="hover:text-red-500 transition-colors">File d'attente</router-link></li>
            <li><router-link to="/PersonnelStocks" class="hover:text-red-500 transition-colors">Gestion des stocks</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white text-[11px] font-black uppercase tracking-[0.2em] mb-6">Support Technique</h4>
          <ul class="space-y-3 text-[10px] font-bold uppercase tracking-widest">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Urgence Maintenance : 01 23 45 67
            </li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Guide d'utilisation</a></li>
            <li><a href="#" class="hover:text-red-500 transition-colors">Signaler un bug</a></li>
          </ul>
        </div>

        <div class="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
          <h4 class="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">État du Système</h4>
          <div class="flex items-center gap-3">
            <div class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span class="text-emerald-400 text-[10px] font-black uppercase">Serveur Opérationnel</span>
          </div>
          <p class="text-[9px] mt-4 opacity-40 font-bold uppercase">Dernière synchro : {{ tempsReel }}</p>
        </div>

      </div>

      <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[9px] font-black uppercase tracking-widest opacity-30">
          © 2026 HEMOLINK SYSTEM — Protocoles de sécurité v4.2.0
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Confidentialité</a>
          <a href="#" class="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">Mentions Légales</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tempsReel = ref('');

const updateTime = () => {
  const now = new Date();
  tempsReel.value = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
};

onMounted(() => {
  updateTime();
});
</script>

<style scoped>
footer {
  /* On s'assure que le footer ne se chevauche pas avec le contenu si la page est courte */
  position: relative;
  z-index: 10;
}
</style>