import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Timer, Shield } from "lucide-react";

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [autoLogout, setAutoLogout] = useState(() => localStorage.getItem("bitem_auto_logout") || "10");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("bitem_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bitem_theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("bitem_auto_logout", autoLogout);
  }, [autoLogout]);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Configuración</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-3">
              {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-warning" />}
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Modo Oscuro</Label>
                <p className="text-sm text-muted-foreground">Cambia entre tema claro y oscuro</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-3">
              <Timer className="h-5 w-5 text-primary" />
              Cierre Automático
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Tiempo de inactividad</Label>
              <p className="text-sm text-muted-foreground mb-3">El sistema cerrará la sesión automáticamente tras la inactividad seleccionada</p>
              <Select value={autoLogout} onValueChange={setAutoLogout}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="0">Desactivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 md:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              Información del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Versión</p>
                <p className="font-semibold text-foreground">Bitem Global v2.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Plataforma</p>
                <p className="font-semibold text-foreground">Lovable Cloud</p>
              </div>
              <div>
                <p className="text-muted-foreground">Soporte</p>
                <p className="font-semibold text-foreground">©Soportado por Calbert 72</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
