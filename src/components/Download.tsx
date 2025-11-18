import React, { useState } from "react";
import toast from "react-hot-toast";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxNNDSmrLjE424vILqAVDjzVnLxJegOhmAEY_ktVS1K8k8TcCGxhxhrDOIF5Q-GpfLg0A/exec";

const Download: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=downloadZip`);
      if (!response.ok) throw new Error("Erreur lors du téléchargement");

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      // Convertir base64 en Blob
      const byteCharacters = atob(data.zipBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/zip" });

      // Télécharger
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Téléchargement lancé avec succès !");
    } catch (error: any) {
      console.error("Error downloading:", error);
      toast.error("Impossible de télécharger les photos");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? "Téléchargement en cours..." : "Télécharger"}
    </button>
  );
};

export default Download;
