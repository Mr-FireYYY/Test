# Configuration Google Apps Script pour le Site de Mariage

## Étape 1 : Créer un dossier Google Drive

1. Allez sur [Google Drive](https://drive.google.com)
2. Créez un nouveau dossier nommé "Mariage_Manuela_Lionel"
3. Notez l'ID du dossier (visible dans l'URL : `drive.google.com/drive/folders/VOTRE_ID_DOSSIER`)

## Étape 2 : Créer le Google Apps Script

1. Allez sur [Google Apps Script](https://script.google.com)
2. Créez un nouveau projet
3. Nommez-le "Wedding Photo Manager"
4. Collez le code ci-dessous dans `Code.gs`

```javascript
// Remplacez par l'ID de votre dossier Google Drive
const FOLDER_ID = '1_z3in5Jd2DJ2-ZHZk0FfFCukhA20_VME';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'listImages') {
    return listImages();
  } else if (action === 'downloadZip') {
    return downloadZip();
  }
  
  return ContentService.createTextOutput(
    JSON.stringify({ error: 'Action non reconnue' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    
    // Parse JSON body
    const requestBody = JSON.parse(e.postData.contents);
    const base64Data = requestBody.data;
    const fileName = requestBody.filename || `photo_${new Date().getTime()}.jpg`;
    const mimeType = requestBody.mimeType || 'image/jpeg';
    
    // Decode Base64
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      mimeType,
      fileName
    );
    
    // Create file in Drive
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        fileId: file.getId(),
        fileName: fileName
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('Upload error: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function listImages() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const images = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Support images and videos
      if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
        images.push({
          id: file.getId(),
          name: file.getName(),
          url: `https://drive.google.com/uc?export=view&id=${file.getId()}`,
          thumbnailUrl: file.getThumbnailUrl(),
          mimeType: mimeType
        });
      }
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        images: images
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function downloadZip() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const files = folder.getFiles();
    const blobs = [];
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getMimeType();
      
      // Include images and videos
      if (mimeType.startsWith('image/') || mimeType.startsWith('video/')) {
        blobs.push(file.getBlob());
      }
    }
    
    if (blobs.length === 0) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: 'Aucun fichier trouvé'
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Créer un fichier ZIP
    const zipBlob = Utilities.zip(blobs, `Mariage_Manuela_Lionel_${new Date().toISOString().split('T')[0]}.zip`);
    
    // Retourner le ZIP
    return ContentService.createTextOutput(zipBlob.getDataAsString())
      .setMimeType(ContentService.MimeType.ZIP);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Étape 3 : Déployer le Script

1. Dans Google Apps Script, cliquez sur **Déployer** > **Nouveau déploiement**
2. Sélectionnez **Application Web**
3. Configurez :
   - **Description** : "Wedding Photo Manager"
   - **Exécuter en tant que** : Moi (votre compte)
   - **Qui peut accéder** : Tout le monde
4. Cliquez sur **Déployer**
5. Copiez **l'URL de l'application web** fournie

## Étape 4 : Configurer le Site Web

1. Ouvrez les fichiers suivants dans votre projet :
   - `src/components/Gallery.tsx`
   - `src/components/Upload.tsx`
   - `src/components/Download.tsx`

2. Dans chaque fichier, remplacez :
   ```typescript
   const GOOGLE_SCRIPT_URL = "VOTRE_URL_APPS_SCRIPT_ICI";
   ```
   
   Par votre URL Apps Script copiée :
   ```typescript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/VOTRE_ID/exec";
   ```

## Étape 5 : Permissions

1. La première fois que le script s'exécute, Google demandera des autorisations
2. Cliquez sur **Examiner les autorisations**
3. Sélectionnez votre compte
4. Cliquez sur **Paramètres avancés**
5. Cliquez sur **Accéder à [Nom du projet] (dangereux)**
6. Accordez les permissions nécessaires

## Étape 6 : Tester

1. Testez l'upload d'une image via le site
2. Vérifiez que l'image apparaît dans votre dossier Google Drive
3. Testez la galerie pour voir les images
4. Testez le téléchargement du ZIP

## Notes Importantes

- **Limites Google** : 
  - Taille maximale de fichier : 50 MB
  - Quotas d'exécution : 6 minutes par exécution
  - Limites de bande passante quotidienne

- **Sécurité** : 
  - Le code d'accès "1213" protège l'accès au site
  - Les uploads sont anonymes mais trackés par Google
  - Vous pouvez modifier les permissions du dossier Drive à tout moment

- **Performance** :
  - Pour de grandes collections d'images, envisagez la pagination
  - Le téléchargement ZIP peut prendre du temps avec beaucoup de photos

## Dépannage

### Les images ne se chargent pas
- Vérifiez que l'ID du dossier est correct
- Assurez-vous que le dossier a les bonnes permissions
- Consultez les logs dans Apps Script (Exécutions)

### L'upload ne fonctionne pas
- Vérifiez que le déploiement est en mode "Tout le monde"
- Assurez-vous que les permissions ont été accordées
- Vérifiez la taille du fichier (< 50 MB)

### Le ZIP ne se télécharge pas
- Avec beaucoup d'images, le processus peut échouer
- Envisagez de télécharger directement depuis Google Drive
- Ou créez un partage du dossier Drive

## Alternative : Partage Direct Google Drive

Si vous préférez une solution plus simple :

1. Rendez votre dossier Google Drive public
2. Partagez le lien direct du dossier
3. Les invités peuvent voir et télécharger directement
4. Activez l'upload pour permettre aux invités d'ajouter des photos

Lien de partage : `https://drive.google.com/drive/folders/VOTRE_ID_DOSSIER?usp=sharing`
