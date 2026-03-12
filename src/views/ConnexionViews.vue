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
          <p class="uppercase tracking-widest text-xs mt-1">Connexion au Portail</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="flex items-center gap-2">
            <label class="w-28 text-right text-[10px] uppercase font-bold">Adresse E-mail</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="votre@email.com"
              class="flex-1 h-9 p-2 rounded bg-white text-black outline-none focus:ring-2 focus:ring-red-600 transition-all" 
            />
          </div>

          <div class="flex items-center gap-2">
            <label class="w-28 text-right text-[10px] uppercase font-bold">Sécurité</label>
            <div class="flex-1 relative">
              <input 
                v-model="loginForm.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Votre mot de passe" 
                required 
                class="w-full h-9 p-2 pr-12 rounded bg-white text-black outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-[10px]" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-red-600 transition-colors"
              >
                <span class="text-[9px] font-black uppercase">{{ showPassword ? 'Cacher' : 'Voir' }}</span>
              </button>
            </div>
          </div>

          <div class="text-center pt-2">
            <label class="text-[10px] italic opacity-80 cursor-pointer hover:opacity-100">
              <input v-model="loginForm.remember" type="checkbox" class="accent-red-600 mr-1"> Rester connecté
            </label>
            
            <button 
              type="submit" 
              :disabled="loading" 
              class="block w-48 mx-auto mt-6 bg-[#A62639] p-2.5 rounded text-xs font-bold uppercase hover:bg-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Authentification...</span>
              <span v-else>Se Connecter</span>
            </button>
            
            <p class="text-[10px] mt-6 opacity-70 uppercase tracking-tighter">
              Pas encore de compte ? 
              <router-link to="/Inscription" class="text-red-500 font-black hover:underline ml-1">Créer un compte</router-link>
            </p>
          </div>
        </form>
      </div>

      <div class="w-full md:w-1/2 bg-white/80 p-8 flex flex-col items-center justify-center text-center">
        <img 
          src="/image/sang.jpg" 
          alt="Don de sang"
          class="rounded-xl shadow-xl mb-6 w-full h-64 object-cover border-4 border-white" 
        />
        <div class="text-[#A62639] font-black uppercase italic text-xl leading-tight">
          <p class="tracking-tighter">Chaque don compte.</p>
          <p class="text-black/80 text-sm not-italic font-medium mt-1">Système de Gestion Hospitalière</p>
          <p class="text-3xl mt-4 animate-pulse">❤️</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ConnexionView',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      showPassword: false,
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      try {
        // Envoi vers ton API Laravel
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/connexion`, this.loginForm);

        // 1. Sauvegarde du Token et des infos utilisateur
        const token = response.data.access_token;
        const user = response.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Configuration globale d'Axios pour les futures requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2. Redirection selon le rôle (MCD : admin, personnel, donneur)
        const role = user.role_utilisateur;

        if (role === 'admin') {
          this.$router.push('/AdminDashboard');
        } else if (role === 'personnel') {
          this.$router.push('/PersonnelDashboard');
        } else {
          // Par défaut vers la vue utilisateur (Donneur)
          this.$router.push('/Dash_user');
        }

        console.log("Connexion réussie en tant que :", role);
      } catch (error) {
        console.error("Erreur de connexion :", error.response?.data);
        const message = error.response?.data?.message || "Identifiants incorrects ou erreur serveur.";
        alert(message);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>