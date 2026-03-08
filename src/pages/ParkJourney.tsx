import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Wind, Palette, Music, Leaf, Book, Cloud, Star,
  Lightbulb, Waves, Scan, Beaker, Sword, Sliders, Users,
  Trophy, Theater, Sprout, ArrowRight, ArrowLeft, Map
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JourneyAttraction } from '@/types/park';

interface AttractionStopProps extends JourneyAttraction {
  delay?: number;
}

const AttractionStop: React.FC<AttractionStopProps> = ({
  number,
  icon: Icon,
  title,
  subtitle,
  narrative,
  gradient,
  route,
  delay = 0
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="mb-16 relative"
    >
      <Card 
        className={`
          relative overflow-hidden p-8
          bg-gradient-to-br ${gradient}
          border-2 border-border/50
          hover:border-primary/50 transition-all duration-500
          group cursor-pointer
        `}
        onClick={() => navigate(route)}
      >
        {/* Number badge */}
        <motion.div 
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center font-bold text-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {number}
        </motion.div>

        {/* Animated sparkle */}
        <motion.div
          className="absolute top-8 left-8 text-primary/30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>

        <div className="relative z-10">
          {/* Icon & Title */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div 
              className="p-4 rounded-2xl bg-primary/20 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="h-8 w-8 text-primary" />
            </motion.div>
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Narrative text */}
          <div className="pl-20 space-y-3">
            {narrative.split('\n').map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: delay + 0.2 + (i * 0.1) }}
                className="text-foreground/90 leading-relaxed"
              >
                {line}
              </motion.p>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div 
            className="pl-20 mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.5 }}
          >
            <Button 
              variant="outline" 
              className="group/btn hover:bg-primary/10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                navigate(route);
              }}
            >
              Entrer dans l'attraction
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
      </Card>
    </motion.div>
  );
};

export default function ParkJourney() {
  const navigate = useNavigate();

  const attractions: JourneyAttraction[] = [
    {
      number: 1,
      icon: Sparkles,
      title: "La Salle des Cartes Vivantes",
      subtitle: "Dashboard /app/home",
      narrative: "Dès ton arrivée, tu entres dans une salle mystérieuse où flottent des cartes lumineuses.\nTu en tires une au hasard : elle se retourne dans un halo cosmique et une voix douce chuchote ton mantra de la semaine.\nTon aventure commence guidée par cette carte, ton horoscope émotionnel personnel.",
      gradient: "from-violet-500/20 to-purple-500/20",
      route: "/app/home"
    },
    {
      number: 2,
      icon: Wind,
      title: "La Bulle Respirante",
      subtitle: "Cocon Respiration",
      narrative: "Tu traverses un couloir de brume et découvres une immense bulle suspendue.\nElle respire avec toi, gonfle et dégonfle, résonnant comme un cœur géant.\nPlus tu respires calmement, plus la bulle devient transparente… révélant des constellations cachées.\nTu en ressors plus léger, comme si tu avais inspiré des étoiles.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      route: "/app/nyvee"
    },
    {
      number: 3,
      icon: Palette,
      title: "La Galerie des Masques",
      subtitle: "Scan émotionnel /app/scan",
      narrative: "Tu arrives dans une galerie étrange, remplie de masques flottants.\nÀ chaque geste, à chaque couleur choisie, un masque s'anime et vient se poser près de toi.\nTon avatar se transforme sous tes yeux : plus lumineux, plus expressif.\nC'est toi, mais en version émotionnelle.",
      gradient: "from-pink-500/20 to-rose-500/20",
      route: "/app/scan"
    },
    {
      number: 4,
      icon: Music,
      title: "La Forêt Sonore",
      subtitle: "Thérapie musicale /app/music",
      narrative: "Un sentier t'emmène dans une forêt enchantée. Les arbres vibrent et chantent avec les musiques qui s'élèvent.\nTu touches un tronc : une guitare résonne. Tu marches : le rythme change.\nÀ la fin, une note rare vient s'ajouter à ta playlist secrète.\nTu viens de composer un fragment de mélodie rien qu'à toi.",
      gradient: "from-green-500/20 to-emerald-500/20",
      route: "/app/music"
    },
    {
      number: 5,
      icon: Leaf,
      title: "Le Jardin des Pensées",
      subtitle: "Coach IA /app/coach",
      narrative: "Te voilà dans un jardin de nuages et de cloches.\nDes bulles translucides flottent, chacune portant une phrase-haïku.\n\"Observe, laisse passer ☁️.\" — murmure l'une d'elles avant de disparaître dans le ciel.\nTu les cueilles dans ton Grimoire des pensées.",
      gradient: "from-teal-500/20 to-green-500/20",
      route: "/app/coach"
    },
    {
      number: 6,
      icon: Book,
      title: "La Bibliothèque des Émotions",
      subtitle: "Journal /app/journal",
      narrative: "Tu entres dans une bibliothèque infinie. Des pages colorées volent autour de toi.\nChaque mot que tu dis ou écris devient une page brillante, s'ajoutant à ton livre vivant.\nTu peux swiper tes pages comme des stories TikTok, et revoir l'évolution de tes jours.\nTon journal est un conte animé, en perpétuelle écriture.",
      gradient: "from-amber-500/20 to-orange-500/20",
      route: "/app/journal"
    },
    {
      number: 7,
      icon: Cloud,
      title: "Le Temple de l'Air",
      subtitle: "VR Breath /app/vr-breath-guide",
      narrative: "Un immense temple suspendu dans le ciel t'attend.\nÀ chaque respiration, une onde lumineuse traverse les colonnes et peint les murs.\nQuand tu termines, la fresque finale est ton souffle devenu œuvre d'art.\nTu ressors avec une fresque unique gravée dans ton temple.",
      gradient: "from-sky-500/20 to-blue-500/20",
      route: "/app/vr-breath-guide"
    },
    {
      number: 8,
      icon: Star,
      title: "La Constellation Émotionnelle",
      subtitle: "VR Galaxy /app/vr-galaxy",
      narrative: "Tu lèves les yeux : un cosmos immense.\nChaque émotion vécue allume une étoile. Tu navigues d'une galaxie à l'autre, dessinant ta propre carte céleste.\nÀ la fin, une constellation apparaît : ton ciel émotionnel, à toi seul.",
      gradient: "from-indigo-500/20 to-purple-500/20",
      route: "/app/vr-galaxy"
    },
    {
      number: 9,
      icon: Lightbulb,
      title: "La Chambre des Lumières",
      subtitle: "Flash Glow /app/flash-glow",
      narrative: "Une salle obscure s'illumine à ton rythme.\nChaque cycle de respiration allume une lampe magique.\nPetit à petit, tu construis ton mur de lumière, chaque lampe portant un mot-clé secret : \"ça vient 🌱\".",
      gradient: "from-yellow-500/20 to-amber-500/20",
      route: "/app/flash-glow"
    },
    {
      number: 10,
      icon: Waves,
      title: "L'Océan Intérieur",
      subtitle: "Breathwork /app/breath",
      narrative: "Tu plonges dans un océan calme.\nÀ chaque expiration, une vague douce vient te porter. Des bulles flottent et explosent doucement quand tu respectes la cadence.\nAu bout du voyage, tu reçois un badge respiratoire : \"Maître des vagues\".",
      gradient: "from-blue-500/20 to-teal-500/20",
      route: "/app/breath"
    },
    {
      number: 11,
      icon: Scan,
      title: "La Chambre des Reflets",
      subtitle: "AR Filters /app/face-ar",
      narrative: "Tu entres dans une salle de miroirs magiques.\nUn clin d'œil déclenche une pluie d'étoiles, un sourire fait briller ton reflet.\nLes stickers que tu utilises s'illuminent et évoluent, créant un avatar unique.",
      gradient: "from-fuchsia-500/20 to-pink-500/20",
      route: "/app/face-ar"
    },
    {
      number: 12,
      icon: Beaker,
      title: "Le Labo des Bulles",
      subtitle: "Bubble Beat /app/bubble-beat",
      narrative: "Dans ce laboratoire coloré, des bulles réagissent à ton stress.\nTendu, elles éclatent vite. Calme, elles flottent doucement.\nChaque session réussie ajoute une bulle rare à ta collection.\nTon laboratoire devient un arc-en-ciel d'émotions.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      route: "/app/bubble-beat"
    },
    {
      number: 13,
      icon: Sword,
      title: "L'Arène de la Persévérance",
      subtitle: "Boss Level Grit /app/boss-grit",
      narrative: "Une arène RPG t'attend. Chaque défi est un mini-niveau lumineux.\nRéussis, et ton aura héroïque s'agrandit, comme un chevalier émotionnel.\nChaque jour que tu reviens, ton aura se renforce encore.",
      gradient: "from-red-500/20 to-orange-500/20",
      route: "/app/boss-grit"
    },
    {
      number: 14,
      icon: Sliders,
      title: "Le Studio DJ des Émotions",
      subtitle: "Mood Mixer /app/mood-mixer",
      narrative: "Bienvenue dans un studio futuriste.\nLes sliders que tu bouges modulent musique, basses et lumières en direct.\nTu deviens le DJ de ton propre état intérieur.\nChaque mix réussi se sauvegarde comme un track rare.",
      gradient: "from-purple-500/20 to-pink-500/20",
      route: "/app/mood-mixer"
    },
    {
      number: 15,
      icon: Users,
      title: "Le Village Bienveillant",
      subtitle: "Communauté /app/community",
      narrative: "Un village chaleureux s'étend devant toi.\nChaque message que tu envoies éclaire une maison.\nPlus tu participes, plus ton maison-avatar brille.\nIci, tu gagnes des badges de soutien : \"Éclaireur empathique\".",
      gradient: "from-emerald-500/20 to-green-500/20",
      route: "/app/community"
    },
    {
      number: 16,
      icon: Star,
      title: "Le Ciel des Auras",
      subtitle: "Leaderboard /app/leaderboard",
      narrative: "Pas de classement. Juste un ciel rempli d'auras colorées.\nLa tienne flotte, change de couleur, devient plus chaude chaque semaine.\nUn spectacle cosmique de progression douce.",
      gradient: "from-indigo-500/20 to-violet-500/20",
      route: "/app/leaderboard"
    },
    {
      number: 17,
      icon: Trophy,
      title: "La Salle des Défis",
      subtitle: "Ambition Arcade /app/ambition-arcade",
      narrative: "Salle arcade futuriste.\nChaque objectif est transformé en mini-jeu (exploser bulles, tap tempo).\nQuand tu réussis, confettis et trophées tombent du plafond.\nTa galerie de trophées s'agrandit.",
      gradient: "from-orange-500/20 to-red-500/20",
      route: "/app/ambition-arcade"
    },
    {
      number: 18,
      icon: Theater,
      title: "Le Théâtre des Histoires",
      subtitle: "Story Synth Lab /app/story-synth",
      narrative: "Un théâtre vivant, où lumière et musique changent selon tes choix.\nChaque histoire terminée te donne un fragment de conte, comme une BD animée.\nÀ force, tu construis ta propre bibliothèque magique d'histoires.",
      gradient: "from-violet-500/20 to-purple-500/20",
      route: "/app/story-synth"
    },
    {
      number: 19,
      icon: Sprout,
      title: "Le Jardin des Saisons",
      subtitle: "Activity & Weekly Bars /app/activity",
      narrative: "Enfin, tu arrives dans un jardin intérieur.\nChaque semaine, une nouvelle plante pousse.\nSelon ton état, elle change de couleur et de forme.\nPetit à petit, ton jardin devient une galerie vivante d'émotions.",
      gradient: "from-green-500/20 to-lime-500/20",
      route: "/app/activity"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          {/* Bouton retour */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/emotional-park')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au parc
            </Button>
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <Sparkles className="h-16 w-16 text-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Voyage à travers le Parc Émotionnel
            </h1>
            
            <p className="text-xl text-muted-foreground mb-4">
              Tu franchis les portes du parc. Devant toi, une pancarte scintillante :
            </p>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="inline-block p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-border"
            >
              <p className="text-2xl font-semibold text-foreground">
                "Bienvenue au Monde des Émotions — Explore, respire, écoute, crée."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 flex gap-4 justify-center"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/app/emotional-park')}
                className="group"
              >
                <Map className="mr-2 h-5 w-5" />
                Voir la carte du parc
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Journey Sections */}
      <section className="container mx-auto px-4 py-12">
        {attractions.map((attraction, index) => (
          <AttractionStop
            key={attraction.number}
            {...attraction}
            delay={0}
          />
        ))}
      </section>

      {/* Conclusion Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-20"
      >
        <Card className="p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/30 text-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block mb-6"
          >
            <Star className="h-16 w-16 text-primary" />
          </motion.div>

          <h2 className="text-4xl font-bold mb-6">Conclusion du voyage</h2>
          
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-muted-foreground mb-8">
            <p>Le parc entier est un univers émotionnel vivant.</p>
            <p>Chaque module est une attraction. Chaque geste, un rituel. Chaque retour, une surprise.</p>
          </div>

          <div className="inline-block p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border mb-8">
            <p className="text-2xl font-semibold mb-4">🎡 C'est un Disneyland numérique :</p>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>doux comme un cocon</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>fun comme un jeu</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>addictif comme TikTok</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>mais sain, poétique, et profondément personnel</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/app/emotional-park')}
              className="group"
            >
              <Map className="mr-2 h-5 w-5" />
              Explorer le parc
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/app/home')}
            >
              Commencer l'aventure
            </Button>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}
