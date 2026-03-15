# Calbert 72 - Plataforma de Gestión Bitem Global

## Design System
- Primary: Blue HSL(217, 85%, 45%) - from ENI logo
- Accent/Success: Green HSL(145, 60%, 40%)
- Destructive: Red HSL(0, 72%, 50%)
- Warning: Orange HSL(38, 92%, 50%)
- Fonts: Montserrat (headings), Open Sans (body)
- Dark sidebar: HSL(220, 30%, 12%)

## Architecture
- Landing page: / (public)
- Login: /login
- Dashboard: /dashboard/* (with sidebar layout + PageGuard)
- Sections: Gimnasia (GeQ Sport), Clínica Bitem, Peluquería Bitem
- Contact: WhatsApp +240222176082, calbertutm@gmail.com

## Roles
- super_admin: Full control, undeletable (calbertutm@gmail.com)
- admin: Adjunct admin, assigned by super_admin, limited by allowed_pages
- worker: Can register data in assigned sections
- viewer: Read-only, default for new signups

## Key Features
- Audit logging: all CRUD actions tracked in audit_log table
- Invoice system: digital invoices with print + WhatsApp
- Payroll: employee management, monthly/annual reports, WhatsApp payslip
- Export: Excel + PDF on all data pages
- Restrictions: only admins can edit/delete, workers can only register
- WhatsApp notifications: placeholder ready (needs API setup)
- Email sending: placeholder ready (needs domain setup)

## Super Admin
- Email: calbertutm@gmail.com - CANNOT be deleted
- Has role super_admin in user_roles table
- Only super_admin can assign admin/super_admin roles
- Can edit user personal data (name, phone, DNI)
