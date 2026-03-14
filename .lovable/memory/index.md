Plataforma de gestión multi-negocio Bitem Global (antes Calbert 72)

## Design System
- Primary: Blue HSL(217, 85%, 45%) - from ENI logo
- Accent/Success: Green HSL(145, 60%, 40%) 
- Destructive: Red HSL(0, 72%, 50%)
- Warning: Orange HSL(38, 92%, 50%)
- Fonts: Montserrat (headings), Open Sans (body)
- Dark sidebar: HSL(220, 30%, 12%)

## Brand
- Name: Bitem Global (NOT Calbert 72)
- Sections: GeQ Sport (gimnasia), Clínica Bitem (clinica), Peluquería Bitem (peluqueria)
- Location: Bata-Ngolo, Guinea Ecuatorial
- Contact: WhatsApp +240222176082, calbertutm@gmail.com
- Logos: logo-eni.png (main), logo-gym.png, logo-clinica.png, logo-peluqueria.jpg

## Architecture
- Landing page: / (public)
- Login/Signup: /login (with tabs)
- Dashboard: /dashboard/* (protected, requires auth)
- DB tables: profiles, user_roles, sales, purchases, income, expenses, inventory, accounting_entries, employees, payroll
- Roles: admin, worker, viewer (stored in user_roles table)
- All tables have business_section enum (gimnasia, clinica, peluqueria)
- New users auto-get viewer role via trigger
- profiles has allowed_sections[] and allowed_pages[] for access control
- PageGuard component restricts page access based on allowed_pages

## Implemented
- Auth with email/password (signup + login)
- Sales CRUD with section filter + Excel/PDF export
- Purchases/Income/Expenses CRUD (TransactionsPage) + Excel/PDF export
- Inventory management with low stock alerts + Excel/PDF export
- Accounting: Libro Diario, Libro Mayor, Balance Comprobación, Cuenta de Resultados
- User management: admin assigns roles, sections, page access; edit/delete users
- Payroll: employees table with personal/bank data, monthly payroll generation
- Protected routes + PageGuard for per-page access control
- Charts with recharts
