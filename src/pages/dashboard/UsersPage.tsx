import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Save, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { logAction } from "@/lib/auditLog";

const SUPER_ADMIN_EMAIL = "calbertutm@gmail.com";

const roleLabels: Record<string, string> = { super_admin: "Super Admin", admin: "Administrador", worker: "Trabajador", viewer: "Lector" };
const roleColors: Record<string, string> = { super_admin: "bg-destructive text-destructive-foreground", admin: "bg-primary text-primary-foreground", worker: "bg-accent text-accent-foreground", viewer: "bg-muted text-muted-foreground" };

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
  { value: "auditoria", label: "Auditoría" },
];

const UsersPage = () => {
  const { isAdmin, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editSections, setEditSections] = useState<string[]>([]);
  const [editPages, setEditPages] = useState<string[]>([]);
  const [editProfileUser, setEditProfileUser] = useState<any | null>(null);
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "", dni: "" });

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
    // Only super_admin can assign super_admin or admin roles
    if ((role === "super_admin" || role === "admin") && !isSuperAdmin) {
      toast.error("Solo el super administrador puede asignar este rol");
      return;
    }
    const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role: role as any } as any, { onConflict: "user_id,role" });
    if (error) { toast.error(error.message); return; }
    await logAction("Asignar rol", "usuarios", userId, { role });
    toast.success("Rol asignado");
    fetchUsers();
  };

  const removeRole = async (userId: string, role: string) => {
    if (role === "super_admin") { toast.error("No se puede eliminar el rol de super administrador"); return; }
    if (role === "admin" && !isSuperAdmin) { toast.error("Solo el super administrador puede quitar este rol"); return; }
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
    if (error) { toast.error(error.message); return; }
    await logAction("Eliminar rol", "usuarios", userId, { role });
    toast.success("Rol eliminado");
    fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.email === SUPER_ADMIN_EMAIL) { toast.error("No se puede eliminar al super administrador principal"); return; }
    if (user?.roles?.includes("super_admin")) { toast.error("No se puede eliminar a un super administrador"); return; }
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    await logAction("Eliminar usuario", "usuarios", userId);
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
    const { error } = await supabase.from("profiles").update({ allowed_sections: editSections, allowed_pages: editPages } as any).eq("id", editingUser.id);
    if (error) { toast.error(error.message); return; }
    await logAction("Actualizar permisos", "usuarios", editingUser.id, { sections: editSections, pages: editPages });
    toast.success("Permisos actualizados");
    setEditingUser(null);
    fetchUsers();
  };

  const openEditProfile = (user: any) => {
    setEditProfileUser(user);
    setProfileForm({ full_name: user.full_name || "", phone: (user as any).phone || "", dni: (user as any).dni || "" });
  };

  const saveProfile = async () => {
    if (!editProfileUser) return;
    const { error } = await supabase.from("profiles").update({ full_name: profileForm.full_name, phone: profileForm.phone, dni: profileForm.dni } as any).eq("id", editProfileUser.id);
    if (error) { toast.error(error.message); return; }
    await logAction("Editar datos usuario", "usuarios", editProfileUser.id, profileForm);
    toast.success("Datos actualizados");
    setEditProfileUser(null);
    fetchUsers();
  };

  const toggleSection = (val: string) => setEditSections(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val]);
  const togglePage = (val: string) => setEditPages(prev => prev.includes(val) ? prev.filter(p => p !== val) : [...prev, val]);

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

  // Roles available to assign
  const assignableRoles = isSuperAdmin
    ? [{ value: "super_admin", label: "Super Admin" }, { value: "admin", label: "Administrador" }, { value: "worker", label: "Trabajador" }, { value: "viewer", label: "Lector" }]
    : [{ value: "worker", label: "Trabajador" }, { value: "viewer", label: "Lector" }];

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

      {/* Edit Profile Dialog */}
      <Dialog open={!!editProfileUser} onOpenChange={open => !open && setEditProfileUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Editar Datos: {editProfileUser?.full_name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nombre completo</Label><Input value={profileForm.full_name} onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Teléfono</Label><Input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Nº Identificación (DNI)</Label><Input value={profileForm.dni} onChange={e => setProfileForm({ ...profileForm, dni: e.target.value })} /></div>
            <Button onClick={saveProfile} className="w-full gap-2"><Save className="h-4 w-4" /> Guardar Datos</Button>
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
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Secciones</TableHead>
                  <TableHead>Asignar Rol</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay usuarios</TableCell></TableRow>
                ) : users.map(u => {
                  const isSuperAdminUser = u.roles?.includes("super_admin");
                  const isMainSuperAdmin = u.email === SUPER_ADMIN_EMAIL;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "Sin nombre"}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{(u as any).phone || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {u.roles.length === 0 && <span className="text-muted-foreground text-sm">Sin rol</span>}
                          {u.roles.map((r: string) => (
                            <Badge key={r} className={`${roleColors[r] || ""} ${(r === "super_admin" || (r === "admin" && !isSuperAdmin)) ? "" : "cursor-pointer"}`}
                              onClick={() => { if (r !== "super_admin" && !(r === "admin" && !isSuperAdmin)) removeRole(u.id, r); }}>
                              {roleLabels[r] || r} {r !== "super_admin" && !(r === "admin" && !isSuperAdmin) && "×"}
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
                            {assignableRoles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isSuperAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => openEditProfile(u)} title="Editar datos personales">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openEdit(u)} title="Editar permisos">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!isMainSuperAdmin && !isSuperAdminUser && (
                            <Button variant="ghost" size="icon" onClick={() => deleteUser(u.id)} title="Eliminar usuario">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
