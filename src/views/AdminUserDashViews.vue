<template>
  <div class="flex min-h-screen bg-[#fafafa] font-sans text-slate-800">
    
    <NavbarAdminComponent />

    <div v-if="loading" class="fixed inset-0 z-[100] bg-[#fafafa] flex flex-col items-center justify-center">
      <div class="relative">
        <div class="w-24 h-24 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl animate-bounce">🔐</span>
        </div>
      </div>
      <p class="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">
        Sécurisation des accès...
      </p>
    </div>

    <div v-else class="flex-1 flex flex-col min-w-0 animate-fade-in">
      
      <header class="h-24 lg:h-28 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-12 border-b border-slate-100 sticky top-0 z-20">
        <div class="ml-12 lg:ml-0">
          <h2 class="text-xl lg:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Gestion d'Équipe</h2>
          <p class="text-[8px] lg:text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Contrôle des accès & annuaire</p>
        </div>
        
        <div class="hidden sm:flex bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          <p class="text-[10px] font-black text-slate-900 italic">Total : {{ personnel.length + donneurs.length }} utilisateurs</p>
        </div>
      </header>

      <div class="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div class="flex flex-col xl:flex-row gap-8 lg:gap-12 min-h-full">
          
          <section class="flex-[1.5] flex flex-col gap-6 animate-slide-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between px-4">
              <h3 class="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">⚕️ Personnel Médical</h3>
              <span class="bg-blue-50 text-blue-600 text-[9px] lg:text-[10px] font-black px-3 py-1 rounded-full uppercase">{{ personnel.length }} Membres</span>
            </div>

            <div class="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50/50">
                      <th class="p-6 lg:p-8 text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Membre</th>
                      <th class="p-6 lg:p-8 text-[9px] font-black uppercase text-slate-400 tracking-widest italic">Rôle</th>
                      <th class="p-6 lg:p-8 text-[9px] font-black uppercase text-slate-400 tracking-widest italic text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="user in personnel" :key="user.utilisateur_id" class="group hover:bg-slate-50/30 transition-colors">
                      <td class="p-6 lg:p-8">
                        <div class="flex items-center gap-4">
                          <div class="w-10 h-10 shrink-0 rounded-xl bg-[#111] text-white flex items-center justify-center font-black italic shadow-lg">
                            {{ user.nom_complet.charAt(0) }}
                          </div>
                          <div class="min-w-0">
                            <p class="text-xs font-black text-slate-900 truncate uppercase italic">{{ user.nom_complet }}</p>
                            <p class="text-[9px] font-bold text-slate-400 truncate uppercase tracking-tighter">{{ user.email }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="p-6 lg:p-8">
                        <select 
                          @change="updateUserRole(user, $event.target.value)"
                          class="bg-slate-100 border-none rounded-lg text-[9px] font-black uppercase tracking-widest px-3 py-2 cursor-pointer focus:ring-2 focus:ring-red-500 outline-none transition-all"
                          :class="user.role_utilisateur === 'admin' ? 'text-red-600 bg-red-50' : 'text-slate-600'"
                        >
                          <option value="admin" :selected="user.role_utilisateur === 'admin'">ADMIN</option>
                          <option value="personnel" :selected="user.role_utilisateur === 'personnel'">PERSONNEL</option>
                        </select>
                      </td>
                      <td class="p-6 lg:p-8 text-right">
                        <button @click="deleteUser(user.utilisateur_id)" class="opacity-0 group-hover:opacity-100 transition-all text-slate-300 hover:text-red-600 text-lg px-2">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section class="flex-1 flex flex-col gap-6 animate-slide-up" style="animation-delay: 0.3s">
            <div class="flex items-center justify-between px-4">
              <h3 class="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-slate-400 italic">🩸 Donneurs Inscrits</h3>
              <span class="bg-red-50 text-red-600 text-[9px] lg:text-[10px] font-black px-3 py-1 rounded-full uppercase">{{ donneurs.length }} Inscrits</span>
            </div>

            <div class="bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden flex-1 overflow-y-auto max-h-[600px] xl:max-h-none custom-scroll">
              <div v-for="donneur in donneurs" :key="donneur.utilisateur_id" 
                   class="p-6 lg:p-8 border-b border-slate-50 hover:bg-red-50/20 transition flex items-center justify-between group">
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black italic">
                     {{ donneur.nom_complet.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-black text-slate-900 uppercase italic truncate">{{ donneur.nom_complet }}</p>
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">{{ donneur.email }}</p>
                  </div>
                </div>
                <button @click="promoteToStaff(donneur)" class="hidden group-hover:block bg-[#111] text-white text-[8px] font-black px-4 py-2 rounded-full uppercase tracking-widest hover:bg-red-600 transition-colors shrink-0 shadow-lg">
                  Promouvoir ⚡
                </button>
              </div>
              
              <div v-if="donneurs.length === 0" class="p-12 text-center text-[10px] font-black uppercase text-slate-300 italic">
                Aucun donneur inscrit
              </div>
            </div>
          </section>

        </div>
      </div>

      <FooterAdminComponent />
    </div>
  </div>
</template>

<script setup>
import FooterAdminComponent from '@/components/FooterAdminComponent.vue';
import NavbarAdminComponent from '@/components/NavbarAdminComponent.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const personnel = ref([]);
const donneurs = ref([]);
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`${process.env.VUE_APP_API_URL}/api/users`);
    personnel.value = res.data.personnel;
    donneurs.value = res.data.donneurs;
  } catch (e) {
    console.error("Erreur de chargement", e);
  } finally {
    setTimeout(() => { loading.value = false; }, 800);
  }
};

const updateUserRole = async (user, newRole) => {
  try {
    await axios.put(`${process.env.VUE_APP_API_URL}/api/users/${user.utilisateur_id}`, {
      role_utilisateur: newRole
    });
    
    Swal.fire({
      icon: 'success',
      title: '<span class="italic font-black uppercase text-sm">Accès Modifié</span>',
      text: `${user.nom_complet} est désormais ${newRole.toUpperCase()}`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#111',
      color: '#fff'
    });

    fetchData();
  } catch (e) {
    Swal.fire('Erreur', 'Impossible de modifier le rôle', 'error');
  }
};

const deleteUser = async (id) => {
  const result = await Swal.fire({
    title: '<span class="italic font-black uppercase">Confirmation</span>',
    text: "Voulez-vous vraiment supprimer cet utilisateur ?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#111',
    confirmButtonText: 'SUPPRIMER',
    cancelButtonText: 'ANNULER'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${process.env.VUE_APP_API_URL}/api/users/${id}`);
      Swal.fire({
        title: 'Supprimé !',
        text: 'L\'utilisateur a été retiré.',
        icon: 'success',
        confirmButtonColor: '#111'
      });
      fetchData();
    } catch (e) {
      Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
    }
  }
};

const promoteToStaff = (user) => {
  updateUserRole(user, 'personnel');
};

onMounted(fetchData);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out both;
}

.animate-slide-up {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar élégante pour la liste des donneurs */
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #ddd;
}
</style>