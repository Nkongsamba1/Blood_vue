<template>
  <div class="min-h-screen bg-[#edf2f7] font-sans text-slate-700">
    <NavbarPersonnelComponent />

    <div v-if="isInitialLoading" class="flex flex-col justify-center items-center min-h-[80vh]">
      <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="mt-4 font-black text-blue-600 animate-pulse uppercase tracking-widest text-xs">Synchronisation base de données...</p>
    </div>

    <main class="max-w-[1200px] mx-auto p-4 md:p-8" v-else>
      <div class="relative mb-20 md:mb-24">
        <div class="h-40 md:h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden relative">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 bg-white p-5 md:p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-6 border border-white w-[85%] md:w-auto min-w-[300px]">
          <div class="relative">
            <div class="w-28 h-28 md:w-32 md:h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border-4 border-white overflow-hidden">
                <span v-if="!user.photo">👨‍⚕️</span>
                <img v-else :src="user.photo" class="w-full h-full object-cover">
            </div>
            <input type="file" ref="fileInput" @change="onFileChange" class="hidden" accept="image/*">
            <button @click="$refs.fileInput.click()" class="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
          </div>
          <div class="text-center md:text-left">
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">{{ user.name }}</h2>
            <p class="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-2">Personnel Médical • ID #{{ user.id }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-24 md:mt-16">
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 italic">Performances Réelles</h3>
            <div class="space-y-8">
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[9px] font-black uppercase text-blue-400 tracking-widest">Dons Effectués</p>
                  <p class="text-4xl font-black italic">{{ stats.dons_valides }}</p>
                </div>
                <div class="text-blue-500 mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
              </div>
              <div class="flex justify-between items-end border-t border-white/10 pt-6">
                <div>
                  <p class="text-[9px] font-black uppercase text-blue-400 tracking-widest">Examens Réalisés</p>
                  <p class="text-4xl font-black italic">{{ stats.examens_realises }}</p>
                </div>
                <div class="text-indigo-400 mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 bg-white rounded-[3rem] p-10 shadow-xl border border-white">
          <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-10">Sécurité & <span class="text-blue-600">Profil</span></h3>
          
          <form @submit.prevent="saveProfile" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="label-style">Nom Complet</label>
                <input v-model="user.name" type="text" required class="input-style">
              </div>
              <div class="space-y-3">
                <label class="label-style">Adresse Email</label>
                <input v-model="user.email" type="email" required class="input-style">
              </div>
              <div class="space-y-3">
                <label class="label-style">Ancien Mot de Passe</label>
                <input v-model="old_password" type="password" placeholder="Obligatoire pour changer" class="input-style">
              </div>
              <div class="space-y-3">
                <label class="label-style">Nouveau Mot de Passe</label>
                <input v-model="password" type="password" placeholder="Laisser vide si inchangé" class="input-style">
              </div>
            </div>

            <div class="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button type="button" @click="handleLogout" class="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline">Déconnexion</button>
                <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase italic shadow-xl shadow-blue-100 hover:scale-105 transition-all disabled:opacity-50">
                    {{ loading ? 'Synchronisation...' : 'Enregistrer les modifications' }}
                </button>
            </div>
          </form>
        </div>
      </div>
    </main>
    <FooterPersonnelComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { apiClient } from '@/main'; 
import NavbarPersonnelComponent from '@/components/NavbarPersonnelComponent.vue';
import FooterPersonnelComponent from '@/components/FooterPersonnelComponent.vue';

const router = useRouter();
const user = ref({ name: '', email: '', id: null, photo: null });
const stats = ref({ dons_valides: 0, examens_realises: 0 }); // Heures supprimées
const old_password = ref('');
const password = ref('');
const selectedFile = ref(null);
const loading = ref(false);
const isInitialLoading = ref(true);

const fetchProfile = async () => {
  try {
    const res = await apiClient.get('/personnel/profils');
    user.value = res.data.user;
    stats.value = res.data.stats;

    Swal.fire({
      icon: 'success', title: 'Données synchronisées', toast: true,
      position: 'top-end', showConfirmButton: false, timer: 2000,
      background: '#1e293b', color: '#fff'
    });
  } catch (e) {
    Swal.fire('Erreur', 'Échec de connexion avec la base de données', 'error');
    if(e.response?.status === 401) router.push('/login');
  } finally {
    isInitialLoading.value = false;
  }
};

const saveProfile = async () => {
  // 1. Validation de sécurité pour le mot de passe
  if (password.value && !old_password.value) {
    return Swal.fire('Attention', "L'ancien mot de passe est requis pour modifier le nouveau.", 'warning');
  }

  loading.value = true;
  
  try {
    const formData = new FormData();
    formData.append('name', user.value.name);
    formData.append('email', user.value.email);
    
    // Ajout des mots de passe si remplis
    if (old_password.value) formData.append('old_password', old_password.value);
    if (password.value) formData.append('password', password.value);
    
    // Ajout de la photo si un nouveau fichier a été choisi
    if (selectedFile.value) {
      formData.append('photo', selectedFile.value);
    }

    // 2. Envoi des données au serveur
    // On récupère la réponse (res) pour obtenir la nouvelle URL de l'image
    const res = await apiClient.post('/personnel/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // 3. MISE À JOUR SYNCHRONE DE L'IMAGE
    // Si le serveur renvoie la nouvelle URL, on l'applique direct au profil
    if (res.data.photo_url) {
      user.value.photo = res.data.photo_url;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Profil mis à jour',
      text: 'Les données et l’image ont été synchronisées avec succès.',
      timer: 2000,
      showConfirmButton: false
    });

    // Nettoyage des champs de mot de passe
    password.value = '';
    old_password.value = '';
    selectedFile.value = null;
    
    // Optionnel : on rafraîchit quand même pour être sûr des stats
    fetchProfile(); 

  } catch (e) {
    console.error("Erreur sync:", e);
    const errorMsg = e.response?.data?.message || 'Une erreur est survenue lors de la synchronisation.';
    Swal.fire('Erreur de base de données', errorMsg, 'error');
  } finally {
    loading.value = false;
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    user.value.photo = URL.createObjectURL(file);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(fetchProfile);
</script>

<style scoped>
.label-style { @apply text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4; }
.input-style { @apply w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all; }
main { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>