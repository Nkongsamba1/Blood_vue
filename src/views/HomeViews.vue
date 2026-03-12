<template>
  <div class="min-h-screen bg-gray-100 font-sans overflow-x-hidden">
    
    <nav class="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="bg-[#A62639] text-white p-1 rounded font-bold">KG</div>
        <span class="font-bold text-gray-800 text-xl uppercase tracking-tighter">Stores</span>
      </div>
      
      <div class="hidden md:flex gap-8 text-gray-600 font-medium">
        <a href="#" class="border-b-2 border-red-500 text-black">Accueil</a>
        <a href="#about-section" class="hover:text-red-500">À Propos</a>
        <a href="#contact-section" class="hover:text-red-500">Contact</a>
      </div>

      <div class="flex gap-4">
        <button class="text-gray-600 font-medium px-4 py-2 hover:text-red-600 transition">
          <router-link to="/Connexion">Se connecter</router-link>
        </button>
        <button class="bg-[#A62639] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-red-800 transition transform active:scale-95">
          <router-link to="/Inscription">Inscription</router-link>
        </button>
      </div>
    </nav>

    <header class="relative overflow-hidden flex flex-col md:flex-row items-center px-10 py-20 bg-cover bg-center reveal"
            style="background-image: url('/image/hopital.jpg');">
      
      <div class="absolute inset-0 bg-[#1e293b]/85"></div>

      <div class="z-10 md:w-1/2 space-y-6 text-white">
        <h1 class="text-5xl md:text-6xl font-black uppercase leading-tight italic">
          Donnez votre sang.<br>Sauvez des vies
        </h1>
        <div class="flex gap-4 items-center">
          <button class="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl uppercase transition-all hover:-translate-y-1">
            Faire un don maintenant
          </button>
          <div class="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
            <p class="text-3xl font-bold">2,450 ❤️</p>
            <p class="text-[10px] uppercase opacity-80 leading-none tracking-widest">Vies sauvées<br>cette semaine</p>
          </div>
        </div>
      </div>
      
      <div class="z-10 md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <img src="/image/prise_de_sang.jpg" 
             alt="Médecins" class="w-full max-w-lg h-auto shadow-2xl rounded-2xl border-4 border-white/10">
      </div>
    </header>

    <div id="about-section" class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2"><span class="">118</span>M</p>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Dons de sang par an</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2"><span class="">3</span></p>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Vies sauvées avec un don</p>
        </div>
        <div class="bg-white p-8 rounded-2xl shadow-sm border-b-4 border-red-500 text-center reveal">
          <p class="text-4xl font-black text-gray-800 mb-2"><span class="">10</span>%</p>
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

    <section class="max-w-7xl mx-auto px-6 pb-24">
      <h2 class="text-gray-800 font-black uppercase mb-10 flex items-center gap-3 reveal">
        <span class="w-2 h-8 bg-red-600 rounded-full"></span> 
        <span class="text-2xl tracking-tighter italic">Conseils Santé</span>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-2xl shadow-md group cursor-pointer overflow-hidden reveal">
          <div class="h-32 overflow-hidden">
            <img src="/image/nouriture.jpg" class="w-full h-full object-cover group-hover:scale-125 transition duration-700">
          </div>
          <div class="p-4">
            <p class="text-[10px] font-black leading-tight uppercase text-gray-800">Bienfaits du don</p>
            <button class="text-[9px] text-red-600 font-bold mt-3 uppercase tracking-widest group-hover:underline">Lire →</button>
          </div>
        </div>
      </div>
    </section>

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

    <section id="contact-section" class="bg-[#1e293b] py-24 px-6 reveal">
      <div class="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div class="md:w-1/3 bg-[#A62639] p-12 text-white flex flex-col justify-center">
          <h3 class="text-3xl font-black uppercase italic mb-6 leading-none">Parlons-en.</h3>
          <p class="text-sm opacity-70 mb-10 font-medium">Une question ? Écrivez-nous.</p>
          <div class="space-y-6 text-[10px] uppercase font-bold tracking-[0.2em]">
            <p>📍 Dakar, Sénégal</p>
            <p>📞 +221 33 800 00 00</p>
            <p>✉️ hello@kgstores.sn</p>
          </div>
        </div>
        <div class="md:w-2/3 p-12 bg-white">
          <form class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" placeholder="NOM COMPLET" class="w-full p-4 bg-gray-50 rounded-lg outline-none focus:ring-2 ring-red-100 border-b-2 border-transparent focus:border-red-600 transition-all text-xs font-bold">
              <input type="email" placeholder="VOTRE EMAIL" class="peer w-full p-4 bg-gray-50 rounded-lg outline-none focus:ring-2 ring-red-100 border-b-2 border-transparent focus:border-red-600 transition-all text-xs font-bold">
            </div>
            <textarea placeholder="COMMENT POUVONS-NOUS VOUS AIDER ?" rows="4" class="w-full p-4 bg-gray-50 rounded-lg outline-none focus:ring-2 ring-red-100 border-b-2 border-transparent focus:border-red-600 transition-all text-xs font-bold resize-none"></textarea>
            <button type="button" class="w-full bg-[#1e293b] text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#A62639] transition-all duration-300 shadow-xl">
              Envoyer maintenant 🚀
            </button>
          </form>
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
          <p class="text-xs text-gray-400 leading-relaxed font-medium">Plateforme communautaire pour le don de sang.</p>
        </div>
        <div v-for="title in ['Navigation', 'Aide', 'Réseaux']" :key="title">
          <h4 class="font-black text-gray-800 text-xs uppercase mb-6 tracking-widest">{{ title }}</h4>
          <ul class="text-[10px] space-y-3 uppercase font-bold text-gray-400">
            <li class="hover:text-red-600 cursor-pointer transition">Lien exemple</li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-50 text-center text-[9px] text-gray-300 uppercase font-black tracking-[0.5em]">
        © 2026 KG STORES
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';


// Gestion de la FAQ
const activeFaq = ref(null);
const faqs = ref([
  {
    question: "Puis-je donner si j'ai un tatouage ?",
    answer: "Oui, mais vous devez attendre un délai de 4 mois après la réalisation du tatouage ou d'un piercing pour garantir une sécurité maximale."
  },
  {
    question: "Combien de temps dure un don de sang ?",
    answer: "Le prélèvement lui-même dure environ 10 minutes. Cependant, en comptant l'entretien médical et le repos après le don, prévoyez environ 45 minutes au total."
  },
  {
    question: "Est-ce que le don de sang fait mal ?",
    answer: "Pas du tout ! C'est une simple piqûre comme lors d'une prise de sang classique. L'équipe médicale est là pour s'assurer que vous êtes à l'aise."
  },
  {
    question: "Quelle est la fréquence autorisée ?",
    answer: "Les hommes peuvent donner 6 fois par an et les femmes 4 fois, en respectant un intervalle minimum de 8 semaines entre chaque don."
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
        const counters = entry.target.querySelectorAll('.stat-number');
        counters.forEach(counter => {
          if (counter.dataset.done) return;
          const target = parseInt(counter.innerText);
          let count = 0;
          const duration = 2000;
          const increment = target / (duration / 16);
          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target;
              counter.dataset.done = "true";
            }
          };
          updateCount();
        });
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