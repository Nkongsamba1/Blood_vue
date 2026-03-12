<template>
  <div class="min-h-screen bg-[#edf2f7] font-sans text-slate-700">
    <NavbarPersonnelComponent />

    <main class="max-w-[1200px] mx-auto p-4 md:p-8" v-if="user.id">
      
      <div class="relative mb-32">
        <div class="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-900 rounded-[3rem] shadow-2xl overflow-hidden relative">
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div class="absolute -bottom-24 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 bg-white p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-6 border border-white w-[90%] md:w-auto">
          <div class="relative">
            <div class="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner border-4 border-white overflow-hidden">
                <span v-if="!user.photo">👨‍⚕️</span>
                <img v-else :src="user.photo" class="w-full h-full object-cover">
            </div>
            <input type="file" ref="fileInput" @change="onFileChange" class="hidden" accept="image/*">
            <button @click="$refs.fileInput.click()" class="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </button>
          </div>
          <div class="text-center md:text-left">
            <h2 class="text-3xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">{{ user.name }}</h2>
            <p class="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1">Personnel Médical • ID #{{ user.id }}</p>
            <div class="flex gap-2 mt-4">
              <span class="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic">● En Service</span>
              <span class="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase italic">Rang: Senior</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 italic">Performances</h3>
            <div class="space-y-6">
              <div v-for="(val, label) in stats" :key="label" class="flex justify-between items-end">
                <div>
                  <p class="text-[9px] font-black uppercase text-blue-400 tracking-widest">{{ label.replace('_', ' ') }}</p>
                  <p class="text-3xl font-black italic">{{ val }}</p>
                </div>
                <div class="w-12 h-1 bg-white/10 rounded-full mb-2">
                    <div class="h-full bg-blue-500" :style="{width: '70%'}"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">Badge de Sécurité</h3>
            <div class="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-200">
               <div class="text-center p-4">
                  <div class="w-32 h-32 bg-slate-800 rounded-2xl mx-auto mb-4 flex items-center justify-center p-2">
                      <div class="grid grid-cols-4 gap-1 w-full h-full">
                          <div v-for="n in 16" :key="n" :class="Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'" class="rounded-sm"></div>
                      </div>
                  </div>
                  <p class="text-[9px] font-black text-slate-400 uppercase">Scanner pour accès rapide</p>
               </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8 bg-white rounded-[3rem] p-10 shadow-xl border border-white">
          <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-10">Paramètres du <span class="text-blue-600">Compte</span></h3>
          
          <form @submit.prevent="saveProfile" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Nom Complet</label>
                <input v-model="user.name" type="text" required class="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Adresse Email</label>
                <input v-model="user.email" type="email" required class="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Téléphone Pro</label>
                <input v-model="user.telephone" type="text" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              <div class="space-y-3">
                <label class="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Nouveau Mot de Passe</label>
                <input v-model="password" type="password" placeholder="Laisser vide si inchangé" class="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
            </div>

            <div class="pt-6 border-t border-slate-100 flex justify-between items-center">
                <button type="button" @click="handleLogout" class="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline">Déconnexion</button>
                <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase italic shadow-xl shadow-blue-100 hover:scale-105 transition-all disabled:opacity-50">
                    {{ loading ? 'Enregistrement...' : 'Enregistrer les modifications' }}
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
import axios from 'axios';
import { useRouter } from 'vue-router';

import NavbarPersonnelComponent from '@/components/NavbarPersonnelComponent.vue';

const router = useRouter();
const user = ref({ name: '', email: '', telephone: '', id: null, photo: null });
const stats = ref({ dons_valides: 0, examens_realises: 0, heures_garde: 0 });
const password = ref('');
const selectedFile = ref(null);
const loading = ref(false);

const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

const fetchProfile = async () => {
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/personnel/me`, config);
    user.value = res.data.user;
    stats.value = res.data.stats;
  } catch (e) {
    console.error("Erreur de chargement", e);
    // Optionnel: rediriger vers login si 401
  }
};

const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile.value = file;
        user.value.photo = URL.createObjectURL(file); // Prévisualisation
    }
};

const saveProfile = async () => {
    loading.value = true;
    try {
        const formData = new FormData();
        formData.append('name', user.value.name);
        formData.append('email', user.value.email);
        formData.append('telephone', user.value.telephone);
        if (password.value) formData.append('password', password.value);
        if (selectedFile.value) formData.append('photo', selectedFile.value);

        await axios.post('${process.env.VUE_APP_API_URL}/api/personnel/update-profile', formData, {
            headers: { 
                ...config.headers,
                'Content-Type': 'multipart/form-data'
            }
        });
        
        alert("Profil mis à jour avec succès !");
        password.value = '';
        selectedFile.value = null;
    } catch (e) {
        alert("Erreur: " + (e.response?.data?.message || "Inconnue"));
    } finally {
        loading.value = false;
    }
};

const handleLogout = async () => {
    if(confirm("Voulez-vous vous déconnecter ?")) {
        localStorage.removeItem('token');
        router.push('/login');
    }
};

onMounted(fetchProfile);
</script>