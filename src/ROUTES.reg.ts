export type RouteDef = { id: string; path: string; component: string };
const routes: Record<string, RouteDef> = {
  // ⚠️ existants : ne rien modifier
};

export function addRoute(def: RouteDef) {
  if (routes[def.id]) throw new Error(`Route ${def.id} existe déjà`);
  routes[def.id] = def;
}

export function getRoutes() {
  return Object.values(routes);
}

export default routes;

// Routes initiales
addRoute({ id: "flash-glow", path: "/modules/flash-glow", component: "FlashGlowPage" });
addRoute({ id: "adaptive-music", path: "/modules/adaptive-music", component: "AdaptiveMusicPage" });
addRoute({ id: "boss-grit", path: "/modules/boss-grit", component: "BossGritPage" });
addRoute({ id: "breath-constellation", path: "/modules/breath-constellation", component: "BreathConstellationPage" });
addRoute({ id: "bubble-beat", path: "/modules/bubble-beat", component: "BubbleBeatPage" });
addRoute({ id: "coach", path: "/modules/coach", component: "CoachPage" });
addRoute({ id: "emotion-scan", path: "/modules/emotion-scan", component: "EmotionScanPage" });
addRoute({ id: "flash-glow-ultra", path: "/modules/flash-glow-ultra", component: "FlashGlowUltraPage" });
addRoute({ id: "journal", path: "/modules/journal", component: "JournalPage" });
addRoute({ id: "mood-mixer", path: "/modules/mood-mixer", component: "MoodMixerPage" });
addRoute({ id: "scan", path: "/modules/scan", component: "ScanPage" });
addRoute({ id: "story-synth", path: "/modules/story-synth", component: "StorySynthPage" });
addRoute({ id: "modules", path: "/modules", component: "ModulesIndexPage" });
