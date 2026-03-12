<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
    <NavbarUserComponent />

    <main class="max-w-6xl mx-auto p-6 md:p-12">
      <div v-if="loading" class="text-center py-20 font-black uppercase animate-pulse text-red-600">
        Récupération de vos données...
      </div>

      <div v-else class="flex flex-col md:flex-row gap-12 items-start">
        
        <div class="w-full md:w-[40%] space-y-8">
          
          <div class="bg-[#e11d48] rounded-[2rem] p-8 text-white shadow-2xl shadow-red-200 relative overflow-hidden">
            <div class="flex items-center gap-6 relative z-10">
              <div class="relative group cursor-pointer" @click="fileInput.click()">
                <img :src="profileData.photo || 'https://i.pravatar.cc/150?u=jean'" 
                     class="w-20 h-20 rounded-full border-4 border-white/20 object-cover shadow-lg group-hover:opacity-75 transition-all">
                
                <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-[8px] font-black uppercase text-white tracking-tighter">Modifier</span>
                </div>

                <input type="file" ref="fileInput" class="hidden" @change="handleImageUpload" accept="image/*">
              </div>

              <div>
                <h2 class="font-black text-xl uppercase leading-none">{{ profileData.nom_complet || 'Utilisateur' }}</h2>
                <p class="text-[10px] opacity-80 uppercase tracking-widest mt-1">Donneur Enregistré</p>
              </div>
              <div class="ml-auto text-6xl font-black italic opacity-40">{{ profileData.groupe_sanguin }}</div>
            </div>
            <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b pb-2">Informations Actuelles</h3>
              <div class="space-y-3 text-[11px] font-bold">
                <div class="flex justify-between"><span class="text-gray-400 uppercase">Nom :</span> <span class="text-gray-900">{{ profileData.nom_complet }}</span></div>
                <div class="flex justify-between"><span class="text-gray-400 uppercase">Genre :</span> <span class="text-gray-900">{{ profileData.genre }}</span></div>
                <div class="flex justify-between"><span class="text-gray-400 uppercase">Email :</span> <span class="text-gray-900">{{ profileData.email }}</span></div>
                <div class="flex justify-between"><span class="text-gray-400 uppercase">Tel :</span> <span class="text-gray-900">{{ profileData.telephone }}</span></div>
              </div>
            </div>

            <button @click="handleUpdateProfil" class="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95">
              Sauvegarder les modifications
            </button>
          </div>
        </div>

        <div class="w-full md:w-[60%] space-y-6">
          <div class="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-50">
            <h1 class="text-3xl font-black text-red-600 uppercase italic mb-10 tracking-tighter">Modifier mes informations</h1>
            
            <form @submit.prevent class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="text-[9px] font-black text-gray-400 ml-2">NOM COMPLET</label>
                    <input v-model="profileData.nom_complet" type="text" class="input-styled">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-black text-gray-400 ml-2">DATE DE NAISSANCE</label>
                    <input v-model="profileData.date_naissance" type="date" class="input-styled">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-black text-gray-400 ml-2">EMAIL</label>
                    <input v-model="profileData.email" type="email" class="input-styled">
                </div>
                <div class="space-y-1">
                    <label class="text-[9px] font-black text-gray-400 ml-2">TÉLÉPHONE</label>
                    <input v-model="profileData.telephone" type="text" class="input-styled">
                </div>
              </div>

              <div class="space-y-4 pt-6 border-t border-gray-50">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-gray-300">Sécurité (Mot de passe)</h3>
                <input v-model="passwords.old_password" type="password" placeholder="ANCIEN MOT DE PASSE" class="input-styled">
                <div class="flex gap-2">
                   <input v-model="passwords.new_password" type="password" placeholder="NOUVEAU MOT DE PASSE" class="input-styled">
                   <button @click="handleUpdatePassword" type="button" class="bg-[#1e293b] text-white px-6 rounded-xl text-[10px] font-black uppercase hover:bg-black transition">Mettre à jour</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import NavbarUserComponent from '@/components/NavbarUserComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const loading = ref(true);
const fileInput = ref(null);

const profileData = ref({
  nom_complet: '',
  email: '',
  groupe_sanguin: '',
  telephone: '',
  genre: '',
  date_naissance: '',
  photo: null
});

const passwords = reactive({ old_password: '', new_password: '' });

// 1. CHARGEMENT DES DONNÉES
const fetchProfil = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/donneur/profil`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    profileData.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error("Erreur de récupération :", error);
    loading.value = false;
  }
};

// 2. MISE À JOUR DU PROFIL (TEXTE)
const handleUpdateProfil = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put('${import.meta.env.VITE_API_URL}/api/donneur/profil/update', profileData.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.user) {
      profileData.value = response.data.user;

      // Mise à jour du localStorage pour la Navbar
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.nom_complet = response.data.user.nom_complet;
        storedUser.email = response.data.user.email;
        storedUser.photo = response.data.user.photo;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      alert("Profil mis à jour avec succès !");
    }
  } catch (error) {
    alert("Erreur lors de la sauvegarde.");
  }
};

// 3. UPLOAD DE L'IMAGE
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('${import.meta.env.VITE_API_URL}/api/donneur/profil/photo', formData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data' 
      }
    });

    if (response.data.photo_url) {
      profileData.value.photo = response.data.photo_url;
      
      // Sync avec localStorage pour persistance immédiate
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.photo = response.data.photo_url;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      alert("Photo de profil mise à jour !");
    }
  } catch (error) {
    alert("Erreur lors de l'importation de l'image.");
  }
};

// 4. CHANGEMENT MOT DE PASSE
const handleUpdatePassword = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put('${import.meta.env.VITE_API_URL}/api/donneur/password/update', passwords, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Mot de passe mis à jour !");
    passwords.old_password = '';
    passwords.new_password = '';
  } catch (error) {
    alert(error.response?.data?.message || "Erreur mot de passe.");
  }
};

onMounted(fetchProfil);
</script>

<style scoped>
.input-styled {
  @apply w-full bg-[#f8fafc] border border-gray-200 rounded-2xl p-4 text-[10px] font-bold uppercase tracking-widest outline-none transition-all focus:bg-white focus:border-red-500;
}
main { animation: slideUp 0.8s ease-out; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>