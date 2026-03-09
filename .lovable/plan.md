

## Plan : Ajouter les traductions allemandes et compléter FR/EN/DE sur toute la plateforme

### Constat actuel

L'application dispose de deux systèmes i18n parallèles :
1. **Système principal** (`src/lib/i18n/locales/{fr,en}/`) — 11 namespaces (common, navigation, dashboard, settings, modules, auth, consent, errors, legal, journal, coach) avec FR et EN complets
2. **Système secondaire** (`src/i18n/locales/{fr,en,de}.ts`) — squelettique, utilisé par `src/i18n/config.ts`
3. **Fichiers JSON** (`public/locales/{fr,en}/`) — partiels (common, errors, breath)

Le **DE (allemand)** existe uniquement dans `src/i18n/locales/de.ts` avec un contenu riche mais n'est **pas branché** dans le système principal (`src/providers/i18n/resources.ts` ne charge que `fr` et `en`).

De plus, de nombreuses pages (100+) contiennent encore des **chaînes hardcodées en français** non internationalisées.

### Plan d'implémentation

#### 1. Creer les fichiers de traduction DE (11 fichiers)

Creer `src/lib/i18n/locales/de/` avec les 11 fichiers miroirs de FR/EN :
- `common.ts`, `navigation.ts`, `dashboard.ts`, `settings.ts`, `modules.ts`, `auth.ts`, `consent.ts`, `errors.ts`, `legal.ts`, `journal.ts`, `coach.ts`

Chaque fichier sera la traduction allemande complète des clés existantes en FR/EN.

#### 2. Brancher DE dans le système principal

Modifier `src/providers/i18n/resources.ts` pour :
- Importer les 11 modules DE
- Ajouter la locale `de` dans l'objet `resources`

#### 3. Mettre à jour la configuration i18n

- `src/lib/i18n.ts` : ajouter `'de'` dans `supportedLngs`
- `src/lib/i18n/i18n.tsx` : ajouter le type `'de'` au type `Lang`
- `src/i18n/locales/fr.ts` et `src/i18n/locales/en.ts` : ajouter `de: 'Allemand'` / `de: 'German'` dans `languageNames`

#### 4. Mettre à jour le sélecteur de langue

- `src/ui/NavBar.tsx` : supporter le cycle FR → EN → DE → FR
- `src/i18n/LanguageSwitcher.tsx` : s'assurer que DE est dans les options (il utilise `SUPPORTED_LOCALES` qui inclut déjà `de`)

#### 5. Ajouter les fichiers JSON DE dans public/locales

Creer `public/locales/de/` avec `common.json`, `errors.json`, `breath.json`

#### 6. Internationaliser les composants avec chaînes hardcodees

Migrer progressivement les composants critiques contenant du texte FR hardcode :
- `GroupHeader.tsx` : remplacer "Aujourd'hui"/"Hier" par `t('common.today')`/`t('common.yesterday')` et utiliser la locale dynamique pour `Intl.DateTimeFormat`
- `NavBar.tsx` : utiliser les clés de traduction pour les liens
- `Footer.tsx` : utiliser les clés de traduction pour les liens legaux

### Details techniques

- Les 11 fichiers DE suivront exactement la structure des fichiers EN existants
- Le type `Lang` sera etendu a `'fr' | 'en' | 'de'`
- Le `fallbackLng` reste `'fr'`
- Environ **15-20 fichiers** seront modifies ou crees

### Limites

- Les 100+ pages avec texte FR hardcode ne seront pas toutes migrées dans cette iteration — seuls les composants partagés (NavBar, Footer, GroupHeader) et la configuration seront traités
- Les pages individuelles (ModulesDashboard, UnifiedHomePage, etc.) necessiteront des passes supplementaires

