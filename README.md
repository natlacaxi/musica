# TalcoMusic

Site de musique ouvert à tous (PWA installable). Comptes par **code** pour les playlists.

## Variables GitHub (Settings → Secrets and variables → Actions → Variables)
`SITE_NAME` (défaut `TalcoMusic`) · `GOOGLE_SITE_VERIFICATION` (optionnel). Settings → Pages → Source : **GitHub Actions**.

## Comptes par code (Firebase exchange-f4322)
- Authentication → Sign-in method : activer **E-mail/Mot de passe**.
- Menu ⚙️ → **Mon compte** : on entre son code (6 à 32 lettres/chiffres) ; s'il n'existe pas, on peut le créer. Les playlists sont liées au code.
- Depuis son compte : message à l'administrateur. Le compte dont le code est l'admin voit les messages reçus.
- **Crée d'abord le compte admin** (entre ton code admin sur le site juste après avoir publié les règles).
- Règles Firestore : `firestore.rules` (fourni à part, **ne pas le mettre dans le dépôt public** : il contient l'identifiant admin).

## Paroles
Projet Firebase séparé `lyrics-8a6a5` : colle sa config web dans `lyricsFirebaseConfig` (dans `index.html`, cherche `VOTRE_API_KEY`). Enregistrement par le bouton « Enregistrer ».

## PWA
Hors ligne (`sw.js`, `offline.html`), mise à jour proposée à chaque déploiement : change `VERSION` dans `sw.js` à chaque modification.

## Pistes
`const TRACKS = [];` est vide : ajouter les morceaux `{ title, artist, url, year }`.
