import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-4">
            Manuela & Lionel
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-primary via-secondary to-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-foreground/80 font-body max-w-2xl mx-auto leading-relaxed">
            Bienvenue au mariage de Manuela & Lionel
          </p>
          <p className="text-lg md:text-xl text-muted-foreground font-body mt-4">
            Merci de célébrer ce moment avec nous
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
          {[couple1, couple2, couple3].map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 aspect-[3/4]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={image}
                alt={`Manuela et Lionel - Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
