# TalcoMusic

Site de musique ouvert à tous (PWA installable). Comptes par **code** pour les playlists.

## Variables GitHub (Settings → Secrets and variables → Actions → Variables)
`SITE_NAME` (défaut `TalcoMusic`) · `GOOGLE_SITE_VERIFICATION` (optionnel). Settings → Pages → Source : **GitHub Actions**.

## Comptes par code (Firebase lyrics-8a6a5)
- Authentication → Sign-in method : activer **E-mail/Mot de passe**.
- Menu ⚙️ → **Mon compte** : on entre son code ; **création = 6 chiffres** (la connexion accepte encore les anciens codes alphanumériques). 3 mauvais codes → blocage 24 h (localStorage). Les playlists sont liées au code.
- Depuis son compte : message à l'administrateur. Le compte dont le code est l'admin voit les messages reçus.
- **Crée d'abord le compte admin** (entre ton code admin sur le site juste après avoir publié les règles).
- Règles Firestore : `firestore.rules` (fourni à part, **ne pas le mettre dans le dépôt public** : il contient l'identifiant admin).

## Playlists partagées
À la création : OK = partagée (collection `sharedPlaylists`), Annuler = perso. Ajoute aux règles Firestore d'lyrics-8a6a5 :
`match /sharedPlaylists/{id} { allow read: if request.auth != null; allow create: if request.auth != null && request.resource.data.owner == request.auth.uid; allow delete: if request.auth != null && resource.data.owner == request.auth.uid; }`

## Paroles
Projet Firebase `lyrics-8a6a5` (config déjà branchée). Active **Authentication → Anonyme** et publie des règles Firestore : lecture publique de `lyrics/*`, écriture si `request.auth != null`. Éditeur : code à 4 chiffres (3 erreurs → blocage 24 h), bouton « Enregistrer ». Le code est visible dans le source : filtre simple, la vraie protection = règles Firestore.

## Artistes
Menu ⚙️ ou barre latérale → **Artistes**. Photos : `ARTIST_PHOTOS` dans `index.html` (Jul déjà renseigné).

## PWA
Hors ligne (`sw.js`, `offline.html`), mise à jour proposée à chaque déploiement : change `VERSION` dans `sw.js` à chaque modification.

## Pistes
`TRACKS` contient 409 titres (fichier 411_tracks.txt, doublon retiré). Colonne Date = date d'ajout Cloudinary ; ajoute `date: '2024-05-01'` à un titre pour la remplacer.

## Administrateur
Le compte dont le code est celui de l'admin (crée-le EN PREMIER sur le site, avant tout le monde) voit et supprime **toutes** les playlists (perso de chacun + partagées) et lit les messages. Les droits réels viennent des règles Firestore : voir `firestore-rules-a-fusionner.txt` (hors dépôt public).

## Création de compte : checklist Firebase (lyrics-8a6a5)
1. Authentication → Sign-in method → **E-mail/Mot de passe** : activé.
2. Authentication → Paramètres → **Domaines autorisés** : ajoute `natlacaxi.github.io` (et ton domaine perso s'il y en a un).
3. Firestore Database créé, règles du fichier `firestore-rules-a-fusionner.txt` fusionnées (sans écraser les règles des autres services).
Le site affiche maintenant l'erreur Firebase exacte si la création échoue.

## Interface
Toutes les fenêtres sont en plein écran ; manifest en `fullscreen`. Artistes : cases uniquement au-delà de 6 titres. Date = année de sortie (renseignée pour ~150 titres, `—` sinon ; ajoute `year: 2021` ou `date: '2021-05-01'` dans `TRACKS`).

## Compte connecté
Menu ⚙️ → **Mon compte** : 🎨 Personnaliser (nom affiché en haut, couleur, fond d'écran ou photo — collection `profiles`), 💬 messagerie avec l'admin (l'admin répond depuis « Messages reçus »), ✏️ personnalisation des playlists (nom, emoji, couleur). Code admin : celui dont l'empreinte est `ADMIN_EMAIL` dans `index.html`.
