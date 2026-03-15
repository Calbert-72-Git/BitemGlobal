import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

const AuditPage = () => {
  const { isAdmin } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    const { data } = await supabase.from("audit_log" as any).select("*").order("created_at", { ascending: false }).limit(500);
    setLogs((data as any[]) || []);
  };

  useEffect(() => { fetchLogs(); }, []);

  const filtered = logs.filter(l =>
    l.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.module?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "created_at_fmt", label: "Fecha/Hora" },
    { key: "user_name", label: "Usuario" },
    { key: "user_role", label: "Rol" },
    { key: "action", label: "Acción" },
    { key: "module", label: "Módulo" },
    { key: "record_id", label: "ID Registro" },
  ];

  const exportData = filtered.map(l => ({
    ...l,
    created_at_fmt: new Date(l.created_at).toLocaleString("es-GQ"),
  }));

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Auditoría del Sistema</h1>
          <p className="text-muted-foreground mt-1">Registro de todas las acciones de los usuarios</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Button variant="outline" size="icon" onClick={() => exportToExcel(exportData, columns, "auditoria")}><FileSpreadsheet className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => exportToPDF(exportData, columns, "Auditoría - Bitem Global", "auditoria")}><FileText className="h-4 w-4" /></Button>
        </div>
      </div>
      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Sin registros de auditoría</TableCell></TableRow>
                ) : filtered.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="text-sm">{new Date(l.created_at).toLocaleString("es-GQ")}</TableCell>
                    <TableCell className="font-medium">{l.user_name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{l.user_role}</Badge></TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell><Badge className="bg-primary/10 text-primary text-xs">{l.module}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{l.details && Object.keys(l.details).length > 0 ? JSON.stringify(l.details) : "-"}</TableCell>
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

export default AuditPage;
