import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileSpreadsheet, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };

const columns = [
  { key: "name", label: "Nombre" },
  { key: "section_label", label: "Sección" },
  { key: "description", label: "Descripción" },
  { key: "quantity", label: "Cantidad" },
  { key: "unit_price_fmt", label: "Precio Unit. (XAF)" },
  { key: "total_fmt", label: "Valor Total (XAF)" },
];

const InventoryPage = () => {
  const { hasRole } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const canWrite = hasRole("admin") || hasRole("worker");
  const [form, setForm] = useState({ name: "", description: "", quantity: "0", unit_price: "0", min_stock: "5", section: "clinica" });

  const fetchItems = async () => {
    let q = supabase.from("inventory").select("*").order("name");
    if (filter !== "all") q = q.eq("section", filter as "gimnasia" | "clinica" | "peluqueria");
    const { data } = await q;
    setItems(data || []);
  };

  useEffect(() => { fetchItems(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("inventory").insert({
      section: form.section as any, name: form.name, description: form.description,
      quantity: parseInt(form.quantity), unit_price: parseFloat(form.unit_price), min_stock: parseInt(form.min_stock),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Artículo agregado");
    setOpen(false);
    setForm({ name: "", description: "", quantity: "0", unit_price: "0", min_stock: "5", section: "clinica" });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("inventory").delete().eq("id", id);
    toast.success("Eliminado");
    fetchItems();
  };

  const exportData = items.map(i => ({
    ...i,
    section_label: sectionLabels[i.section] || i.section,
    unit_price_fmt: Number(i.unit_price).toLocaleString(),
    total_fmt: (i.quantity * Number(i.unit_price)).toLocaleString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Inventario</h1>
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
          <Button variant="outline" size="icon" onClick={() => exportToExcel(exportData, columns, "inventario")} title="Excel"><FileSpreadsheet className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => exportToPDF(exportData, columns, "Inventario - Bitem Global", "inventario")} title="PDF"><FileText className="h-4 w-4" /></Button>
          {canWrite && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Artículo</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Agregar Artículo</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Sección</Label>
                      <Select value={form.section} onValueChange={v => setForm({ ...form, section: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gimnasia">GeQ Sport</SelectItem>
                          <SelectItem value="clinica">Clínica Bitem</SelectItem>
                          <SelectItem value="peluqueria">Peluquería Bitem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Nombre</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Descripción</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Cantidad</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Precio Unit. (XAF)</Label><Input type="number" step="0.01" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>Stock Mínimo</Label><Input type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: e.target.value })} required /></div>
                  </div>
                  <Button type="submit" className="w-full">Guardar</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead><TableHead>Sección</TableHead><TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead><TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead><TableHead>Estado</TableHead><TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Sin artículos</TableCell></TableRow>
                ) : items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{sectionLabels[item.section] || item.section}</TableCell>
                    <TableCell>{item.description || "-"}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{Number(item.unit_price).toLocaleString()} XAF</TableCell>
                    <TableCell className="text-right font-semibold">{(item.quantity * Number(item.unit_price)).toLocaleString()} XAF</TableCell>
                    <TableCell>
                      {item.quantity <= item.min_stock ? <Badge variant="destructive">Bajo</Badge> : <Badge className="bg-accent text-accent-foreground">OK</Badge>}
                    </TableCell>
                    <TableCell>
                      {hasRole("admin") && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default InventoryPage;
