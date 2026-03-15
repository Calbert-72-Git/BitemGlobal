import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, FileSpreadsheet, FileText, Receipt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { logAction } from "@/lib/auditLog";
import InvoiceDialog from "@/components/dashboard/InvoiceDialog";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };

const columns = [
  { key: "sale_date", label: "Fecha" },
  { key: "section_label", label: "Sección" },
  { key: "description", label: "Descripción" },
  { key: "client_name", label: "Cliente" },
  { key: "quantity", label: "Cantidad" },
  { key: "amount_fmt", label: "Monto (XAF)" },
  { key: "registered_by", label: "Registrado por" },
];

const SalesPage = () => {
  const { user, isAdmin, hasRole, profile } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceSection, setInvoiceSection] = useState("gimnasia");
  const [filter, setFilter] = useState<string>("all");
  const canWrite = isAdmin || hasRole("worker");
  const allowedSections: string[] = profile?.allowed_sections || [];
  const [form, setForm] = useState({ description: "", amount: "", quantity: "1", client_name: "", section: allowedSections[0] || "gimnasia", sale_date: new Date().toISOString().split("T")[0] });

  const fetchSales = async () => {
    let q = supabase.from("sales").select("*").order("sale_date", { ascending: false });
    if (filter !== "all") q = q.eq("section", filter as any);
    const { data } = await q;
    setSales(data || []);
  };

  const fetchProfiles = async () => {
    if (!isAdmin) return;
    const { data } = await supabase.from("profiles").select("id, full_name");
    const map: Record<string, string> = {};
    (data || []).forEach((p: any) => { map[p.id] = p.full_name; });
    setProfiles(map);
  };

  useEffect(() => { fetchSales(); fetchProfiles(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin && allowedSections.length > 0 && !allowedSections.includes(form.section)) {
      toast.error("No tienes permiso para registrar en esta sección");
      return;
    }
    const { data, error } = await supabase.from("sales").insert({
      user_id: user?.id, section: form.section as any, description: form.description,
      amount: parseFloat(form.amount), quantity: parseInt(form.quantity), client_name: form.client_name, sale_date: form.sale_date,
    }).select("id").single();
    if (error) { toast.error(error.message); return; }
    await logAction("Registrar venta", "ventas", data?.id, { description: form.description, amount: form.amount, section: form.section });
    toast.success("Venta registrada");
    setOpen(false);
    setForm({ description: "", amount: "", quantity: "1", client_name: "", section: allowedSections[0] || "gimnasia", sale_date: new Date().toISOString().split("T")[0] });
    fetchSales();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await logAction("Eliminar venta", "ventas", id);
    toast.success("Venta eliminada");
    fetchSales();
  };

  const exportData = sales.map(s => ({ ...s, section_label: sectionLabels[s.section] || s.section, amount_fmt: Number(s.amount).toLocaleString(), registered_by: profiles[s.user_id] || "-" }));

  const availableSections = isAdmin ? allSectionsList : allSectionsList.filter(s => allowedSections.includes(s.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Ventas</h1>
        <div className="flex gap-2 flex-wrap">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="gimnasia">GeQ Sport</SelectItem>
              <SelectItem value="clinica">Clínica Bitem</SelectItem>
              <SelectItem value="peluqueria">Peluquería Bitem</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => exportToExcel(exportData, columns, "ventas")} title="Exportar Excel"><FileSpreadsheet className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => exportToPDF(exportData, columns, "Ventas - Bitem Global", "ventas")} title="Exportar PDF"><FileText className="h-4 w-4" /></Button>
          {canWrite && (
            <>
              <Button variant="outline" className="gap-2" onClick={() => { setInvoiceSection(filter !== "all" ? filter : "gimnasia"); setInvoiceOpen(true); }}>
                <Receipt className="h-4 w-4" /> Facturar
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Nueva Venta</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Registrar Venta</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sección</Label>
                        <Select value={form.section} onValueChange={v => setForm({ ...form, section: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {availableSections.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2"><Label>Fecha</Label><Input type="date" value={form.sale_date} onChange={e => setForm({ ...form, sale_date: e.target.value })} required /></div>
                    </div>
                    <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2"><Label>Monto (XAF)</Label><Input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required /></div>
                      <div className="space-y-2"><Label>Cantidad</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></div>
                      <div className="space-y-2"><Label>Cliente</Label><Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} /></div>
                    </div>
                    <Button type="submit" className="w-full">Guardar Venta</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      <InvoiceDialog open={invoiceOpen} onOpenChange={setInvoiceOpen} section={invoiceSection} />

      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead><TableHead>Sección</TableHead><TableHead>Descripción</TableHead><TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Cant.</TableHead><TableHead className="text-right">Monto</TableHead>
                  <TableHead>Registrado por</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No hay ventas registradas</TableCell></TableRow>
                ) : sales.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.sale_date}</TableCell>
                    <TableCell>{sectionLabels[s.section] || s.section}</TableCell>
                    <TableCell>{s.description}</TableCell>
                    <TableCell>{s.client_name || "-"}</TableCell>
                    <TableCell className="text-right">{s.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">{Number(s.amount).toLocaleString()} XAF</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{profiles[s.user_id] || (s.user_id === user?.id ? profile?.full_name : "-")}</TableCell>
                    <TableCell>
                      {isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      )}
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

const allSectionsList = [
  { value: "gimnasia", label: "GeQ Sport" },
  { value: "clinica", label: "Clínica Bitem" },
  { value: "peluqueria", label: "Peluquería Bitem" },
];

export default SalesPage;
