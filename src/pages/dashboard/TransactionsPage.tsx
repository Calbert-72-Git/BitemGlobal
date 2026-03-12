import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

type TransactionType = "purchases" | "income" | "expenses";

const config: Record<TransactionType, {
  title: string;
  dateField: string;
  extraField: { key: string; label: string };
}> = {
  purchases: { title: "Compras", dateField: "purchase_date", extraField: { key: "supplier", label: "Proveedor" } },
  income: { title: "Ingresos", dateField: "income_date", extraField: { key: "source", label: "Fuente" } },
  expenses: { title: "Gastos", dateField: "expense_date", extraField: { key: "category", label: "Categoría" } },
};

interface Props {
  type: TransactionType;
}

const TransactionsPage = ({ type }: Props) => {
  const { user } = useAuth();
  const c = config[type];
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ description: "", amount: "", section: "gimnasia", extra: "", date: new Date().toISOString().split("T")[0] });

  const fetchData = async () => {
    let q = supabase.from(type).select("*").order(c.dateField, { ascending: false });
    if (filter !== "all") q = q.eq("section", filter);
    const { data: res } = await q;
    setData(res || []);
  };

  useEffect(() => { fetchData(); }, [filter, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const row: any = {
      user_id: user?.id,
      section: form.section,
      description: form.description,
      amount: parseFloat(form.amount),
      [c.dateField]: form.date,
      [c.extraField.key]: form.extra,
    };
    if (type === "purchases") row.quantity = 1;
    const { error } = await supabase.from(type).insert(row);
    if (error) { toast.error(error.message); return; }
    toast.success(`${c.title.slice(0, -1)} registrado/a`);
    setOpen(false);
    setForm({ description: "", amount: "", section: "gimnasia", extra: "", date: new Date().toISOString().split("T")[0] });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(type).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Eliminado");
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">{c.title}</h1>
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
              <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registrar {c.title}</DialogTitle></DialogHeader>
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
                    <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monto (XAF)</Label>
                    <Input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{c.extraField.label}</Label>
                    <Input value={form.extra} onChange={e => setForm({ ...form, extra: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Guardar</Button>
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
                  <TableHead>{c.extraField.label}</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Sin registros</TableCell></TableRow>
                ) : data.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r[c.dateField]}</TableCell>
                    <TableCell>{sectionLabels[r.section] || r.section}</TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>{r[c.extraField.key] || "-"}</TableCell>
                    <TableCell className="text-right font-semibold">{Number(r.amount).toLocaleString()} XAF</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
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

export default TransactionsPage;
