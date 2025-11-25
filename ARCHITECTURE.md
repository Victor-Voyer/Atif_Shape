## Architecture du projet Atif Shape

### Vue d’ensemble

**Atif Shape** est une application de suivi de poids composée :

- **Back-end** : API REST en Node.js / Express, avec **Sequelize** pour l’accès à la base de données (modèle relationnel `User` / `UserWeight`) et une authentification par **JWT**.
- **Front-end** : SPA en **React** (Vite) qui consomme l’API, gère l’authentification (login / register) et affiche un tableau de bord avec les courbes et statistiques de poids.

Le back expose des routes sous le préfixe `/api`, et le front communique avec ces routes via Axios.

---

### Back-end (Node.js / Express / Sequelize)

#### Démarrage du serveur

- **Fichier** : `back/src/server.js`  
  - Charge les variables d’environnement avec `dotenv`.
  - Lit le port depuis `process.env.PORT` (fallback sur `3000`).
  - Démarre l’application Express importée depuis `app.js`.

Le serveur HTTP ne contient aucune logique métier : il délègue tout à l’instance Express configurée dans `app.js`.

#### Configuration de l’application Express

- **Fichier** : `back/src/app.js`
  - Initialise Express.
  - Active des middlewares globaux :
    - `cors()` pour autoriser les requêtes cross-origin (utiles pour le front React).
    - `morgan("dev")` pour les logs HTTP.
    - `express.json()` pour parser le corps des requêtes JSON.
  - Monte le routeur principal sur le préfixe `/api` :
    - `app.use("/api", router);` avec `router` défini dans `routes/index.js`.

Il existe un commentaire pour servir les fichiers statiques des uploads (`/uploads`), ce qui laisse la porte ouverte à l’exposition directe des avatars si nécessaire.

#### Routage principal

- **Fichier** : `back/src/routes/index.js`
  - Crée un `Router` Express.
  - Monte les sous-routeurs :
    - `/users` → `users.routes.js`
    - `/auth` → `auth.routes.js`
  - Termine par le middleware `notFound` (gestion générique des routes inexistantes).

Ainsi, toutes les routes de l’API sont regroupées et hiérarchisées sous `/api/auth/*` et `/api/users/*`.

#### Authentification & sécurité

##### Routes d’authentification

- **Fichier** : `back/src/routes/auth.routes.js`
  - `POST /api/auth/register`  
    - Middlewares de validation : `registerValidation`.
    - Contrôleur : `registerUser`.
  - `POST /api/auth/login`  
    - Middlewares de validation : `loginValidation`.
    - Contrôleur : `login`.

Les validations sont centralisées dans `middlewares/validators/auth.validator.js` (non détaillé ici, mais responsable de vérifier la forme des données d’entrée).

##### Contrôleur d’authentification

- **Fichier** : `back/src/controllers/auth.controller.js`
  - Utilise `express-validator` pour vérifier les erreurs de validation et répondre en **400** en cas d’erreurs.
  - `registerUser(req, res)` :
    - Appelle `register(req.body)` dans `services/auth.service.js`.
    - Retourne **201** avec le nouvel utilisateur si tout est OK.
  - `login(req, res)` :
    - Appelle `validateCredentials(email, password)` dans `auth.service.js`.
    - En cas de succès, génère un **JWT** via `generateToken(user)` et renvoie :
      - `data` : l’utilisateur authentifié.
      - `token` : le JWT à stocker côté front.

Toute la logique sensible (hash des mots de passe, génération et vérification de token) est encapsulée dans le service `auth.service.js`.

##### Middleware d’authentification (JWT)

- **Fichier** : `back/src/middlewares/auth.js`
  - Expose `verifyToken(req, res, next)` :
    - Vérifie la présence d’un header `Authorization` de type `Bearer <token>`.
    - Décode et valide le token avec `jwt.verify` et la clé `process.env.JWT_SECRET`.
    - Stocke le **payload** dans `req.user`.
    - En cas d’erreur ou d’absence de token, renvoie une réponse **401** avec un message explicite.

Toutes les routes sensibles (accès utilisateur, stats, création de poids, etc.) utilisent ce middleware pour s’assurer que l’appelant est authentifié.

---

### Gestion des utilisateurs & des poids

#### Routes utilisateurs

- **Fichier** : `back/src/routes/users.routes.js`
  - Toutes les routes passent par `verifyToken` (l’utilisateur doit être connecté) :
    - `GET /api/users/:id` → `getUserById`
    - `POST /api/users` → `createNewUserWeight` (ajout d’une nouvelle mesure de poids pour l’utilisateur courant `req.user.id`).
    - `PUT /api/users/:id` → `updateUser` (avec validations `updateUserValidation` + `handleValidationErrors`).
    - `DELETE /api/users/:id` → `deleteUser`.
    - `GET /api/users/:id/stats` → `getUserStats` (statistiques de poids).

Ces routes encapsulent le domaine fonctionnel “profil utilisateur” + “suivi de poids”.

#### Modèles Sequelize

- **Fichier** : `back/src/models/User.js`
  - Modèle `User` :
    - Champs principaux : `avatar`, `gender`, `username`, `first_name`, `last_name`, `age` (date de naissance), `height` (cm), `email`, `password` (hashé).
    - Validation forte :
      - `gender` limité à `"male"` / `"female"`.
      - `age` contrôlé pour être cohérent (entre 5 et 150 ans).
      - `height` encadré entre 100 et 300 cm.
      - `email` unique et de forme valide.
      - `password` longueur minimale.
    - Association :
      - `User.hasMany(UserWeight, { as: "user_weights" })`.

- **Fichier** : `back/src/models/UserWeights.js`
  - Modèle `UserWeight` :
    - Champs : `weight` (kg), `measured_at` (date de mesure, par défaut `NOW`), `user_id`.
    - Association :
      - `UserWeight.belongsTo(User, { as: "user" })`.

Cette structure permet :

- De stocker les informations “statiques” de l’utilisateur dans `users`.
- De stocker l’historique des mesures dans `user_weights`.

#### Contrôleur utilisateurs

- **Fichier** : `back/src/controllers/users.controller.js`

Principales fonctions :

- `getUserById(req, res)` :
  - Récupère un `User` par `id` avec ses `user_weights`.
  - Renvoie **404** si l’utilisateur n’existe pas.

- `createNewUserWeight(req, res)` :
  - Lit le `weight` (kg) dans `req.body`.
  - Crée une nouvelle ligne dans `UserWeight` avec `user_id` provenant du token (`req.user.id`).

- `updateUser(req, res)` :
  - Récupère un utilisateur par `id`.
  - Prépare un `payload` avec les champs modifiables : `gender`, `username`, `first_name`, `last_name`, `age`, `height`, `email`, `password`.
  - Si un fichier `avatar` a été uploadé, ajoute `avatar` au `payload`.
  - Met à jour l’utilisateur et renvoie l’utilisateur mis à jour (avec `user_weights`).

- `deleteUser(req, res)` :
  - Supprime un utilisateur par `id`.
  - Si un avatar existe, essaie d’effacer le fichier dans `public/uploads/avatars`.

- `getUserStats(req, res)` :
  - Calcule une série de statistiques en parallèle (`Promise.all`) :
    - `startingWeight`, `maxWeight`, `minWeight`, `daysSinceFirstMeasure`, `measuresCount`, `weightLastWeek`, `weightLastMonth`.
  - Récupère l’utilisateur et sa dernière mesure de poids (`latestWeightRow`).
  - Calcule l’IMC via `calculateIMC`.
  - Retourne un objet structuré avec toutes ces données dans `data`.

Ce contrôleur centralise la logique de lecture / écriture et la composition des réponses JSON pour le front.

---

### Calculs métiers (utils poids & dates)

#### Utilitaires de poids

- **Fichier** : `back/src/utils/weight/algoWeight.js`
  - `calculateIMC(weightKg, heightCm)` :
    - Convertit `_cm_ → _m_` et calcule l’IMC \( \text{IMC} = \frac{\text{poids}}{\text{taille}^2} \).
    - Retourne un objet `{ imc, category }` où `category` est une chaîne en français (Insuffisance pondérale, Corpulence normale, Surpoids, Obésité).
  - `calculateMaxWeight(id)` / `calculateMinWeight(id)` :
    - Utilisent les agrégats Sequelize `max` et `min` sur la table `user_weights` pour un `user_id` donné.
  - `getStartingWeight(id)` :
    - Récupère la toute première mesure de l’utilisateur (tri ASC sur `measured_at`) et renvoie le poids correspondant.

Ces fonctions encapsulent la logique métier de calcul liée aux poids, et sont réutilisées dans le contrôleur des utilisateurs.

#### Utilitaires de dates

- **Fichier** : `back/src/utils/dates/algoDate.js`
  - `getDaysSinceFirstMeasure(userId)` :
    - Récupère la première mesure de poids et calcule le nombre de jours écoulés jusqu’à aujourd’hui (en mode “inclusif” : le jour même compte comme 1).
  - `getMeasuresCount(userId)` :
    - Compte le nombre total de mesures pour un utilisateur.
  - `getWeightLastWeek(userId)` :
    - Filtre les mesures sur les 7 derniers jours et renvoie la différence entre le premier et le dernier poids sur cette période.
  - `getWeightLastMonth(userId)` :
    - Même logique, mais sur 28 jours (4 semaines).

Ces utilitaires permettent de fournir au front des indicateurs prêts à l’emploi sans que celui-ci ne doive faire de calculs complexes.

---

### Upload d’avatar (stockage de fichiers)

- **Fichier** : `back/src/middlewares/uploadAvatar.js`
  - Configure **multer** avec un stockage disque :
    - Dossier cible : `public/uploads/avatars`.
    - Nom de fichier : basé sur `req.user.username`, la date courante et le nom original (espaces remplacés par `_`).
  - `fileFilter` n’autorise que certains types MIME (`image/jpeg`, `image/png`, `image/webp`).

Ce middleware est pensé pour être utilisé sur des routes de mise à jour de profil afin de gérer l’upload de photos de profil.

---

### Front-end (React / Vite)

#### Initialisation de l’application

- **Fichier** : `front/src/main.jsx`
  - Monte le composant racine `App` dans la div `#root`.
  - Applique les styles globaux via `index.css`.

#### Composant racine `App`

- **Fichier** : `front/src/App.jsx`
  - Gère l’état global côté client :
    - `token` JWT.
    - `user` courant.
    - `view` (`"dashboard"` ou `"profile"`).
  - Persiste `token` et `user` dans `localStorage` (`atif_token`, `atif_user`) et les recharge au démarrage.
  - Affiche :
    - `Login` si l’utilisateur n’est pas authentifié.
    - `Dashboard` si authentifié et `view === "dashboard"`.
    - `Profile` si authentifié et `view === "profile"`.
  - Gère la déconnexion (clear du localStorage et remise à zéro des states).

#### Service d’appel API

- **Fichier** : `front/src/services/api.js`
  - Crée une instance Axios avec `baseURL = "http://localhost:3000/api"`.
  - Intercepteur de requête :
    - Lit `atif_token` depuis `localStorage`.
    - Ajoute automatiquement l’en-tête `Authorization: Bearer <token>` si présent.

Tous les composants front (Login, Dashboard, Profile) consomment l’API via ce service partagé.

#### Écrans principaux

- **`Login.jsx`**
  - Gère à la fois **connexion** et **inscription** :
    - `mode = "login"` → POST `/auth/login`.
    - `mode = "register"` → POST `/auth/register` puis `/auth/login`.
  - En cas de succès, récupère `user` + `token` et appelle `onLoginSuccess`, qui met à jour l’état global dans `App`.

- **`Dashboard.jsx`**
  - Charge en parallèle :
    - le détail utilisateur (`GET /users/:id`),
    - les stats (`GET /users/:id/stats`).
  - Affiche :
    - Le graphique d’évolution du poids (`WeightChart`).
    - Les statistiques calculées sur le back (poids de départ, min, max, IMC, évolution sur 7 et 30 jours, nombre de mesures…).
  - Permet d’ajouter un nouveau poids (`POST /users`), ce qui déclenche un rechargement local des données.

- **`Profile.jsx`**
  - Affiche et permet de modifier les informations de profil (genre, username, prénom, nom, date de naissance, taille, email).
  - Ne soumet au back que les champs réellement modifiés.
  - Envoie un `PUT /users/:id` avec les données à mettre à jour, puis met à jour l’état `user` dans `App`.

---

### Résumé des flux principaux

- **Inscription / Connexion**
  1. L’utilisateur s’inscrit via `Login.jsx` → `POST /api/auth/register`.
  2. Puis se connecte automatiquement → `POST /api/auth/login` → reçoit un `token` + `user`.
  3. Le front stocke ces informations en mémoire et dans `localStorage`.

- **Suivi de poids**
  1. `Dashboard.jsx` appelle `GET /api/users/:id` + `GET /api/users/:id/stats`.
  2. L’utilisateur ajoute un poids → `POST /api/users` (protégé par `verifyToken`).
  3. Le back stocke la nouvelle mesure dans `user_weights` et recalcule les stats à la demande.

- **Gestion du profil**
  1. `Profile.jsx` prépare un `payload` minimal (seulement les champs modifiés).
  2. Envoie `PUT /api/users/:id`, protégé par `verifyToken` + validations.
  3. Le back met à jour `users` (et éventuellement l’avatar) et retourne la nouvelle version de l’utilisateur.

Ce découpage claire entre **routes**, **contrôleurs**, **modèles**, **middlewares** et **utils** côté back, ainsi que l’utilisation d’un service Axios central côté front, facilite la compréhension, la maintenance et l’évolution future de l’application.

---

back/
├── node_modules/
├── public/
│   └── uploads/
│       └── avatars/
└── src/
    ├── config/
    ├── controllers/
    ├── middlewares/
    │   └── validators/
    ├── migrations/
    ├── models/
    ├── routes/
    ├── seeders/
    ├── services/
    └── utils/
        ├── dates/
        └── weight/

