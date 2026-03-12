import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };

const AccountingPage = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ account_name: "", description: "", debit: "0", credit: "0", section: "gimnasia", entry_date: new Date().toISOString().split("T")[0], reference: "" });

  const fetchEntries = async () => {
    let q = supabase.from("accounting_entries").select("*").order("entry_date", { ascending: false });
    if (filter !== "all") q = q.eq("section", filter);
    const { data } = await q;
    setEntries(data || []);
  };

  useEffect(() => { fetchEntries(); }, [filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("accounting_entries").insert({
      user_id: user?.id,
      section: form.section as any,
      account_name: form.account_name,
      description: form.description,
      debit: parseFloat(form.debit),
      credit: parseFloat(form.credit),
      entry_date: form.entry_date,
      reference: form.reference,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Asiento registrado");
    setOpen(false);
    setForm({ account_name: "", description: "", debit: "0", credit: "0", section: "gimnasia", entry_date: new Date().toISOString().split("T")[0], reference: "" });
    fetchEntries();
  };

  // Compute grouped data for reports
  const accountSummary = entries.reduce((acc: Record<string, { debit: number; credit: number }>, e) => {
    if (!acc[e.account_name]) acc[e.account_name] = { debit: 0, credit: 0 };
    acc[e.account_name].debit += Number(e.debit);
    acc[e.account_name].credit += Number(e.credit);
    return acc;
  }, {});

  const totalDebit = entries.reduce((s, e) => s + Number(e.debit), 0);
  const totalCredit = entries.reduce((s, e) => s + Number(e.credit), 0);

  const fmt = (n: number) => n.toLocaleString("es-GQ") + " XAF";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Contabilidad</h1>
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
              <Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Asiento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registrar Asiento Contable</DialogTitle></DialogHeader>
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
                    <Input type="date" value={form.entry_date} onChange={e => setForm({ ...form, entry_date: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cuenta</Label>
                    <Input value={form.account_name} onChange={e => setForm({ ...form, account_name: e.target.value })} placeholder="Ej: Caja, Bancos, Ventas" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Referencia</Label>
                    <Input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Debe (XAF)</Label>
                    <Input type="number" step="0.01" value={form.debit} onChange={e => setForm({ ...form, debit: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Haber (XAF)</Label>
                    <Input type="number" step="0.01" value={form.credit} onChange={e => setForm({ ...form, credit: e.target.value })} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Guardar Asiento</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="diario">
        <TabsList className="mb-4">
          <TabsTrigger value="diario">Libro Diario</TabsTrigger>
          <TabsTrigger value="mayor">Libro Mayor</TabsTrigger>
          <TabsTrigger value="comprobacion">Balance Comprobación</TabsTrigger>
          <TabsTrigger value="resultados">Cuenta de Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="diario">
          <Card className="shadow-card border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Ref.</TableHead>
                      <TableHead className="text-right">Debe</TableHead>
                      <TableHead className="text-right">Haber</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Sin asientos</TableCell></TableRow>
                    ) : entries.map(e => (
                      <TableRow key={e.id}>
                        <TableCell>{e.entry_date}</TableCell>
                        <TableCell>{sectionLabels[e.section] || e.section}</TableCell>
                        <TableCell className="font-medium">{e.account_name}</TableCell>
                        <TableCell>{e.description || "-"}</TableCell>
                        <TableCell>{e.reference || "-"}</TableCell>
                        <TableCell className="text-right">{Number(e.debit) > 0 ? fmt(Number(e.debit)) : "-"}</TableCell>
                        <TableCell className="text-right">{Number(e.credit) > 0 ? fmt(Number(e.credit)) : "-"}</TableCell>
                      </TableRow>
                    ))}
                    {entries.length > 0 && (
                      <TableRow className="font-bold bg-muted">
                        <TableCell colSpan={5} className="text-right">TOTALES</TableCell>
                        <TableCell className="text-right">{fmt(totalDebit)}</TableCell>
                        <TableCell className="text-right">{fmt(totalCredit)}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mayor">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(accountSummary).map(([account, { debit, credit }]) => (
              <Card key={account} className="shadow-card border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-lg">{account}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Debe</p>
                      <p className="font-semibold text-foreground">{fmt(debit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Haber</p>
                      <p className="font-semibold text-foreground">{fmt(credit)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">Saldo</p>
                    <p className={`font-heading font-bold ${debit - credit >= 0 ? "text-accent" : "text-destructive"}`}>
                      {fmt(Math.abs(debit - credit))} {debit - credit >= 0 ? "(Deudor)" : "(Acreedor)"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {Object.keys(accountSummary).length === 0 && (
              <p className="text-muted-foreground col-span-2 text-center py-8">No hay cuentas registradas</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comprobacion">
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="font-heading">Balance de Comprobación de Sumas y Saldos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cuenta</TableHead>
                      <TableHead className="text-right">Suma Debe</TableHead>
                      <TableHead className="text-right">Suma Haber</TableHead>
                      <TableHead className="text-right">Saldo Deudor</TableHead>
                      <TableHead className="text-right">Saldo Acreedor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(accountSummary).map(([account, { debit, credit }]) => {
                      const balance = debit - credit;
                      return (
                        <TableRow key={account}>
                          <TableCell className="font-medium">{account}</TableCell>
                          <TableCell className="text-right">{fmt(debit)}</TableCell>
                          <TableCell className="text-right">{fmt(credit)}</TableCell>
                          <TableCell className="text-right">{balance > 0 ? fmt(balance) : "-"}</TableCell>
                          <TableCell className="text-right">{balance < 0 ? fmt(Math.abs(balance)) : "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                    {Object.keys(accountSummary).length > 0 && (
                      <TableRow className="font-bold bg-muted">
                        <TableCell>TOTALES</TableCell>
                        <TableCell className="text-right">{fmt(totalDebit)}</TableCell>
                        <TableCell className="text-right">{fmt(totalCredit)}</TableCell>
                        <TableCell className="text-right">
                          {fmt(Object.values(accountSummary).reduce((s, a) => s + Math.max(0, a.debit - a.credit), 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          {fmt(Object.values(accountSummary).reduce((s, a) => s + Math.max(0, a.credit - a.debit), 0))}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="font-heading text-accent">Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(accountSummary)
                  .filter(([_, v]) => v.credit > v.debit)
                  .map(([account, { debit, credit }]) => (
                    <div key={account} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span>{account}</span>
                      <span className="font-semibold">{fmt(credit - debit)}</span>
                    </div>
                  ))}
                <div className="flex justify-between pt-4 font-bold text-accent">
                  <span>Total Ingresos</span>
                  <span>{fmt(Object.values(accountSummary).reduce((s, a) => s + Math.max(0, a.credit - a.debit), 0))}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="font-heading text-destructive">Gastos</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(accountSummary)
                  .filter(([_, v]) => v.debit > v.credit)
                  .map(([account, { debit, credit }]) => (
                    <div key={account} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span>{account}</span>
                      <span className="font-semibold">{fmt(debit - credit)}</span>
                    </div>
                  ))}
                <div className="flex justify-between pt-4 font-bold text-destructive">
                  <span>Total Gastos</span>
                  <span>{fmt(Object.values(accountSummary).reduce((s, a) => s + Math.max(0, a.debit - a.credit), 0))}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 shadow-card border-0">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-2">Resultado del Periodo</p>
                <p className={`font-heading text-3xl font-bold ${totalCredit - totalDebit >= 0 ? "text-accent" : "text-destructive"}`}>
                  {fmt(totalCredit - totalDebit)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{totalCredit - totalDebit >= 0 ? "Beneficio" : "Pérdida"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingPage;
