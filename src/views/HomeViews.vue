<template>
  <div class="min-h-screen bg-gray-100 font-sans overflow-x-hidden">
    
    <nav class="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="bg-[#A62639] text-white p-1 rounded font-bold">KG</div>
        <span class="font-bold text-gray-800 text-xl uppercase tracking-tighter">Stores</span>
      </div>
      
      <div class="hidden md:flex gap-8 text-gray-600 font-medium">
        <router-link to="/" class="border-b-2 border-red-500 text-black">Accueil</router-link>
        <a href="#about-section" class="hover:text-red-500 transition-colors">À Propos</a>
        <a href="#contact-section" class="hover:text-red-500 transition-colors">Contact</a>
      </div>

      <div class="flex gap-4">
        <router-link to="/Connexion" class="text-gray-600 font-medium px-4 py-2 hover:text-red-600 transition">
          Se connecter
        </router-link>
        <router-link to="/Inscription" class="bg-[#A62639] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-red-800 transition transform active:scale-95">
          Inscription
        </router-link>
      </div>
    </nav>

    <header class="relative overflow-hidden flex flex-col md:flex-row items-center px-10 py-20 bg-cover bg-center reveal">
      <div class="absolute inset-0 bg-[#1e293b]/85" style="background-image: url('/image/hopital.jpg'); background-size: cover;"></div>

      <div class="z-10 md:w-1/2 space-y-6 text-white">
        <h1 class="text-5xl md:text-6xl font-black uppercase leading-tight italic">
          Donnez votre sang.<br><span class="text-red-500">Sauvez des vies</span>
        </h1>
        <div class="flex gap-4 items-center">
          <router-link to="/Inscription" class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl uppercase transition-all hover:-translate-y-1 inline-block">
            Devenir donneur
          </router-link>
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <p class="text-3xl font-bold">2,450 ❤️</p>
            <p class="text-[10px] uppercase opacity-80 leading-none tracking-widest">Vies sauvées<br>cette semaine</p>
          </div>
        </div>
      </div>
      
      <div class="z-10 md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <img src="/image/prise_de_sang.jpg" alt="Don de sang" class="w-full max-w-lg h-auto shadow-2xl rounded-2xl border-4 border-white/10">
      </div>
    </header>

    <div id="about-section" class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2">118M</p>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Dons par an</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2">3</p>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Vies sauvées par don</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2">10%</p>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Besoins hospitaliers</p>
        </div>
      </div>

      <div class="bg-red-50 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 reveal">
        <div class="md:w-2/3">
          <h2 class="text-3xl font-black text-[#A62639] uppercase italic mb-4">Pourquoi donner ?</h2>
          <p class="text-gray-700 leading-relaxed font-medium">
            Le sang ne peut pas être fabriqué artificiellement. Chaque jour, des milliers de personnes dépendent de la générosité de donneurs anonymes. 
            <br><br>
            <span class="font-bold">Votre geste est irremplaçable.</span> En moins de 45 minutes, vous offrez une chance de vie à quelqu'un.
          </p>
        </div>
        <div class="md:w-1/3 bg-[#A62639] text-white p-8 rounded-2xl rotate-3 shadow-lg">
          <p class="text-xl font-bold italic">"Chaque don est un acte d'humanité pur."</p>
          <p class="text-[10px] mt-4 uppercase tracking-widest opacity-80">— KG Stores Team</p>
        </div>
      </div>
    </div>

    <section class="max-w-4xl mx-auto px-6 py-20 reveal">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-black text-gray-800 uppercase italic">Questions Fréquentes</h2>
        <p class="text-gray-500 font-medium uppercase text-[10px] tracking-[0.3em] mt-2">Tout ce que vous devez savoir</p>
      </div>

      <div class="space-y-4">
        <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
          <button @click="toggleFaq(index)" class="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition-colors">
            <span class="font-bold text-gray-800 uppercase text-xs tracking-wider">{{ faq.question }}</span>
            <span class="text-[#A62639] font-bold text-xl transform transition-transform duration-300" :class="{'rotate-45': activeFaq === index}">+</span>
          </button>
          
          <div v-show="activeFaq === index" class="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-4 animate-fade-in">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-white border-t border-gray-100 pt-20 pb-10">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div class="space-y-6">
          <div class="flex items-center gap-2">
            <div class="bg-[#A62639] text-white p-1 rounded font-bold">KG</div>
            <span class="font-bold text-gray-800 uppercase tracking-tighter">Stores</span>
          </div>
          <p class="text-xs text-gray-400 leading-relaxed font-medium">Plateforme communautaire pour le don de sang au Sénégal.</p>
        </div>
        <div v-for="title in ['Navigation', 'Aide', 'Réseaux']" :key="title">
          <h4 class="font-black text-gray-800 text-xs uppercase mb-6 tracking-widest">{{ title }}</h4>
          <ul class="text-[10px] space-y-3 uppercase font-bold text-gray-400">
            <li class="hover:text-red-600 cursor-pointer transition">Confidentialité</li>
            <li class="hover:text-red-600 cursor-pointer transition">Conditions d'utilisation</li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-50 text-center text-[9px] text-gray-300 uppercase font-black tracking-[0.5em]">
        © 2026 KG STORES - TOUS DROITS RÉSERVÉS
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const activeFaq = ref(null);
const faqs = ref([
  {
    question: "Puis-je donner si j'ai un tatouage ?",
    answer: "Oui, mais vous devez attendre un délai de 4 mois après la réalisation du tatouage ou d'un piercing."
  },
  {
    question: "Combien de temps dure un don de sang ?",
    answer: "Le prélèvement dure 10 minutes, mais prévoyez 45 minutes pour l'ensemble du processus."
  },
  {
    question: "Est-ce que le don de sang fait mal ?",
    answer: "C'est une simple piqûre rapide, comparable à une prise de sang classique."
  }
]);

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index;
};

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
</style>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { background: #A62639; border-radius: 10px; }
</style>