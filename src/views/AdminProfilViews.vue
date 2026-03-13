<template>
  <div class="flex min-h-screen bg-[#eeeded] font-sans text-slate-800">
    
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#eeeded] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-[#A62639] rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-bounce">👤</span>
        </div>
      </div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Accès au profil sécurisé...
      </p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div class="ml-12 lg:ml-0">
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Mon Profil</h2>
          <p class="text-[8px] lg:text-[10px] font-bold text-[#A62639] uppercase tracking-widest mt-1">Paramètres du compte administrateur</p>
        </div>
      </header>

      <div class="flex-1 p-6 lg:p-12 bg-[#fafafa]">
        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div class="space-y-6 animate-slide-up" style="animation-delay: 0.1s">
            <div class="bg-slate-900 p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
              <div class="relative z-10">
                <div class="relative w-32 h-32 lg:w-36 lg:h-36 mx-auto mb-6 cursor-pointer" @click="fileInput.click()">
                  <div class="w-full h-full bg-[#A62639] rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black italic shadow-xl border-4 border-white/10 overflow-hidden transition-transform group-hover:scale-95">
                    <img v-if="user.photo" :src="user.photo.startsWith('http') ? user.photo : `http://127.0.0.1:8000/storage/${user.photo}`" class="w-full h-full object-cover">
                    <span v-else>{{ user.nom_complet?.charAt(0) }}</span>
                  </div>
                  <div class="absolute inset-0 bg-black/50 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-[9px] font-black text-white uppercase italic text-center px-2">Modifier</span>
                  </div>
                </div>
                
                <input type="file" ref="fileInput" class="hidden" @change="handleImageUpload" accept="image/*">

                <h3 class="text-white font-black uppercase italic tracking-tighter text-xl truncate px-2">{{ user.nom_complet }}</h3>
                <p class="text-[#A62639] font-bold text-[9px] lg:text-[10px] uppercase tracking-[0.2em] mt-2">{{ user.role_utilisateur }}</p>
              </div>
              <div class="absolute -right-10 -top-10 text-[10rem] opacity-5 text-white italic font-black select-none">PRO</div>
            </div>

            <button @click="handleLogout" class="w-full py-5 bg-white border border-slate-200 rounded-2xl lg:rounded-[1.5rem] text-[10px] font-black uppercase text-[#A62639] hover:bg-red-50 transition-all shadow-sm">
              🚪 Déconnexion sécurisée
            </button>
          </div>

          <div class="lg:col-span-2 space-y-8 animate-slide-up" style="animation-delay: 0.2s">
            <div class="bg-white p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100">
              
              <form @submit.prevent="updateProfile" class="space-y-8">
                <h4 class="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest italic mb-4 border-l-4 border-[#A62639] pl-4">Données Personnelles</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Nom Complet</label>
                    <input v-model="form.nom_complet" type="text" class="custom-input" placeholder="Ex: Jean Dupont">
                  </div>
                  <div class="space-y-2">
                    <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Email de Contact</label>
                    <input v-model="form.email" type="email" class="custom-input" placeholder="admin@kstores.com">
                  </div>
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] lg:rounded-[2rem] font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] hover:bg-[#A62639] transition-all shadow-xl">
                      Sauvegarder les modifications
                    </button>
                </div>
              </form>

              <div class="mt-12 pt-10 border-t border-slate-50">
                <h4 class="text-[10px] lg:text-xs font-black text-[#A62639] uppercase tracking-widest italic mb-8 border-l-4 border-[#A62639] pl-4">Sécurité & Authentification</h4>
                <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Mot de passe actuel</label>
                      <input v-model="passwords.old_password" type="password" placeholder="••••••••" class="custom-input">
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-4">
                      <div class="flex-1 space-y-2">
                        <label class="text-[9px] font-black uppercase text-slate-400 ml-4 italic">Nouveau mot de passe</label>
                        <input v-model="passwords.new_password" type="password" placeholder="Min. 8 caractères" class="custom-input">
                      </div>
                      <button @click="handleUpdatePassword" class="md:self-end bg-[#A62639] text-white px-8 py-4 rounded-xl lg:rounded-2xl text-[10px] font-black uppercase hover:bg-slate-900 transition shadow-lg">
                        Mettre à jour
                      </button>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <FooterAdminComponent />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '@/main';
import Swal from 'sweetalert2';
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue'; 

const router = useRouter();
const loading = ref(true);
const fileInput = ref(null);

const user = ref({ nom_complet: '', role_utilisateur: '', photo: null });
const form = reactive({ nom_complet: '', email: '' });
const passwords = reactive({ old_password: '', new_password: '' });

const fetchUserProfile = async () => {
  try {
    const res = await apiClient.get('/user-profile');
    user.value = res.data;
    form.nom_complet = res.data.nom_complet;
    form.email = res.data.email;
  } catch (e) {
    console.error("Erreur de profil", e);
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  try {
    await apiClient.put(`/users/${user.value.utilisateur_id}`, form);
    
    // Mise à jour locale du nom
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if(storedUser) {
        storedUser.nom_complet = form.nom_complet;
        localStorage.setItem('user', JSON.stringify(storedUser));
    }

    Swal.fire({ 
      icon: 'success', 
      title: 'Profil mis à jour', 
      background: '#1e293b', 
      color: '#fff', 
      toast: true, 
      position: 'top-end', 
      showConfirmButton: false, 
      timer: 3000 
    });
    fetchUserProfile();
  } catch (e) {
    Swal.fire('Erreur', 'Impossible de sauvegarder les données', 'error');
  }
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validation taille (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return Swal.fire('Fichier trop lourd', 'La photo ne doit pas dépasser 2Mo', 'warning');
  }

  const formData = new FormData();
  formData.append('photo', file);

  try {
    const response = await apiClient.post('/admin/profil/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.photo_url) {
      user.value.photo = response.data.photo_url;
      // Mise à jour du localStorage pour que la Navbar affiche la nouvelle image
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.photo = response.data.photo_url;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      Swal.fire({ icon: 'success', title: 'Photo mise à jour !', background: '#1e293b', color: '#fff', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
  } catch (error) {
    Swal.fire('Erreur', "Le serveur n'a pas pu traiter l'image.", 'error');
  }
};

const handleUpdatePassword = async () => {
  if (!passwords.old_password || !passwords.new_password) {
    return Swal.fire('Attention', 'Veuillez remplir les deux champs de mot de passe', 'warning');
  }
  try {
    await apiClient.put('/admin/password/update', passwords);
    Swal.fire({ icon: 'success', title: 'Sécurité renforcée', text: 'Votre mot de passe a été modifié.', background: '#1e293b', color: '#fff' });
    passwords.old_password = '';
    passwords.new_password = '';
  } catch (error) {
    Swal.fire('Erreur', error.response?.data?.message || "L'ancien mot de passe est incorrect", 'error');
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

onMounted(fetchUserProfile);
</script>

<style scoped>
.custom-input {
  @apply w-full bg-slate-50 border border-slate-100 rounded-xl lg:rounded-[1.2rem] p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-[#A62639] transition-all;
}

.animate-fade-in { animation: fadeIn 0.5s ease-out both; }
.animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>