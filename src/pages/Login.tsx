import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-eni.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("¡Bienvenido!");
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Cuenta creada. Revisa tu correo para verificar tu cuenta.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero px-4">
      <Card className="w-full max-w-md shadow-elevated border-0">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 self-start">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <img src={logo} alt="Bitem Global" className="h-16 w-auto mx-auto mb-4" />
          <CardTitle className="font-heading text-2xl">Bitem Global</CardTitle>
          <p className="text-sm text-muted-foreground">Accede al panel de gestión</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Correo electrónico</Label>
                  <Input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full font-heading font-semibold" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombre completo</Label>
                  <Input id="signup-name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Tu nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Correo electrónico</Label>
                  <Input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
                <Button type="submit" className="w-full font-heading font-semibold" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
