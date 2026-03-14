<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
    <div 
      class="absolute inset-0 bg-cover bg-center scale-110" 
      style="background-image: url('/image/hopital.jpg'); filter: blur(1px);">
    </div>
    
    <div class="absolute inset-0 bg-black/30"></div>

    <div class="z-10 max-w-4xl w-full flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-2xl bg-white/20 backdrop-blur-md border border-white/30 font-sans">
      
      <div class="w-full md:w-1/2 bg-black/70 p-8 text-white">
        <div class="text-center mb-6">
          <h1 class="font-bold text-2xl"><span class="text-red-600 text-3xl">K</span> STORES</h1>
          <p class="uppercase tracking-widest text-xs mt-1">Inscription</p>
        </div>

        <form @submit.prevent="handleInscription" class="space-y-3">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Nom Complet</label>
            <input v-model="form.nom_complet" type="text" required class="flex-1 h-9 p-2 rounded bg-white text-black outline-none" />
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Adresse E-mail</label>
            <input v-model="form.email" type="email" required class="flex-1 h-9 p-2 rounded bg-white text-black outline-none" />
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Sécurité</label>
            <div class="flex-1 flex flex-col sm:flex-row gap-2 w-full">
              <input v-model="form.password" type="password" placeholder="Pass" required class="w-full sm:w-1/2 h-9 p-2 rounded bg-white text-black outline-none placeholder:text-[10px]" />
              <input v-model="form.password_confirmation" type="password" placeholder="Confirm" required class="w-full sm:w-1/2 h-9 p-2 rounded bg-white text-black outline-none placeholder:text-[10px]" />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Genre</label>
            <select v-model="form.genre" class="flex-1 h-9 px-2 py-1 rounded bg-white text-black outline-none appearance-none cursor-pointer">
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
            <span class="absolute right-2 top-2 text-[10px] pointer-events-none text-gray-400">&gt;</span>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Gr. Sanguin</label>
            <select v-model="form.groupe_sanguin" class="flex-1 h-9 py-1 px-2 rounded bg-white text-black outline-none appearance-none cursor-pointer">
              <option v-for="groupe in groupes" :key="groupe" :value="groupe">{{ groupe }}</option>
            </select>
            <span class="absolute right-2 top-2 text-[10px] pointer-events-none text-gray-400">&gt;</span>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Naissance</label>
            <input v-model="form.date_naissance" type="date" required class="flex-1 h-9 p-2 rounded bg-white text-black outline-none" />
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label class="w-full sm:w-28 text-left sm:text-right text-[10px] uppercase">Téléphone</label>
            <input v-model="form.telephone" type="tel" required class="flex-1 h-9 p-2 rounded bg-white text-black outline-none" />
          </div>

          <div class="text-center pt-2">
            <label class="text-[10px] italic opacity-80 cursor-pointer">
              <input v-model="form.accept_terms" type="checkbox" required class="accent-red-600 mr-1"> J'accepte les termes
            </label>
            
            <button :disabled="loading" type="submit" class="block w-40 mx-auto mt-4 bg-[#A62639] p-2 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors text-white disabled:opacity-50">
              <span v-if="!loading">S'inscrire</span>
              <span v-else>Traitement...</span>
            </button>

            <p class="mt-4 text-[10px] uppercase tracking-tighter opacity-70">
              Déjà un compte ? 
              <router-link to="/Connexion" class="text-red-500 font-bold hover:underline ml-1">Connectez-vous</router-link>
            </p>
          </div>
        </form>
      </div>

      <div class="w-full md:w-1/2 bg-white/80 p-8 flex flex-col items-center justify-center text-center">
        <img src="/image/sang.jpg" alt="Blood Donation" class="rounded shadow-lg mb-6 w-full h-56 object-cover" />
        <div class="text-[#A62639] font-black uppercase italic text-lg leading-tight">
          <p>Rejoignez notre cause.</p>
          <p>Sauvez des lives.</p>
          <p class="text-2xl mt-2 font-normal">❤️</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Utilisation de l'apiClient global pour Railway
import { apiClient } from '@/main';
import Swal from 'sweetalert2';

export default {
  name: 'InscriptionView',
  data() {
    return {
      loading: false,
      form: {
        nom_complet: '',
        email: '',
        password: '',
        password_confirmation: '',
        genre: 'Masculin',
        groupe_sanguin: 'A+',
        date_naissance: '',
        telephone: '',
        accept_terms: false
      },
      groupes: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    };
  },
  methods: {
    async handleInscription() {
      // 1. Validation mot de passe
      if (this.form.password !== this.form.password_confirmation) {
        Swal.fire('Oups', 'Les mots de passe ne correspondent pas !', 'error');
        return;
      }

      this.loading = true;
      try {
        // 2. Appel via apiClient vers Railway
        const response = await apiClient.post('/inscription', this.form);
        console.log(response.data);

        Swal.fire({
          title: 'Bienvenue !',
          text: 'Inscription réussie. Vous pouvez maintenant vous connecter.',
          icon: 'success',
          confirmButtonColor: '#A62639'
        });
        
        // 3. Redirection
        this.$router.push('/Connexion');
      } catch (error) {
        console.error("Erreur Inscription :", error);
        const message = error.response?.data?.message || "Une erreur est survenue lors de l'inscription.";
        Swal.fire('Erreur', message, 'error');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>