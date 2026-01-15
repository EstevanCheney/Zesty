import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trees, Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // --- INSCRIPTION ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        
        setVerificationSent(true);
        toast.success("Inscription réussie !");
        
      } else {
        // --- CONNEXION ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Connexion réussie");
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D5A27] to-[#1a3316]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          
          {/* En-tête Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#2D5A27] rounded-full flex items-center justify-center mb-4">
              <Trees className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl text-[#2D5A27] mb-1">Zoo Management</h1>
            <p className="text-slate-600">
              {verificationSent 
                ? "Vérification requise" 
                : (isSignUp ? "Créer un compte staff" : "Portail Staff")}
            </p>
          </div>

          {/* ÉCRAN DE CONFIRMATION EMAIL */}
          {verificationSent ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-800 p-4 rounded-lg flex flex-col items-center gap-3">
                <div className="bg-white p-2 rounded-full">
                  <Mail className="w-8 h-8 text-[#2D5A27]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email envoyé !</h3>
                  <p className="text-sm text-green-700">
                    Un lien de confirmation a été envoyé à <strong>{email}</strong>.
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-slate-500">
                Veuillez cliquer sur le lien dans l'email pour activer votre compte, puis revenez ici pour vous connecter.
              </p>

              <Button 
                onClick={() => {
                  setVerificationSent(false);
                  setIsSignUp(false);
                }}
                variant="outline" 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullname">Nom complet</Label>
                  <Input
                    id="fullname"
                    placeholder="Jean Dupont"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@zoo.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2D5A27] hover:bg-[#1f3f1c] text-white py-6"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "S'inscrire" : "Se connecter"}
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-slate-600 hover:text-[#2D5A27] underline"
                >
                  {isSignUp
                    ? "Déjà un compte ? Se connecter"
                    : "Pas encore de compte ? S'inscrire"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}