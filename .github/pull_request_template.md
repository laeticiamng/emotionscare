## Résumé
- [ ] Opt-in requis respecté et documenté
- [ ] Pas de chiffres en UI (lint + snapshots `no-numbers`)
- [ ] A11Y AA validé (jest-axe / axe-playwright)
- [ ] Types OpenAPI utilisés, aucun `any` dans les appels API
- [ ] Logs et traces sans PII (RLS testée si pertinent)
- [ ] Captures ou vidéos fournies pour les changements UI
- [ ] Nouveaux flags ou variations documentés (docs + ENV)

## Tests
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run gen:openapi && npm run type-check`
- [ ] `npm run e2e` ou scénario ciblé
- [ ] Autres (préciser)
