import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary/5 border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <h3 className="text-2xl font-display font-bold text-primary">
            Manuela & Lionel
          </h3>
          <Heart className="w-5 h-5 text-primary fill-primary" />
        </div>
        <p className="text-muted-foreground font-body mb-2">
          Merci d'avoir célébré ce moment magique avec nous
        </p>
        <p className="text-sm text-muted-foreground/70 font-body">
          © {new Date().getFullYear()} - Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
