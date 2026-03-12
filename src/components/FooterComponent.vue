<template>
  <footer class="bg-slate-900 text-white pt-16 pb-8 mt-20 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm shadow-lg shadow-red-600/20">
              KG
            </div>
            <span class="font-black text-lg tracking-tighter uppercase italic">Saint-Raphaël</span>
          </div>
          <p class="text-slate-400 text-xs leading-relaxed font-medium">
            Engagé dans la gestion et la promotion du don de sang pour sauver des vies au quotidien. 
            Votre générosité est le moteur de notre mission.
          </p>
        </div>

        <div>
          <h3 class="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Navigation</h3>
          <ul class="space-y-4">
            <li><router-link to="/Dash_user" class="footer-link">Accueil</router-link></li>
            <li><router-link to="/Reservation" class="footer-link">Prendre RDV</router-link></li>
            <li><router-link to="/Historique" class="footer-link">Mon Historique</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Informations</h3>
          <ul class="space-y-4">
            <li><router-link to="/Profil" class="footer-link">Mon Profil</router-link></li>
            <li class="footer-link text-slate-500 cursor-default">Conditions d'éligibilité</li>
            <li class="footer-link text-slate-500 cursor-default">Centre d'aide</li>
          </ul>
        </div>

        <div>
          <h3 class="text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Contact</h3>
          <div class="space-y-4 text-xs font-medium text-slate-400">
            <p class="flex items-center gap-3">
              <span class="text-red-500">📍</span> Hôpital Saint-Raphaël
            </p>
            <p class="flex items-center gap-3">
              <span class="text-red-500">📞</span> +226 XX XX XX XX
            </p>
            <p class="flex items-center gap-3">
              <span class="text-red-500">✉</span> contact@hopital-sr.org
            </p>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
          &copy; 2026 Saint-Raphaël Blood Care. Tous droits réservés.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-slate-500 hover:text-white transition-colors"><i class="fab fa-facebook"></i></a>
          <a href="#" class="text-slate-500 hover:text-white transition-colors"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-slate-500 hover:text-white transition-colors"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply text-slate-400 text-xs font-bold transition-all duration-300 hover:text-white hover:translate-x-1 inline-block;
}

/* Optionnel : Ajout d'une petite animation sur le trait de séparation */
footer {
  position: relative;
}
footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: #dc2626;
}
</style>