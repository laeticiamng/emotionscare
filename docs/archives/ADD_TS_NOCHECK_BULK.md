# Ajout massif de // @ts-nocheck

Les erreurs TypeScript dans les fichiers legacy bloquent le build. 
Ajoutez `// @ts-nocheck` en première ligne de tous les fichiers dans ces répertoires :

```bash
# Tous les fichiers .ts et .tsx dans :
src/components/auth/**/*
src/components/breathwork/**/*
src/components/buddy/**/*
src/components/chat/**/*
src/components/coach/**/*
src/components/common/**/*
src/components/analytics/**/*
src/components/animations/**/*
src/components/ambition-arcade/**/*
```

Ces fichiers fonctionnent en runtime grâce à esbuild mais ont des erreurs TypeScript legacy qui seront corrigées progressivement.
