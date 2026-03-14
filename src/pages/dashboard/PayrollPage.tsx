import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, FileSpreadsheet, FileText, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { exportToExcel, exportToPDF } from "@/lib/exportUtils";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const PayrollPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("admin");
  const [tab, setTab] = useState("payroll");
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [empOpen, setEmpOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [empForm, setEmpForm] = useState({ full_name: "", dni: "", phone: "", address: "", bank_name: "", bank_account: "", section: "gimnasia", position: "", base_salary: "", start_date: new Date().toISOString().split("T")[0] });
  const now = new Date();
  const [payForm, setPayForm] = useState({ employee_id: "", month: String(now.getMonth() + 1), year: String(now.getFullYear()), bonuses: "0", deductions: "0", notes: "" });

  const fetchEmployees = async () => {
    let q = supabase.from("employees" as any).select("*").eq("active", true).order("full_name");
    if (filter !== "all") q = q.eq("section", filter);
    const { data } = await q;
    setEmployees((data as any[]) || []);
  };

  const fetchPayrolls = async () => {
    const { data } = await supabase.from("payroll" as any).select("*, employees!inner(full_name, section, bank_name, bank_account, position)").order("year", { ascending: false }).order("month", { ascending: false });
    setPayrolls((data as any[]) || []);
  };

  useEffect(() => { fetchEmployees(); fetchPayrolls(); }, [filter]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("employees" as any).insert({ ...empForm, base_salary: parseFloat(empForm.base_salary) } as any);
    if (error) { toast.error(error.message); return; }
    toast.success("Empleado añadido");
    setEmpOpen(false);
    setEmpForm({ full_name: "", dni: "", phone: "", address: "", bank_name: "", bank_account: "", section: "gimnasia", position: "", base_salary: "", start_date: new Date().toISOString().split("T")[0] });
    fetchEmployees();
  };

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(em => em.id === payForm.employee_id);
    if (!emp) { toast.error("Selecciona un empleado"); return; }
    const base = Number(emp.base_salary);
    const bonuses = parseFloat(payForm.bonuses) || 0;
    const deductions = parseFloat(payForm.deductions) || 0;
    const net = base + bonuses - deductions;
    const { error } = await supabase.from("payroll" as any).insert({
      employee_id: payForm.employee_id,
      section: emp.section,
      month: parseInt(payForm.month),
      year: parseInt(payForm.year),
      base_salary: base,
      bonuses, deductions, net_salary: net,
      notes: payForm.notes,
    } as any);
    if (error) { toast.error(error.message === 'duplicate key value violates unique constraint "payroll_employee_id_month_year_key"' ? "Ya existe nómina para este empleado en ese mes" : error.message); return; }
    toast.success("Nómina generada");
    setPayOpen(false);
    fetchPayrolls();
  };

  const markPaid = async (id: string) => {
    await supabase.from("payroll" as any).update({ paid: true, paid_date: new Date().toISOString().split("T")[0] } as any).eq("id", id);
    toast.success("Marcada como pagada");
    fetchPayrolls();
  };

  const deletePayroll = async (id: string) => {
    await supabase.from("payroll" as any).delete().eq("id", id);
    toast.success("Nómina eliminada");
    fetchPayrolls();
  };

  const deleteEmployee = async (id: string) => {
    await supabase.from("employees" as any).delete().eq("id", id);
    toast.success("Empleado eliminado");
    fetchEmployees();
  };

  const filteredPayrolls = filter === "all" ? payrolls : payrolls.filter((p: any) => p.section === filter);

  const payrollColumns = [
    { key: "emp_name", label: "Empleado" },
    { key: "section_label", label: "Sección" },
    { key: "period", label: "Período" },
    { key: "base_salary", label: "Salario Base" },
    { key: "bonuses", label: "Bonificaciones" },
    { key: "deductions", label: "Deducciones" },
    { key: "net_salary", label: "Salario Neto" },
    { key: "status", label: "Estado" },
  ];

  const exportPayrollData = filteredPayrolls.map((p: any) => ({
    emp_name: p.employees?.full_name || "",
    section_label: sectionLabels[p.section] || p.section,
    period: `${monthNames[p.month - 1]} ${p.year}`,
    base_salary: Number(p.base_salary).toLocaleString(),
    bonuses: Number(p.bonuses).toLocaleString(),
    deductions: Number(p.deductions).toLocaleString(),
    net_salary: Number(p.net_salary).toLocaleString(),
    status: p.paid ? "Pagada" : "Pendiente",
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="font-heading text-3xl font-bold text-foreground">Nóminas</h1>
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
          <Button variant="outline" size="icon" onClick={() => exportToExcel(exportPayrollData, payrollColumns, "nominas")} title="Excel"><FileSpreadsheet className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={() => exportToPDF(exportPayrollData, payrollColumns, "Nóminas - Bitem Global", "nominas")} title="PDF"><FileText className="h-4 w-4" /></Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="payroll">Nóminas</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          {isAdmin && (
            <Dialog open={payOpen} onOpenChange={setPayOpen}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Generar Nómina</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Generar Nómina</DialogTitle></DialogHeader>
                <form onSubmit={handleGeneratePayroll} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Empleado</Label>
                    <Select value={payForm.employee_id} onValueChange={v => setPayForm({ ...payForm, employee_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name} - {sectionLabels[e.section]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mes</Label>
                      <Select value={payForm.month} onValueChange={v => setPayForm({ ...payForm, month: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {monthNames.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Año</Label>
                      <Input type="number" value={payForm.year} onChange={e => setPayForm({ ...payForm, year: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bonificaciones (XAF)</Label>
                      <Input type="number" value={payForm.bonuses} onChange={e => setPayForm({ ...payForm, bonuses: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Deducciones (XAF)</Label>
                      <Input type="number" value={payForm.deductions} onChange={e => setPayForm({ ...payForm, deductions: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Input value={payForm.notes} onChange={e => setPayForm({ ...payForm, notes: e.target.value })} />
                  </div>
                  <Button type="submit" className="w-full">Generar</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <Card className="shadow-card border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Base</TableHead>
                      <TableHead className="text-right">Bonif.</TableHead>
                      <TableHead className="text-right">Deduc.</TableHead>
                      <TableHead className="text-right">Neto</TableHead>
                      <TableHead>Estado</TableHead>
                      {isAdmin && <TableHead></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayrolls.length === 0 ? (
                      <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Sin nóminas</TableCell></TableRow>
                    ) : filteredPayrolls.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.employees?.full_name}</TableCell>
                        <TableCell>{sectionLabels[p.section]}</TableCell>
                        <TableCell>{monthNames[p.month - 1]} {p.year}</TableCell>
                        <TableCell className="text-right">{Number(p.base_salary).toLocaleString()} XAF</TableCell>
                        <TableCell className="text-right">{Number(p.bonuses).toLocaleString()} XAF</TableCell>
                        <TableCell className="text-right">{Number(p.deductions).toLocaleString()} XAF</TableCell>
                        <TableCell className="text-right font-semibold">{Number(p.net_salary).toLocaleString()} XAF</TableCell>
                        <TableCell>
                          {p.paid ? <Badge className="bg-accent text-accent-foreground">Pagada</Badge> : <Badge variant="destructive">Pendiente</Badge>}
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex gap-1">
                              {!p.paid && <Button variant="ghost" size="icon" onClick={() => markPaid(p.id)}><Check className="h-4 w-4 text-accent-foreground" /></Button>}
                              <Button variant="ghost" size="icon" onClick={() => deletePayroll(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          {isAdmin && (
            <Dialog open={empOpen} onOpenChange={setEmpOpen}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" /> Nuevo Empleado</Button></DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Añadir Empleado</DialogTitle></DialogHeader>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Nombre completo</Label><Input value={empForm.full_name} onChange={e => setEmpForm({ ...empForm, full_name: e.target.value })} required /></div>
                    <div className="space-y-2"><Label>DNI / Pasaporte</Label><Input value={empForm.dni} onChange={e => setEmpForm({ ...empForm, dni: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Teléfono</Label><Input value={empForm.phone} onChange={e => setEmpForm({ ...empForm, phone: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Dirección</Label><Input value={empForm.address} onChange={e => setEmpForm({ ...empForm, address: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Banco</Label><Input value={empForm.bank_name} onChange={e => setEmpForm({ ...empForm, bank_name: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Nº Cuenta Bancaria</Label><Input value={empForm.bank_account} onChange={e => setEmpForm({ ...empForm, bank_account: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Sección</Label>
                      <Select value={empForm.section} onValueChange={v => setEmpForm({ ...empForm, section: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gimnasia">GeQ Sport</SelectItem>
                          <SelectItem value="clinica">Clínica Bitem</SelectItem>
                          <SelectItem value="peluqueria">Peluquería Bitem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Cargo</Label><Input value={empForm.position} onChange={e => setEmpForm({ ...empForm, position: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Salario Base (XAF)</Label><Input type="number" value={empForm.base_salary} onChange={e => setEmpForm({ ...empForm, base_salary: e.target.value })} required /></div>
                  </div>
                  <div className="space-y-2"><Label>Fecha de inicio</Label><Input type="date" value={empForm.start_date} onChange={e => setEmpForm({ ...empForm, start_date: e.target.value })} /></div>
                  <Button type="submit" className="w-full">Guardar Empleado</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
          <Card className="shadow-card border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Sección</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead>Cuenta</TableHead>
                      <TableHead className="text-right">Salario Base</TableHead>
                      {isAdmin && <TableHead></TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Sin empleados</TableCell></TableRow>
                    ) : employees.map(e => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.full_name}</TableCell>
                        <TableCell>{sectionLabels[e.section]}</TableCell>
                        <TableCell>{e.position || "-"}</TableCell>
                        <TableCell>{e.dni || "-"}</TableCell>
                        <TableCell>{e.bank_name || "-"}</TableCell>
                        <TableCell>{e.bank_account || "-"}</TableCell>
                        <TableCell className="text-right font-semibold">{Number(e.base_salary).toLocaleString()} XAF</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => deleteEmployee(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </TableCell>
                        )}
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

export default PayrollPage;
