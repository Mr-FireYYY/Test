import { useState } from "react";
import { toast } from "sonner"; // si tu utilises sonner pour les notifications

const Messages = () => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Vérification des champs obligatoires
    if (!name.trim() || !text.trim()) {
      toast.error("Veuillez remplir votre nom et votre message !");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbzDAdl6D2K5H8mQ9cWXkjQbkWLhLpIaf_z2qVHYo2QF3nNFQO1pZL8lLDkbNdqpXIbisQ/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), text: text.trim() }),
        }
      );

      const data = await response.json();

      if (data.success === false) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setName("");
      setText("");
      toast.success("Message envoyé aux mariés !");
    } catch (err: any) {
      console.error("Erreur lors de l'envoi :", err);
      toast.error("Erreur, le message n'a pas été envoyé.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-card rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Laissez un message aux mariés
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          required
          disabled={isSending}
        />
        <textarea
          placeholder="Votre message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 h-24"
          required
          disabled={isSending}
        />
        <button
          type="submit"
          className={`w-full bg-primary text-white py-3 rounded-md transition-colors ${
            isSending ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
          }`}
          disabled={isSending}
        >
          {isSending ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default Messages;
