

# Audit UX Utilisateur Final - EmotionsCare

## Pages testees et statut

| Page | Statut | Remarques |
|------|--------|-----------|
| Accueil `/` | OK | Navigation, CTA, demo respiration fonctionnels |
| Login `/login` | Minor | Checkbox "Se souvenir" utilise un input natif peu visible sur fond sombre |
| Signup `/signup` | OK | Formulaire complet, social login present |
| Pricing `/pricing` | OK | "Gratuit" affiche correctement, toggle mensuel/annuel fonctionne |
| Contact `/contact` | OK | Lien centre d'aide fonctionne |
| Features `/features` | OK | Cartes fonctionnalites bien presentees |
| About `/about` | OK | Page complete |
| Help `/help` | OK | Centre d'aide accessible |
| FAQ `/faq` | OK | Recherche et categories fonctionnelles |
| Enterprise `/b2b` | OK | Page B2B complete |
| Legal `/legal/mentions` | **404** | Page introuvable |
| Legal `/legal/terms` | **404** | Page introuvable |
| Install `/install` | OK | Page PWA accessible |

## Problemes restants

### P0 - Liens du footer menant vers des 404

**Impact** : Les 5 liens legaux du footer (`/legal/mentions`, `/legal/terms`, `/legal/sales`, `/legal/privacy`, `/legal/cookies`) menent tous vers la page 404. Un utilisateur qui cherche les mentions legales ou la politique de confidentialite ne trouve rien. Ceci est aussi un probleme de conformite RGPD.

**Fichier** : `src/components/home/Footer.tsx` lignes 28-34

**Correction** : Verifier les routes dans le routeur et corriger les chemins du footer pour correspondre aux routes existantes. Si les pages legales existent sous d'autres chemins (ex: `/privacy`, `/terms`), mettre a jour les liens. Sinon, les pages doivent etre creees.

### P1 - Checkbox "Se souvenir de moi" peu visible

**Fichier** : `src/pages/LoginPage.tsx` lignes 322-329

**Impact** : La checkbox native `<input type="checkbox">` est quasiment invisible sur le fond sombre de la page de login. L'utilisateur ne voit pas s'il l'a cochee ou non.

**Correction** : Remplacer par le composant `Checkbox` de shadcn/ui (Radix) deja installe, qui offre un meilleur contraste et un feedback visuel clair.

### P2 - Banniere cookies persistante

**Impact** : La banniere cookies reste affichee en permanence en bas de chaque page, meme apres interaction. Elle masque partiellement le contenu du footer. Si l'utilisateur clique "Accepter" ou "Refuser", elle doit disparaitre et ne plus revenir.

**Correction** : Verifier que le composant cookie banner sauvegarde bien le choix de l'utilisateur (localStorage) et ne s'affiche plus une fois le choix fait.

---

## Corrections a implementer

### Fichier 1 : Liens legaux du footer
Identifier les bonnes routes pour les pages legales et corriger les href dans `Footer.tsx` pour eviter les 404.

### Fichier 2 : Checkbox login
Remplacer `<input type="checkbox">` par `<Checkbox>` de shadcn/ui dans `LoginPage.tsx` pour une meilleure visibilite sur fond sombre.

### Fichier 3 : Cookie banner
Verifier la persistance du choix utilisateur dans le composant de banniere cookies.

