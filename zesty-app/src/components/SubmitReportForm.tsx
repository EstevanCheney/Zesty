import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

export function SubmitReportForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) setSelectedFile(files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) setSelectedFile(files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !location || !description) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('incident-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('incident-images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from('incidents')
        .insert([
          {
            category,
            location,
            description,
            priority,
            image_url: imageUrl,
            status: 'Under Review',
            reported_by: 'Staff Member',
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      setIsSubmitted(true);
      toast.success("Incident signalé avec succès !");
      
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedFile(null);
        setCategory("");
        setLocation("");
        setDescription("");
        setPriority("Low");
      }, 2000);

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'envoi : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full">
      <h3 className="text-slate-800 mb-4 font-semibold text-lg">Signaler un Incident</h3>
      
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="w-16 h-16 text-[#2D5A27] mb-4" />
          <p className="text-lg text-slate-800 font-medium">Rapport Envoyé !</p>
          <p className="text-sm text-slate-600 mt-2">Votre demande de maintenance a été enregistrée.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label className="text-slate-700">Ajouter une photo</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging
                  ? "border-[#2D5A27] bg-green-50"
                  : "border-slate-300 bg-slate-50"
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#2D5A27] rounded flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    Glissez une image ici ou cliquez pour parcourir
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-sm text-[#2D5A27] cursor-pointer hover:underline"
                  >
                    Parcourir les fichiers
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700">Catégorie</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="border-slate-300">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Safety">Sécurité</SelectItem>
                  <SelectItem value="Cleaning">Nettoyage</SelectItem>
                  <SelectItem value="Repair">Réparation</SelectItem>
                </SelectContent>
              </Select>
            </div>

             {/* Priority */}
             <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-700">Priorité</Label>
              <Select value={priority} onValueChange={setPriority} required>
                <SelectTrigger id="priority" className="border-slate-300">
                  <SelectValue placeholder="Choisir la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">Haute</SelectItem>
                  <SelectItem value="Med">Moyenne</SelectItem>
                  <SelectItem value="Low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-700">Lieu</Label>
            <Select value={location} onValueChange={setLocation} required>
              <SelectTrigger id="location" className="border-slate-300">
                <SelectValue placeholder="Choisir un lieu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Entrance - Ticketing">Entrée Principale - Billetterie</SelectItem>
                <SelectItem value="Small Farm">Petite Ferme</SelectItem>
                <SelectItem value="Giraffe Habitat">Enclos des Girafes</SelectItem>
                <SelectItem value="Food Kiosk - Crepes">Enclos des Ours</SelectItem>
                <SelectItem value="African Savanna">Savane Africaine</SelectItem>
                <SelectItem value="Big Aviary">Volière</SelectItem>
                <SelectItem value="Restrooms">Toilettes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-slate-300 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2D5A27] hover:bg-[#1f3f1c] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              "Envoyer le rapport"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}