# Visuel Design Print — Guide de démarrage

## Prérequis

- Node.js v18+ installé
- npm v9+

---

## Premier lancement (installation)

À faire une seule fois après clonage ou modification de `package.json`.

```bash
# 1. Dépendances racine (concurrently)
npm install

# 2. Dépendances frontend
cd frontend
npm install --legacy-peer-deps
cd ..

# 3. Dépendances backend
cd backend
npm install
cd ..
```

---

## Lancement du projet (développement)

### Option A — Tout en une commande (recommandé)

Depuis la racine du projet :

```bash
npm run dev
```

Lance simultanément :
- Frontend Angular sur `http://localhost:4400`
- Backend Express sur `http://localhost:3000`

---

### Option B — Lancer séparément (deux terminaux)

**Terminal 1 — Backend :**
```bash
cd backend
node src/server.js
```

**Terminal 2 — Frontend :**
```bash
cd frontend
npx ng serve --open
```

---

## Accès

| URL | Description |
|-----|-------------|
| `http://localhost:4400` | Site vitrine (page d'accueil) |
| `http://localhost:4400/login` | Connexion administration |
| `http://localhost:4400/admin/dashboard` | Tableau de bord |
| `http://localhost:4400/admin/events` | Gestion des publications |
| `http://localhost:3000/api/health` | Vérification de l'API |

**Identifiants admin :** `admin` / `vdp2025`

---

## Après modification du code

| Modification | Action requise |
|-------------|---------------|
| Fichiers Angular (`src/`) | Aucune — rechargement automatique |
| Fichiers backend (`backend/src/`) | Redémarrer le backend (Ctrl+C puis relancer) |
| `frontend/package.json` | `cd frontend && npm install --legacy-peer-deps` |
| `backend/package.json` | `cd backend && npm install` |
| `frontend/angular.json` | Redémarrer `ng serve` |

---

## Build production

```bash
cd frontend
npx ng build --configuration production
```

Les fichiers compilés se trouvent dans `frontend/dist/vdp-frontend/`.
Servir ce dossier avec le backend Express ou un serveur statique (Nginx, Vercel, etc.).

---

## Dépannage

**Erreur : `ECONNREFUSED /api/events`**
→ Le backend n'est pas démarré. Lancer `node src/server.js` dans le dossier `backend/`.

**Erreur : `Cannot find module '...'`**
→ Dépendances manquantes. Relancer `npm install` dans le dossier concerné.

**Erreur TypeScript à la compilation**
→ Vérifier que `frontend/package.json` a `"typescript": "~5.9.0"` et relancer `npm install --legacy-peer-deps`.

**Port 4400 ou 3000 déjà occupé**
```bash
# Libérer le port (Windows)
netstat -ano | findstr :4400
taskkill /PID <PID> /F
```

**Login ne fonctionne pas**
→ Vérifier que le backend tourne : ouvrir `http://localhost:3000/api/health` dans le navigateur.
