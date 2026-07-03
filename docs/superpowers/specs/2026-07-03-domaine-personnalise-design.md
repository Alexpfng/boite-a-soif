# Domaine personnalisé `la-boite-a-soif.fr`

Date : 2026-07-03

## Objectif

Servir l'application Boîte à Soif sur `https://la-boite-a-soif.fr` au lieu de
l'URL GitHub Pages de projet `/boite-a-soif/`, tout en conservant
l'infrastructure actuelle basée sur GitHub Pages et GitHub Actions.

Le domaine `la-boite-a-soif.com` doit rediriger vers le domaine principal
`https://la-boite-a-soif.fr`.

## Décision

Conserver GitHub Pages comme hébergement principal.

Le domaine canonique sera `la-boite-a-soif.fr`.

Le site ne sera plus construit avec une base par défaut de type
`/boite-a-soif/` pour la production publique. La production devra être servie à
la racine `/`, afin que le routeur React, les assets et le manifest PWA
fonctionnent correctement derrière le domaine personnalisé.

## Changements applicatifs

### 1. Base de build Vite

Mettre à jour la configuration Vite pour que la base de build de production soit
`/` par défaut.

Conserver la possibilité de surcharge via `VITE_BASE` pour éviter de bloquer un
besoin futur de prévisualisation ou d'hébergement sous sous-chemin.

### 2. Routage

Le routeur React continuera d'utiliser `import.meta.env.BASE_URL`. Aucun
changement de structure de routes n'est attendu si la base Vite passe à `/`.

### 3. Domaine GitHub Pages

Ajouter un fichier `public/CNAME` contenant :

`la-boite-a-soif.fr`

Comme le déploiement utilise un workflow GitHub Actions personnalisé, ce fichier
doit être présent dans l'artefact publié afin que le domaine personnalisé reste
stable après les déploiements.

### 4. Documentation projet

Mettre à jour la documentation locale du projet pour signaler que :

- le domaine public principal est `la-boite-a-soif.fr`
- la base de production par défaut est `/`
- GitHub Pages reste le mode de publication
- `VITE_BASE` reste disponible pour un cas particulier de sous-chemin

## Déploiement GitHub Pages

Le workflow existant `.github/workflows/deploy.yml` reste en place.

Le pipeline garde :

- installation Bun
- build Vite
- copie de `dist/index.html` vers `dist/404.html` pour les refresh sur routes
  profondes
- publication vers GitHub Pages

Aucune migration d'hébergement n'est prévue.

## DNS attendu

### Domaine principal

Configurer `la-boite-a-soif.fr` comme domaine personnalisé GitHub Pages.

Créer les enregistrements DNS du domaine apex vers GitHub Pages :

- `A` → `185.199.108.153`
- `A` → `185.199.109.153`
- `A` → `185.199.110.153`
- `A` → `185.199.111.153`

Ajouter aussi le sous-domaine `www` :

- `CNAME` `www` → `Alexpfng.github.io`

GitHub Pages gérera ensuite la redirection entre `www` et l'apex selon le
domaine défini comme principal.

### Domaine secondaire

Configurer `la-boite-a-soif.com` et idéalement `www.la-boite-a-soif.com` en
redirection HTTP 301 vers :

`https://la-boite-a-soif.fr`

Cette redirection sera gérée chez le registrar ou le fournisseur DNS du `.com`,
pas dans l'application front.

## Sécurité et validation

- Définir le domaine personnalisé dans GitHub Pages avant ou en même temps que
  la configuration DNS.
- Activer `Enforce HTTPS` dans GitHub Pages après propagation DNS.
- Vérifier ensuite :
  - chargement de `https://la-boite-a-soif.fr`
  - navigation directe sur une route profonde
  - chargement des assets
  - absence de références runtime à `/boite-a-soif/`
  - redirection du `.com` vers le `.fr`

## Tests prévus

- `bun run build`
- inspection du contenu `dist/`
- vérification de la présence du fichier `CNAME` dans l'artefact
- contrôle de l'absence de base cassée dans le HTML généré

## Hors périmètre

- migration vers Vercel, Netlify ou Cloudflare
- refonte du workflow CI
- configuration automatisée du registrar
- changement de domaine principal vers `.com`
