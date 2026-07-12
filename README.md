<!--
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-05 01:51:11
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-12 11:24:03
 * @FilePath: \MALAGASY_TRANSPORT\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# MALAGASY TRANSPORT 🚍

Système de réservation de voyage à Madagascar.

## 🚀 Déploiement

### Variables d'environnement (Vercel)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL complète MySQL | `mysql://user:pass@host:port/db` |
| `DB_HOST` | Hôte MySQL | `switchyard.proxy.rlwy.net` |
| `DB_PORT` | Port MySQL | `29442` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | `****` |
| `DB_NAME` | Nom de la base | `railway` |
| `JWT_SECRET` | Secret JWT | `malagasy_secret_2026` |

### ⚠️ Important

Sur Vercel, `mysql.railway.internal` **n'est pas accessible**. Utilisez l'URL publique Railway (`switchyard.proxy.rlwy.net`).

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@malagasy.com` | `admin123` |

## 📦 Installation locale

```bash
npm install
npm run dev