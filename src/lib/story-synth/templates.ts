// @ts-nocheck
import { createRng, pick } from "./rng";

export type Brief = {
  genre?: "calme"|"aventure"|"poetique"|"mysterieux"|"romance";
  pov?: "je"|"il"|"elle"|"nous";
  hero?: string;    // nom court
  place?: string;   // lieu
  length?: number;  // 3..7
  style?: "sobre"|"lyrique"|"journal"|"dialogue";
  seed?: string;
};

const OPENERS = {
  calme: [
    "Le matin étirait une lumière pâle sur {place}.",
    "Un souffle doux fendait l'air quand {hero} ouvrit la fenêtre.",
    "{place} semblait retenu dans un silence paisible."
  ],
  aventure: [
    "La carte vibrait encore dans la poche de {hero}.",
    "Un sentier effacé serpentait derrière {place}.",
    "Le vent chuchotait un cap que {hero} décida de suivre."
  ],
  poetique: [
    "Les heures s'épanchaient comme un thé infusé trop longtemps.",
    "Entre deux battements, {hero} entendit un monde s'ouvrir.",
    "La ville respirait, et {place} battait sa mesure secrète."
  ],
  mysterieux: [
    "Un détail clochait, minuscule, à {place}.",
    "La lettre n'avait ni timbre ni signature.",
    "Quand la lumière vacilla, {hero} comprit que la nuit commençait vraiment."
  ],
  romance: [
    "{hero} n'avait rien prévu, sinon de sourire au hasard.",
    "À {place}, tout semblait soudain possible.",
    "Le ciel, ce soir-là, tenait juste assez pour deux."
  ]
};

const MIDDLES = [
  "Il y eut d'abord une hésitation, comme une note tenue trop longtemps.",
  "Une odeur de pluie fraîche glissa entre les phrases.",
  "Le temps prit de l'élan, puis accéléra sans prévenir.",
  "Un souvenir remonta, simple et précis, et guida la suite.",
  "Quelque chose appela {hero} par le prénom, sans voix."
];

const TURNS = [
  "Alors {hero} fit un pas de côté, et le décor bougea.",
  "Une main se tendit, discrète, vers la sienne.",
  "Le regard s'accrocha à un détail que personne ne voyait.",
  "Le rire fendit l'air et allégea tout le reste.",
  "L'idée parut évidente : il fallait suivre ce fil."
];

const ENDINGS = {
  sobre: [
    "Rien n'était résolu, mais tout devenait possible.",
    "La nuit tomba sans bruit, et {hero} respira plus librement.",
    "Le chemin restait long, et c'était très bien ainsi."
  ],
  lyrique: [
    "Le monde, vaste et neuf, battit le rythme dans sa poitrine.",
    "Chaque pas devenait étoile, et l'horizon s'enflamma.",
    "Le vent cousit une promesse au revers de la veste."
  ],
  journal: [
    "Note : revenir demain à {place}. Ne rien oublier.",
    "À consigner : l'élan, la douceur, la simple clarté.",
    "Bilan : avancer suffit. Signé : {hero}."
  ],
  dialogue: [
    "— On continue ? — Oui, répondit {hero}, et c'était déjà beaucoup.",
    "— Tu viens ? — J'arrive, dit-il en souriant.",
    "— Alors, on y va. — On y va."
  ]
};

function format(s: string, b: Brief) {
  return s.replaceAll("{hero}", b.hero || "Alex").replaceAll("{place}", b.place || "la ville");
}

export function synthParagraphs(brief: Brief): string[] {
  const b: Brief = {
    genre: brief.genre || "calme",
    pov: brief.pov || "je",
    hero: brief.hero?.trim() || "Alex",
    place: brief.place?.trim() || "la ville",
    length: Math.max(3, Math.min(7, brief.length ?? 4)),
    style: brief.style || "sobre",
    seed: brief.seed || `${Date.now()}-${Math.random().toString(36).slice(2)}`
  };

  const rand = createRng([b.genre, b.pov, b.hero!, b.place!, b.length, b.style, b.seed].join("|"));

  const out: string[] = [];
  out.push(format(pick(rand, OPENERS[b.genre!]), b));

  const middleCount = Math.max(0, (b.length ?? 4) - 2);
  for (let i = 0; i < middleCount; i++) {
    const line = rand() < 0.5 ? pick(rand, MIDDLES) : pick(rand, TURNS);
    out.push(format(line, b));
  }

  out.push(format(pick(rand, ENDINGS[b.style!]), b));

  // POV adaptation simple
  if (b.pov === "je") {
    return out.map(p => p.replaceAll("{hero}", "je"));
  } else if (b.pov === "elle") {
    return out.map(p => p.replaceAll("il ", "elle ").replaceAll("Il ", "Elle "));
  }
  return out;
}
