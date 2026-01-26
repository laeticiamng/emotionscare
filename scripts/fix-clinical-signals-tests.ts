#!/usr/bin/env tsx
/**
 * Script pour corriger les objets ClinicalSignal dans les tests
 * Ajoute les champs manquants: module_context et expires_at
 */

import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/services/music/__tests__/orchestration.test.ts';
let content = readFileSync(filePath, 'utf-8');

// Pattern pour trouver les objets ClinicalSignal incomplets
// On cherche les objets qui ont source_instrument mais pas module_context

// Méthode plus simple : remplacer les patterns spécifiques
const lines = content.split('\n');
const newLines: string[] = [];
let inMockSignal = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Détecter le début d'un objet dans mockSignals
  if (line.includes('const mockSignals: ClinicalSignal[]')) {
    inMockSignal = true;
  }

  // Détecter la fin de mockSignals
  if (inMockSignal && line.trim() === '];') {
    inMockSignal = false;
  }

  newLines.push(line);

  // Si on est dans un objet et qu'on trouve 'level:', ajouter les champs manquants si absents
  if (inMockSignal && line.includes('level:')) {
    const indent = line.match(/^\s*/)?.[0] || '          ';
    const nextLine = lines[i + 1];

    // Vérifier si module_context n'est pas déjà présent
    if (!nextLine?.includes('module_context')) {
      newLines.push(`${indent}module_context: 'music',`);
    }
  }

  // Si on trouve metadata: et que expires_at n'est pas avant, l'ajouter
  if (inMockSignal && line.includes('metadata:')) {
    const indent = line.match(/^\s*/)?.[0] || '          ';
    const prevLine = lines[i - 1];

    if (!prevLine?.includes('expires_at')) {
      // Insérer avant metadata
      const metadataIndex = newLines.length - 1;
      newLines.splice(metadataIndex, 0, `${indent}expires_at: new Date(Date.now() + 3600000).toISOString(),`);
    }
  }
}

content = newLines.join('\n');

writeFileSync(filePath, content, 'utf-8');

console.log('✅ Fixed ClinicalSignal test objects');
