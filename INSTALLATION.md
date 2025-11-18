# Guide d'Installation - Site de Mariage Manuela & Lionel

## Vue d'ensemble

Ce site web de mariage comprend :
- ✅ Page d'accueil sécurisée par code (1213)
- ✅ Galerie de photos hébergées sur Google Drive
- ✅ Upload de photos par les invités (sans compte Google requis)
- ✅ Téléchargement de toutes les photos en ZIP
- ✅ Design élégant Terracotta (#BC6C21) et Vert Olive (#606C36)

## Architecture des Fichiers

```
src/
├── assets/
│   ├── couple-1.jpg          # Photo principale des mariés
│   ├── couple-2.jpg          # Photo 2 des mariés
│   └── couple-3.jpg          # Photo 3 des mariés
├── components/
│   ├── AccessGate.tsx        # Page de connexion avec code
│   ├── Navigation.tsx        # Menu de navigation
│   ├── Hero.tsx              # Section d'accueil avec photos
│   ├── Gallery.tsx           # Galerie Google Drive
│   ├── Upload.tsx            # Upload de photos
│   ├── Download.tsx          # Téléchargement ZIP
│   └── Footer.tsx            # Pied de page
├── pages/
│   └── Index.tsx             # Page principale
├── index.css                 # Styles globaux (couleurs terracotta/olive)
└── tailwind.config.ts        # Configuration Tailwind

GOOGLE_APPS_SCRIPT.md         # Instructions pour Google Apps Script
INSTALLATION.md               # Ce fichier
```

## Installation Locale

### Prérequis
- Node.js 18+ et npm installés
- Un compte Google pour Google Drive

### Étapes

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Accéder au site**
   - Ouvrez votre navigateur à l'adresse : `http://localhost:8080`
   - Code d'accès : `1213`

## Configuration Google Drive

Suivez le guide complet dans `GOOGLE_APPS_SCRIPT.md` :

1. Créez un dossier Google Drive
2. Créez un projet Google Apps Script
3. Déployez comme Application Web
4. Copiez l'URL du déploiement
5. Remplacez `VOTRE_URL_APPS_SCRIPT_ICI` dans :
   - `src/components/Gallery.tsx`
   - `src/components/Upload.tsx`
   - `src/components/Download.tsx`

## Personnalisation

### Modifier le code d'accès
Dans `src/components/AccessGate.tsx` ligne 17 :
```typescript
if (code === "1213") {  // Changez "1213" par votre code
```

### Modifier les couleurs
Dans `src/index.css` :
```css
--primary: 26 70% 43%;      /* Terracotta #BC6C21 */
--secondary: 82 25% 40%;    /* Olive Green #606C36 */
```

### Modifier les noms
Recherchez et remplacez "Manuela & Lionel" dans tous les fichiers.

### Ajouter/Modifier les photos
Remplacez les fichiers dans `src/assets/` et mettez à jour les imports dans `src/components/Hero.tsx`.

## Déploiement

### Via Lovable (Recommandé)
1. Connectez-vous à [Lovable](https://lovable.dev)
2. Ouvrez votre projet
3. Cliquez sur **Share** > **Publish**
4. Votre site sera déployé automatiquement

### Via Vercel
1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre repository GitHub
3. Configurez :
   - Framework : Vite
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Déployez

### Via Netlify
1. Créez un compte sur [Netlify](https://netlify.com)
2. Glissez-déposez le dossier `dist` après avoir fait `npm run build`
3. Ou connectez votre repository GitHub pour un déploiement automatique

## Configuration Post-Déploiement

1. **Activez HTTPS** sur votre hébergeur
2. **Configurez le domaine personnalisé** si souhaité
3. **Mettez à jour les URLs Google Apps Script** avec votre domaine de production
4. **Testez toutes les fonctionnalités** :
   - Code d'accès
   - Chargement de la galerie
   - Upload de photos
   - Téléchargement ZIP

## Utilisation

### Pour les mariés
1. Partagez l'URL du site avec le code `1213` à vos invités
2. Consultez les photos uploadées dans votre dossier Google Drive
3. Téléchargez le ZIP à tout moment

### Pour les invités
1. Entrez le code `1213`
2. Explorez la galerie
3. Uploadez vos photos via la section "Partager"
4. Téléchargez toutes les photos en ZIP

## Fonctionnalités Clés

### Code d'accès (1213)
- Stocké dans le localStorage du navigateur
- Pas besoin de se reconnecter à chaque visite
- Facile à partager avec les invités

### Galerie Google Drive
- Affiche automatiquement toutes les images du dossier
- Chargement à la demande pour optimiser les performances
- Miniatures optimisées

### Upload sans compte Google
- Les invités uploadent sans se connecter
- Les photos vont directement dans votre Google Drive
- Format supporté : JPG, PNG, HEIC
- Taille maximale : 10 MB par photo

### Téléchargement ZIP
- Récupère toutes les photos d'un coup
- Nom de fichier daté automatiquement
- Pas de limite de nombre de photos

## Dépannage

### Le code ne fonctionne pas
- Vérifiez que vous utilisez le bon code : `1213`
- Videz le cache du navigateur

### Les images ne s'affichent pas
- Vérifiez que les fichiers sont bien dans `src/assets/`
- Vérifiez les imports dans `Hero.tsx`
- Rebuild le projet : `npm run build`

### L'upload ne fonctionne pas
- Vérifiez la configuration Google Apps Script
- Assurez-vous que le déploiement est actif
- Consultez la console du navigateur pour les erreurs

### Le ZIP ne se télécharge pas
- Vérifiez que des images existent dans le dossier Drive
- Limitez le nombre d'images (< 100) pour éviter les timeouts
- Essayez de télécharger directement depuis Google Drive

## Support

Pour toute question ou problème :
1. Consultez `GOOGLE_APPS_SCRIPT.md` pour la configuration backend
2. Vérifiez les logs dans la console du navigateur (F12)
3. Consultez les logs d'exécution dans Google Apps Script

## Limites Connues

- Taille maximale d'upload : 10 MB par image
- Le ZIP peut échouer avec > 100 images (limitation Google Apps Script)
- Temps de génération du ZIP : jusqu'à 6 minutes
- Quotas Google Apps Script : limites quotidiennes d'exécution

## Améliorations Futures Possibles

- Système de commentaires sur les photos
- Votes pour les meilleures photos
- Filtres et effets sur les photos
- Partage social direct
- Album organisé par date/événement
- Reconnaissance faciale pour trier les photos
- Slideshow automatique
- Mode plein écran pour la galerie

## Crédits

- Développé avec React, TypeScript, Tailwind CSS
- Icons par Lucide React
- Backend sur Google Apps Script
- Hébergement sur Lovable / Vercel / Netlify
