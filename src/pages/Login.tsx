import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/logo-eni.png";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - will connect to backend later
    toast.info("Funcionalidad de autenticación próximamente");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-elevated border-0">
        <CardHeader className="text-center pb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 self-start">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Link>
          <img src={logo} alt="Calbert 72" className="h-16 w-auto mx-auto mb-4" />
          <CardTitle className="font-heading text-2xl">Iniciar Sesión</CardTitle>
          <p className="text-sm text-muted-foreground">Accede al panel de gestión de Calbert 72</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full font-heading font-semibold">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
