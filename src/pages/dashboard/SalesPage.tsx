import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, FileDown, FileBarChart, Receipt, Eye, Printer, Download, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";
import { logAction } from "@/lib/auditLog";
import InvoiceDialog from "@/components/dashboard/InvoiceDialog";
import logoBitem from "@/assets/logo-eni.png";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };
const paymentLabels: Record<string, string> = { efectivo: "Efectivo", bancario: "Bancario", munidinero: "MuniDinero", credito: "A crédito" };

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
  const [invoices, setInvoices] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceSection, setInvoiceSection] = useState("gimnasia");
  const [filter, setFilter] = useState<string>("all");
  const [viewInvoice, setViewInvoice] = useState<any>(null);
  const canWrite = isAdmin || hasRole("worker");
  const allowedSections: string[] = profile?.allowed_sections || [];
  const [form, setForm] = useState({ description: "", amount: "", quantity: "1", client_name: "", section: allowedSections[0] || "gimnasia", sale_date: new Date().toISOString().split("T")[0] });

  const fetchSales = async () => {
    let q = supabase.from("sales").select("*").order("sale_date", { ascending: false });
    if (filter !== "all") q = q.eq("section", filter as any);
    // Section-based filtering for non-admins
    if (!isAdmin && allowedSections.length > 0) {
      q = q.in("section", allowedSections as any);
    }
    const { data } = await q;
    setSales(data || []);
  };

  const fetchInvoices = async () => {
    let q = supabase.from("invoices" as any).select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("section", filter);
    if (!isAdmin && allowedSections.length > 0) {
      q = q.in("section", allowedSections);
    }
    const { data } = await q;
    setInvoices((data as any[]) || []);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("id, full_name");
    const map: Record<string, string> = {};
    (data || []).forEach((p: any) => { map[p.id] = p.full_name; });
    setProfiles(map);
  };

  useEffect(() => { fetchSales(); fetchInvoices(); fetchProfiles(); }, [filter]);

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

  const renderInvoicePreview = (inv: any) => {
    const items = inv.items || [];
    const pmLabel = paymentLabels[inv.payment_method] || inv.payment_method || "Efectivo";
    return (
      <div className="font-body text-sm space-y-4">
        <div className="flex justify-between items-start border-b-2 border-primary pb-4">
          <div className="flex items-center gap-3">
            <img src={logoBitem} alt="Bitem" className="h-10 w-auto" />
            <div>
              <h3 className="font-heading font-bold text-primary">{sectionLabels[inv.section] || inv.section}</h3>
              <p className="text-xs text-muted-foreground">Bitem Global - Guinea Ecuatorial</p>
              <p className="text-xs text-muted-foreground">📧 calbertutm@gmail.com | 📞 +240 222 176 082</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-primary">FACTURA</p>
            <p className="text-xs">Nº: {inv.invoice_number}</p>
            <p className="text-xs">{new Date(inv.created_at).toLocaleDateString("es-GQ")}</p>
          </div>
        </div>
        <div className="bg-muted p-3 rounded-lg text-xs">
          <p><strong>Cliente:</strong> {inv.client_name}</p>
          {inv.client_phone && <p><strong>Tel:</strong> {inv.client_phone}</p>}
        </div>
        <table className="w-full text-xs">
          <thead><tr className="bg-primary text-primary-foreground"><th className="p-2 text-left">Descripción</th><th className="p-2 text-center">Cant.</th><th className="p-2 text-right">P.Unit</th><th className="p-2 text-right">Total</th></tr></thead>
          <tbody>{items.map((it: any, i: number) => (
            <tr key={i} className="border-b border-border"><td className="p-2">{it.description}</td><td className="p-2 text-center">{it.quantity}</td><td className="p-2 text-right">{Number(it.unit_price).toLocaleString()} XAF</td><td className="p-2 text-right">{Number(it.total).toLocaleString()} XAF</td></tr>
          ))}</tbody>
        </table>
        <div className="text-right space-y-1">
          <p>Subtotal: <strong>{Number(inv.subtotal).toLocaleString()} XAF</strong></p>
          {Number(inv.discount_percent) > 0 && <p className="text-destructive">Descuento ({inv.discount_percent}%): -{Number(inv.discount_amount).toLocaleString()} XAF</p>}
          <p className="text-lg font-bold text-primary">TOTAL: {Number(inv.total).toLocaleString()} XAF</p>
          <p className="text-xs">Forma de pago: <strong>{pmLabel}</strong></p>
          {Number(inv.amount_pending) > 0 && <p className="text-destructive text-xs">Pendiente: {Number(inv.amount_pending).toLocaleString()} XAF</p>}
        </div>
        <div className="text-center bg-muted p-3 rounded-lg">
          <p className="text-xs font-semibold text-primary">¡Gracias por confiar en nosotros!</p>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">Emitido por: {inv.created_by_name} — ©Soportado por Calbert 72</p>
      </div>
    );
  };

  const printInvoice = (inv: any) => {
    const items = inv.items || [];
    const pmLabel = paymentLabels[inv.payment_method] || inv.payment_method || "Efectivo";
    const html = `<html><head><title>Factura ${inv.invoice_number}</title></head><body style="font-family:Arial;padding:30px;max-width:700px;margin:0 auto">
      <div style="display:flex;justify-content:space-between;border-bottom:3px solid #1E56A0;padding-bottom:15px;margin-bottom:20px">
        <div><h2 style="margin:0;color:#1E56A0">${sectionLabels[inv.section]}</h2><p style="font-size:11px;color:#666;margin:2px 0">📧 calbertutm@gmail.com | 📞 +240 222 176 082</p></div>
        <div style="text-align:right"><h3 style="margin:0;color:#1E56A0">FACTURA</h3><p style="font-size:12px;margin:0">Nº: ${inv.invoice_number}</p><p style="font-size:12px;margin:0">${new Date(inv.created_at).toLocaleDateString("es-GQ")}</p></div>
      </div>
      <p><strong>Cliente:</strong> ${inv.client_name}</p>
      <table style="width:100%;border-collapse:collapse;margin:15px 0"><thead><tr style="background:#1E56A0;color:white"><th style="padding:8px;text-align:left">Descripción</th><th style="padding:8px;text-align:center">Cant.</th><th style="padding:8px;text-align:right">P.Unit</th><th style="padding:8px;text-align:right">Total</th></tr></thead>
      <tbody>${items.map((it: any) => `<tr style="border-bottom:1px solid #eee"><td style="padding:6px">${it.description}</td><td style="padding:6px;text-align:center">${it.quantity}</td><td style="padding:6px;text-align:right">${Number(it.unit_price).toLocaleString()} XAF</td><td style="padding:6px;text-align:right">${Number(it.total).toLocaleString()} XAF</td></tr>`).join("")}</tbody></table>
      <div style="text-align:right"><p>Total: <strong>${Number(inv.total).toLocaleString()} XAF</strong></p><p>Pago: ${pmLabel}</p></div>
      <p style="text-align:center;margin-top:30px;color:#1E56A0;font-weight:bold">¡Gracias por confiar en nosotros!</p>
      <p style="text-align:center;font-size:10px;color:#aaa;margin-top:15px">©Soportado por Calbert 72</p>
    </body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.print(); }
  };

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
          <Button variant="outline" size="icon" onClick={() => exportToExcel(exportData, columns, "ventas")} title="Excel"><FileDown className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => exportToPDF(exportData, columns, "Ventas - Bitem Global", "ventas")} title="PDF"><FileBarChart className="h-4 w-4" /></Button>
          {canWrite && (
            <>
              <Button variant="outline" className="gap-2" onClick={() => { setInvoiceSection(filter !== "all" ? filter : "gimnasia"); setInvoiceOpen(true); }}>
                <Receipt className="h-4 w-4" /> Facturar
              </Button>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild><Button className="gap-2"><PlusCircle className="h-4 w-4" /> Nueva Venta</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Registrar Venta</DialogTitle></DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sección</Label>
                        <Select value={form.section} onValueChange={v => setForm({ ...form, section: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{availableSections.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
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

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="invoices">Historial Facturas ({invoices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
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
                        <TableCell><Badge variant="outline" className="text-xs">{sectionLabels[s.section] || s.section}</Badge></TableCell>
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
        </TabsContent>

        <TabsContent value="invoices">
          {/* View Invoice Dialog */}
          <Dialog open={!!viewInvoice} onOpenChange={o => !o && setViewInvoice(null)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Factura {viewInvoice?.invoice_number}</DialogTitle></DialogHeader>
              {viewInvoice && renderInvoicePreview(viewInvoice)}
              <div className="flex gap-2 mt-4">
                <Button onClick={() => printInvoice(viewInvoice)} className="flex-1 gap-2"><Printer className="h-4 w-4" /> Imprimir</Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                  const blob = new Blob([`<html><head><meta charset="utf-8"></head><body>${document.querySelector('.invoice-preview')?.innerHTML || ''}</body></html>`], { type: "text/html" });
                  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `factura-${viewInvoice.invoice_number}.html`; a.click();
                }}><Download className="h-4 w-4" /> Descargar</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="shadow-card border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Factura</TableHead><TableHead>Fecha</TableHead><TableHead>Sección</TableHead>
                      <TableHead>Cliente</TableHead><TableHead className="text-right">Total</TableHead>
                      <TableHead>Pago</TableHead><TableHead>Estado</TableHead>
                      <TableHead>Emitida por</TableHead><TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No hay facturas</TableCell></TableRow>
                    ) : invoices.map((inv: any) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs font-semibold">{inv.invoice_number}</TableCell>
                        <TableCell>{new Date(inv.created_at).toLocaleDateString("es-GQ")}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{sectionLabels[inv.section]}</Badge></TableCell>
                        <TableCell>{inv.client_name || "-"}</TableCell>
                        <TableCell className="text-right font-semibold">{Number(inv.total).toLocaleString()} XAF</TableCell>
                        <TableCell><Badge className="text-xs bg-secondary text-secondary-foreground">{paymentLabels[inv.payment_method] || "Efectivo"}</Badge></TableCell>
                        <TableCell>
                          {Number(inv.amount_pending) > 0
                            ? <Badge variant="destructive" className="text-xs">Pend: {Number(inv.amount_pending).toLocaleString()}</Badge>
                            : <Badge className="bg-accent text-accent-foreground text-xs">Pagada</Badge>
                          }
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{inv.created_by_name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => setViewInvoice(inv)} title="Ver"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => printInvoice(inv)} title="Imprimir"><Printer className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const allSectionsList = [
  { value: "gimnasia", label: "GeQ Sport" },
  { value: "clinica", label: "Clínica Bitem" },
  { value: "peluqueria", label: "Peluquería Bitem" },
];

export default SalesPage;
