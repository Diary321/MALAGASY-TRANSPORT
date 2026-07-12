# MALAGASY-TRANSPORT

## Déploiement Vercel / Railway

Pour que l'API fonctionne correctement en production, configure ces variables d'environnement dans le dashboard Vercel :

- `DATABASE_URL` = `mysql://USER:PASSWORD@HOST:PORT/DATABASE`
- `JWT_SECRET` = `malagasy_secret_2026` ou une valeur secrète personnelle

Tu peux aussi utiliser les variables individuelles si tu préfères :

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

> Important : sur Vercel, `mysql.railway.internal` n'est pas accessible. Utilise l'URL publique fournie par Railway (`switchyard.proxy.rlwy.net` ou équivalent).

## Notes de connexion

- L'API `POST /auth/login` doit se connecter à la base de données pour authentifier l'utilisateur.
- Si tu as un compte admin existant avec un hash bcrypt (`$2b$...`), le backend l'accepte.
- Si l'erreur persiste, vérifie bien que la variable `DATABASE_URL` est définie dans Vercel.

