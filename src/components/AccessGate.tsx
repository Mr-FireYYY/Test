import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AccessGateProps {
  onAccessGranted: () => void;
}

const AccessGate = ({ onAccessGranted }: AccessGateProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (!name || !email) {
        toast.error("Veuillez remplir votre nom et votre email.");
        setIsLoading(false);
        return;
      }

      // Sauvegarder les infos de l'utilisateur
      const userData = { name, email };
      localStorage.setItem("wedding-user", JSON.stringify(userData));
      localStorage.setItem("wedding-access", "granted");

      toast.success("Bienvenue " + name + " !");
      onAccessGranted();
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/30 via-background to-secondary/20 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
              Manuela & Lionel
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 rounded-full"></div>
            <p className="text-muted-foreground font-body">
              Connectez-vous pour accéder à la galerie
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg font-medium"
                disabled={isLoading}
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center text-lg"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg transition-all duration-300 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Entrer"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Vos informations sont uniquement utilisées pour signer vos photos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessGate;
