<template>
  <footer class="mt-20 bg-[#0f172a] text-slate-500 py-16 border-t-2 border-red-600/20">
    <div class="max-w-[1600px] mx-auto px-6 md:px-12">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-900/40">
              <span class="text-xl font-black italic">H</span>
            </div>
            <div>
              <h4 class="text-white font-black uppercase tracking-tighter text-2xl leading-none italic">
                HEMO<span class="text-red-600">LINK</span>
              </h4>
              <span class="text-[9px] font-black uppercase tracking-[0.4em] text-red-500/80">Administration Centrale</span>
            </div>
          </div>
          <p class="text-[11px] font-bold uppercase leading-relaxed tracking-wider opacity-60 max-w-sm">
            Console de supervision globale. Accès restreint au personnel de direction et administrateurs système.
          </p>
          <div class="flex gap-4 pt-2">
            <div class="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700 text-[9px] font-black uppercase text-slate-300">
              ID Session: <span class="text-red-500">{{ sessionId }}</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h5 class="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-l-2 border-red-600 pl-4">Supervision</h5>
          <ul class="space-y-4 text-[10px] font-black uppercase tracking-widest">
            <li><router-link to="/AdminDashboard" class="hover:text-white transition-all flex items-center gap-2"><span>→</span> Vue d'ensemble</router-link></li>
            <li><router-link to="/AdminUsers" class="hover:text-white transition-all flex items-center gap-2"><span>→</span> Gestion Utilisateurs</router-link></li>
            <li><router-link to="/AdminLogs" class="hover:text-white transition-all flex items-center gap-2"><span>→</span> Journaux d'audit</router-link></li>
          </ul>
        </div>

        <div class="lg:col-span-3">
          <h5 class="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-l-2 border-red-600 pl-4">Infrastructure</h5>
          <div class="space-y-4">
            <div class="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
              <span class="text-[9px] font-black uppercase tracking-widest">Database Sync</span>
              <span class="text-emerald-500 text-[9px] font-black uppercase">Active</span>
            </div>
            <div class="flex justify-between items-center bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
              <span class="text-[9px] font-black uppercase tracking-widest">Security Layer</span>
              <span class="text-blue-500 text-[9px] font-black uppercase">AES-256</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 bg-red-950/20 p-8 rounded-[2.5rem] border border-red-900/30 relative overflow-hidden">
          <h5 class="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Urgence Système</h5>
          <p class="text-slate-300 text-[10px] font-bold leading-relaxed mb-6">
            En cas de faille de sécurité ou d'incident majeur sur la chaîne de froid.
          </p>
          <button class="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-red-900/40">
            Protocole d'Alerte
          </button>
        </div>

      </div>

      <div class="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-6">
          <p class="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
            © 2026 HEMOLINK CORE — All Rights Reserved
          </p>
          <div class="h-4 w-[1px] bg-slate-800 hidden md:block"></div>
          <span class="text-[9px] font-black uppercase tracking-widest text-slate-600">v4.2.0-PRO</span>
        </div>
        
        <div class="flex gap-8">
          <a href="#" class="text-[9px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">Audit Policy</a>
          <a href="#" class="text-[9px] font-black uppercase tracking-widest hover:text-red-500 transition-colors">Encryption Standards</a>
          <a href="#" class="text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">System Health</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const sessionId = ref('---');

onMounted(() => {
  // Simule un ID de session admin
  sessionId.value = 'ADM-' + Math.random().toString(36).substring(2, 9).toUpperCase();
});
</script>

<style scoped>
footer {
  /* Assure une transition douce avec les fonds de page Admin souvent gris très clair */
  box-shadow: 0 -20px 50px -20px rgba(15, 23, 42, 0.1);
}

/* Effet de brillance subtile sur le branding */
h4 {
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.1);
}
</style>