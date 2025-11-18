import { useState, useEffect } from "react";
import AccessGate from "@/components/AccessGate";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Messages from "@/components/Messages";
import Upload from "@/components/Upload";
import Download from "@/components/Download";
import Footer from "@/components/Footer";

const Index = () => {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem("wedding-access");
    if (access === "granted") {
      setHasAccess(true);
    }
  }, []);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  if (!hasAccess) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <Hero />
        <Messages />
        <Upload />
        <Download />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
