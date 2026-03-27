// @ts-nocheck
import type { InstrumentCatalog, InstrumentCode, LocaleCode } from './types';

const CATALOGS: Record<InstrumentCode, Record<LocaleCode, InstrumentCatalog>> = {
  WHO5: {
    fr: {
      code: 'WHO5',
      name: 'Indice de bien-être OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Je me suis senti(e) gai(e) et de bonne humeur', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Je me suis senti(e) calme et détendu(e)', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Je me suis senti(e) actif/ve et énergique', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: "Je me suis réveillé(e) frais/fraîche et reposé(e)", type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: "Ma vie quotidienne a été remplie de choses qui m'intéressent", type: 'scale', min: 0, max: 5 },
      ],
    },
    en: {
      code: 'WHO5',
      name: 'WHO Well-Being Index',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'I have felt cheerful and in good spirits', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'I have felt calm and relaxed', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'I have felt active and vigorous', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'I woke up feeling fresh and rested', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'My daily life has been filled with things that interest me', type: 'scale', min: 0, max: 5 },
      ],
    },
    es: {
      code: 'WHO5',
      name: 'Índice de Bienestar OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Me he sentido alegre y de buen ánimo', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Me he sentido calmado/a y relajado/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Me he sentido activo/a y enérgico/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Me he despertado sintiéndome fresco/a y descansado/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mi vida diaria ha estado llena de cosas que me interesan', type: 'scale', min: 0, max: 5 },
      ],
    },
    de: {
      code: 'WHO5',
      name: 'WHO Wohlbefinden Index',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Ich war fröhlich und guter Laune', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Ich habe mich ruhig und entspannt gefühlt', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Ich habe mich energisch und aktiv gefühlt', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Ich bin frisch und ausgeruht aufgewacht', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'Mein Alltag war voller Dinge, die mich interessieren', type: 'scale', min: 0, max: 5 },
      ],
    },
    it: {
      code: 'WHO5',
      name: 'Indice di Benessere OMS',
      version: '1.0',
      expiry_minutes: 30,
      items: [
        { id: '1', prompt: 'Mi sono sentito/a allegro/a e di buon umore', type: 'scale', min: 0, max: 5 },
        { id: '2', prompt: 'Mi sono sentito/a calmo/a e rilassato/a', type: 'scale', min: 0, max: 5 },
        { id: '3', prompt: 'Mi sono sentito/a attivo/a ed energico/a', type: 'scale', min: 0, max: 5 },
        { id: '4', prompt: 'Mi sono svegliato/a sentendomi fresco/a e riposato/a', type: 'scale', min: 0, max: 5 },
        { id: '5', prompt: 'La mia vita quotidiana è stata piena di cose che mi interessano', type: 'scale', min: 0, max: 5 },
      ],
    },
  },
  STAI6: {
    fr: {
      code: 'STAI6',
      name: "Inventaire d’anxiété état (court)",
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Je me sens calme', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Je me sens tendu(e)', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Je me sens contrarié(e)', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Je me sens détendu(e)', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Je me sens inquiet/ète', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Je me sens confus(e)', type: 'scale', min: 1, max: 4 },
      ],
    },
    en: {
      code: 'STAI6',
      name: 'State Anxiety Inventory (Short)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'I feel calm', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'I feel tense', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'I feel upset', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'I feel relaxed', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'I feel worried', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'I feel confused', type: 'scale', min: 1, max: 4 },
      ],
    },
    es: {
      code: 'STAI6',
      name: 'Inventario de Ansiedad Estado (Corto)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Me siento calmado/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Me siento tenso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Me siento molesto/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Me siento relajado/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Me siento preocupado/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Me siento confundido/a', type: 'scale', min: 1, max: 4 },
      ],
    },
    de: {
      code: 'STAI6',
      name: 'Zustandsangst Inventar (Kurz)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Ich fühle mich ruhig', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Ich fühle mich angespannt', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Ich fühle mich verärgert', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Ich fühle mich entspannt', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Ich fühle mich besorgt', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Ich fühle mich verwirrt', type: 'scale', min: 1, max: 4 },
      ],
    },
    it: {
      code: 'STAI6',
      name: 'Inventario Ansia di Stato (Breve)',
      version: '1.0',
      expiry_minutes: 15,
      items: [
        { id: '1', prompt: 'Mi sento calmo/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '2', prompt: 'Mi sento teso/a', type: 'scale', min: 1, max: 4 },
        { id: '3', prompt: 'Mi sento contrariato/a', type: 'scale', min: 1, max: 4 },
        { id: '4', prompt: 'Mi sento rilassato/a', type: 'scale', min: 1, max: 4, reversed: true },
        { id: '5', prompt: 'Mi sento preoccupato/a', type: 'scale', min: 1, max: 4 },
        { id: '6', prompt: 'Mi sento confuso/a', type: 'scale', min: 1, max: 4 },
      ],
    },
  },
  SAM: {
    fr: {
      code: 'SAM',
      name: 'Auto-évaluation émotionnelle',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Plaisir/Déplaisir', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activation/Calme', type: 'slider', min: 1, max: 9 },
      ],
    },
    en: {
      code: 'SAM',
      name: 'Self-Assessment Manikin',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Pleasure/Displeasure', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Arousal/Calm', type: 'slider', min: 1, max: 9 },
      ],
    },
    es: {
      code: 'SAM',
      name: 'Muñeco de Autoevaluación',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Placer/Displacer', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Activación/Calma', type: 'slider', min: 1, max: 9 },
      ],
    },
    de: {
      code: 'SAM',
      name: 'Selbstbewertungs-Manikin',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Freude/Unfreude', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Erregung/Ruhe', type: 'slider', min: 1, max: 9 },
      ],
    },
    it: {
      code: 'SAM',
      name: 'Omino di Autovalutazione',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Piacere/Dispiacere', type: 'slider', min: 1, max: 9 },
        { id: '2', prompt: 'Attivazione/Calma', type: 'slider', min: 1, max: 9 },
      ],
    },
  },
  SUDS: {
    fr: {
      code: 'SUDS',
      name: 'Unités subjectives de détresse',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Niveau de détresse actuel (0 = aucune, 10 = extrême)', type: 'slider', min: 0, max: 10 },
      ],
    },
    en: {
      code: 'SUDS',
      name: 'Subjective Units of Distress',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Current distress level (0 = none, 10 = extreme)', type: 'slider', min: 0, max: 10 },
      ],
    },
    es: {
      code: 'SUDS',
      name: 'Unidades Subjetivas de Angustia',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Nivel de angustia actual (0 = ninguna, 10 = extrema)', type: 'slider', min: 0, max: 10 },
      ],
    },
    de: {
      code: 'SUDS',
      name: 'Subjektive Belastungseinheiten',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Aktueller Belastungsgrad (0 = keiner, 10 = extrem)', type: 'slider', min: 0, max: 10 },
      ],
    },
    it: {
      code: 'SUDS',
      name: 'Unità Soggettive di Distress',
      version: '1.0',
      expiry_minutes: 5,
      items: [
        { id: '1', prompt: 'Livello di distress attuale (0 = nessuno, 10 = estremo)', type: 'slider', min: 0, max: 10 },
      ],
    },
  },
};

export function getCatalog(instrument: InstrumentCode, locale: LocaleCode = 'fr'): InstrumentCatalog {
  const catalogs = CATALOGS[instrument];
  if (!catalogs) {
    throw new Error(`Unknown instrument: ${instrument}`);
  }

  return catalogs[locale] ?? catalogs.fr ?? catalogs.en!;
  const catalogByLocale = CATALOGS[instrument];
  if (!catalogByLocale) {
    throw new Error(`Unknown instrument: ${instrument}`);
  }

  const localized = catalogByLocale[locale] || catalogByLocale.fr || catalogByLocale.en;
  if (!localized) {
    throw new Error(`No catalog available for instrument ${instrument}`);
  }

  return localized;
}

export function listAvailableLocales(instrument: InstrumentCode): LocaleCode[] {
  return Object.keys(CATALOGS[instrument] ?? {}) as LocaleCode[];
}

export function getAllCatalogs(): Record<InstrumentCode, Record<LocaleCode, InstrumentCatalog>> {
  return CATALOGS;
}
