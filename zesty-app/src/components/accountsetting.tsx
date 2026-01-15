import { useState, useEffect } from "react";
import { User, Bell, Lock, Globe, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

interface AccountSettingsProps {
  onBack?: () => void;
}

export function AccountSettings({ onBack }: AccountSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Staff");
  const [department, setDepartment] = useState("General");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => { getProfile(); }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFullName(data.full_name || "");
        setEmail(data.email || user.email || "");
        setPhone(data.phone || "");
        setRole(data.role || "Staff");
        setDepartment(data.department || "Général");
      }
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setUpdating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: fullName,
        phone,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) throw error;
      toast.success('Profil mis à jour avec succès !');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">
        {onBack && (
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour au tableau de bord
            </Button>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-slate-900 mb-1">Paramètres du Compte</h1>
          <p className="text-sm text-slate-500">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#2D5A27]" />
                <div>
                  <CardTitle>Informations Personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos détails</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-[#2D5A27]">
                  <AvatarFallback className="bg-[#2D5A27] text-white text-xl">
                    {getInitials(fullName || "User")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Changer la photo</Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom Complet</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse E-mail</Label>
                <Input id="email" type="email" value={email} disabled className="bg-slate-100 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" value={role} disabled className="bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Service</Label>
                  <Input id="department" value={department} disabled className="bg-slate-100" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={updateProfile} disabled={updating} className="bg-[#2D5A27] hover:bg-[#234520]">
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" /> Enregistrer le profil
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#2D5A27]" />
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configurez vos alertes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotif">Notifications par E-mail</Label>
                  <p className="text-xs text-slate-500">Recevoir les alertes importantes</p>
                </div>
                <Switch id="emailNotif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotif">Notifications Push</Label>
                  <p className="text-xs text-slate-500">Sur votre appareil mobile</p>
                </div>
                <Switch id="pushNotif" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}