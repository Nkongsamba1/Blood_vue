// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Import des composants/pages
import InscriptionViews from '../views/InscriptionViews.vue'
import ConnexionViews from '../views/ConnexionViews.vue'
import HomeViews from '../views/HomeViews.vue'
import Dash_userViews from '../views/Dash_userViews.vue'
import ProfilUserViews from '@/views/ProfilUserViews.vue'
import HistoriqueUserViews from '@/views/HistoriqueUserViews.vue'
import ReservationUserViews from '@/views/ReservationUserViews.vue'
import PersonnelDashboardViews from '@/views/PersonnelDashboardViews.vue'
import PersonnelStockViews from '@/views/PersonnelStockViews.vue'
import PersonnelPlanningViews from '@/views/PersonnelPlanningViews.vue';
import PersonnelProfilsViews from '@/views/PersonnelProfilsViews.vue';



import AdminDashboardView from '../views/AdminDashboardView.vue';       
import AdminCampagnesViews from '@/views/AdminCampagnesViews.vue'
import NouvelleCampagneViews from '@/views/NouvelleCampagneViews.vue'
import AdminStockViews from '@/views/AdminStockViews.vue'
import AdminUserDashViews from '@/views/AdminUserDashViews.vue'
import AdminProfilViews from '@/views/AdminProfilViews.vue'




const routes = [
  { path: '/AdminDashboard', name: 'AdminDashboard', component: AdminDashboardView },
  { path: '/AdminCampagnes', name: 'AdminCampagnes', component: AdminCampagnesViews },
  { path: '/NouvelleCampagne', name: 'NouvelleCampagne', component: NouvelleCampagneViews },
  { path: '/AdminStocks', name: 'AdminStocks', component: AdminStockViews },
  { path: '/AdminUsers', name: 'AdminUsers', component: AdminUserDashViews },
  { path: '/AdminProfil', name: 'AdminProfil', component: AdminProfilViews },

  { path: '/PersonnelProfils', name: 'PersonnelProfils', component: PersonnelProfilsViews },
  { path: '/PersonnelDashboard', name: 'PersonnelDashboard', component: PersonnelDashboardViews },
  { path: '/PersonnelStocks', name: 'PersonnelStocks', component: PersonnelStockViews },
  { path: '/PersonnelPlanning', name: 'PersonnelPlanning', component: PersonnelPlanningViews },
  { path: '/Reservation', name: 'Reservation', component: ReservationUserViews },
  { path: '/Historique', name: 'Historique', component: HistoriqueUserViews },
  { path: '/Dash_user', name: 'Dash_user', component: Dash_userViews },
  { path: '/Profil', name: 'Profil', component: ProfilUserViews },
  { path: '/', redirect: '/Home' },
  { path: '/Home', name: 'Home', component: HomeViews },
  { path: '/Inscription', name: 'Inscription', component: InscriptionViews },
  { path: '/Connexion', name: 'Connexion', component: ConnexionViews },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
