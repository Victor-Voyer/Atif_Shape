## Front Atif_Shape – Documentation du travail réalisé

Ce fichier décrit **point par point** ce qui a été mis en place pour le front React dans le dossier `front/`.

---

### 1. Initialisation du projet

- **Outil** : Vite + React (`npm create vite@latest . -- --template react`).
- **Structure principale** :
  - `src/main.jsx` : point d’entrée React.
  - `src/App.jsx` : composition principale de l’interface (login / dashboard / profil).
  - `src/App.css` et `src/index.css` : styles globaux et layout.
  - `src/components/` : composants réutilisables (Login, Dashboard, Profile, WeightChart).
  - `src/services/api.js` : client HTTP centralisé basé sur Axios.
- **Dépendances ajoutées** :
  - `axios` pour communiquer avec l’API back.
  - `recharts` pour la courbe d’évolution du poids.

---

### 2. Style global et design sobre

Fichier : `src/index.css`

- Remplacement du thème Vite par un style **clair, minimaliste** :
  - fond en dégradé très léger (`#f3f4f6`, `#f9fafb`),
  - typographie système (`system-ui`, `-apple-system`, etc.),
  - suppression des logos Vite/React.
- Normalisation :
  - `box-sizing: border-box` pour tous les éléments,
  - marges de base gérées au niveau du `body` uniquement.

Fichier : `src/App.css`

- Mise en place de la **structure de page** :
  - `#root` centré avec largeur max de 1200px.
  - `.app-shell` : layout vertical global.
  - `.app-header` : bandeau supérieur (titre + navigation + utilisateur + bouton de déconnexion).
- Création de **cartes** et **grilles** :
  - `.card` : panneau blanc avec bord fin + ombre douce.
  - `.layout-split` : grille principale (courbe à gauche + résumé à droite).
  - `.stats-grid` / `.stat-card` : grille de statistiques (min, max, nombre de mesures, variations).
- Styles des **éléments spécifiques** :
  - `.logout-button`, `.user-chip`, `.user-dot` : affichage de l’utilisateur connecté et bouton de déconnexion.
  - `.empty-state` : affichage propre en cas de chargement ou d’absence de données.
  - `.weight-form*` : style du formulaire d’ajout de poids, intégré dans la carte de la courbe.
  - `.profile-*` : style du formulaire de profil (grille responsive, champs sobres).
  - `.nav-toggle*` : petite “pill” de navigation `Poids / Profil` dans le header.

---

### 3. Client API (Axios + JWT)

Fichier : `src/services/api.js`

- Création d’une instance Axios avec :
  - `baseURL: "http://localhost:3000/api"` (adapté au back existant).
- Mise en place d’un **interceptor de requêtes** :
  - Récupère le token JWT dans `localStorage` (`atif_token`).
  - Ajoute l’en-tête HTTP `Authorization: Bearer <token>` pour toutes les requêtes.

Objectif : **ne jamais répéter le code d’ajout du token** dans chaque appel d’API.

---

### 4. Composant racine `App.jsx`

Fichier : `src/App.jsx`

Responsabilités :
- Gestion de l’**authentification** (stockage du token et des infos user).
- Choix de la **vue à afficher** :
  - écran de connexion,
  - dashboard (courbe + stats),
  - profil utilisateur.

Fonctionnement :
- États gérés dans `App` :
  - `token` : JWT renvoyé par `/api/auth/login`.
  - `user` : données de l’utilisateur renvoyées par le back.
  - `view` : `"dashboard"` ou `"profile"` (navigation interne simple).
- **Persistance** :
  - Au montage du composant, lecture de `atif_token` et `atif_user` dans `localStorage`.
  - En cas de connexion/réussite de mise à jour du profil, sauvegarde dans `localStorage`.
- **Header** :
  - Affiche le nom de l’appli (“Atif Shape”) + sous-titre explicatif.
  - Navigation `Poids / Profil` via deux boutons (`view`).
  - Affiche le prénom ou le `username` de l’utilisateur + bouton de déconnexion.
- Rendu conditionnel :
  - si **non authentifié** : affiche `<Login />`.
  - si **authentifié & vue "profile"** : affiche `<Profile />`.
  - sinon : affiche `<Dashboard />`.

---

### 5. Page de connexion – `Login.jsx`

Fichier : `src/components/Login.jsx`

Objectif : **authentifier l’utilisateur** via `POST /api/auth/login` (déjà existant côté back).

Fonctionnement :
- Champs gérés dans le state local :
  - `email`,
  - `password`,
  - `loading`, `error`.
- Au `submit` :
  - envoi d’une requête `POST /auth/login` via `api`,
  - en cas de succès : appelle `onLoginSuccess(user, token)` fourni par `App`,
  - en cas d’échec : affichage d’un message d’erreur (en français) sous le formulaire.

Design :
- Carte centrée et compacte,
- champs simples, labels discrets, bouton plein fond bleu,
- messages d’erreurs en rouge sous le formulaire.

---

### 6. Dashboard – courbe d’évolution du poids

Fichier : `src/components/Dashboard.jsx`

Responsabilités :
- Afficher la **courbe d’évolution du poids**.
- Afficher les **statistiques de poids** (min, max, nombre de mesures, variations).
- Permettre **d’ajouter un nouveau poids** via un petit formulaire.

Chargement des données :
- Au montage (et à chaque ajout de poids), pour l’utilisateur connecté `user.id` :
  - `GET /api/users/:id` → récupère l’utilisateur + relation `user_weights`.
  - `GET /api/users/:id/stats` → récupère les stats calculées (min, max, évolution 7 / 30 jours, etc.).
- Les poids (`user_weights`) sont stockés dans `weights`.
- Les stats sont stockées dans `stats`.

Préparation des données pour Recharts :
- Tri des poids par date croissante à partir de `measured_at` (champ de la table `user_weights`).
- Transformation en tableau `{ date: "jj MMM", weight: nombre }`.

Formulaire d’ajout de poids :
- Champ nombre `Nouveau poids (kg)` + bouton **Ajouter**.
- Validation côté front :
  - transformation éventuelle `,` → `.`,
  - refus des valeurs non numériques ou ≤ 0.
- Appel API :
  - `POST /users` avec `{ weight: <nombre> }`.
  - En cas de succès : on vide le champ et on incrémente une clé `reloadKey` pour recharger les données.
  - En cas d’erreur : message rouge “Impossible d’enregistrer ce nouveau poids”.

Affichage des stats :
- Dernier poids mesuré (calculé côté front à partir de `weights` triés par date),
- Poids min et max (`stats.minWeight`, `stats.maxWeight`),
- Nombre de mesures,
- Évolution sur 7 et 30 jours (couleurs verte ou rouge selon le signe).

---

### 7. Courbe de poids – `WeightChart.jsx`

Fichier : `src/components/WeightChart.jsx`

Librairie : **Recharts**

- Composants utilisés :
  - `ResponsiveContainer` pour adapter la courbe à la largeur de la carte.
  - `LineChart` + `Line` pour la courbe principale.
  - `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip` pour les axes et le fond.
- Lignes épurées :
  - grille grise fine,
  - courbe bleue,
  - points ronds blancs avec bord bleu.
- Comportement :
  - Si `data` est vide → affichage d’un état vide “Pas encore de mesures de poids.”

---

### 8. Page Profil – `Profile.jsx`

Fichier : `src/components/Profile.jsx`

Objectif : permettre à l’utilisateur de **modifier ses informations** personnelles.

Champs gérés :
- `gender` (Homme / Femme),
- `username`,
- `first_name`,
- `last_name`,
- `age` (géré comme `input type="date"`),
- `height` (en cm),
- `email`.

Fonctionnement :
- Initialisation du state local à partir de `user` fourni par `App`.
- Au `submit` :
  - on construit un `payload` contenant **uniquement les champs modifiés** (par rapport aux valeurs initiales),
  - envoi sur `PUT /users/:id`,
  - en cas de succès : appel de `onUserUpdated(updatedUser)` pour mettre à jour le `user` global et le `localStorage`,
  - affichage d’un message de succès vert ou d’une erreur rouge.

Design :
- Formulaire en grille 2 colonnes (qui passe à 1 colonne en mobile),
- labels gris, champs blancs arrondis, bouton sombre pour l’enregistrement.

---

### 9. Navigation interne : Poids / Profil

Au lieu d’utiliser un router complet, la navigation est gérée **simplement dans `App.jsx`** :

- état `view` : `"dashboard"` ou `"profile"`,
- deux boutons dans le header (`Poids`, `Profil`) qui changent `view`,
- rendu conditionnel dans `App` selon `view`.

Cela permet de garder un front **léger et lisible** tout en ayant une séparation claire entre :
- le suivi du poids,
- la gestion du profil.

---

### 10. Lancer et tester le front

Dans le dossier `front/` :

```bash
npm install    # déjà fait une fois, à refaire seulement si nécessaire
npm run dev    # lance Vite en mode développement
```

Puis aller sur l’URL affichée (généralement `http://localhost:5173`).

Pré-requis côté back :
- serveur Node lancé sur `http://localhost:3000`,
- routes exposées sous `/api` :
  - `POST /api/auth/login`,
  - `GET /api/users/:id`,
  - `GET /api/users/:id/stats`,
  - `POST /api/users` (ajout d’un poids),
  - `PUT /api/users/:id` (mise à jour du profil).

---

### 11. Résumé rapide

- Mise en place d’un **front React moderne** avec Vite, Axios et Recharts.
- Création d’un **écran de login**, d’un **dashboard** (courbe + stats + ajout de poids) et d’un **profil éditable**.
- Intégration complète avec ton back existant (JWT, routes `/auth` et `/users`).
- Design **sobre, clair et responsive**, centré sur la lisibilité des données de poids.

