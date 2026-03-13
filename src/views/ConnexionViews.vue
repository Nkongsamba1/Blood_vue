<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
    
    <div 
      class="absolute inset-0 bg-cover bg-center scale-110" 
      style="background-image: url('/image/hopital.jpg'); filter: blur(2px);">
    </div>
    <div class="absolute inset-0 bg-black/40"></div>

    <div class="z-10 max-w-4xl w-full flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-sans">
      
      <div class="w-full md:w-1/2 bg-black/80 p-10 text-white">
        <div class="text-center mb-10">
          <div class="flex justify-center items-center gap-2 mb-2">
            <div class="bg-[#A62639] text-white p-1 rounded font-bold">KG</div>
            <h1 class="font-black text-2xl uppercase tracking-tighter">Stores</h1>
          </div>
          <p class="uppercase tracking-[0.4em] text-[9px] font-bold text-gray-400">Portail Sécurisé</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="flex flex-col gap-1">
            <label class="text-[9px] uppercase font-black tracking-widest text-red-500 ml-1">Identifiant Email</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required 
              placeholder="votre@email.com"
              class="w-full h-11 px-4 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-[#A62639] transition-all font-medium text-sm" 
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[9px] uppercase font-black tracking-widest text-red-500 ml-1">Clé de Sécurité</label>
            <div class="relative">
              <input 
                v-model="loginForm.password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required 
                class="w-full h-11 px-4 pr-12 rounded-xl bg-white text-black outline-none focus:ring-2 focus:ring-[#A62639] transition-all font-medium text-sm" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#A62639] transition-colors"
              >
                <span class="text-[8px] font-black uppercase">{{ showPassword ? 'Masquer' : 'Afficher' }}</span>
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center px-1">
            <label class="text-[10px] font-bold text-gray-400 cursor-pointer flex items-center gap-2 hover:text-white transition-colors">
              <input v-model="loginForm.remember" type="checkbox" class="accent-[#A62639] w-3 h-3"> Se souvenir
            </label>
            <a href="#" class="text-[10px] font-bold text-gray-500 hover:text-red-400 italic">Oubli ?</a>
          </div>

          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full mt-4 bg-[#A62639] py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Vérification...
            </span>
            <span v-else>Accéder au Tableau de Bord</span>
          </button>
          
          <p class="text-center text-[10px] mt-8 text-gray-500 font-bold uppercase tracking-widest">
            Nouveau donneur ? 
            <router-link to="/Inscription" class="text-red-500 hover:text-white transition-colors ml-1">S'enregistrer</router-link>
          </p>
        </form>
      </div>

      <div class="hidden md:flex w-1/2 bg-white/90 p-12 flex-col items-center justify-center text-center">
        <div class="relative w-full">
           <img 
            src="/image/sang.jpg" 
            alt="Don de sang"
            class="rounded-[2rem] shadow-2xl mb-8 w-full h-72 object-cover border-[6px] border-white" 
          />
          <div class="absolute -bottom-4 -right-4 bg-[#A62639] text-white p-4 rounded-2xl shadow-lg rotate-3">
             <p class="text-2xl font-black italic">❤️</p>
          </div>
        </div>
        
        <div class="space-y-2 mt-4">
          <h2 class="text-[#A62639] font-black uppercase italic text-2xl tracking-tighter">Héro du quotidien.</h2>
          <p class="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Connectez-vous pour sauver des vies</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/main'; // Utilisation de l'instance centralisée
import Swal from 'sweetalert2';

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);

const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});

const handleLogin = async () => {
  loading.value = true;
  try {
    // 1. Initialiser le système de sécurité de Laravel (indispensable en production)
    await apiClient.get('/sanctum/csrf-cookie');

    // 2. Envoyer les identifiants
    const response = await apiClient.post('/connexion', loginForm);

    // 3. EXTRACTION SÉCURISÉE (On vérifie les deux noms possibles : access_token ou token)
    const token = response.data.access_token || response.data.token;
    const user = response.data.user;

    if (token) {
      // 4. STOCKAGE IMMÉDIAT
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 5. REDIRECTION SELON LE RÔLE
      const role = user.role_utilisateur;
      
      if (role === 'admin') {
        router.push('/AdminDashboard');
      } else if (role === 'personnel') {
        router.push('/PersonnelDashboard');
      } else {
        router.push('/Dash_user');
      }

      // Petit toast de succès
      Swal.fire({
        icon: 'success',
        title: `Bienvenue, ${user.nom_complet}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      throw new Error("Token non reçu du serveur");
    }

  } catch (error) {
    console.error("Erreur de connexion détaillée:", error.response?.data);
    const message = error.response?.data?.message || "Identifiants invalides.";
    
    Swal.fire({
      icon: 'error',
      title: 'Erreur d\'accès',
      text: message,
      confirmButtonColor: '#A62639'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Focus personnalisé */
input:focus {
  transform: translateY(-1px);
}

/* Animation douce pour le background */
@keyframes slowZoom {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.2); }
}

.bg-cover {
  animation: slowZoom 20s infinite alternate ease-in-out;
}
</style>