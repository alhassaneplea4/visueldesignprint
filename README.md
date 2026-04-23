# 🖨️ Visuel Design Print

**Site web officiel et panel d'administration pour Visuel Design Print**  
Imprimerie Grand Format — Conakry, Guinée 🇬🇳

---

## 🗂️ Structure du projet

```
visueldesignprint/
│
├── index.html          ← Site public (page d'accueil)
├── admin.html          ← Panel d'administration
│
├── assets/
│   └── images/
│       └── vdp.jpg    ← Logo Visuel Design Print
│
├── backend/            ← API REST Express 5 (optionnel)
│   └── src/
│       ├── server.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── events.routes.js
│       ├── middleware/
│       │   └── auth.middleware.js
│       └── data/
│           └── db.json
│
└── frontend/           ← Application Angular 21 (optionnel)
    └── src/
        └── app/
            ├── core/
            ├── pages/
            └── shared/
```

---

## 🚀 Version Simple (HTML/JS)

**Aucune installation requise !** Ouvrez directement dans un navigateur.

```bash
# Option 1 : Double-clic sur index.html
# Option 2 : Serveur local simple
npx serve .
# → http://localhost:3000
```

### Accès admin
- URL : `admin.html`
- Utilisateur : `admin`
- Mot de passe : `vdp2025`

> Les données sont stockées dans le `localStorage` du navigateur.

---

## ⚡ Version Full-Stack (Angular 21 + Express 5)

### Backend (Express 5)

```bash
cd backend
npm install
npm run dev
# → http://localhost:3000
```

### Frontend (Angular 21)

```bash
cd frontend
npm install
ng serve --port 4200
# → http://localhost:4200
```

### Accès admin full-stack
- URL : `http://localhost:4200/login`
- Utilisateur : `admin`
- Mot de passe : `vdp2025`

---

## 🎨 Palette de couleurs

| Couleur | Code HEX | Usage |
|---------|----------|-------|
| Cyan (C) | `#00B4D8` | Couleur principale |
| Magenta (M) | `#E63B7A` | Accents |
| Yellow (Y) | `#F4C430` | Highlights |
| Black (K) | `#0D0D0D` | Fond principal |
| Ink | `#1A1A1A` | Fond secondaire |
| White | `#F5F5F0` | Texte |

---

## 📦 Services proposés

1. **Bâches & Banderoles** — Publicité extérieure grand format
2. **Affiches & Kakémonos** — Roll-up et stands événementiels
3. **Covering Véhicule** — Habillage de flotte automobile
4. **Vitrophanie** — Films adhésifs pour vitrines
5. **Panneaux & Enseignes** — Signalétique commerciale
6. **Packaging & Flyers** — Print communication complète

---

## 📱 Pages du site

| Page | Description |
|------|-------------|
| `#hero` | Section d'accueil avec animation CMYK |
| `#services` | Grille des 6 services |
| `#about` | Histoire et valeurs de l'entreprise |
| `#process` | Processus en 4 étapes |
| `#actualites` | Publications récentes (dynamiques) |
| `#contact` | Formulaire de devis gratuit |

---

## 🔑 Panel d'Administration

Le panel admin permet de :
- ✅ Créer de nouvelles publications/actualités
- ✏️ Modifier les publications existantes
- 🗑️ Supprimer des publications
- 📊 Voir les statistiques du tableau de bord
- 🔍 Rechercher et filtrer les publications
- 🖼️ Uploader des images pour les publications

---

## 🌐 Réseaux sociaux

- **Facebook** : [Visuel Design Print](https://www.facebook.com/share/17NnQYVFwA/)

---

## 📄 Licence

© 2026 Visuel Design Print. Tous droits réservés.
