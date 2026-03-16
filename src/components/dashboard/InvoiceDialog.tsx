import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer, MessageCircle, Plus, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { logAction } from "@/lib/auditLog";
import logoBitem from "@/assets/logo-eni.png";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };
const paymentMethods = [
  { value: "efectivo", label: "Efectivo" },
  { value: "bancario", label: "Bancario" },
  { value: "munidinero", label: "MuniDinero" },
  { value: "credito", label: "A crédito" },
];

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: string;
  prefillClient?: string;
  prefillItems?: InvoiceItem[];
}

const InvoiceDialog = ({ open, onOpenChange, section, prefillClient, prefillItems }: Props) => {
  const { user, profile } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const [clientName, setClientName] = useState(prefillClient || "");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>(prefillItems || [{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [amountPaid, setAmountPaid] = useState(0);

  const updateItem = (i: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[i] as any)[field] = value;
    if (field === "quantity" || field === "unit_price") {
      newItems[i].total = newItems[i].quantity * newItems[i].unit_price;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: "", quantity: 1, unit_price: 0, total: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const amountPending = total - amountPaid;

  const handleSave = async () => {
    const num = `FAC-${Date.now().toString(36).toUpperCase()}`;
    setInvoiceNumber(num);
    const { error } = await supabase.from("invoices" as any).insert({
      invoice_number: num,
      section: section as any,
      client_name: clientName,
      client_phone: clientPhone,
      client_address: clientAddress,
      items: items as any,
      subtotal,
      tax_rate: 0,
      tax_amount: 0,
      total,
      discount_percent: discountPercent,
      discount_amount: discountAmount,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      amount_pending: amountPending > 0 ? amountPending : 0,
      notes,
      created_by: user?.id,
      created_by_name: profile?.full_name || "",
    } as any);
    if (error) { toast.error(error.message); return; }
    await logAction("Crear factura", "ventas", num, { client: clientName, total });
    toast.success("Factura guardada");
    setSaved(true);
  };

  const getInvoiceHTML = () => {
    const pmLabel = paymentMethods.find(p => p.value === paymentMethod)?.label || paymentMethod;
    return `
      <div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:30px;color:#333">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;border-bottom:3px solid #1E56A0;padding-bottom:20px">
          <div style="display:flex;align-items:center;gap:15px">
            <img src="${logoBitem}" style="height:50px;width:auto" />
            <div>
              <h2 style="margin:0;font-size:22px;color:#1E56A0">${sectionLabels[section] || section}</h2>
              <p style="margin:2px 0;font-size:11px;color:#666">Bitem Global - Guinea Ecuatorial</p>
              <p style="margin:0;font-size:11px;color:#666">📧 calbertutm@gmail.com | 📞 +240 222 176 082</p>
              <p style="margin:0;font-size:11px;color:#666">📍 Bata-Ngolo, Guinea Ecuatorial</p>
            </div>
          </div>
          <div style="text-align:right">
            <h3 style="margin:0;color:#1E56A0;font-size:20px">FACTURA</h3>
            <p style="margin:2px 0;font-size:13px">Nº: <strong>${invoiceNumber}</strong></p>
            <p style="margin:0;font-size:13px">Fecha: ${new Date().toLocaleDateString("es-GQ")}</p>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:20px">
          <p style="margin:0;font-size:13px"><strong>Cliente:</strong> ${clientName}</p>
          ${clientPhone ? `<p style="margin:3px 0;font-size:13px"><strong>Teléfono:</strong> ${clientPhone}</p>` : ""}
          ${clientAddress ? `<p style="margin:0;font-size:13px"><strong>Dirección:</strong> ${clientAddress}</p>` : ""}
        </div>
        <table style="width:100%;border-collapse:collapse;margin:15px 0">
          <thead><tr style="background:#1E56A0;color:white">
            <th style="padding:10px;text-align:left;font-size:12px">Descripción</th>
            <th style="padding:10px;text-align:center;font-size:12px">Cant.</th>
            <th style="padding:10px;text-align:right;font-size:12px">P. Unitario</th>
            <th style="padding:10px;text-align:right;font-size:12px">Total</th>
          </tr></thead>
          <tbody>
            ${items.map((item, i) => `
              <tr style="border-bottom:1px solid #eee;${i % 2 === 1 ? 'background:#f8f9fa' : ''}">
                <td style="padding:8px;font-size:12px">${item.description}</td>
                <td style="padding:8px;text-align:center;font-size:12px">${item.quantity}</td>
                <td style="padding:8px;text-align:right;font-size:12px">${item.unit_price.toLocaleString()} XAF</td>
                <td style="padding:8px;text-align:right;font-size:12px">${item.total.toLocaleString()} XAF</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div style="text-align:right;margin-top:10px">
          <p style="margin:3px 0;font-size:13px">Subtotal: <strong>${subtotal.toLocaleString()} XAF</strong></p>
          ${discountPercent > 0 ? `<p style="margin:3px 0;font-size:13px;color:#e53e3e">Descuento (${discountPercent}%): -${discountAmount.toLocaleString()} XAF</p>` : ""}
          <p style="margin:8px 0;font-size:18px;font-weight:bold;color:#1E56A0">TOTAL: ${total.toLocaleString()} XAF</p>
          <p style="margin:3px 0;font-size:13px">Forma de pago: <strong>${pmLabel}</strong></p>
          <p style="margin:3px 0;font-size:13px">Monto pagado: <strong>${amountPaid.toLocaleString()} XAF</strong></p>
          ${amountPending > 0 ? `<p style="margin:3px 0;font-size:13px;color:#e53e3e">Monto pendiente: <strong>${amountPending.toLocaleString()} XAF</strong></p>` : ""}
        </div>
        ${notes ? `<p style="margin-top:15px;font-style:italic;font-size:12px;color:#666">Notas: ${notes}</p>` : ""}
        <div style="margin-top:30px;padding:15px;background:#f0f7ff;border-radius:8px;text-align:center">
          <p style="margin:0;font-size:14px;color:#1E56A0;font-weight:bold">¡Gracias por confiar en nosotros!</p>
          <p style="margin:5px 0 0;font-size:11px;color:#888">Su satisfacción es nuestra prioridad. Esperamos verle pronto.</p>
        </div>
        <div style="margin-top:20px;border-top:2px solid #eee;padding-top:10px;text-align:center">
          <p style="font-size:10px;color:#aaa;margin:0">Emitido por: ${profile?.full_name} — Bitem Global</p>
          <p style="font-size:10px;color:#aaa;margin:3px 0 0">©Soportado por Calbert 72</p>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Factura ${invoiceNumber}</title></head><body>${getInvoiceHTML()}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleDownload = () => {
    const blob = new Blob([`<html><head><meta charset="utf-8"><title>Factura ${invoiceNumber}</title></head><body>${getInvoiceHTML()}</body></html>`], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `factura-${invoiceNumber}.html`;
    a.click();
  };

  const handleWhatsApp = () => {
    const pmLabel = paymentMethods.find(p => p.value === paymentMethod)?.label || paymentMethod;
    const msg = `*Factura ${invoiceNumber}*\n${sectionLabels[section] || section}\nCliente: ${clientName}\nSubtotal: ${subtotal.toLocaleString()} XAF${discountPercent > 0 ? `\nDescuento: ${discountPercent}%` : ""}\n*Total: ${total.toLocaleString()} XAF*\nForma de pago: ${pmLabel}\nPagado: ${amountPaid.toLocaleString()} XAF${amountPending > 0 ? `\nPendiente: ${amountPending.toLocaleString()} XAF` : ""}\n\n¡Gracias por su compra!\n©Soportado por Calbert 72`;
    const phone = clientPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone || ""}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const resetForm = () => {
    setSaved(false);
    setItems([{ description: "", quantity: 1, unit_price: 0, total: 0 }]);
    setClientName("");
    setClientPhone("");
    setClientAddress("");
    setNotes("");
    setDiscountPercent(0);
    setPaymentMethod("efectivo");
    setAmountPaid(0);
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="flex items-center gap-3 text-lg">
          <img src={logoBitem} alt="Bitem" className="h-8 w-auto" />
          Factura - {sectionLabels[section] || section}
        </DialogTitle></DialogHeader>

        {!saved ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Cliente</Label><Input value={clientName} onChange={e => setClientName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} /></div>
              <div className="space-y-2"><Label>Dirección</Label><Input value={clientAddress} onChange={e => setClientAddress(e.target.value)} /></div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Artículos</Label>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5"><Input placeholder="Descripción" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="Cant." value={item.quantity} onChange={e => updateItem(i, "quantity", parseInt(e.target.value) || 0)} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="P.Unit" value={item.unit_price} onChange={e => updateItem(i, "unit_price", parseFloat(e.target.value) || 0)} /></div>
                  <div className="col-span-2 text-right font-semibold text-sm pt-2">{item.total.toLocaleString()} XAF</div>
                  <div className="col-span-1">
                    {items.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(i)}><Trash2 className="h-3 w-3" /></Button>}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1"><Plus className="h-3 w-3" /> Añadir</Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Descuento (%)</Label>
                <Input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Forma de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monto Anticipado (XAF)</Label>
                <Input type="number" value={amountPaid} onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)} />
              </div>
            </div>

            <div className="space-y-2"><Label>Notas</Label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>

            <div className="bg-muted p-3 rounded-lg space-y-1 text-right text-sm">
              <p>Subtotal: <span className="font-semibold">{subtotal.toLocaleString()} XAF</span></p>
              {discountPercent > 0 && <p className="text-destructive">Descuento ({discountPercent}%): -{discountAmount.toLocaleString()} XAF</p>}
              <p className="text-xl font-bold text-foreground">Total: {total.toLocaleString()} XAF</p>
              {amountPending > 0 && <p className="text-destructive text-sm">Pendiente: {amountPending.toLocaleString()} XAF</p>}
            </div>
            <Button onClick={handleSave} className="w-full">Guardar Factura</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div ref={printRef} dangerouslySetInnerHTML={{ __html: getInvoiceHTML() }} />
            <div className="flex gap-2">
              <Button onClick={handlePrint} className="flex-1 gap-2"><Printer className="h-4 w-4" /> Imprimir</Button>
              <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2"><Download className="h-4 w-4" /> Descargar</Button>
              <Button onClick={handleWhatsApp} variant="outline" className="flex-1 gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
