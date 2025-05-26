# Setup du Front

Pour accélérer l'installation sur un environnement ne nécessitant pas les tests de base de données ni les fonctions Edge, vous pouvez définir le flag `SKIP_TEST_DEPS`.

```bash
SKIP_TEST_DEPS=true npm install
```

Avec ce drapeau, le script `preinstall` remplace les dépendances de test (edge-test-kit, supabase-edge-functions-test, pgtap-run, pg-prove) par des stubs vides. Après le build, `scripts/install-heavy.js` peut réinstaller ces packages si besoin.

Ce mécanisme évite les erreurs 404 lors de `npm install` tout en conservant la possibilité d'exécuter les tests localement lorsque `SKIP_TEST_DEPS` n'est pas activé.
