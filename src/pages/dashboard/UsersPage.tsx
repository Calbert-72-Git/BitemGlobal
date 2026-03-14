import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const roleLabels: Record<string, string> = { admin: "Administrador", worker: "Trabajador", viewer: "Lector" };
const roleColors: Record<string, string> = { admin: "bg-primary text-primary-foreground", worker: "bg-accent text-accent-foreground", viewer: "bg-muted text-muted-foreground" };

const allSections = [
  { value: "gimnasia", label: "GeQ Sport" },
  { value: "clinica", label: "Clínica Bitem" },
  { value: "peluqueria", label: "Peluquería Bitem" },
];

const allPages = [
  { value: "ventas", label: "Ventas" },
  { value: "compras", label: "Compras" },
  { value: "ingresos", label: "Ingresos" },
  { value: "gastos", label: "Gastos" },
  { value: "inventario", label: "Inventario" },
  { value: "contabilidad", label: "Contabilidad" },
  { value: "graficos", label: "Gráficos" },
  { value: "nominas", label: "Nóminas" },
  { value: "usuarios", label: "Usuarios" },
];

const UsersPage = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editSections, setEditSections] = useState<string[]>([]);
  const [editPages, setEditPages] = useState<string[]>([]);
  const isAdmin = hasRole("admin");

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("*");
    const usersMap = (profiles || []).map(p => ({
      ...p,
      roles: (roles || []).filter((r: any) => r.user_id === p.id).map((r: any) => r.role),
    }));
    setUsers(usersMap);
  };

  useEffect(() => { fetchUsers(); }, []);

  const assignRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role: role as "admin" | "worker" | "viewer" } as any, { onConflict: "user_id,role" });
    if (error) { toast.error(error.message); return; }
    toast.success("Rol asignado");
    fetchUsers();
  };

  const removeRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as "admin" | "worker" | "viewer");
    if (error) { toast.error(error.message); return; }
    toast.success("Rol eliminado");
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    // Delete roles and profile (user auth record stays but profile removed)
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    toast.success("Usuario eliminado del sistema");
    fetchUsers();
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setEditSections(user.allowed_sections || []);
    setEditPages(user.allowed_pages || []);
  };

  const savePermissions = async () => {
    if (!editingUser) return;
    const { error } = await supabase.from("profiles").update({
      allowed_sections: editSections,
      allowed_pages: editPages,
    } as any).eq("id", editingUser.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Permisos actualizados");
    setEditingUser(null);
    fetchUsers();
  };

  const toggleSection = (val: string) => {
    setEditSections(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  };

  const togglePage = (val: string) => {
    setEditPages(prev => prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
        <Card className="shadow-card border-0">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No tienes permisos de administrador para acceder a esta sección.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">Gestión de Usuarios</h1>

      {/* Edit Permissions Dialog */}
      <Dialog open={!!editingUser} onOpenChange={open => !open && setEditingUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Permisos: {editingUser?.full_name || editingUser?.email}</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Secciones donde puede registrar datos</Label>
              <div className="space-y-2">
                {allSections.map(s => (
                  <div key={s.value} className="flex items-center gap-2">
                    <Checkbox checked={editSections.includes(s.value)} onCheckedChange={() => toggleSection(s.value)} />
                    <span className="text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Páginas a las que puede acceder</Label>
              <div className="grid grid-cols-2 gap-2">
                {allPages.map(p => (
                  <div key={p.value} className="flex items-center gap-2">
                    <Checkbox checked={editPages.includes(p.value)} onCheckedChange={() => togglePage(p.value)} />
                    <span className="text-sm">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={savePermissions} className="w-full gap-2"><Save className="h-4 w-4" /> Guardar Permisos</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Secciones</TableHead>
                  <TableHead>Asignar Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No hay usuarios</TableCell></TableRow>
                ) : users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || "Sin nombre"}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {u.roles.length === 0 && <span className="text-muted-foreground text-sm">Sin rol</span>}
                        {u.roles.map((r: string) => (
                          <Badge key={r} className={`${roleColors[r] || ""} cursor-pointer`} onClick={() => removeRole(u.id, r)}>
                            {roleLabels[r] || r} ×
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {(!u.allowed_sections || u.allowed_sections.length === 0) && <span className="text-muted-foreground text-xs">Sin asignar</span>}
                        {(u.allowed_sections || []).map((s: string) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {allSections.find(sec => sec.value === s)?.label || s}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select onValueChange={v => assignRole(u.id, v)}>
                        <SelectTrigger className="w-36"><SelectValue placeholder="Añadir rol" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="worker">Trabajador</SelectItem>
                          <SelectItem value="viewer">Lector</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)} title="Editar permisos">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)} title="Eliminar usuario">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
