import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };

const SalesPage = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [form, setForm] = useState({ description: "", amount: "", quantity: "1", client_name: "", section: "gimnasia", sale_date: new Date().toISOString().split("T")[0] });

  const fetchSales = async () => {
    let q = supabase.from("sales").select("*").order("sale_date", { ascending: false });
    if (filter !== "all") q = q.eq("section", filter as "gimnasia" | "clinica" | "peluqueria");
    const { data } = await q;
    setSales(data || []);
  };

  useEffect(() => { fetchSales(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("sales").insert({
      user_id: user?.id,
      section: form.section as any,
      description: form.description,
      amount: parseFloat(form.amount),
      quantity: parseInt(form.quantity),
      client_name: form.client_name,
      sale_date: form.sale_date,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Venta registrada");
    setOpen(false);
    setForm({ description: "", amount: "", quantity: "1", client_name: "", section: "gimnasia", sale_date: new Date().toISOString().split("T")[0] });
    fetchSales();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sales").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Venta eliminada");
    fetchSales();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Ventas</h1>
        <div className="flex gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="gimnasia">GeQ Sport</SelectItem>
              <SelectItem value="clinica">Clínica Bitem</SelectItem>
              <SelectItem value="peluqueria">Peluquería Bitem</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> Nueva Venta</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registrar Venta</DialogTitle></DialogHeader>
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
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input type="date" value={form.sale_date} onChange={e => setForm({ ...form, sale_date: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monto (XAF)</Label>
                    <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Cantidad</Label>
                    <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Guardar Venta</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-card border-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Cant.</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No hay ventas registradas</TableCell></TableRow>
                ) : sales.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.sale_date}</TableCell>
                    <TableCell>{sectionLabels[s.section] || s.section}</TableCell>
                    <TableCell>{s.description}</TableCell>
                    <TableCell>{s.client_name || "-"}</TableCell>
                    <TableCell className="text-right">{s.quantity}</TableCell>
                    <TableCell className="text-right font-semibold">{Number(s.amount).toLocaleString()} XAF</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

export default SalesPage;
