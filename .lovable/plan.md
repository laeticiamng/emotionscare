

# Correction des informations de contact - Audit complet

## Probleme

Le seul contact valide est **contact@emotionscare.com**. Or la plateforme contient :
- Des numeros de telephone fictifs (+33 1 23 45 67 89, +33 (0)1 86 95 12 34)
- Un domaine incorrect : **emotions-care.com** (avec tiret) au lieu de **emotionscare.com**
- Un domaine inexistant : **emotionscare.ai**
- Des adresses postales fictives (123 Avenue..., 75001 Paris)
- Des emails non verifies (support@, legal@, dpo@, privacy@, enterprise@)

L'adresse reelle est : **5 rue Caudron, 80000 Amiens** (source Pappers / RCS).

---

## Inventaire des corrections (11 fichiers)

### Fichier 1 : `src/components/navigation/MainFooter.tsx`
- Ligne 77-79 : `contact@emotions-care.com` -> `contact@emotionscare.com`
- Lignes 81-86 : Supprimer le bloc telephone fictif (+33 1 23 45 67 89)

### Fichier 2 : `src/components/layout/PremiumFooter.tsx`
- Ligne 141-143 : `contact@emotions-care.com` -> `contact@emotionscare.com`
- Lignes 145-150 : Supprimer le bloc telephone fictif
- Lignes 158-174 : Remplacer les liens sociaux actifs (twitter.com, facebook.com, instagram.com) par des spans desactives avec label "bientot disponible" (conformement a la politique de credibilite)

### Fichier 3 : `src/components/marketing/Footer.tsx`
- Ligne 67 : email deja correct (contact@emotionscare.com)
- Lignes 69-72 : Supprimer le bloc telephone fictif
- Lignes 73-76 : Remplacer "Paris, France" par "Amiens, France"

### Fichier 4 : `src/pages/legal/MentionsPage.tsx`
- Ligne 87 : `support@emotionscare.com` -> `contact@emotionscare.com`
- Ligne 88 : Supprimer `legal@emotionscare.com` (non verifie)
- Ligne 89 : Supprimer la ligne telephone fictif

### Fichier 5 : `src/pages/legal/PrivacyPolicyPage.tsx`
- Ligne 431 : `privacy@emotionscare.com` -> `contact@emotionscare.com`
- Ligne 432 : `dpo@emotionscare.com` -> `contact@emotionscare.com`
- Ligne 433 : Supprimer telephone fictif
- Ligne 434 : Remplacer adresse fictive par "5 rue Caudron, 80000 Amiens"

### Fichier 6 : `src/pages/b2c/B2CDataPrivacyPage.tsx`
- Ligne 619 : `dpo@emotionscare.com` -> `contact@emotionscare.com`
- Ligne 620 : Supprimer telephone fictif
- Ligne 621 : Remplacer adresse fictive par "5 rue Caudron, 80000 Amiens"

### Fichier 7 : `src/pages/EntreprisePage.tsx`
- Lignes 440-447 : Remplacer bouton "Nous Appeler" par bouton "Nous Contacter" avec mailto
- Ligne 453 : `enterprise@emotionscare.com` -> `contact@emotionscare.com`
- Lignes 455-458 : Supprimer le bloc telephone

### Fichier 8 : `src/pages/SupportChatbotPage.tsx`
- Ligne 335 : `support@emotionscare.com` -> `contact@emotionscare.com`
- Lignes 337-340 : Supprimer le bouton telephone

### Fichier 9 : `src/pages/SupportPage.tsx`
- Ligne 124 : `support@emotionscare.com` -> `contact@emotionscare.com`

### Fichier 10 : `src/components/layout/CommandMenu.tsx`
- Ligne 117 : `docs.emotions-care.com` -> `emotionscare.com` (ou supprimer le lien externe)

### Fichier 11 : `src/components/help/FAQAccordion.tsx`
- Ligne 55 : `support@emotionscare.com` -> `contact@emotionscare.com`

### Fichier 12 : `supabase/functions/contact-form/index.ts`
- Ligne 159 : `support@emotionscare.ai` -> `contact@emotionscare.com`
- Ligne 222 : `emotionscare.ai/help` -> `emotionscare.com/help`
- Ligne 222 : `emotionscare.ai/social-cocon` -> `emotionscare.com/social-cocon`

---

## Resume des regles appliquees

| Element | Avant | Apres |
|---------|-------|-------|
| Email de contact | contact@emotions-care.com, support@, legal@, dpo@, privacy@, enterprise@ | **contact@emotionscare.com** partout |
| Telephone | +33 1 23 45 67 89 / +33 (0)1 86 95 12 34 | **Supprime** (fictif) |
| Adresse postale | 123 Avenue..., 75001 Paris | **5 rue Caudron, 80000 Amiens** |
| Domaine | emotions-care.com / emotionscare.ai | **emotionscare.com** |
| Reseaux sociaux | Liens actifs vers twitter.com/facebook.com | **Desactives** ("bientot disponible") |

Total : 12 fichiers a modifier. Zero donnee fictive restante apres correction.
