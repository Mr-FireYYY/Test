import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload as UploadIcon, Image } from "lucide-react";

const Upload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    fileArray.forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        validFiles.push(file);
        // Prévisualisation uniquement pour les images
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      } else {
        toast.error(`${file.name}: Format non supporté`);
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxNNDSmrLjE424vILqAVDjzVnLxJegOhmAEY_ktVS1K8k8TcCGxhxhrDOIF5Q-GpfLg0A/exec";

      // Envoyer chaque fichier séparément
      for (const file of selectedFiles) {
        try {
          // Convertir l'image en Base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => {
              const base64String = (reader.result as string).split(',')[1];
              resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const base64Data = await base64Promise;

          console.log("Envoi de l'image:", file.name, file.type);

          await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain",
            },
            body: JSON.stringify({
              data: base64Data,
              filename: file.name,
              mimeType: file.type,
            }),
          });

          successCount++;
        } catch (error) {
          console.error(`Erreur pour ${file.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} fichier(s) envoyé(s) avec succès ! ❤️`);
        setSelectedFiles([]);
        setPreviews([]);
      }
      
      if (errorCount > 0) {
        toast.error(`${errorCount} fichier(s) n'ont pas pu être envoyés`);
      }
      
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast.error("Erreur: Vérifiez que votre Google Apps Script est bien déployé et accessible. Consultez GOOGLE_APPS_SCRIPT.md");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section id="upload" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Partagez vos Photos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-muted-foreground font-body">
            Immortalisez ce moment en partageant vos plus beaux clichés
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-4 sm:p-8 border border-border/50">
          <div className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? "border-primary bg-primary/5 scale-105" 
                  : "border-border hover:border-primary"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-upload"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {previews.length > 0 ? (
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Aperçu ${index + 1}`}
                          className="rounded-lg shadow-lg w-full h-24 sm:h-32 object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFile(index);
                          }}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <Image className="w-12 h-12 sm:w-16 sm:h-16 mb-4 text-muted-foreground" />
                    <p className="text-base sm:text-lg font-medium text-foreground mb-2">
                      {isDragging ? "Déposez votre fichier ici" : "Cliquez ou glissez un fichier"}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Images (JPG, PNG, HEIC) et Vidéos (MP4, MOV, etc.) - Sans limite de taille
                    </p>
                  </>
                )}
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-accent/30 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  {selectedFiles.length} fichier(s) sélectionné(s)
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Image className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <span className="font-medium text-foreground truncate">
                          {file.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground ml-2 flex-shrink-0">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:shadow-lg"
            >
              {isUploading ? (
                <>
                  <UploadIcon className="w-5 h-5 mr-2 animate-pulse" />
                  Envoi en cours ({selectedFiles.length} fichier(s))...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5 mr-2" />
                  Envoyer {selectedFiles.length > 0 ? `${selectedFiles.length} fichier(s)` : "les fichiers"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upload;
