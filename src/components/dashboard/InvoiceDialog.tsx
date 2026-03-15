import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, MessageCircle, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { logAction } from "@/lib/auditLog";

const sectionLabels: Record<string, string> = { gimnasia: "GeQ Sport", clinica: "Clínica Bitem", peluqueria: "Peluquería Bitem" };

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
  const total = subtotal;

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
      notes,
      created_by: user?.id,
      created_by_name: profile?.full_name || "",
    } as any);
    if (error) { toast.error(error.message); return; }
    await logAction("Crear factura", "ventas", num, { client: clientName, total });
    toast.success("Factura guardada");
    setSaved(true);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Factura ${invoiceNumber}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;color:#333}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.header{display:flex;justify-content:space-between;margin-bottom:30px}.total{font-size:1.2em;font-weight:bold;text-align:right}</style>
    </head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.print();
  };

  const handleWhatsApp = () => {
    const msg = `*Factura ${invoiceNumber}*\n${sectionLabels[section] || section}\nCliente: ${clientName}\nTotal: ${total.toLocaleString()} XAF\n\nGracias por su compra.`;
    const phone = clientPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone || ""}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { setSaved(false); setItems([{ description: "", quantity: 1, unit_price: 0, total: 0 }]); setClientName(""); setClientPhone(""); setClientAddress(""); setNotes(""); } onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Factura - {sectionLabels[section] || section}</DialogTitle></DialogHeader>

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

            <div className="space-y-2"><Label>Notas</Label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>

            <div className="text-right text-xl font-bold text-foreground">Total: {total.toLocaleString()} XAF</div>
            <Button onClick={handleSave} className="w-full">Guardar Factura</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div ref={printRef}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{sectionLabels[section] || section}</h2>
                  <p style={{ margin: 0, color: "#666" }}>Bitem Global - Guinea Ecuatorial</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: 0 }}>FACTURA</h3>
                  <p style={{ margin: 0 }}>Nº: {invoiceNumber}</p>
                  <p style={{ margin: 0 }}>Fecha: {new Date().toLocaleDateString("es-GQ")}</p>
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <p style={{ margin: 0 }}><strong>Cliente:</strong> {clientName}</p>
                {clientPhone && <p style={{ margin: 0 }}><strong>Teléfono:</strong> {clientPhone}</p>}
                {clientAddress && <p style={{ margin: 0 }}><strong>Dirección:</strong> {clientAddress}</p>}
              </div>
              <table>
                <thead><tr><th>Descripción</th><th>Cant.</th><th>P. Unitario</th><th>Total</th></tr></thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}><td>{item.description}</td><td>{item.quantity}</td><td>{item.unit_price.toLocaleString()} XAF</td><td>{item.total.toLocaleString()} XAF</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="total" style={{ marginTop: 10, fontSize: "1.2em", fontWeight: "bold", textAlign: "right" }}>
                TOTAL: {total.toLocaleString()} XAF
              </div>
              {notes && <p style={{ marginTop: 10, fontStyle: "italic" }}>Notas: {notes}</p>}
              <p style={{ marginTop: 20, fontSize: 12, color: "#999", textAlign: "center" }}>Emitido por: {profile?.full_name} — Bitem Global</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePrint} className="flex-1 gap-2"><Printer className="h-4 w-4" /> Imprimir</Button>
              <Button onClick={handleWhatsApp} variant="outline" className="flex-1 gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
