import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const roleLabels: Record<string, string> = { admin: "Administrador", worker: "Trabajador", viewer: "Lector" };
const roleColors: Record<string, string> = { admin: "bg-primary text-primary-foreground", worker: "bg-accent text-accent-foreground", viewer: "bg-muted text-muted-foreground" };

const UsersPage = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
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
    const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role: role as any }, { onConflict: "user_id,role" });
    if (error) { toast.error(error.message); return; }
    toast.success("Rol asignado");
    fetchUsers();
  };

  const removeRole = async (userId: string, role: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
    if (error) { toast.error(error.message); return; }
    toast.success("Rol eliminado");
    fetchUsers();
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
      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Asignar Rol</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No hay usuarios</TableCell></TableRow>
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
                      <Select onValueChange={v => assignRole(u.id, v)}>
                        <SelectTrigger className="w-36"><SelectValue placeholder="Añadir rol" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="worker">Trabajador</SelectItem>
                          <SelectItem value="viewer">Lector</SelectItem>
                        </SelectContent>
                      </Select>
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
