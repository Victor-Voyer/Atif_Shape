## Architecture du projet AkiShape

### Vue d’ensemble

**AkiShape** est une application de suivi de poids composée de :

- **Back-end** : API REST Node.js / Express, Sequelize (MySQL), authentification JWT.
- **Front-end** : SPA React (Vite) avec React Router, AuthContext et hooks data.
- **Shared** : constantes communes (`shared/constants.js`) importées côté front (`@shared`) et back.

Le back expose les routes sous `/api`. Le front consomme l’API via Axios (`VITE_API_URL`, fallback `http://localhost:3000/api`).

---

### Couches back-end

```
Request → routes → middlewares (auth, validators) → controllers → services → models / utils purs
```

| Couche | Rôle |
|--------|------|
| `routes/` | Déclaration des endpoints |
| `middlewares/` | JWT (`verifyToken`, `requireSelf`), validations |
| `controllers/` | HTTP uniquement (`sendSuccess` / `sendError`) |
| `services/` | Métier + accès DB |
| `utils/` | Fonctions pures (IMC, deltas de poids, réponses HTTP) |
| `models/` | Sequelize |

#### Démarrage

- `server.js` : charge `dotenv`, écoute sur `PORT`.
- `app.js` : cors, morgan, json, monte `/api`.

#### Auth

- `POST /api/auth/register` — validation complète (profil + email + password).
- `POST /api/auth/login` — retourne `{ data: user, token }`.
- JWT payload allégé : `{ id, email }` uniquement (1h).
- Mot de passe hashé avec bcrypt à l’inscription **et** à la mise à jour.

#### Utilisateurs & poids

Toutes les routes `/users/:id*` exigent `verifyToken` + `requireSelf` (403 si `params.id ≠ token.id`).

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/users/:id` | Profil + `user_weights` |
| `PUT` | `/api/users/:id` | Mise à jour profil |
| `DELETE` | `/api/users/:id` | Suppression compte |
| `GET` | `/api/users/:id/stats` | Statistiques de poids |
| `POST` | `/api/users/:id/weights` | Nouvelle mesure de poids |

#### Modèle User

Champs : `gender`, `username`, `first_name`, `last_name`, `birthdate` (DATEONLY), `height`, `target_weight`, `email`, `password`.

Plus de champ `avatar` (feature retirée). L’ancien champ `age` a été renommé en `birthdate`.

#### Services

- `auth.service.js` — register, login, JWT
- `users.service.js` — CRUD user
- `weights.service.js` — création / lecture des mesures
- `stats.service.js` — agrégation des stats (charge les poids, appelle les utils purs)

#### Utils purs

- `algoWeight.js` — IMC, min/max, starting, goal (reçoit des tableaux, pas de Sequelize)
- `algoDate.js` — jours depuis 1ʳᵉ mesure, count, `getWeightDelta(weights, days)`
- `httpResponse.js` — `sendSuccess` / `sendError`

#### Validators

Un seul module : `middlewares/validators/user.validation.js`  
(`registerValidation`, `loginValidation`, `updateUserValidation`, `createWeightValidation`, `handleValidationErrors`).

---

### Front-end

#### Infra

- `main.jsx` — `BrowserRouter` + `AuthProvider`
- `context/AuthContext.jsx` — token/user, loginSuccess, logout, updateUser (localStorage via `STORAGE_KEYS`)
- `services/api.js` — Axios + Bearer + `getErrorMessage`
- `services/authApi.js`, `usersApi.js`, `weightsApi.js` — appels métier
- Alias Vite `@shared` → `../shared`

#### Routes

| Path | Accès | Page |
|------|-------|------|
| `/login` | public | Login |
| `/register` | public | Register |
| `/` | protégé | Dashboard |
| `/profile` | protégé | Profile |

#### Hooks

- `useUserStats(userId)` — fetch user + stats
- `useCreateWeight(userId, onSuccess)` — mutation poids

#### Composants UI

- `pages/` — Login, Register, Dashboard, Profile
- `components/` — WeightChart, WeightForm, StatsPanel

---

### Shared

Fichier `shared/constants.js` :

- `STORAGE_KEYS` (`aki_token`, `aki_user`)
- `GENDERS` / `GENDER_VALUES`

---

### Flux principaux

1. **Inscription** → `POST /auth/register` (champ `birthdate`) → `POST /auth/login` → AuthContext + redirect `/`
2. **Dashboard** → `GET /users/:id` + `GET /users/:id/stats` → ajout via `POST /users/:id/weights`
3. **Profil** → `PUT /users/:id` (champs modifiés seulement, dont `birthdate`)

---

### Structure des dossiers

```
AkiShape/
├── ARCHITECTURE.md
├── shared/
│   └── constants.js
├── back/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       │   └── validators/
│       ├── migrations/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── utils/
│           ├── dates/
│           ├── weight/
│           └── httpResponse.js
└── front/
    └── src/
        ├── components/
        ├── context/
        ├── hooks/
        ├── pages/
        └── services/
```
